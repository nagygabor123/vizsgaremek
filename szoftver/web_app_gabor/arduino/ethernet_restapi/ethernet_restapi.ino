#include <SPI.h>
#include <MFRC522.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD inicializálása az 0x27 címmel
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; // Ethernet MAC-cím
IPAddress server(192, 168, 1, 49); // A localhost IP-címe
EthernetClient client;

// RFID beállítások
#define RST_PIN 9 // Reset pin az RFID-hoz
#define SS_PIN 4  // Slave Select pin az RFID-hoz
MFRC522 rfid(SS_PIN, RST_PIN); // RFID olvasó példányosítása

// Hexadecimális kód alakítása stringgé
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
  delay(1000); 
  SPI.begin(); 
  rfid.PCD_Init(); 
  Serial.println("RFID olvasó inicializálva.");
  pinMode(2, OUTPUT);  
  digitalWrite(2, LOW); 
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
  // Ellenőrzés, hogy van-e elérhető RFID kártya
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return; // Nincs kártya, visszatérünk
  }
  
  // Azonosító kiolvasása hexadecimális formátumban
  String rfidTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    rfidTag += toHexString(rfid.uid.uidByte[i]);
  }
  Serial.println("RFID Tag read: " + rfidTag);

  int lockerId = 0;
  // HTTP kérést küldünk az RFID-azonosítóval
 if (client.connect(server, 3000)) {
    Serial.println("Connected to server.");
    String url = "/api/locker/getLocker?rfid=" + rfidTag;

    // HTTP kérés felépítése
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: localhost");
    client.println("Connection: close");
    client.println(); // Üres sor a kérés végén

    // Válasz feldolgozása
    bool validLocker = false; // Eltárolja, hogy a locker ID érvényes volt-e
    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readStringUntil('\n');
        lockerId = response.toInt();
        if (lockerId == 3 || lockerId == 6 || lockerId == 7 || lockerId == 5) {
          digitalWrite(lockerId, HIGH); 
          delay(500); 
          digitalWrite(lockerId, LOW); 
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Elfogadva");
          lcd.setCursor(0, 1);
          lcd.print(lockerId);
          delay(2000);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Olvasd be");
          lcd.setCursor(0, 1);
          lcd.print("a kartyad");
          validLocker = true; // Beállítjuk, hogy érvényes locker ID-t találtunk
          break; // Kilépünk a válasz feldolgozásából
        }
      }
    }

    // Ha nem találtunk érvényes locker ID-t
    if (!validLocker) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Masik BOX");
      delay(2000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Olvasd be");
      lcd.setCursor(0, 1);
      lcd.print("a kartyad");
    }

    client.stop(); // Kapcsolat lezárása
    Serial.println("Disconnected from server.");
} else {
    Serial.println("Failed to connect to server.");
}


  delay(1000); // Késleltetés a következő olvasás előtt
}
