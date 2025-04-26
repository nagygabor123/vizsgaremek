#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <Adafruit_GC9A01A.h>
#include <Adafruit_GFX.h>
#include <SPI.h>

// TFT kijelző lábak
#define TFT_CS   3
#define TFT_DC   7
#define TFT_RST  9

Adafruit_GC9A01A tft(TFT_CS, TFT_DC, TFT_RST);

// Ethernet MAC cím és proxy szerver IP
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server(192,168,1,114); // Proxy IP

EthernetClient client;

// RFID olvasó lábak
#define RST_PIN 9
#define SS_PIN 4
MFRC522 rfid(SS_PIN, RST_PIN);

// Állapot változók
int lockerId = 0;
bool previousLockState = true;
bool lockerStatusUpdated = false;

// Függvény: HEX stringre konvertál egy byte-ot
String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString;
  }
  hexString.toUpperCase();
  return hexString;
}

// Függvény: TFT kijelző üzenet kiírás
void showMessage(String text, uint16_t color) {
  tft.fillScreen(GC9A01A_BLACK);
  tft.setTextColor(color);
  tft.setTextSize(5);
  tft.setRotation(1);
  tft.setCursor(50, 112);
  tft.print(text);
}

// Függvény: Időzített várakozás
void bounce(unsigned long waitTime) {
  unsigned long start = millis();
  while (millis() - start < waitTime) {}
}

// Függvény: Proxy válaszok kezelése
bool handleResponse(String response) {
  response.trim();
  if (response == "zarva") {
    Serial.println("Rendszer ZÁRVA");
    showMessage("Zarva", GC9A01A_RED);
    bounce(2000);
    showMessage("Olvas", GC9A01A_WHITE);
    return false;
  }
  if (response == "nincs") {
    Serial.println("TÉVES AZONOSÍTÓ");
    showMessage("Hibas", GC9A01A_RED);
    bounce(2000);
    showMessage("Olvas", GC9A01A_WHITE);
    return false;
  }
  return true;
}

// Függvény: Ellenőrzi, hogy érvényes locker ID-t kaptunk-e
bool isValidLockerId(String response) {
  if (response.length() > 2) {
    handleResponse(response);
    return false;
  }
  for (int i = 0; i < response.length(); i++) {
    if (!isDigit(response[i])) {
      handleResponse(response);
      return false;
    }
  }
  return true;
}

// Függvény: Locker állapot frissítés a szerveren
void updateLockerStatus(int lockerId) {
  if (lockerId == 0) return;

  if (client.connect(server, 3000)) {
    Serial.println("Kapcsolódás proxy szerverhez (PUT).");
    String url = "/proxy2?id=" + String(lockerId);
    client.println("PUT " + url + " HTTP/1.1");
    client.println("Host: 192.168.1.114");
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.println("Content-Length: 2");
    client.println();
    client.println("{}"); // Üres JSON body küldése

    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        Serial.println("Szerver válasz: " + response);
      }
    }
    client.stop();
    Serial.println("Proxy kapcsolat lezárva (PUT után).");
    showMessage("Olvas", GC9A01A_WHITE);
  } else {
    Serial.println("Proxy szerver kapcsolat HIBA (PUT).");
  }
}

// Függvény: Ellenőrzi, hogy minden zár bezárva van-e
bool areAllLocksClosed() {
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

// Setup
void setup() {
  tft.begin();
  showMessage("Olvas", GC9A01A_WHITE);

  Serial.begin(9600);
  delay(1000);
  SPI.begin();
  rfid.PCD_Init();

  pinMode(8, INPUT_PULLUP);
  pinMode(2, INPUT_PULLUP);
  pinMode(5, OUTPUT);
  digitalWrite(5, LOW);
  pinMode(6, OUTPUT);
  digitalWrite(6, LOW);

  if (Ethernet.begin(mac) == 0) {
    Serial.println("Ethernet inicializálás sikertelen. Újraindítás...");
    delay(5000);
    asm volatile ("jmp 0"); // AVR újraindítás
  }

  Serial.println("Ethernet sikeresen elindítva.");
  Serial.print("IP cím: ");
  Serial.println(Ethernet.localIP());
}

// Fő loop
void loop() {
  if (!areAllLocksClosed()) {
    showMessage("Zaras", GC9A01A_RED);
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
  Serial.println("RFID kártya olvasva: " + rfidTag);

  if (client.connect(server, 3000)) {
    Serial.println("Kapcsolódás proxy szerverhez (GET).");
    String url = "/proxy1?rfid=" + rfidTag;
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: 192.168.1.114");
    client.println("Connection: close");
    client.println();

    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        response.trim();
        if (isValidLockerId(response)) {
          lockerId = response.toInt();
          Serial.println("Érvényes Locker ID: " + String(lockerId));
          showMessage("Nyitas", GC9A01A_GREEN);

          if (lockerId == 3 || lockerId == 5 || lockerId == 6 || lockerId == 7) {
            digitalWrite(lockerId, HIGH);
            bounce(2000);
            digitalWrite(lockerId, LOW);
            showMessage("Olvas", GC9A01A_WHITE);
          } else {
            Serial.println("Másik BOX. Nem nyitom.");
            bounce(2000);
            showMessage("Olvas", GC9A01A_WHITE);
          }
        }
      }
    }
    client.stop();
    Serial.println("Proxy kapcsolat lezárva (GET után).");
  } else {
    Serial.println("Kapcsolódási hiba a proxy szerverhez (GET).");
  }

  rfid.PCD_Init();
}
