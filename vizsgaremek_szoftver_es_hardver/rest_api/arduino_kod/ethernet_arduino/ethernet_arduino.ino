#include <SPI.h>
#include <Ethernet.h>
#include <MFRC522.h> // RFID könyvtár

// MAC cím, amit az Ethernet Shield használ
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

// Ethernet kliens létrehozása
EthernetClient client;

// RFID olvasó inicializálása
#define RST_PIN 9 // Reset pin for RFID module
#define SS_PIN 10  // Slave select pin for RFID module
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  // Soros monitor inicializálása
  Serial.begin(9600);
  while (!Serial) {
    ; // Várakozás a soros port megnyitására
  }

  // Ethernet inicializálása
  if (Ethernet.begin(mac) == 0) {
    Serial.println("DHCP sikertelen, állítsd be a statikus IP címet!");
    Ethernet.begin(mac, IPAddress(192, 168, 1, 177)); // Statikus IP beállítása
  } else {
    Serial.println("DHCP sikeres.");
  }

  // Kiíratás a soros monitorra
  Serial.print("Eszköz MAC címe: ");
  for (int i = 0; i < 6; i++) {
    // MAC cím formázása
    if (i < 5) {
      Serial.print(mac[i], HEX);
      Serial.print(":");
    } else {
      Serial.print(mac[i], HEX);
    }
  }
  Serial.println();

  // RFID olvasó inicializálása
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("RFID olvasó inicializálva.");
}

void loop() {
  // Ellenőrizni, hogy van-e beolvasott RFID
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    // Az RFID azonosító kiíratása
    Serial.print("Beolvasott RFID azonosító: ");
    for (byte i = 0; i < rfid.uid.size; i++) {
      Serial.print(rfid.uid.uidByte[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    // RFID azonosító küldése a Node.js szervernek
    if (client.connect("192.168.1.100", 80)) { // Cseréld le a megfelelő IP-címre
      Serial.println("Kapcsolódás a Node.js szerverhez...");
      
      // Kérés elküldése
      client.println("POST /rfid HTTP/1.1");
      client.println("Host: 192.168.1.100");
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(34); // Az adat hosszát itt beállítjuk, cseréld le a megfelelő hosszra
      
      client.println();
      client.print("{\"rfid\":\"");
      
      // Az RFID azonosító JSON formátumban
      for (byte i = 0; i < rfid.uid.size; i++) {
        client.print(rfid.uid.uidByte[i], HEX);
        if (i < rfid.uid.size - 1) {
          client.print("");
        }
      }
      client.print("\"}");
      
      // Kapcsolat bontása
      client.stop();
      Serial.println("RFID azonosító elküldve.");
    } else {
      Serial.println("Kapcsolódás sikertelen.");
    }
    
    // A kártya beolvasása befejeződik
    rfid.PICC_HaltA();
    delay(1000); // Várakozás 1 másodpercig
  }
  
  // IP cím kiírása a soros monitorra
  IPAddress ip = Ethernet.localIP();
  Serial.print("Eszköz IP címe: ");
  Serial.println(ip);
  
  // Várakozás 5 másodpercig
  delay(500000);
}
