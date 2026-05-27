# Bremen Town Musicians - Project Source of Truth

Last updated: 2026-05-27

## Project Goal

Create an interactive retelling of *The Bremen Town Musicians* for the IxD interaction design module.

The project uses:

- **p5.js** for visuals, branching story interaction, and the tower stacking mini-game.
- **Arduino IDE** for the Arduino Micro controller.
- **Arduino Micro hardware** connected to the laptop over USB serial.

No generated replacement images are currently used.

## Application Entry Point

The browser application is launched from:

- `index.html`
- `style.css`
- `sketch.js`

The app uses existing assets from:

- `Bremen Image Material/`

## Browser Requirement

Use Chrome or Edge for the Arduino connection because the app uses the Web Serial API.

Keyboard fallback for testing:

- `Space` or `Enter`: red button / continue
- `1`: yellow button / choice 1
- `2`: green button / choice 2
- `3`: white button / choice 3
- `Left` / `A`: move slider left
- `Right` / `D`: move slider right
- `L`: simulate covered light sensor threshold

## Arduino Hardware Inputs

The repo sketch expects this mapping:

| Control | Purpose | Pin | Serial output |
| --- | --- | --- | --- |
| Red button | Continue / advance story | D2 | `B1` |
| White button | Choice 3 | D3 | `B2` |
| Green button | Choice 2 | D4 | `B3` |
| Yellow button | Choice 1 | D5 | `B4` |
| Slider / potentiometer | Mini-game horizontal control | A0 | `S:<0-1023>` |
| Light sensor | Starts story and mini-game when covered | A1 | `L:<0-1023>` |

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
L:300
```

The app also accepts readable labels:

```text
RED
YELLOW
GREEN
WHITE
SLIDER:512
LIGHT:300
```

## Light Sensor Rules

The light sensor uses the original high-value trigger. The app starts when the sensor value becomes high enough.

Current thresholds in `sketch.js`:

```js
const LIGHT_START_THRESHOLD = 650;
const MINI_GAME_LIGHT_THRESHOLD = 650;
```

Story start:

- if app is on the start page
- and receives `L:<value>`
- and `value >= 650`
- then the story begins

Mini-game start:

- if app is on the mini-game explanation page
- and receives `L:<value>`
- and `value >= 650`
- then the tower stacking game begins

The threshold should be calibrated after testing the actual sensor values for uncovered and covered states.

## Button Mapping In App

| Serial | Color | Function |
| --- | --- | --- |
| `B1` | Red | Continue |
| `B2` | White | Choice 3 |
| `B3` | Green | Choice 2 |
| `B4` | Yellow | Choice 1 |

## Story Structure

The story uses the updated Word document as the narrative source.

Implementation rules:

- `VC` labels are ignored for now.
- Voice lines are future work.
- Heading/marker text is used only to understand structure.
- Narrative text is split into readable chunks.
- The same scene image can remain while red/continue advances through multiple text chunks.
- Text may be lightly cleaned for grammar/structure, but not rewritten or shortened.

Major story sections:

1. Donkey leaves the mill.
2. Dog choice.
3. Cat choice.
4. Rooster choice.
5. Forest/house approach.
6. Tower stacking game if at least one companion joined.
7. Good, neutral, or bad ending.

## Companion Rules

| Animal | Can join through |
| --- | --- |
| Dog | Dog choice 1 or choice 2 |
| Cat | Cat choice 1 |
| Rooster | Rooster choice 1 or choice 2 |

## Ending Rules

Good ending:

- dog joined
- cat joined
- rooster joined

Neutral ending:

- at least one companion joined
- includes cat-only, dog-only, rooster-only, and mixed companion variants

Bad ending:

- donkey has no companions

## Visual Rules

- Scene images are used as full visual scenes, not as generic layered backgrounds.
- Scene images may be reused where the narrative still fits.
- Road transition images may be inserted between encounters so a previous animal scene does not remain visible during the next encounter.
- Transparent animal images are used only for the tower stacking mini-game.
- Text boxes are semi-transparent when they overlap full scene images.
- The start page does not use the story text-box UI. Its title is centered, with compact control explanations below it.
- Narrative text boxes resize to the current text instead of using one fixed box size for every page.
- Choice screens use one separate text-box UI image for each choice option. The button image is centered at the top of each choice box, and the old "Choice 1/2/3" text titles are not shown.
- The old bottom party indicator has been removed.
- Scene images are drawn with full-image containment to avoid cropping/over-zooming.

## Scene Image Map

Intro and road:

- `starting page.png`
- `the old mill donkey intro.png`
- `bg_road for walking.png`

Dog:

- `meeting the dog  happy and neutral choices .png`
- `meeting the dog bad choice.png`

The good/neutral dog image is also used for the dog introduction and dog choice screen. It remains through the dog scene unless the bad dog choice is selected.

Cat:

- `meeting cat only donkey bad and neutral choice.png`
- `meeting the sad cat with donkey and dog.png`
- `Donkey alone meeting cat good choice cat joining.png`
- `donkey and dog happy cat joining them good choice .png`

Cat image rules:

- If the dog did not join, the cat introduction and non-joining cat choices use `meeting cat only donkey bad and neutral choice.png`.
- If the dog joined, the cat introduction and non-joining cat choices use `meeting the sad cat with donkey and dog.png`.
- The cat image changes to a happy joining image only after cat choice 1 is selected.
- If cat choice 1 is selected without the dog, use `Donkey alone meeting cat good choice cat joining.png`.
- If cat choice 1 is selected with the dog, use `donkey and dog happy cat joining them good choice .png`.

Rooster:

- `meeting the rooster with only donkey.png`
- `meeting the rooster with donkey and dog.png`
- `meeting rooster with donkey and cat.png`
- `meeting the rooster with donkey cat and dog.png`

House and robber sequence:

- `bg_house for first view of the house and for the sleeping scene.png`
- `looking inside the hut seeing robbers.png`
- `Broken glass ambush of towereed animals neutral and good choices .png`
- `Feast scene good and neutral choices.png`
- `scene house with no lights before robbers go inside and after.png`
- `robber inside the house.png`
- `robber fleeing the house.png`

Ending animal images:

- `ending_good.png`
- `ending_neutral_donkey_dog.png`
- `ending_neutral_donkey_cat.png`
- `ending_neutral_donkey_rooster.png`
- `ending_neutral_donkey_dog_cat.png`
- `ending_neutral_donkey_dog_rooster.png`
- `ending neutral_donkey_cat_rooster.png`
- `ending_bad.png`

Final ending images:

- `good ending after animals are shown last image.png`
- `neutral ending background after animal ending is shown last image.png`

UI:

- `text box ui.png`
- `UI Buttons red button choice continue.png`
- `UI Buttons yellow button choice 1.png`
- `UI Buttons green button choice 2.png`
- `UI Buttons white button choice 3.png`
- `UI Buttons Red choice Retry .png`
- `Slider UI.png`
- `Light sensor UI.png`

## Mini-Game

The mini-game starts after a short explanation page.

Flow:

1. Narrative introduces the tower plan.
2. Explanation page tells the user to cover the light sensor.
3. User covers light sensor to start.
4. Slider moves the donkey horizontally.
5. One joined companion falls at a time in a zigzag motion.
6. If caught, the companion stacks on the donkey and remains visible.
7. The catch height follows the current stack height, so later animals snap onto the top of the tower instead of falling into the lower animal.
8. If an animal is missed, the game advances to the next joined companion.
9. After all joined companions have had a turn, a result screen appears.
10. If at least one animal was caught, the result says "Good job, you built a tower!" and the red button continues.
11. If no animals were caught, the result screen uses the red retry button and the player must retry before the story continues.

Mini-game assets:

- `full body transparent background.png` for donkey
- `dog sitting full body transparent background.png`
- `cat full body transparent background.png`
- `rooster full body transparent background.png`

Mini-game constants:

- `MINI_GAME_CATCH_WINDOW = 82`

## Board Layout Mockup

`Board Layout example for each function.png` is a professor hand-in mockup.

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
| `STORY_BRANCH_IMAGE_ORDER.md` | Current image order by branch |

## Known Technical Notes

- The app references p5.js through CDN in `index.html`.
- Browsers require a user click on `Connect Arduino`; serial connection cannot start automatically.
- Light thresholds must be calibrated with the actual sensor and physical setup.
- Voice lines are intentionally not implemented yet.
- Background music and three ending sounds are planned, but no audio files are currently present in the repo.
