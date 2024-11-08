#include <SPI.h>
#include <Ethernet.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD inicializálása az 0x27 címmel
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(172,16,27,1); // Arduino Ip
IPAddress server(172,16,27,2); // Node.js szerver Ip
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

bool isLocked = false; // Globális változó a zár állapotának nyomon követésére

void setup() {
  Serial.begin(9600);
  delay(1000); // Késleltetés az Arduino inicializálására
  SPI.begin();
  rfid.PCD_Init(); // RFID olvasó inicializálása
  Serial.println("RFID olvasó inicializálva.");
  pinMode(7, OUTPUT);  
  digitalWrite(5, LOW);
  pinMode(5, OUTPUT);  
  digitalWrite(7, LOW);
  pinMode(2, OUTPUT);  
  digitalWrite(2, LOW);  
  pinMode(6, OUTPUT);  
  digitalWrite(6, LOW);
  lcd.begin();  
  lcd.backlight();
  lcdstarttext();

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
  // Üzenet fogadása a szervertől
  String response = ""; // Válasz tárolása
  if (client.connected()) {
    while (client.available()) {
      char c = client.read();
      response += c; // Válasz összegyűjtése
    }
  } else {
    Serial.println("A kapcsolat megszakadt, újra csatlakozom...");
    client.stop();
    delay(1000);
    if (client.connect(server, serverPort)) {
      Serial.println("Újra kapcsolódás sikeres");
    } else {
      Serial.println("Újra kapcsolódási hiba");
    }
  }

  // Ha van válasz, feldolgozzuk azt
  if (response.length() > 0) {
    processResponse(response); // Feldolgozzuk a bejövő választ
    response = ""; // Válasz változó törlése a következő körre
  }

  // RFID olvasás, ha a rendszer nyitva van
  if (!isLocked && rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String rfidID = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      rfidID += toHexString(rfid.uid.uidByte[i]); // Használjuk a segédfunkciót
    }

    Serial.print("RFID azonosító: ");
    Serial.println(rfidID);

    if (client.connected()) {
      client.println(rfidID); // RFID adat elküldése
      Serial.println("RFID adat elküldve");
    }
    
    // Kártya olvasás befejezése
    rfid.PICC_HaltA();
    delay(1000);
  }

  // Ha a rendszer zárva van, jelezzük az LCD-n
  if (isLocked) {
    lcdlock();
    delay(2000);
  }
}

void processResponse(String response) {
  response.trim(); // Levágjuk a fölösleges szóközöket

  if (response.startsWith("LOCK")) {
    // Rendszer zárása
    isLocked = true; 
    lcdlock();
    Serial.println("Rendszer: ZARVA");
  } else if (response.startsWith("UNLOCK")) {
    // Rendszer nyitása
    isLocked = false; 
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Rendszer nyitva");
    delay(2000);
    lcdstarttext();
    Serial.println("Rendszer: NYITVA");
  } else if (response.startsWith("ACCES")) {
    isLocked = false; 
    Serial.println("ACCES: RFID olvasás engedélyezve.");
  }else if (response.startsWith("PIN:")) {
    String pin = response.substring(4); // Kinyerjük a PIN kódot
    uint8_t pinInt = pin[0] - '0'; // Konvertálás számmá
    handlePin(pinInt);
    
  } else if (response.startsWith("INVALID")) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Elutasitva");
    delay(2000);
    lcdstarttext();
  }
}

void handlePin(uint8_t pinInt) {
  if (pinInt == 2 || pinInt == 6 || pinInt == 7 || pinInt == 5) {
      digitalWrite(pinInt, HIGH); // LED bekapcsolása
      delay(500); // LED világít egy ideig
      digitalWrite(pinInt, LOW); // LED lekapcsolása
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Elfogadva");
      lcd.setCursor(0, 1);
      lcd.print(pinInt);
      delay(2000);
      if (isLocked) {
        lcdlock();
      }else {
        lcdstarttext();
      }
  } else {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Elutasítva");
      lcd.setCursor(0, 1);
      lcd.print(pinInt);
      delay(2000);
      lcdstarttext();
  }
}

void lcdlock() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Rendszer zarva");
}

void lcdstarttext() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Olvasd be");
  lcd.setCursor(0, 1);
  lcd.print("a kartyad");
}
