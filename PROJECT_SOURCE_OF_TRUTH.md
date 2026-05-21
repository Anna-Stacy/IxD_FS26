# Bremen Town Musicians - Project Source of Truth

Last updated: 2026-05-21

## Project Goal

Create an interactive retelling of *The Bremen Town Musicians* for the IxD interaction design module.

The project uses:

- **p5.js** for the visual story, branching interaction, and mini-game.
- **Arduino IDE** for the Arduino Micro controller.
- **Arduino Micro hardware** connected to the laptop over USB serial.

The intended experience is a physical story controller: the audience uses buttons, a slider, and a light sensor to control a browser-based story.

## Application Entry Point

The p5.js application is launched from:

- `index.html`
- `style.css`
- `sketch.js`

The browser app uses the existing image files in:

- `Bremen Image Material/`

No generated replacement images are currently used.

## Required Browser

Use Chrome or Edge for the Arduino connection because the app uses the Web Serial API.

The story can also be tested without Arduino using keyboard fallback:

- `Space` or `Enter`: white button / continue
- `1`: red button / choice 1
- `2`: yellow button / choice 2
- `3`: green button / choice 3
- `Left` / `A`: move slider left
- `Right` / `D`: move slider right
- `L`: simulate light sensor reaching the start threshold

## Arduino Hardware Inputs

The implemented repo sketch expects:

| Control | Purpose | Pin | Serial output |
| --- | --- | --- | --- |
| White button | Continue / advance story | D2 | `B1` |
| Red button | Choice 1 | D3 | `B2` |
| Yellow button | Choice 2 | D4 | `B3` |
| Green button | Choice 3 | D5 | `B4` |
| Slider / potentiometer | Mini-game horizontal control | A0 | `S:<0-1023>` |
| Light sensor | Starts story from start page | A1 | `L:<0-1023>` |

Buttons use `INPUT_PULLUP`, so they are active LOW:

- one button leg to GND
- the other button leg to the digital input pin

## Serial Protocol

Baud rate:

```text
9600
```

Arduino sends:

```text
READY
B1
B2
B3
B4
S:512
L:700
```

The app also accepts these readable labels for testing/flexibility:

```text
WHITE
RED
YELLOW
GREEN
SLIDER:512
LIGHT:700
```

## Light Sensor Start Rule

The story stays on the start page until the light sensor reaches the configured threshold.

Current threshold in `sketch.js`:

```js
const LIGHT_START_THRESHOLD = 650;
```

When the app receives `L:<value>` and `value >= 650`, the story starts from the first scene.

This value may need calibration after testing with the real sensor, room lighting, and physical enclosure.

## Story Structure

The story begins with the donkey leaving the mill.

The player then makes choices for:

1. Dog
2. Cat
3. Rooster

Each choice can produce one of three effects:

- Good: kind/helpful answer
- Neutral: useful but tactless answer
- Bad: rude or dismissive answer

Animal joining rules:

| Animal | Can join through |
| --- | --- |
| Dog | Dog good or dog neutral choice |
| Cat | Cat good choice only |
| Rooster | Rooster good or rooster neutral choice |

## Ending Rules

### Good Ending

Condition:

- Dog joined
- Cat joined
- Rooster joined

Visual:

- `ending_good.png`

Meaning:

- All four animals work together and scare the robbers away.

### Neutral Ending

Condition:

- At least one non-cat companion joined:
  - dog
  - rooster
  - dog and rooster

Cat rule:

- The cat is never used in the neutral ending.
- Neutral ending images containing the cat are intentionally excluded.

Allowed neutral visuals:

- `ending_mid_donkey_dog.png`
- `ending_mid_donkey_rooster.png`
- `ending_mid_donkey_dog_rooster.png`

Excluded neutral visuals:

- `ending_mid_donkey_cat.png`
- `ending_mid_donkey_cat_rooster.png`
- `ending_mid_donkey_dog_cat.png`

### Bad Ending

Condition:

- No non-cat companion remains available for the ending.

Visual:

- `ending_bad.png`

Meaning:

- The donkey reaches the forest alone and cannot face the robbers.

## Cat Edge Case

The project requirement says:

- the cat can join in the good ending
- the cat can never join in the neutral ending

Therefore, if the cat joins earlier but the full good-ending group is not completed, the neutral ending ignores the cat and uses only dog/rooster companionship.

If the cat is the only animal that joined, the app resolves to the bad ending because a neutral ending requires at least one non-cat companion.

## Mini-Game

The mini-game starts after the house-in-the-forest scene if the result is not bad.

Purpose:

- Use the slider to move the donkey horizontally.
- Catch falling companion icons.
- The game supports the story moment where the animals form a tower at the robbers' house.

Current behavior:

- Good ending mini-game uses dog, cat, and rooster icons.
- Neutral ending mini-game uses only dog and/or rooster.
- Bad ending skips the mini-game.

The mini-game currently does not change the final ending. It is an interaction step before showing the ending.

## Visual Assets

Backgrounds:

- `bg_farm.png`
- `bg_road.png`
- `bg_forest.png`
- `bg_house.png`
- `bg_inside.png`

Characters:

- `donkey_icon.png`
- `dog_icon.png`
- `cat_icon.png`
- `rooster_icon.png`

Endings currently used:

- `ending_good.png`
- `ending_bad.png`
- `ending_mid_donkey_dog.png`
- `ending_mid_donkey_rooster.png`
- `ending_mid_donkey_dog_rooster.png`

## Board Layout Mockup

`Board Layout example for each function.png` is a hand-in mockup for the professor.

It is not treated as the authoritative hardware source.

The authoritative implementation is:

- the physical wiring
- the Arduino sketch
- the serial output observed in Arduino IDE Serial Monitor
- this documentation

## Current Implementation Files

| File | Purpose |
| --- | --- |
| `index.html` | Browser entry point and p5.js loading |
| `style.css` | Page layout and controls |
| `sketch.js` | Story logic, serial parsing, rendering, mini-game |
| `bremen_musicians/bremen_musicians.ino` | Arduino Micro firmware |
| `PROJECT_SOURCE_OF_TRUTH.md` | Living documentation |

## Known Technical Notes

- The app references p5.js through CDN in `index.html`.
- The Arduino connection requires a user click on `Connect Arduino`; browsers do not allow automatic serial connection.
- The light threshold should be tested on the real physical setup and adjusted if needed.
- The Arduino sketch in the repo is now intended to match the described four-button, slider, and light-sensor controller.

