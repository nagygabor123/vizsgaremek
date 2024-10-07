/************************************************************************************
 * Created By: Tauseef Ahmad
 * Created On: December 31, 2021
 * 
 * Tutorial: https://youtu.be/pdBrvLGH0PE
 *
 * ****************************************************************************
 * Download Resources
 * **************************************************************************** 
 *  Download RFID library:
 *  https://github.com/miguelbalboa/rfid
 **********************************************************************************/ 

//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Initialize the LCD with the I2C address 0x27
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
#define SS_PIN 10
#define RST_PIN 9
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
byte readCard[4];
String MasterTag = "DA6BD581";
String SpecialTag = "030FC70A"; // New special tag
String tagID = "";
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// Create instances
MFRC522 mfrc522(SS_PIN, RST_PIN);
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

/**********************************************************************************************
 * setup() function
**********************************************************************************************/
void setup() 
{
  // Initialize the LCD
  lcd.begin(); // Only call begin() without parameters
  lcd.backlight();

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  Serial.begin(9600);
  SPI.begin();
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  mfrc522.PCD_Init();
  delay(4);
  // Show details of PCD - MFRC522 Card Reader
  mfrc522.PCD_DumpVersionToSerial();
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  lcd.setCursor(0, 0);
  lcd.print("Olvasd be");
  lcd.setCursor(0, 1);
  lcd.print("a kartyad");
  
  pinMode(4, OUTPUT); // Pin for the special LED
  pinMode(6, OUTPUT); // Pin for access granted LED
  pinMode(2, OUTPUT); // Pin for access denied LED
  // Serial.println("--------------------------");
  // Serial.println(" Access Control ");
  // Serial.println("Scan Your Card>>");
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
}

/**********************************************************************************************
 * loop() function
**********************************************************************************************/
void loop() 
{
  //---------------------------------------------------------------------- 
  // Wait until a new tag is available
  while (getID()) {
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    if (tagID == MasterTag) {
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Elfogadva");
      digitalWrite(6, HIGH);
      delay(2000);
      digitalWrite(6, LOW);
      
      // Serial.println(" Access Granted!");
      // Serial.println("--------------------------");
      // You can write any code here like opening doors, 
      // switching ON a relay, lighting up an LED etc...
    }
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    else if (tagID == SpecialTag) { // Check for the special tag
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Elfogadva"); // Display special tag message
      digitalWrite(4, HIGH); // Activate pin 4
      delay(2000);
      digitalWrite(4, LOW); // Deactivate pin 4
    }
    else {
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Elutasitva");
      digitalWrite(2, HIGH);
      delay(2000);
      digitalWrite(2, LOW);
      // Serial.println(" Access Denied!");
      // Serial.println("--------------------------");
    }
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    
    delay(2000);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Olvasd be");
    lcd.setCursor(0, 1);
    lcd.print("a kartyad");
    // Serial.println(" Access Control ");
    // Serial.println("Scan Your Card>>");
  }
  //---------------------------------------------------------------------- 
}

/**********************************************************************************************
 * getID() function
 * Read new tag if available
**********************************************************************************************/
boolean getID() 
{
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    // Getting ready for Reading PICCs
    // If a new PICC placed to RFID reader continue
    if (!mfrc522.PICC_IsNewCardPresent()) {
        return false;
    }
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    // Since a PICC is placed get Serial and continue
    if (!mfrc522.PICC_ReadCardSerial()) {
        return false;
    }
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    tagID = "";
    // The MIFARE PICCs that we use have 4 byte UID
    for (uint8_t i = 0; i < 4; i++) {
        // Ensures leading zeros
        tagID.concat(String(mfrc522.uid.uidByte[i], HEX).length() < 2 ? "0" : "");
        tagID.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    tagID.toUpperCase();
    mfrc522.PICC_HaltA(); // Stop reading
    return true;
    //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
}
