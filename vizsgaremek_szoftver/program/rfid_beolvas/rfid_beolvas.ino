#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 9
#define SS_PIN 10

MFRC522 rfid(SS_PIN, RST_PIN);

// Segédfunkció a hexadecimális kód kiegészítéséhez
String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; // Kiegészítjük 0-val, ha szükséges
  }
  hexString.toUpperCase(); // Nagybetűs formátumban, de nem ad vissza értéket
  return hexString; // Visszaadjuk a hexadecimális kódot
}

void setup() {
  Serial.begin(9600);  // Soros kommunikáció
  SPI.begin();         // SPI indítása
  rfid.PCD_Init();     // RFID olvasó inicializálása
}

void loop() {
  // Ellenőrizze, van-e új kártya
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  // RFID kártya adatainak kiolvasása
  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]); // Használjuk a segédfunkciót
  }

  // Küldje el az RFID azonosítót a soros porton keresztül
  Serial.println(rfidTag);

  delay(1000);  // Kis szünet a következő olvasás előtt
}
