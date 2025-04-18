 #include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; 
IPAddress server(192,168,1,114); 
//172,16,13,9 Iskola
//192.168.1.114 Adam
EthernetClient client;

#define RST_PIN 9 
#define SS_PIN 4 
MFRC522 rfid(SS_PIN, RST_PIN); 

unsigned long lastTime = 0;

int lockerId = 0;
bool previousLockState = true; 
bool lockerStatusUpdated = false; 

String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; 
  }
  hexString.toUpperCase();
  return hexString; 
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
  if (lockerId == 0) return; 

  if (client.connect(server, 3000)) {
    Serial.println("Connected to proxy server for status update.");
    String url = "/proxy2?id=" + String(lockerId); 
    client.println("PUT " + url + " HTTP/1.1");
    client.println("Host: 172.16.13.9");
    client.println("Connection: close");
    client.println();

    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        Serial.println("Server response: " + response);
      }
    }
    client.stop();
    Serial.println("Disconnected from proxy server after status update.");
  } else {
    Serial.print("Failed to connect to proxy server. Error code: ");
    Serial.println(client.status()); 
  }
}

bool areAllLocksClosed(int lockerId) {
bool currentLockState = (digitalRead(8) == LOW && digitalRead(2) == LOW);

  if (currentLockState && !previousLockState) {
    updateLockerStatus(lockerId);
    lockerStatusUpdated = true;
  } else if (!currentLockState) {
    lockerStatusUpdated = false; 
  }

  previousLockState = currentLockState; 
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
  pinMode(5, OUTPUT);
  digitalWrite(5, LOW);
  pinMode(6, OUTPUT);
  digitalWrite(6, LOW);

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
    bounce(2000); 
    return; 
  }

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]);
  }
  Serial.println("RFID Tag read: " + rfidTag);

  if (client.connect(server, 3000)) { 
    Serial.println("Connected to proxy server.");
    String url = "/proxy1?rfid=" + rfidTag; 
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

    Serial.print("Failed to connect to proxy server. Error code: ");
    Serial.println(client.status()); 
  }

  rfid.PCD_Init();
}
