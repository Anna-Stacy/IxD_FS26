// ============================================================
//  THE BREMEN TOWN MUSICIANS - Arduino Micro controller
//  Sends four buttons, slider, and light sensor values to p5.js.
// ============================================================
//
//  BUTTONS, active LOW with internal pull-up resistors:
//    Red    / Continue  -> Digital Pin 2 -> sends B1
//    White  / Choice 3  -> Digital Pin 3 -> sends B2
//    Green  / Choice 1  -> Digital Pin 4 -> sends B3
//    Yellow / Choice 2  -> Digital Pin 5 -> sends B4
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
//    B1        red button pressed
//    B2        white button pressed
//    B3        green button pressed
//    B4        yellow button pressed
//    S:512     slider value
//    L:700     light sensor value
// ============================================================

// Lecturer QA: Arduino cable/controller answer.
// The Arduino Micro is connected to the computer by USB. This sketch reads the physical buttons and sensors,
// then prints simple serial messages through that cable. The browser receives those messages after pressing
// Connect Arduino in the website.
// Values: red/white/green/yellow use pins 2/3/4/5 and become B1/B2/B3/B4 in the serial protocol.
// Why: The physical buttons need fixed digital pins so the p5.js game receives stable button codes.
// What this does for the code: Names the Arduino Micro digital pins used for red, white, green, and yellow buttons.
// Codependencies and why/where: Used by BUTTON_PINS and readButtons(); p5.js parseSerialLine() depends on the B1-B4 order.
// Why these values: Pins 2-5 match the wiring described in the controller protocol.
const int PIN_BTN_RED = 2;
const int PIN_BTN_WHITE = 3;
const int PIN_BTN_GREEN = 4;
const int PIN_BTN_YELLOW = 5;

// Why: The analog controls need named pins so sensor wiring stays readable.
// What this does for the code: Names the potentiometer/slider input and the light-sensor input.
// Codependencies and why/where: Used by readAnalogInputs(); p5.js expects S:<0-1023> and L:<0-1023>.
// Why these values: A0 is wired to the slider and A1 is wired to the light sensor.
const int PIN_SLIDER = A0;
const int PIN_LIGHT = A1;

// Why: Button handling should use one loop instead of repeated code for each button.
// What this does for the code: Stores the number of buttons and the ordered list of button pins.
// Codependencies and why/where: Used by setup() and readButtons(); the array index controls the outgoing B number.
// Why these values: Four buttons are used, and the order red, white, green, yellow sends B1, B2, B3, B4.
const int BUTTON_COUNT = 4;
const int BUTTON_PINS[BUTTON_COUNT] = {
  PIN_BTN_RED,
  PIN_BTN_WHITE,
  PIN_BTN_GREEN,
  PIN_BTN_YELLOW
};

// Why: Mechanical buttons can flicker briefly when pressed or released.
// What this does for the code: Sets the debounce time and stores per-button debounce/read/state history.
// Codependencies and why/where: Used by readButtons(); relies on millis(), digitalRead(), and INPUT_PULLUP button wiring.
// Why these values: 30 ms is long enough to filter bounce, HIGH is the idle state for internal pull-up inputs, and zeros initialize timing.
const int DEBOUNCE_MS = 30;
unsigned long lastDebounce[BUTTON_COUNT] = {0, 0, 0, 0};
int lastBtnReading[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH};
int btnState[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH};

// Why: Analog readings change constantly, so they need throttling and change filtering.
// What this does for the code: Sets send timing, minimum change amount, last sent values, and last send timestamp.
// Codependencies and why/where: Used by readAnalogInputs(); p5.js handleLightValue() and slider logic consume the serial values.
// Why these values: 40 ms keeps updates responsive, threshold 4 reduces serial noise, -1 forces the first reading to send, and 0 starts the timer.
const int ANALOG_INTERVAL_MS = 40;
const int ANALOG_THRESHOLD = 4;

int lastSliderVal = -1;
int lastLightVal = -1;
unsigned long lastAnalogSend = 0;

// Lecturer QA: How Arduino connects to the UI.
// This setup opens USB serial at 9600 baud and prepares the button pins. When the browser connects,
// it can read READY, then B1-B4, S:<value>, and L:<value> messages from this same serial connection.
// Values: Serial.begin(9600) must match SERIAL_BAUD_RATE = 9600 in sketch.js.
// Why: The Arduino must initialize serial and input pins before the game can read controls.
// What this does for the code: Opens serial, configures button pins with internal pull-ups, waits briefly, and announces READY.
// Codependencies and why/where: Arduino calls setup() once; p5.js connectSerial()/parseSerialLine() reads READY and button data later.
// Why these values: Baud 9600 matches SERIAL_BAUD_RATE in sketch.js, and 300 ms gives the serial connection a moment to settle.
void setup() {
  Serial.begin(9600);

  for (int i = 0; i < BUTTON_COUNT; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
  }

  delay(300);
  Serial.println("READY");
}

// Why: The controller needs to continuously poll buttons and analog sensors.
// What this does for the code: Reads buttons, reads analog inputs, then waits briefly before the next cycle.
// Codependencies and why/where: Arduino calls loop() repeatedly; depends on readButtons() and readAnalogInputs().
// Why these values: 5 ms delay keeps the loop responsive while avoiding unnecessary serial/polling pressure.
void loop() {
  readButtons();
  readAnalogInputs();
  delay(5);
}

// Lecturer QA: How physical UI buttons become game UI actions.
// The buttons use INPUT_PULLUP, so they normally read HIGH and read LOW when pressed. On each clean press,
// this code prints B plus the button number. sketch.js then turns that message into continue or choice actions.
// Values: i + 1 converts array positions 0-3 into B1-B4.
// Why: Button presses should send exactly one clean event when the button is pressed down.
// What this does for the code: Debounces each button, detects state changes, and sends B1-B4 for LOW pressed states.
// Codependencies and why/where: Called by loop(); depends on BUTTON_PINS, debounce arrays, INPUT_PULLUP behavior, and Serial.
// Why these values: LOW means pressed with pull-up wiring, and i + 1 converts zero-based array indexes into B1-B4 protocol codes.
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

// Lecturer QA: How sensor UI values reach the sketch.
// The slider and light sensor are analog inputs. The Arduino reads their 0-1023 values and sends them as
// S:<value> for slider and L:<value> for light; sketch.js receives them and updates the mini-game/start gates.
// Values: A0 is slider, A1 is light, ANALOG_INTERVAL_MS is 40, and ANALOG_THRESHOLD is 4.
// Why: Slider and light readings should update the game without flooding serial output.
// What this does for the code: Sends S: and L: values only after the interval has passed and the reading changed enough.
// Codependencies and why/where: Called by loop(); p5.js parseSerialLine() reads S: for slider and L: for light.
// Why these values: Arduino analogRead returns 0-1023, threshold 4 filters tiny jitter, and ANALOG_INTERVAL_MS sets the send rate.
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
