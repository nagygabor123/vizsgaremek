#include <Wire.h>

#include <SPI.h>
#include <MFRC522.h>

// RFID modul konfiguráció
#define RST_PIN 9
#define SS_PIN 10
MFRC522 rfid(SS_PIN, RST_PIN);
int relayPin = 2;   
int ii = 0;    // Relé vezérlése

// Segédfunkció a hexadecimális kód kiegészítéséhez
String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; // Kiegészítjük 0-val, ha szükséges
  }
  hexString.toUpperCase(); // Nagybetűs formátum
  return hexString; // Visszaadjuk a hexadecimális kódot
}

void setup() {
  Serial.begin(9600);  
  SPI.begin();         
  rfid.PCD_Init();    
  pinMode(relayPin, OUTPUT);
  Serial.println("RFID rendszer készen áll.");
}



void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  
  Serial.println("ok");
  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]); 
  }


  Serial.println("Beolvasott kártya: " + rfidTag);
  Serial.println("ok");

  Serial.println("Szolenoid áram alatt");
  digitalWrite(relayPin, HIGH); 
  delay(1000);                 
  digitalWrite(relayPin, LOW);  
  Serial.println("Solenoid áram elvéve");
  delay(1000);  
  rfid.PCD_Init();           

}

