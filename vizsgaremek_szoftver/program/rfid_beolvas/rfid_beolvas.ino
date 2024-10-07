#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Initialize the LCD with the I2C address 0x27
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

#define RST_PIN 9
#define SS_PIN 10
#define RED_LED_PIN 2  // A piros LED a 2-es pinhez kötve

MFRC522 rfid(SS_PIN, RST_PIN);
bool ledState = false;  // Alapértelmezett állapot: kikapcsolt LED

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
  pinMode(RED_LED_PIN, OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(RED_LED_PIN, LOW);  // Kezdetben a LED ki van kapcsolva
  pinMode(2, OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(2, LOW);  // Kezdetben a LED ki van kapcsolva
   pinMode(4,OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(4, LOW);  // Kezdetben a LED ki van kapcsolva
   pinMode(6, OUTPUT);  // A LED pin kimenetre állítása
  digitalWrite(6, LOW);  // Kezdetben a LED ki van kapcsolva
  lcd.begin(); // Only call begin() without parameters
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Olvasd be");
  lcd.setCursor(0, 1);
  lcd.print("a kartyad");
}

void loop() {
  // Ellenőrizzük, van-e új adat a soros porton
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');  // Olvasunk egy sor adatot a soros porton
    command.trim();  // Eltávolítjuk az esetleges felesleges whitespace karaktereket
    
    // Ha a "TOGGLE_LED" üzenetet kapjuk, váltjuk a LED állapotát
    if (command == "TOGGLE_LED") {
      ledState = !ledState;  // Váltás: ha be van kapcsolva, akkor kikapcsol, ha ki van kapcsolva, akkor bekapcsol
      digitalWrite(RED_LED_PIN, ledState ? HIGH : LOW);  // Az új állapot alkalmazása
    }
    
    // Ha PIN-kódot kapunk, azt is kezeljük
    if (command.startsWith("PIN:")) {
      String pin = command.substring(4); // Kinyerjük a PIN kódot
      // Itt lehet egyéb PIN-kód alapú logikát is hozzáadni
      uint8_t pinInt = pin[0] - '0';
      Serial.print("Received PIN: ");
      Serial.println(pin); // Kiírja a kapott PIN kódot
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print(pinInt);
      // LED vezérlés (opcionális, ha a PIN azonosítással szeretnéd vezérelni a LED-et)
      digitalWrite(pinInt, HIGH); // LED bekapcsolása
      delay(500); // LED világít egy ideig
      digitalWrite(pinInt, LOW); // LED lekapcsolása
    }
  }

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
