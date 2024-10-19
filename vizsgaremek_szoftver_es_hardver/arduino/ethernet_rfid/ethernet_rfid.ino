#include <SPI.h>
#include <Ethernet.h>
#include <MFRC522.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 141); // Arduino IP
IPAddress server(192, 168, 1, 49); // Node.js szerver IP
unsigned int serverPort = 8080; // Port

EthernetClient client;

#define RST_PIN 9 // Reset pin az RFID-hoz
#define SS_PIN 4   // Slave Select pin az RFID-hoz
MFRC522 rfid(SS_PIN, RST_PIN); // RFID olvasó példányosítása

String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; // Kiegészítjük 0-val, ha szükséges
  }
  hexString.toUpperCase();
  return hexString; // Visszaadjuk a hexadecimális kódot
}

void setup() {
  Serial.begin(9600);
  delay(1000); // Késleltetés az Arduino inicializálására

  SPI.begin();
  rfid.PCD_Init(); // RFID olvasó inicializálása
  Serial.println("RFID olvasó inicializálva.");

  Ethernet.begin(mac, ip);
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Ethernet shield nem található.");
    while (true) delay(1);
  }

  if (client.connect(server, serverPort)) {
    Serial.println("Kapcsolódás sikeres");
  } else {
    Serial.println("Kapcsolódási hiba");
  }
}

void loop() {
  // RFID olvasás
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String rfidID = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      rfidID += toHexString(rfid.uid.uidByte[i]); // Használjuk a segédfunkciót
    }
    
    Serial.print("RFID azonosító: ");
    Serial.println(rfidID);
    
    if (client.connected()) {
      client.println(rfidID); // RFID adat elküldése
      Serial.println("RFID adat elküldve");
    } else {
      Serial.println("A kapcsolat megszakadt, újra csatlakozom...");
      client.stop();
      delay(1000);
      if (client.connect(server, serverPort)) {
        Serial.println("Újra kapcsolódás sikeres");
        client.println(rfidID); // RFID adat elküldése
      } else {
        Serial.println("Újra kapcsolódási hiba");
      }
    }

    // Válasz fogadása a szervertől
    String response = ""; // Válasz tárolása
    while (client.available()) {
      char c = client.read();
      response += c; // Válasz összegyűjtése
    }

    // Válasz kiírása
    if (response.length() > 0) {
      Serial.print("Válasz a szervertől: ");
      Serial.println(response); // Válasz kiírása
    }

    rfid.PICC_HaltA(); // Állítsuk le az aktuális kártyaolvasást
    delay(1000); // Várakozás 1 másodpercig az új RFID beolvasáshoz
  }
}
