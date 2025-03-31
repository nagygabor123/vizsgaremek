#include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; // Ethernet MAC-cím
IPAddress server(172,16,13,9); // A localhost IP-címe
EthernetClient client;

// RFID beállítások
#define RST_PIN 9 // Reset pin az RFID-hoz
#define SS_PIN 4  // Slave Select pin az RFID-hoz
MFRC522 rfid(SS_PIN, RST_PIN); // RFID olvasó példányosítása

unsigned long lastTime = 0; // Az időzítő segítváltozó

int lockerId = 0;
bool previousLockState = true; // Az előző zárállapot
bool lockerStatusUpdated = false; // Változó a státusz frissítésének ellenőrzésére

// Hexadecimális kód alakítása stringgé
String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; // Kiegészítjük 0-val, ha szükséges
  }
  hexString.toUpperCase();
  return hexString; // Visszaadjuk a hexadecimális kódot
}

bool isValidLockerId(String response) {
  if (response.length() > 2) 
  {
    handleResponse(response);
    return false; 
  }
  for (int i = 0; i < response.length(); i++) {
    if (!isDigit(response[i])) 
    {
      handleResponse(response);
      return false; 
    }
  }
  return true;
}

bool handleResponse(String response) {
  if (response == "zarva") {
    Serial.println("Rendszer ZARVA");
    bounce(2000); 
    Serial.println("Olvasd be a kartyad");
  }
  if (response == "nincs") {
    Serial.println("TEVES AZON");
    bounce(2000); 
    Serial.println("Olvasd be a kartyad");
  }
}

void bounce(unsigned long waitTime) {
  unsigned long start = millis();
  while (millis() - start < waitTime) {
  }
}

void updateLockerStatus(int lockerId) {
  if (lockerId == 0) return; // Ha a lockerId 0, nem küldünk semmit

  if (client.connect(server, 3000)) {
    Serial.println("Connected to server for status update.");
    String url = "/api/locker/setLockerStatus?id=" + String(lockerId);
    client.println("PATCH " + url + " HTTP/1.1");
    client.println("Host: localhost");
    client.println("Connection: close");
    client.println();
    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        Serial.println("Server response: " + response);
      }
    }
    client.stop();
    Serial.println("Disconnected from server after status update.");
  } else {
    Serial.println("Failed to connect to server for status update.");
  }
}

bool areAllLocksClosed(int lockerId) {
  bool currentLockState = (digitalRead(8) == LOW);

  if (currentLockState && !previousLockState) {
    updateLockerStatus(lockerId);
    lockerStatusUpdated = true;
  } else if (!currentLockState) {
    lockerStatusUpdated = false; 
  }

  previousLockState = currentLockState; // Frissítjük az előző állapotot
  return currentLockState;
}

void setup() {
  Serial.begin(9600);
  delay(1000); 
  SPI.begin(); 
  rfid.PCD_Init(); 
  Serial.println("RFID olvasó inicializálva.");
  pinMode(8, INPUT_PULLUP); 
  pinMode(2, INPUT_PULLUP); 
  pinMode(3, INPUT_PULLUP);
  pinMode(5, OUTPUT);
  digitalWrite(5, LOW);
  pinMode(6, OUTPUT);
  digitalWrite(6, LOW);
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);

  // Ethernet inicializálás
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Ethernet initialization failed.");
    while (true);
  }
  Serial.println("Ethernet initialized.");
  Serial.print("IP Address: ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  if (!areAllLocksClosed(lockerId)) {
    Serial.println("Zárak vissza a szekrényt");
    bounce(2000); // Várás 2 másodpercig
    return; // Ha valamelyik zár nyitva van, ne folytassa az RFID olvasást
  }

  // RFID kártya olvasása
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]);
  }
  Serial.println("RFID Tag read: " + rfidTag);

  if (client.connect(server, 3000)) { // Kapcsolódás a proxy szerverhez
    Serial.println("Connected to proxy server.");
    String url = "/proxy1?rfid=" + rfidTag; // A getLocker endpointot kérjük le
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: 172.16.13.9");
    client.println("Connection: close");
    client.println();

    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        if (isValidLockerId(response)) {
          Serial.println("Validated Locker ID: " + response);
          lockerId = response.toInt();
          if (lockerId == 3 || lockerId == 6 || lockerId == 7 || lockerId == 5) {
            digitalWrite(lockerId, HIGH);
            bounce(2000); 
            Serial.println("Olvasd be a kartyad");
          } else {
            Serial.println("Masik BOX");
            bounce(2000); 
            Serial.println("Olvasd be a kartyad");
          }
        }
      }
    }

    client.stop();
    digitalWrite(lockerId, LOW);
    Serial.println("Disconnected from proxy server.");
  } else {
    // Ha nem sikerült csatlakozni a proxy szerverhez, kiírjuk a hibakódot
    Serial.print("Failed to connect to proxy server. Error code: ");
    Serial.println(client.status()); // Kiírja a kapcsolat hiba kódját
  }

  rfid.PCD_Init();
}

