// ============================================================
//  THE BREMEN TOWN MUSICIANS — Arduino Sketch
//  Sends button presses and slider values to p5.js via Serial
// ============================================================
//
//  WIRING:
//
//  BUTTONS (active-LOW with internal pull-up resistors):
//    Button 1  →  one leg to GND, other leg to Digital Pin 2
//    Button 2  →  one leg to GND, other leg to Digital Pin 3
//    Button 3  →  one leg to GND, other leg to Digital Pin 4
//    No external resistors needed (INPUT_PULLUP handles it).
//
//  SLIDER / POTENTIOMETER:
//    Left leg   →  GND
//    Right leg  →  5V
//    Wiper (middle) →  Analog Pin A0
//    This gives a smooth 0–1023 range.
//
//  SERIAL:
//    Baud rate: 9600
//    Connect USB to computer running Chrome with p5.js sketch.
//    In p5.js, click "Connect Arduino" on the title screen.
//
//  PROTOCOL SENT TO p5.js:
//    "B1\n"     button 1 pressed (choice A / Next)
//    "B2\n"     button 2 pressed (choice B)
//    "B3\n"     button 3 pressed (choice C)
//    "S:512\n"  slider value (0–1023), sent only when it changes
// ============================================================

// ─── Pin assignments ───────────────────────────────────────
const int PIN_BTN1   = 2;
const int PIN_BTN2   = 3;
const int PIN_BTN3   = 4;
const int PIN_SLIDER = A0;

// ─── Debounce ──────────────────────────────────────────────
const int   DEBOUNCE_MS       = 30;
unsigned long lastDebounce[3] = {0, 0, 0};
int           lastBtnState[3] = {HIGH, HIGH, HIGH};
int           btnState[3]     = {HIGH, HIGH, HIGH};

// ─── Slider throttle ───────────────────────────────────────
int           lastSliderVal   = -1;
unsigned long lastSliderSend  = 0;
const int     SLIDER_INTERVAL = 40;   // ms between sends
const int     SLIDER_THRESHOLD = 4;   // minimum change to send

// ─── Setup ─────────────────────────────────────────────────
void setup() {
  Serial.begin(9600);
  pinMode(PIN_BTN1, INPUT_PULLUP);
  pinMode(PIN_BTN2, INPUT_PULLUP);
  pinMode(PIN_BTN3, INPUT_PULLUP);

  // Small startup delay so p5.js serial connection settles
  delay(300);
  Serial.println("READY");
}

// ─── Loop ──────────────────────────────────────────────────
void loop() {

  // ── Buttons (with debounce) ─────────────────────────────
  int pins[3] = { PIN_BTN1, PIN_BTN2, PIN_BTN3 };

  for (int i = 0; i < 3; i++) {
    int reading = digitalRead(pins[i]);

    // Reset debounce timer if state changed
    if (reading != lastBtnState[i]) {
      lastDebounce[i] = millis();
    }

    // Only register if stable for DEBOUNCE_MS
    if ((millis() - lastDebounce[i]) > DEBOUNCE_MS) {
      if (reading != btnState[i]) {
        btnState[i] = reading;

        // Send message on PRESS (LOW), not release
        if (btnState[i] == LOW) {
          Serial.print("B");
          Serial.println(i + 1);   // B1, B2, or B3
        }
      }
    }

    lastBtnState[i] = reading;
  }

  // ── Slider ─────────────────────────────────────────────
  if (millis() - lastSliderSend >= SLIDER_INTERVAL) {
    int sv = analogRead(PIN_SLIDER);

    if (abs(sv - lastSliderVal) >= SLIDER_THRESHOLD) {
      Serial.print("S:");
      Serial.println(sv);          // e.g. "S:512"
      lastSliderVal  = sv;
    }
    lastSliderSend = millis();
  }

  delay(5); // small loop delay to avoid flooding serial
}

// ============================================================
//  OPTIONAL EXTENSIONS
// ============================================================
//
//  LED FEEDBACK (optional, not required):
//    Add LEDs to pins 8, 9, 10 for button press confirmation.
//    In each button press block:
//      digitalWrite(8 + i, HIGH);
//      delay(80);
//      digitalWrite(8 + i, LOW);
//
//  HAPTIC / VIBRATION MOTOR (optional):
//    Wire a mini vibration motor to pin 11 via a transistor.
//    Pulse it when the tower is in the sweet zone:
//      p5 sends "BUZZ\n" back to Arduino, Arduino reads it.
//    Add to loop():
//      if (Serial.available()) {
//        String cmd = Serial.readStringUntil('\n');
//        if (cmd == "BUZZ") {
//          digitalWrite(11, HIGH); delay(100); digitalWrite(11, LOW);
//        }
//      }
//
//  SECOND SLIDER (optional — e.g. volume):
//    Add a second potentiometer to A1.
//    Send as "V:512\n" and parse in p5.js parseSerialLine().
// ============================================================
