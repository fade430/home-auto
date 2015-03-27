#include <SPI.h>
#include <Ethernet.h>

byte mac[] = {
  0xC6, 0x9B, 0x56, 0xF5,0X43, 0x3A};
IPAddress ip(192, 168, 1, 201);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
EthernetServer server(80);
String paramsString;
//pins that should be used to output to digital activated devices(relays)
byte activeDigitalPins[] = {
  5,6,7};

void setup(){
  pinMode(4,OUTPUT);
  digitalWrite(4,HIGH);
  pinMode(5,OUTPUT);
  pinMode(6,OUTPUT);
  Serial.begin(9600);
  Ethernet.begin(mac);
  Serial.print("server started at ");
  Serial.println(Ethernet.localIP());
  Serial.println(ip);
}

void loop(){
  EthernetClient client = server.available();
  if(client){
    boolean currentLineIsBlank = true;
    while(client.connected()){
      if(client.available()){
        char c = client.read();
        if(paramsString.length() < 100){
          paramsString += c;
        }
        //send back data on the prossessor
        if(c=='\n' && currentLineIsBlank){
          if(paramsString.indexOf("?togglePin5ON") > 0){
            digitalWrite(5,HIGH);
          }
          if(paramsString.indexOf("?togglePin5OFF") > 0){
            digitalWrite(5,LOW);
          }
          if(paramsString.indexOf("?togglePin6ON") > 0){
            digitalWrite(6,HIGH);
          }
          if(paramsString.indexOf("?togglePin6OFF") > 0){
            digitalWrite(6,LOW);
          }
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("");
          String jsonOut =  "";
          jsonOut += "{pin5:" + (String)digitalRead(5);
          jsonOut += ",pin6:" + (String)digitalRead(6);
          jsonOut += ",pin7:" + (String)digitalRead(7);
          jsonOut += "}";
          client.println(jsonOut);
          paramsString = "";
          break;
        }
        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        }
        else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      }
    }
    delay(1);
    client.stop();
  }
}
