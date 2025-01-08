#include <Adafruit_GFX.h>
#include <Adafruit_GC9A01A.h>
#include <SPI.h>

// Kijelző lábkiosztása
#define TFT_CS   10
#define TFT_DC    9
#define TFT_RST   8

// Kijelző példány
Adafruit_GC9A01A tft = Adafruit_GC9A01A(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  tft.begin();                 // Kijelző inicializálása
  tft.setRotation(0);          // Forgatás
  tft.fillScreen(GC9A01A_RED); // Törlés feketére
  
  // Rajzolj egy piros kört
  tft.fillCircle(120, 120, 100, GC9A01A_BLUE);
}

void loop() {
  // További funkciók helye
}
