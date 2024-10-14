#include <SPI.h>
#include <Ethernet.h>
#include <EthernetUdp.h>
#include <Dns.h>

IPAddress receiverIP(192, 168, 1, 100); // Cseréld ki a helyi Node.js szerver IP-címére
unsigned int receiverPort = 8080;      // Port a Node.js szerverhez
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 }; // MAC cím
EthernetUDP Udp;
int sensorPin = A0; // Az érzékelő láb definiálása
int sensorValue;

void setup() {
  // Soros kommunikáció megnyitása
  Serial.begin(9600);
  // Ethernet kapcsolat indítása
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Hiba az Ethernet beállításakor DHCP használatával");
    for (;;);
  }
  // Helyi IP-cím kiírása
  Serial.print("Helyi IP-címem: ");
  Serial.println(Ethernet.localIP());

  Udp.begin(receiverPort); // UDP csatorna megnyitása
}

void loop() {
  // Üzenet küldése
  const char *message = "NAGY"; // A küldendő üzenet
  Udp.beginPacket(receiverIP, receiverPort); // Csomag kezdeményezése
  Udp.write(message); // Üzenet küldése
  Udp.endPacket(); // Csomag lezárása

  delay(10000); // Várakozás 10 másodpercig
}
