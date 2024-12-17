#include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD inicializálása az 0x27 címmel
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; // Ethernet MAC-cím
IPAddress server(172,16,13,9); // A localhost IP-címe
EthernetClient client;

// RFID beállítások
#define RST_PIN 9 // Reset pin az RFID-hoz
#define SS_PIN 4  // Slave Select pin az RFID-hoz
MFRC522 rfid(SS_PIN, RST_PIN); // RFID olvasó példányosítása
int lockerId = 0;
unsigned long lastTime = 0; // Az időzítő segítváltozó

// Hexadecimális kód alakítása stringgé
String toHexString(byte value) {
  String hexString = String(value, HEX);
  if (hexString.length() < 2) {
    hexString = "0" + hexString; // Kiegészítjük 0-val, ha szükséges
  }
  hexString.toUpperCase();
  return hexString; // Visszaadjuk a hexadecimális kódot
}

bool isValidLockerId(String response) {
  if (response.length() > 2) return false; // Ha több mint két karakter, nem valid
  for (int i = 0; i < response.length(); i++) {
    if (!isDigit(response[i])) return false; // Ha nem számjegy, nem valid
  }
  return true;
}

void bounce(unsigned long waitTime) {
  unsigned long start = millis();
  while (millis() - start < waitTime) {
  }
}

bool areAllLocksClosed() {
  if (digitalRead(2) == LOW && digitalRead(3) == LOW && digitalRead(8) == LOW) {
    return true; 
  }
  Serial.println("ZARD VISSZA A SZEKRENYT");
  return false; 
}

void setup() {
  Serial.begin(9600);
  delay(1000); 
  SPI.begin(); 
  rfid.PCD_Init(); 
  Serial.println("RFID olvasó inicializálva.");
  pinMode(8, INPUT_PULLUP); 
  pinMode(2, INPUT_PULLUP); 
  pinMode(3, INPUT_PULLUP);
  pinMode(5, OUTPUT);
  digitalWrite(5, LOW);
  pinMode(6, OUTPUT);
  digitalWrite(6, LOW);
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);
  lcd.begin();  
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Olvasd be");
  lcd.setCursor(0, 1);
  lcd.print("a kartyad");

  // Ethernet inicializálás
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Ethernet initialization failed.");
    while (true);
  }
  Serial.println("Ethernet initialized.");
  Serial.print("IP Address: ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  // Először ellenőrizzük, hogy minden zár vissza van-e csukva
  if (!areAllLocksClosed()) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Zarakat");
    lcd.setCursor(0, 1);
    lcd.print("vissza zart");
    bounce(2000); // Várás 2 másodpercig
    return; // Ha valamelyik zár nyitva van, ne folytassa az RFID olvasást
  }

  // RFID kártya olvasása
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]);
  }
  Serial.println("RFID Tag read: " + rfidTag);

  if (client.connect(server, 3000)) {
    Serial.println("Connected to server.");
    String url = "/api/locker/getLocker?rfid=" + rfidTag;

    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: localhost");
    client.println("Connection: close");
    client.println();

    bool validLocker = false;

    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');

        // Ha a válasz "zarva", külön kezeljük
        if (response == "zarva") {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Rendszer");
          lcd.setCursor(0, 1);
          lcd.print("ZARVA");
          bounce(2000); // Várás
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Olvasd be");
          lcd.setCursor(0, 1);
          lcd.print("a kartyad");
          validLocker = true; // Megakadályozzuk, hogy a "Masik BOX" logika lefusson
          break; // Kilépünk a válasz feldolgozásából
        }

        // Ha valid szám, ellenőrizzük a locker ID-t
        if (isValidLockerId(response)) {
          Serial.println("Validated Locker ID: " + response);
          lockerId = response.toInt();
          if (lockerId == 3 || lockerId == 6 || lockerId == 7 || lockerId == 5) {
            digitalWrite(lockerId, HIGH);
            //bounce(1000); // Várás a zár nyitásához
            //digitalWrite(lockerId, LOW);
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Elfogadva");
            lcd.setCursor(0, 1);
            lcd.print(lockerId);
            bounce(2000); // Várás az elfogadás megjelenítéséhez
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Olvasd be");
            lcd.setCursor(0, 1);
            lcd.print("a kartyad");
            validLocker = true;
            break;
          }
        }
      }
    }

    if (!validLocker) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Masik BOX");
      bounce(2000); // Várás az üzenet megjelenítéséhez
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Olvasd be");
      lcd.setCursor(0, 1);
      lcd.print("a kartyad");
    }

    client.stop();
    digitalWrite(lockerId, LOW);
    Serial.println("Disconnected from server.");
  } else {
    Serial.println("Failed to connect to server.");
  }

  bounce(1000); // Időzítés a következő olvasáshoz
  rfid.PCD_Init();     
}
