#include <SPI.h>
#include <Ethernet.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 141); // Arduino IP
IPAddress server(192, 168, 1, 49); // Node.js szerver IP
unsigned int serverPort = 8080; // Port

EthernetClient client;

void setup() {
  Serial.begin(9600);
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
  if (client.connected()) {
    client.println("Hello from Arduino");
    Serial.println("Üzenet elküldve");
    
    // Válasz fogadása
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }

    delay(60000); // Várakozás 60 másodpercig
  } else {
    Serial.println("A kapcsolat megszakadt, újra csatlakozom...");
    client.stop();
    delay(1000); // Várakozás az új próbálkozás előtt
    if (client.connect(server, serverPort)) {
      Serial.println("Újra kapcsolódás sikeres");
    } else {
      Serial.println("Újra kapcsolódási hiba");
    }
  }
}
