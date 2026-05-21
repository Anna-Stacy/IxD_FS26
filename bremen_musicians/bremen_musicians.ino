// ============================================================
//  THE BREMEN TOWN MUSICIANS - Arduino Micro controller
//  Sends four buttons, slider, and light sensor values to p5.js.
// ============================================================
//
//  BUTTONS, active LOW with internal pull-up resistors:
//    White  / Continue  -> Digital Pin 2 -> sends B1
//    Red    / Choice 1  -> Digital Pin 3 -> sends B2
//    Yellow / Choice 2  -> Digital Pin 4 -> sends B3
//    Green  / Choice 3  -> Digital Pin 5 -> sends B4
//
//  ANALOG INPUTS:
//    Slider / potentiometer -> Analog Pin A0 -> sends S:<0-1023>
//    Light sensor           -> Analog Pin A1 -> sends L:<0-1023>
//
//  SERIAL:
//    Baud rate: 9600
//    Connect USB to the computer running the p5.js sketch in Chrome/Edge.
//
//  PROTOCOL:
//    READY     board started
//    B1        white button pressed
//    B2        red button pressed
//    B3        yellow button pressed
//    B4        green button pressed
//    S:512     slider value
//    L:700     light sensor value
// ============================================================

const int PIN_BTN_WHITE = 2;
const int PIN_BTN_RED = 3;
const int PIN_BTN_YELLOW = 4;
const int PIN_BTN_GREEN = 5;

const int PIN_SLIDER = A0;
const int PIN_LIGHT = A1;

const int BUTTON_COUNT = 4;
const int BUTTON_PINS[BUTTON_COUNT] = {
  PIN_BTN_WHITE,
  PIN_BTN_RED,
  PIN_BTN_YELLOW,
  PIN_BTN_GREEN
};

const int DEBOUNCE_MS = 30;
unsigned long lastDebounce[BUTTON_COUNT] = {0, 0, 0, 0};
int lastBtnReading[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH};
int btnState[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH};

const int ANALOG_INTERVAL_MS = 40;
const int ANALOG_THRESHOLD = 4;

int lastSliderVal = -1;
int lastLightVal = -1;
unsigned long lastAnalogSend = 0;

void setup() {
  Serial.begin(9600);

  for (int i = 0; i < BUTTON_COUNT; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
  }

  delay(300);
  Serial.println("READY");
}

void loop() {
  readButtons();
  readAnalogInputs();
  delay(5);
}

void readButtons() {
  for (int i = 0; i < BUTTON_COUNT; i++) {
    int reading = digitalRead(BUTTON_PINS[i]);

    if (reading != lastBtnReading[i]) {
      lastDebounce[i] = millis();
    }

    if ((millis() - lastDebounce[i]) > DEBOUNCE_MS) {
      if (reading != btnState[i]) {
        btnState[i] = reading;

        if (btnState[i] == LOW) {
          Serial.print("B");
          Serial.println(i + 1);
        }
      }
    }

    lastBtnReading[i] = reading;
  }
}

void readAnalogInputs() {
  if (millis() - lastAnalogSend < ANALOG_INTERVAL_MS) {
    return;
  }

  int sliderVal = analogRead(PIN_SLIDER);
  int lightVal = analogRead(PIN_LIGHT);

  if (abs(sliderVal - lastSliderVal) >= ANALOG_THRESHOLD) {
    Serial.print("S:");
    Serial.println(sliderVal);
    lastSliderVal = sliderVal;
  }

  if (abs(lightVal - lastLightVal) >= ANALOG_THRESHOLD) {
    Serial.print("L:");
    Serial.println(lightVal);
    lastLightVal = lightVal;
  }

  lastAnalogSend = millis();
}
