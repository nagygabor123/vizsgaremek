#include <SPI.h>
#include <Ethernet.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Initialize the LCD with the I2C address 0x27
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
  pinMode(2,OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(2, LOW);  // Kezdetben a LED ki van kapcsolva
  pinMode(6, OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(6, LOW);
  lcd.begin();  // lcd.begin()
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Olvasd be");
  lcd.setCursor(0, 1);
  lcd.print("a kartyad");

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
    unsigned long startTime = millis();
    while (millis() - startTime < 1000) { // Várj legfeljebb 1 másodpercig
      while (client.available()) {
        char c = client.read();
        response += c; // Válasz összegyűjtése
      }
      if (response.length() > 0) {
        break; // Ha van válasz, lépj ki a ciklusból
      }
    }

    // Válasz feldolgozása
    if (response.length() > 0) {
      Serial.print("Válasz a szervertől: ");
      Serial.println(response); // Válasz kiírása

      if (response.startsWith("PIN:")) {
        String pin = response.substring(4); // Kinyerjük a PIN kódot
        uint8_t pinInt = pin[0] - '0'; // Konvertálás számmá
        Serial.print("PIN kód: ");
        Serial.println(pinInt);
        if (pinInt == 2 || pinInt == 6) {
          // LED vezérlés (opcionális, ha a PIN azonosítással szeretnéd vezérelni a LED-et)
          digitalWrite(pinInt, HIGH); // LED bekapcsolása
          delay(500); // LED világít egy ideig
          digitalWrite(pinInt, LOW); // LED lekapcsolása
          Serial.print("Received PIN: ");
          Serial.println(pin); // Kiírja a kapott PIN kódot
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Elfogadva");
          lcd.setCursor(0, 1);
          lcd.print(pinInt);
          delay(2000);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Olvasd be");
          lcd.setCursor(0, 1);
          lcd.print("a kartyad");
        } else {
          // Ha a PIN hossza nem megfelelő, akkor elutasítjuk
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Elutasítva");
          lcd.setCursor(0, 1);
          lcd.print(pinInt);
          delay(2000);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Olvasd be");
          lcd.setCursor(0, 1);
          lcd.print("a kartyad");
        } 
      }

      if (response.startsWith("INVALID")) {
        // Handle invalid RFID response
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Elutasitva"); // Display rejection message
        delay(2000); // Wait for 2 seconds
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Olvasd be");
        lcd.setCursor(0, 1);
        lcd.print("a kartyad");
      }
    }

    rfid.PICC_HaltA(); // Állítsuk le az aktuális kártyaolvasást
    delay(1000); // Várakozás 1 másodpercig az új RFID beolvasáshoz
  }
}
