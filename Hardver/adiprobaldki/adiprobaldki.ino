#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <Adafruit_GC9A01A.h>
#include <Adafruit_GFX.h>
#include <SPI.h>

#define TFT_CS   3
#define TFT_DC    7
#define TFT_RST   9

Adafruit_GC9A01A tft(TFT_CS, TFT_DC, TFT_RST);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; 
IPAddress server(192,168,1,114); 
EthernetClient client;

#define RST_PIN 9 
#define SS_PIN 4 
MFRC522 rfid(SS_PIN, RST_PIN); 

unsigned long lastTime = 0;
int lockerId = 0;
bool previousLockState = true; 
bool lockerStatusUpdated = false; 

// Új segédfüggvények
void maintainEthernetConnection() {
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet link down, attempting to reconnect...");
    Ethernet.begin(mac);
  }
}

void safeStop(EthernetClient &cli) {
  if (cli.connected()) {
    cli.flush();
    cli.stop();
    delay(100); // Rövid késleltetés a megbízható lezáráshoz
  }
}

bool connectWithRetry(EthernetClient &cli, IPAddress srv, int port, int retries = 3) {
  for (int i = 0; i < retries; i++) {
    if (cli.connect(srv, port)) {
      return true;
    }
    Serial.print("Connection attempt ");
    Serial.print(i+1);
    Serial.println(" failed");
    delay(500 * (i + 1)); // Progresszív várakozás
  }
  return false;
}

String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; 
  }
  hexString.toUpperCase();
  return hexString; 
}

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

bool handleResponse(String response) {
  if (response == "zarva") {
    Serial.println("Rendszer ZARVA");
    bounce(2000); 
    Serial.println("Olvasd be a kartyad");
    return true;
  }
  if (response == "nincs") {
    Serial.println("TEVES AZON");
    bounce(2000); 
    Serial.println("Olvasd be a kartyad");
    return true;
  }
  return false;
}

void bounce(unsigned long waitTime) {
  unsigned long start = millis();
  while (millis() - start < waitTime) {
    // Üres várakozás
  }
}

void updateLockerStatus(int lockerId) {
  if (lockerId == 0) return; 

  if (connectWithRetry(client, server, 3000)) {
    Serial.println("Connected to proxy server for status update.");
    String url = "/proxy2?id=" + String(lockerId); 
    client.println("PUT " + url + " HTTP/1.1");
    client.println("Host: 172.16.13.9");
    client.println("Connection: close");
    client.println();

    unsigned long timeout = millis();
    while (client.connected() && (millis() - timeout < 5000)) { // 5 másodperc timeout
      if (client.available()) {
        String response = client.readStringUntil('\n');
        Serial.println("Server response: " + response);
      }
    }
    safeStop(client);
    Serial.println("Disconnected from proxy server after status update.");
    tft.fillScreen(GC9A01A_BLACK);
    tft.setTextColor(GC9A01A_WHITE);
    tft.setTextSize(5);
    tft.setRotation(1);
    tft.setCursor(50, 120 - 8);
    tft.print("Olvas");
  } else {
    Serial.println("Failed to connect to proxy server for status update");
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
  tft.begin();
  tft.fillScreen(GC9A01A_BLACK);
  tft.setTextColor(GC9A01A_WHITE);
  tft.setTextSize(5);
  tft.setRotation(1);
  tft.setCursor(50, 120 - 8);
  tft.print("Olvas");

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
    Serial.println("Ethernet initialization failed.");
    while (true);
  }
  Serial.println("Ethernet initialized.");
  Serial.print("IP Address: ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  maintainEthernetConnection();
  
  if (!areAllLocksClosed(lockerId)) {
    tft.fillScreen(GC9A01A_BLACK);
    tft.setTextColor(GC9A01A_RED);
    tft.setTextSize(5);
    tft.setRotation(1);
    tft.setCursor(50, 120 - 8);
    tft.print("Zaras");
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

  if (connectWithRetry(client, server, 3000)) { 
    Serial.println("Connected to proxy server.");
    String url = "/proxy1?rfid=" + rfidTag; 
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: 172.16.13.9");
    client.println("Connection: close");
    client.println();

    unsigned long timeout = millis();
    bool responseProcessed = false;
    
    while (client.connected() && (millis() - timeout < 5000) && !responseProcessed) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        if (isValidLockerId(response)) {
          Serial.println("Validated Locker ID: " + response);
          tft.fillScreen(GC9A01A_BLACK);
          tft.setTextColor(GC9A01A_GREEN);
          tft.setTextSize(5);
          tft.setRotation(1);
          tft.setCursor(40, 120 - 8);
          tft.print("Nyitas");
          
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
          responseProcessed = true;
        }
      }
    }

    safeStop(client);
    digitalWrite(lockerId, LOW);
    Serial.println("Disconnected from proxy server.");
  } else {
    Serial.println("Failed to connect to proxy server after retries");
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}