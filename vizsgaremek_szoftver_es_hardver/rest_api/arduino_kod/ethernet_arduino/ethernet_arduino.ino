#include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>


// RFID olvasó és Ethernet Shield beállításai
#define SS_PIN 10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);  // 0x27 lehet az I2C cím, de ez függhet az LCD modultól


byte mac[] = {  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server(192, 168, 1, 100); // A Node.js szerver IP címe
EthernetClient client;

const int ledPin = 6;  // LED pin

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  pinMode(ledPin, OUTPUT);
  // LCD inicializálása
  lcd.init();
  lcd.backlight();  // Kapcsold be a háttérvilágítást
  lcd.setCursor(0, 0);  // Kezdő pozíció beállítása (1. sor, 1. oszlop)
  lcd.print("Hello, World!");  // Szöveg kiírása az első sorra
  delay(2000); 
  lcd.clear();
  lcd.setCursor(0, 0);  // Áthelyezés a 2. sorra
  lcd.print("RFID teszt...");
  lcd.setCursor(0, 1);  // Áthelyezés a 2. sorra
  lcd.print("Csatlakozás"); 
  // Ethernet inicializálása
  Ethernet.begin(mac);
  Serial.print("Eszköz IP címe: ");
  Serial.println(Ethernet.localIP());  // Kiírja az eszköz IP címét a soros monitorra
  delay(1000);


  // Csatlakozás a szerverhez
  if (client.connect(server, 3000)) {
    Serial.println("Csatlakozás a szerverhez sikeres.");
    lcd.clear();
    lcd.setCursor(0, 1);  // Áthelyezés a 2. sorra
    lcd.print("sikeres");
  } else {
    Serial.println("Sikertelen csatlakozás.");
    Serial.println("Ellenőrizd a szerver IP címét és portját.");
    lcd.clear();
    lcd.setCursor(0, 1);  // Áthelyezés a 2. sorra
    lcd.print("sikertelen");
  }
  
  
}

void loop() {
  // RFID olvasás
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String rfidTag = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      rfidTag += String(rfid.uid.uidByte[i], HEX);
    }
    
    Serial.println("RFID tag olvasva: " + rfidTag);
    lcd.clear();
    lcd.setCursor(0, 0);  // Áthelyezés a 2. sorra
    lcd.print("rf olvasva ");
    lcd.setCursor(0, 1);  // Áthelyezés a 2. sorra
    lcd.print(rfidTag);

    // RFID adatok küldése a szervernek
    if (client.connected()) {
      client.println("RFID: " + rfidTag);

      // Válasz a szervertől, ha kapunk egy "ON" üzenetet, a LED felkapcsol
      if (client.available()) {
        String response = client.readStringUntil('\n');
        if (response.indexOf("ON") >= 0) {
          digitalWrite(ledPin, HIGH);
        } else {
          digitalWrite(ledPin, LOW);
        }
      }
    }
  }

  delay(1000);
}
