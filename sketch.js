"use strict";

// Why: Keep asset-folder names centralized so file paths are not repeated throughout the sketch.
// What this does for the code: Provides the base folder used by preload() when loading all visual assets.
// Codependencies and why/where: Used only by preload(); depends on the repo folder `Bremen Image Material`.
// Why these values: The value matches the exact folder name in this project.
const ASSET_DIR = "Bremen Image Material";

// Why: Keep music-folder names centralized for the same reason as visual assets.
// What this does for the code: Provides the base folder used by preload() when loading all MP3 files.
// Codependencies and why/where: Used only by preload(); depends on the repo folder `Bremen_Music_Files`.
// Why these values: The value matches the exact folder name containing the project music.
const MUSIC_DIR = "Bremen_Music_Files";

// Why: The story should begin only when the physical light sensor is covered enough.
// What this does for the code: Sets the analog threshold that moves from the light-sensor start page into the story.
// Codependencies and why/where: Used in handleLightValue(); depends on Arduino serial `L:<0-1023>` values.
// Why these values: 650 keeps the existing high-value covered-light behavior from testing.
const LIGHT_START_THRESHOLD = 650;

// Why: The tower mini-game should also require a deliberate light-sensor action to begin.
// What this does for the code: Sets the analog threshold that moves from miniIntro into miniGame.
// Codependencies and why/where: Used in handleLightValue(); depends on the same Arduino light sensor protocol.
// Why these values: Kept equal to LIGHT_START_THRESHOLD so the same covered-light gesture works consistently.
const MINI_GAME_LIGHT_THRESHOLD = 650;

// Why: Browser serial and Arduino serial must agree on speed.
// What this does for the code: Supplies the baud rate used when opening the Web Serial port.
// Codependencies and why/where: Used by connectSerial(); must match `Serial.begin(9600)` in the Arduino sketch.
// Why these values: 9600 is stable and matches the controller code already in this repo.
const SERIAL_BAUD_RATE = 9600;

// Why: Falling animals should only be caught near the current tower height.
// What this does for the code: Limits the vertical catch region after a faller reaches the stack target.
// Codependencies and why/where: Used in updateMiniGame(); works with stackTargetY() and MINI_GAME positions.
// Why these values: 82 matches the visual vertical spacing used between stacked animals.
const MINI_GAME_CATCH_WINDOW = 82;

// Why: Button feedback should be visible but not carry into the next scene.
// What this does for the code: Sets the brief duration for choice/continue button highlight effects.
// Codependencies and why/where: Used by drawChoicePage(), handleContinueButton(), and drawUiButton().
// Why these values: 220 ms is short enough to feel responsive while still visible.
const BUTTON_FEEDBACK_MS = 220;

// Why: Music should be audible without overpowering the story presentation.
// What this does for the code: Sets the default gain for all looping tracks.
// Codependencies and why/where: Used by updateMusic(); depends on p5.sound's setVolume() method.
// Why these values: 0.45 is a moderate level suitable for classroom playback.
const MUSIC_VOLUME = 0.45;

// Why: Music transitions should feel ambient instead of abruptly switching.
// What this does for the code: Sets the crossfade duration between background, tower, and ending tracks.
// Codependencies and why/where: Used by updateMusic(); depends on p5.sound volume ramping.
// Why these values: 1 second was requested for every fade in/out.
const MUSIC_FADE_SECONDS = 1;

// Why: Shared colors need readable names so UI drawing stays consistent.
// What this does for the code: Stores text, panel, border, and accent colors used across draw functions.
// Codependencies and why/where: Used by drawTextBox(), drawPanel(), drawMiniGame(), and start/minigame screens.
// Why these values: They match the warm parchment/ink look of the project assets.
const COLORS = {
  ink: "#2b1b10",
  paper: "#fff4db",
  muted: "#dacfb9",
  panel: "rgba(15, 13, 11, 0.68)",
  panelStrong: "rgba(15, 13, 11, 0.82)",
  border: "rgba(255, 244, 219, 0.26)",
  accent: "#e8c86b",
};

// Why: Each image asset should have a stable key used by story logic instead of hard-coded filenames everywhere.
// What this does for the code: Maps logical image names to the exact PNG filenames in `Bremen Image Material`.
// Codependencies and why/where: Used by preload(), drawSceneImage(), story page objects, and UI draw helpers.
// Why these values: Each value is the current filename in the repo; spaces/capitalization must match exactly on disk.
const FILES = {
  mainStart: "main starting page.png",
  start: "starting page.png",
  intro: "the old mill donkey intro.png",
  road: "bg_road for walking.png",
  dogGood: "meeting the dog  happy and neutral choices .png",
  dogBad: "meeting the dog bad choice.png",
  catDonkey: "meeting cat only donkey bad and neutral choice.png",
  catDogSad: "meeting the sad cat with donkey and dog.png",
  catGoodDonkey: "Donkey alone meeting cat good choice cat joining.png",
  catGoodDog: "donkey and dog happy cat joining them good choice .png",
  roosterDonkey: "meeting the rooster with only donkey.png",
  roosterDog: "meeting the rooster with donkey and dog.png",
  roosterCat: "meeting rooster with donkey and cat.png",
  roosterAll: "meeting the rooster with donkey cat and dog.png",
  house: "bg_house for first view of the house and for the sleeping scene.png",
  lookingInside: "looking inside the hut seeing robbers.png",
  crash: "Broken glass ambush of towereed animals neutral and good choices .png",
  feast: "Feast scene good and neutral choices.png",
  darkHouse: "scene house with no lights before robbers go inside and after.png",
  robberInside: "robber inside the house.png",
  robberFleeing: "robber fleeing the house.png",
  goodAnimals: "ending_good.png",
  goodFinal: "good ending after animals are shown last image.png",
  neutralFinal: "neutral ending background after animal ending is shown last image.png",
  bad: "ending_bad.png",
  neutralDog: "ending_neutral_donkey_dog.png",
  neutralCat: "ending_neutral_donkey_cat.png",
  neutralRooster: "ending_neutral_donkey_rooster.png",
  neutralDogCat: "ending_neutral_donkey_dog_cat.png",
  neutralDogRooster: "ending_neutral_donkey_dog_rooster.png",
  neutralCatRooster: "ending neutral_donkey_cat_rooster.png",
  redContinue: "UI Buttons red button choice continue.png",
  yellowChoice1: "UI Buttons yellow button choice 1.png",
  greenChoice2: "UI Buttons green button choice 2.png",
  whiteChoice3: "UI Buttons white button choice 3.png",
  redRetry: "UI Buttons Red choice Retry .png",
  sliderUi: "Slider UI.png",
  lightUi: "Light sensor UI.png",
  textBox: "text box ui.png",
  donkeyBody: "full body transparent background.png",
  dogBody: "dog sitting full body transparent background.png",
  catBody: "cat full body transparent background.png",
  roosterBody: "rooster full body transparent background.png",
};

// Why: Each music phase needs a stable key just like the image assets.
// What this does for the code: Maps logical music states to the exact MP3 filenames in `Bremen_Music_Files`.
// Codependencies and why/where: Used by preload(), desiredMusicKey(), and updateMusic().
// Why these values: They match the current imported MP3 files for background, tower, and endings.
const MUSIC_FILES = {
  background: "IxD Bremen Town Musicians Background Music (1).mp3",
  tower: "IxD Bremen Town Musicians MiniGame (1).mp3",
  good: "IxD Bremen Town Musicians Good Ending.mp3",
  neutral: "IxD Bremen Town Musicians Neutral Ending.mp3",
  bad: "IxD Bremen Town Musicians Bad Ending.mp3",
};

// Why: p5 preload() needs somewhere to store loaded image objects by key.
// What this does for the code: Holds loaded p5.Image objects after preload().
// Codependencies and why/where: Filled by preload(); read by drawSceneImage(), drawUiImage(), and animal drawing functions.
// Why these values: Starts empty because p5 loads assets asynchronously during preload().
const assets = {};

// Why: p5 preload() needs somewhere to store loaded sound objects by key.
// What this does for the code: Holds loaded p5.SoundFile objects after preload().
// Codependencies and why/where: Filled by preload(); read by updateMusic() and stopAllMusic().
// Why these values: Starts empty because sounds are available only after preload() runs.
const music = {};

// Why: The browser needs to remember which serial port is connected.
// What this does for the code: Stores the Web Serial port object selected by the user.
// Codependencies and why/where: Set by connectSerial(); used by readSerialLoop().
// Why these values: Null means no port is connected yet.
let serialPort = null;

// Why: Serial reading requires a persistent stream reader.
// What this does for the code: Stores the active reader for incoming Arduino text.
// Codependencies and why/where: Set by readSerialLoop(); indirectly tied to serialPort.
// Why these values: Null means no reader is active yet.
let serialReader = null;

// Why: Serial data can arrive in partial chunks.
// What this does for the code: Buffers incomplete serial text until a newline appears.
// Codependencies and why/where: Used by consumeSerialChunk() before parseSerialLine().
// Why these values: Empty string means there is no partial serial line pending.
let serialBuffer = "";

// Why: The app needs to know whether the serial loop should keep reading.
// What this does for the code: Tracks the current Arduino connection state.
// Codependencies and why/where: Set by connectSerial() and readSerialLoop(); shown through updateHud()/status text.
// Why these values: False is the safe startup state before the user connects hardware.
let serialConnected = false;

// Why: The start and mini-game gates depend on the latest light reading.
// What this does for the code: Stores the most recent `L:<0-1023>` value from Arduino or keyboard simulation.
// Codependencies and why/where: Updated by handleLightValue(); displayed by drawStart() and updateHud().
// Why these values: Null means no reading has arrived yet, so the UI can show `--`.
let lastLightValue = null;

// Why: The tower mini-game needs a current horizontal control value.
// What this does for the code: Stores the most recent slider/potentiometer value.
// Codependencies and why/where: Updated by parseSerialLine() and keyPressed(); read by drawStackedDonkeyAndCompanions().
// Why these values: 512 is the midpoint of the Arduino analog 0-1023 range.
let lastSliderValue = 512;

// Why: The story has multiple screens and interaction modes.
// What this does for the code: Stores the active application state.
// Codependencies and why/where: Read by draw(), handleContinueButton(), handleLightValue(), and input handlers.
// Why these values: `mainStart` is the first user-facing screen after loading.
let appState = "mainStart";

// Why: The fixed story canvas must scale to the browser window.
// What this does for the code: Stores the current scale and translation used in draw().
// Codependencies and why/where: Updated by resizeCanvasToWrap(); applied by draw().
// Why these values: Initial scale 1 and offsets 0 are safe before the first resize calculation.
let canvasSize = { scale: 1, x: 0, y: 0 };

// Why: The narrative is displayed as a list of page objects for the current branch.
// What this does for the code: Holds the active sequence of story pages.
// Codependencies and why/where: Filled by introPages(), branch choices, forestPages(), and buildPostMiniPages().
// Why these values: Empty array means no story page sequence is active yet.
let pages = [];

// Why: The app needs to know which page in the active sequence is visible.
// What this does for the code: Stores the current index into `pages`.
// Codependencies and why/where: Used by drawNarrativePage(), continueStory(), and advanceAfterPages().
// Why these values: 0 means the first page of any new sequence.
let pageIndex = 0;

// Why: Choice screens need the currently displayed choice definition.
// What this does for the code: Stores the active choice object while appState is `choice` or `choiceFeedback`.
// Codependencies and why/where: Set by showChoice(); read by drawChoicePage(), chooseOption(), and applyChoice().
// Why these values: Null means no choice screen is currently active.
let currentChoice = null;

// Why: Choice buttons need a brief visual acknowledgement.
// What this does for the code: Stores which choice was pressed and when the feedback started.
// Codependencies and why/where: Set by chooseOption(); read by drawChoicePage().
// Why these values: Null means no choice feedback animation is active.
let choiceFeedback = null;

// Why: Continue/retry buttons need a brief visual acknowledgement.
// What this does for the code: Stores the time until which the red button highlight should remain active.
// Codependencies and why/where: Set by handleContinueButton(); read by drawTextBox() and drawMiniResult().
// Why these values: 0 means no highlight is active at startup.
let continueFeedbackUntil = 0;

// Why: Branches depend on which animals have joined the donkey.
// What this does for the code: Tracks companion membership for dog, cat, and rooster.
// Codependencies and why/where: Updated by applyChoice(); read by story builders, endings, and mini-game setup.
// Why these values: All false means the donkey starts alone.
let companions = { dog: false, cat: false, rooster: false };

// Why: The ending path depends on the final companion set.
// What this does for the code: Stores `good`, `neutral`, or `bad` after choices are complete.
// Codependencies and why/where: Set by decideEnding(); read by forestPages() and buildPostMiniPages().
// Why these values: Null means the ending has not been decided yet.
let resultType = null;

// Why: The tower game needs its own runtime state separate from story pages.
// What this does for the code: Stores animals to catch, stack contents, faller state, and donkey position.
// Codependencies and why/where: Created by startMiniGame(); read and updated by mini-game functions.
// Why these values: Null means the mini-game is not active.
let miniGame = null;

// Why: The transition after the mini-game uses a timed fade screen.
// What this does for the code: Stores fade timing and image while appState is `fade`.
// Codependencies and why/where: Set by performContinueAction(); read by drawFade().
// Why these values: Null means no fade transition is active.
let fade = null;

// Why: Browsers require user interaction before audio can start.
// What this does for the code: Tracks whether userStartAudio() has been triggered.
// Codependencies and why/where: Set by beginAudio(); read by updateMusic().
// Why these values: False prevents music from starting on the main start screen automatically.
let audioStarted = false;

// Why: The app needs to avoid restarting the same music loop every frame.
// What this does for the code: Stores the currently active music key.
// Codependencies and why/where: Updated by updateMusic(); reset by stopAllMusic().
// Why these values: Null means no track is currently considered active.
let currentMusicKey = null;

// Why: Continue button feedback delays navigation briefly.
// What this does for the code: Stores the timeout that will run the actual continue action.
// Codependencies and why/where: Set by handleContinueButton(); cleared by resetStoryState().
// Why these values: Null means no delayed continue action is pending.
let pendingContinue = null;

// Why: Music fade-out needs a delayed stop after volume reaches zero.
// What this does for the code: Stores the timeout that stops previous tracks after crossfade.
// Codependencies and why/where: Set by updateMusic(); cleared by updateMusic() and stopAllMusic().
// Why these values: Null means no delayed music stop is pending.
let musicStopTimer = null;

// Lecturer QA: How the sketch/visuals are made in code.
// The visuals are PNG and MP3 assets loaded into two lookup objects, `assets` and `music`.
// Later, story pages only refer to short keys like "dogGood" or "bad", and preload() translates those
// keys into actual files from Bremen Image Material and Bremen_Music_Files.
// Values: ASSET_DIR, MUSIC_DIR, FILES, and MUSIC_FILES above are the source of the filenames.
// Why: p5 needs all media loaded before setup() and draw() try to use it.
// What this does for the code: Loads all images and sounds into the `assets` and `music` lookup objects.
// Codependencies and why/where: Depends on FILES, MUSIC_FILES, ASSET_DIR, MUSIC_DIR, p5 loadImage(), and p5.sound loadSound().
// Why these values: Uses the exact keys and filenames defined above so story pages can reference stable logical names.
function preload() {
  Object.entries(FILES).forEach(([key, filename]) => {
    assets[key] = loadImage(`${ASSET_DIR}/${filename}`);
  });
  if (typeof loadSound === "function") {
    Object.entries(MUSIC_FILES).forEach(([key, filename]) => {
      music[key] = loadSound(`${MUSIC_DIR}/${filename}`);
    });
  }
}

// Lecturer QA: How the website/local host becomes the interactive sketch.
// index.html loads p5.js and sketch.js; then p5 automatically calls setup() when the page opens on localhost.
// setup() creates the canvas inside #canvas-wrap and connects the HTML buttons to JavaScript functions.
// Values: createCanvas(1376, 768) matches the designed artwork size, and frameRate(60) gives smooth animation.
// Why: p5 needs a setup step to create the canvas and bind browser UI controls.
// What this does for the code: Creates the canvas, applies font/frame settings, connects button listeners, and initializes HUD text.
// Codependencies and why/where: Depends on p5 createCanvas(), `canvas-wrap`, `connect-serial`, `demo-start`, startStory(), and updateHud().
// Why these values: Canvas size 1376x768 matches the designed scene asset resolution and game coordinate system.
function setup() {
  const canvas = createCanvas(1376, 768);
  canvas.parent("canvas-wrap");
  textFont("Georgia");
  frameRate(60);
  resizeCanvasToWrap();

  document.getElementById("connect-serial").addEventListener("click", connectSerial);
  document.getElementById("demo-start").addEventListener("click", () => {
    beginAudio();
    startStory();
  });
  updateHud();
}

// Why: p5 redraws the application continuously, so all screen rendering is routed from one state switch.
// What this does for the code: Clears the background, applies responsive canvas scaling, draws the active app state, and updates music.
// Codependencies and why/where: Depends on appState and all draw* functions; updateMusic() keeps audio synchronized with visible story state.
// Why these values: Background 16 provides a dark margin outside the scaled story canvas.
function draw() {
  background(16);
  push();
  translate(canvasSize.x, canvasSize.y);
  scale(canvasSize.scale);

  if (appState === "mainStart") drawMainStart();
  else if (appState === "start") drawStart();
  else if (appState === "page") drawNarrativePage();
  else if (appState === "choice") drawChoicePage();
  else if (appState === "choiceFeedback") drawChoicePage();
  else if (appState === "miniIntro") drawMiniIntro();
  else if (appState === "miniGame") drawMiniGame();
  else if (appState === "miniResult") drawMiniResult();
  else if (appState === "fade") drawFade();

  updateMusic();
  pop();
}

// Why: The app should remain correctly scaled after the browser window changes size.
// What this does for the code: Delegates resize events to resizeCanvasToWrap().
// Codependencies and why/where: Called automatically by p5; depends on resizeCanvasToWrap().
// Why these values: No literal values here; it exists as the p5 resize hook.
function windowResized() {
  resizeCanvasToWrap();
}

// Why: The story was designed at 1376x768 but may run in different browser sizes.
// What this does for the code: Resizes the p5 canvas to its wrapper and calculates scale/offset for letterboxed drawing.
// Codependencies and why/where: Uses `canvas-wrap`, p5 width/height, resizeCanvas(), and draw() transform logic.
// Why these values: Minimum 320 prevents invalid tiny canvases; 1376x768 matches the designed scene resolution.
function resizeCanvasToWrap() {
  const wrap = document.getElementById("canvas-wrap");
  const w = Math.max(320, wrap.clientWidth);
  const h = Math.max(320, wrap.clientHeight);
  resizeCanvas(w, h);
  const scale = Math.min(width / 1376, height / 768);
  canvasSize = {
    scale,
    x: (width - 1376 * scale) / 2,
    y: (height - 768 * scale) / 2,
  };
}

// Lecturer QA: How the scene visuals are drawn.
// Every story scene calls this function with an asset key. The function scales the image so it fits the
// 1376x768 design canvas, centers it, and optionally draws a transparent black overlay for readability.
// Values: 1376x768 is the fixed design coordinate system; overlay values like 42, 46, or 52 control darkness.
// Why: Every narrative page needs consistent full-scene image rendering.
// What this does for the code: Draws an image contained within the canvas and optionally darkens it with an overlay.
// Codependencies and why/where: Depends on loaded `assets`; used by all major screen draw functions.
// Why these values: Default overlay 52 preserves image visibility while improving text readability.
function drawSceneImage(assetKey, overlay = 52) {
  const img = assets[assetKey] || assets.road;
  const scale = Math.min(1376 / img.width, 768 / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (1376 - dw) / 2;
  const dy = (768 - dh) / 2;
  noStroke();
  fill(12);
  rect(0, 0, 1376, 768);
  image(img, dx, dy, dw, dh);
  if (overlay > 0) {
    noStroke();
    fill(0, 0, 0, overlay);
    rect(0, 0, 1376, 768);
  }
}

// Why: The first screen is a designed landing page separate from the light-sensor start page.
// What this does for the code: Draws the main start PNG and overlays only the red continue UI.
// Codependencies and why/where: Depends on `mainStart` image key, drawUiButton(), and continueFeedbackUntil.
// Why these values: Red button coordinates place it in the lower-middle area requested for the main page.
function drawMainStart() {
  drawSceneImage("mainStart", 0);
  textAlign(CENTER, CENTER);
  drawUiButton("redContinue", 647, 642, 82, 82, millis() < continueFeedbackUntil);
  textAlign(LEFT, BASELINE);
}

// Why: The second start page waits for the physical light sensor before the story begins.
// What this does for the code: Draws the light-sensor start image and overlays the live light value.
// Codependencies and why/where: Depends on `start` image key and lastLightValue; handleLightValue() performs the threshold transition.
// Why these values: Text coordinates place the light value in the lower-right middle area of the designed page.
function drawStart() {
  drawSceneImage("start", 0);
  textAlign(CENTER, CENTER);
  fill("#4a2414");
  textStyle(BOLD);
  textSize(26);
  text(`Light: ${lastLightValue ?? "--"}`, 1018, 598);
  textAlign(LEFT, BASELINE);
}

// Why: Narrative pages share image-and-textbox rendering.
// What this does for the code: Draws the current page image and story text with the red continue icon.
// Codependencies and why/where: Depends on pages, pageIndex, drawSceneImage(), drawTextBox(), and page() objects.
// Why these values: Overlay fallback 46 is a balanced darkness level for readable story text.
function drawNarrativePage() {
  const page = pages[pageIndex];
  drawSceneImage(page.image, page.overlay ?? 46);
  drawTextBox(page.text, "red-icon-only", page.position || "left");
}

// Why: Choice pages need to display the question, three options, and short button feedback.
// What this does for the code: Draws the active choice scene, question box, option cards, and applies selected-choice timing.
// Codependencies and why/where: Depends on currentChoice, choiceFeedback, BUTTON_FEEDBACK_MS, choiceCardBox(), drawChoiceCard(), and applyChoice().
// Why these values: Uses three fixed option card positions so the UI layout stays predictable.
function drawChoicePage() {
  drawSceneImage(currentChoice.image, currentChoice.overlay ?? 42);
  drawTextBox(currentChoice.question, "Choose with green, yellow, or white.", "top");
  currentChoice.options.forEach((option, index) => {
    const box = choiceCardBox(index);
    drawChoiceCard(box.x, box.y, box.w, box.h, option, index, choiceFeedback?.index === index);
  });

  if (appState === "choiceFeedback" && millis() - choiceFeedback.startedAt >= BUTTON_FEEDBACK_MS) {
    applyChoice(choiceFeedback.index);
  }
}

// Why: The tower game needs an instruction page before the light sensor starts gameplay.
// What this does for the code: Draws the house scene and explains the light-sensor trigger for the mini-game.
// Codependencies and why/where: Depends on drawTextBox(), lightUi asset, and MINI_GAME_LIGHT_THRESHOLD.
// Why these values: Light UI position keeps the control hint visible without covering the main text box.
function drawMiniIntro() {
  drawSceneImage("lookingInside", 50);
  drawTextBox(
    `The companions have a plan: they will climb into a tower and make the most terrible music the robbers have ever heard. Cover the light sensor until the value is ${MINI_GAME_LIGHT_THRESHOLD} or higher to start the stacking game.`,
    "Use the light sensor to start.",
    "left"
  );
  drawUiImage("lightUi", 1110, 66, 150, 108);
}

// Why: The mini-game needs continuous animation and input-driven drawing.
// What this does for the code: Updates falling animals, draws the game instruction panel, slider UI, donkey stack, and active faller.
// Codependencies and why/where: Depends on miniGame state, updateMiniGame(), drawStackedDonkeyAndCompanions(), animalWidth(), and animalHeight().
// Why these values: Panel and slider coordinates keep controls readable while leaving the falling area visible.
function drawMiniGame() {
  drawSceneImage("lookingInside", 34);
  updateMiniGame();

  drawTextBoxUi(54, 58, 500, 128);
  fill(COLORS.ink);
  textStyle(BOLD);
  textSize(28);
  text("Stack the Musicians", 92, 100);
  textStyle(NORMAL);
  textSize(18);
  text(`Catch the falling companion with the donkey.\nSlider value: ${Math.round(lastSliderValue)}`, 92, 128);
  drawUiImage("sliderUi", 928, 52, 324, 65);

  imageMode(CENTER);
  drawStackedDonkeyAndCompanions();
  if (miniGame.faller) {
    const img = assets[`${miniGame.faller.kind}Body`];
    image(img, miniGame.faller.x, miniGame.faller.y, animalWidth(miniGame.faller.kind), animalHeight(miniGame.faller.kind));
  }
  imageMode(CORNER);
}

// Why: Players need clear feedback after the tower mini-game ends.
// What this does for the code: Shows either a success continue state or retry state, depending on whether any animal was caught.
// Codependencies and why/where: Depends on miniGame.stack, drawStackedDonkeyAndCompanions(), drawUiButton(), and continueFeedbackUntil.
// Why these values: Result box and button positions place feedback near the top center without hiding the tower.
function drawMiniResult() {
  drawSceneImage("lookingInside", 38);
  imageMode(CENTER);
  drawStackedDonkeyAndCompanions();
  imageMode(CORNER);

  const caughtAny = miniGame.stack.length > 0;
  drawTextBoxUi(384, 82, 608, caughtAny ? 176 : 224);
  fill(COLORS.ink);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(30);
  text(caughtAny ? "Good job, you built a tower!" : "Try building the tower again.", 430, 128, 516, 44);
  textStyle(NORMAL);
  textSize(18);
  textLeading(24);
  if (caughtAny) {
    drawUiButton("redContinue", 654, 182, 68, 68, millis() < continueFeedbackUntil);
  } else {
    text("Catch at least one animal before the story continues.", 430, 180, 516, 52);
    drawUiButton("redRetry", 654, 244, 68, 68, millis() < continueFeedbackUntil);
    text("Press red to retry.", 430, 310, 516, 30);
  }
  textAlign(LEFT, BASELINE);
}

// Why: After the mini-game, the story transitions through a short dramatic fade.
// What this does for the code: Draws the fade image, animates black opacity, then builds post-mini story pages.
// Codependencies and why/where: Depends on fade state, millis(), buildPostMiniPages(), and appState transitions.
// Why these values: 500 ms fade in plus 500 ms fade out creates a 1 second transition.
function drawFade() {
  drawSceneImage(fade.image, 44);
  const elapsed = millis() - fade.startedAt;
  const alpha = elapsed < 500 ? map(elapsed, 0, 500, 0, 255) : map(elapsed, 500, 1000, 255, 0);
  fill(0, 0, 0, constrain(alpha, 0, 255));
  rect(0, 0, 1376, 768);
  if (elapsed >= 1000) {
    pages = buildPostMiniPages();
    pageIndex = 0;
    appState = "page";
    fade = null;
  }
}

// Lecturer QA: UI stuff, text box answer.
// The text boxes are not normal HTML boxes; they are drawn inside the p5 canvas. This function draws the
// text-box image, wraps the story sentence, centers it vertically, and adds the red continue button image.
// Values: buttonSize 56, padding from layoutTextBox(), and continueFeedbackUntil create the visible button cue.
// Why: Story text needs consistent layout across different scene images and sentence lengths.
// What this does for the code: Draws the text-box UI, centers/wraps story text, and places the red continue icon partly outside the box.
// Codependencies and why/where: Depends on layoutTextBox(), drawTextBoxUi(), drawUiButton(), COLORS, and continueFeedbackUntil.
// Why these values: Padding and icon placement are inherited from layoutTextBox() and were tuned for the custom text-box image.
function drawTextBox(body, footer, position) {
  const box = layoutTextBox(body, footer, position);
  drawTextBoxUi(box.x, box.y, box.w, box.h);
  fill(COLORS.ink || "#2b1b10");
  textStyle(NORMAL);
  textSize(box.fontSize);
  textLeading(box.leading);
  textAlign(LEFT, TOP);
  text(body, box.x + box.padX, box.bodyY, box.w - box.padX * 2, box.bodyH);

  if (box.showFooter) {
    const buttonSize = 56;
    const buttonX = box.x + box.padX;
    const buttonY = box.y + box.h - buttonSize / 3;
    drawUiButton("redContinue", buttonX, buttonY, buttonSize, buttonSize, millis() < continueFeedbackUntil);
    fill("#5a3518");
    textSize(18);
    textLeading(23);
    if (footer !== "red-icon-only") {
      text(footer, buttonX + 54, buttonY + 10, box.w - box.padX * 2 - 54, 34);
    }
  }
  textAlign(LEFT, BASELINE);
}

// Why: Text boxes need different base layouts depending on screen position.
// What this does for the code: Returns initial x/y/width/height/font/padding values for top, right, bottom, or left boxes.
// Codependencies and why/where: Used by layoutTextBox(); affects drawTextBox() on every narrative and question screen.
// Why these values: Coordinates and minimum sizes were tuned to avoid the decorative leaves and keep text readable.
function getTextBox(position) {
  if (position === "top") return { x: 74, y: 74, w: 1228, h: 178, minW: 660, minH: 126, fontSize: 21, leading: 28, padX: 42, padY: 34 };
  if (position === "right") return { x: 716, y: 112, w: 586, h: 394, minW: 430, minH: 158, fontSize: 21, leading: 29, padX: 38, padY: 36 };
  if (position === "bottom") return { x: 84, y: 536, w: 1208, h: 180, minW: 620, minH: 128, fontSize: 20, leading: 27, padX: 42, padY: 34 };
  return { x: 74, y: 112, w: 610, h: 420, minW: 430, minH: 158, fontSize: 21, leading: 29, padX: 38, padY: 36 };
}

// Why: Short sentences should not use oversized text boxes, while long sentences still need enough room.
// What this does for the code: Shrinks text-box width for shorter copy, recenters/right-aligns boxes as needed, and fits text metrics.
// Codependencies and why/where: Depends on getTextBox(), p5 map()/constrain(), shouldShowTextBoxFooter(), and fitTextToBox().
// Why these values: 220 characters is the cutoff where shrinking stops; 0.68 is the smallest proportional width used.
function layoutTextBox(body, footer, position) {
  const base = getTextBox(position);
  const bodyLength = body.length;
  const shrink = bodyLength < 220 ? map(constrain(bodyLength, 40, 220), 40, 220, 0.68, 1) : 1;
  const box = {
    ...base,
    w: Math.round(Math.max(base.minW, base.w * shrink)),
  };

  if (position === "top" || position === "bottom") {
    box.x = Math.round((1376 - box.w) / 2);
  } else if (position === "right") {
    box.x = base.x + (base.w - box.w);
  }

  box.showFooter = shouldShowTextBoxFooter(footer);
  fitTextToBox(body, box, footer);
  return box;
}

// Why: p5 text rendering can clip final words if the box is too tight.
// What this does for the code: Calculates wrapped line count, reduces font size when needed, and adds vertical safety space.
// Codependencies and why/where: Depends on wrapTextLines(), textSize(), textLeading(), and textWidth().
// Why these values: Minimum font size 17 remains readable; bodySafety 18 prevents bottom-line clipping.
function fitTextToBox(body, box, footer) {
  const footerH = 0;
  const footerGap = 0;
  const bodySafety = 18;
  let lines = [];

  while (box.fontSize >= 17) {
    textSize(box.fontSize);
    textLeading(box.leading);
    lines = wrapTextLines(body, box.w - box.padX * 2);
    const bodyH = lines.length * box.leading;
    const wantedH = bodyH + box.padY * 2 + footerGap + footerH + bodySafety;
    if (wantedH <= box.h || box.fontSize === 17) break;
    box.fontSize -= 1;
    box.leading = Math.max(23, box.leading - 1);
  }

  const bodyH = lines.length * box.leading;
  const wantedH = bodyH + box.padY * 2 + footerGap + footerH + bodySafety;
  box.h = Math.max(box.minH, Math.min(box.h, Math.ceil(wantedH)));
  const bodyAreaH = box.h - box.padY * 2 - footerGap - footerH;
  box.bodyH = bodyAreaH;
  box.bodyY = box.y + box.padY + Math.max(0, (bodyAreaH - bodyH) / 2);
  box.footerY = box.y + box.h - box.padY - footerH + 3;
}

// Why: Only red continue footers should draw the red control icon.
// What this does for the code: Detects whether footer text represents a red continue control.
// Codependencies and why/where: Used by layoutTextBox() and drawTextBox().
// Why these values: Checks for the word `red` because current continue footer values are `red-icon-only` or red instructions.
function shouldShowTextBoxFooter(footer) {
  return Boolean(footer && footer.toLowerCase().includes("red"));
}

// Why: Text height calculation needs to mirror p5's wrapping behavior.
// What this does for the code: Splits text into lines that fit a given pixel width.
// Codependencies and why/where: Used by fitTextToBox() and drawChoiceCard(); depends on p5 textWidth().
// Why these values: Splits on whitespace so sentence words remain intact.
function wrapTextLines(value, maxWidth) {
  const lines = [];
  const paragraphs = value.split("\n");
  paragraphs.forEach((paragraph) => {
    let line = "";
    paragraph.split(/\s+/).forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      if (line && textWidth(testLine) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    });
    if (line) lines.push(line);
  });
  return lines.length ? lines : [""];
}

// Why: Some UI panels need a simple fallback if image-based UI is not available.
// What this does for the code: Draws a rounded rectangle with fill and border.
// Codependencies and why/where: Used by drawTextBoxUi() fallback and mini-game panel-style needs.
// Why these values: Radius 8 matches the rest of the project UI, and border color comes from COLORS.
function drawPanel(x, y, w, h, colorValue) {
  noStroke();
  fill(colorValue);
  rect(x, y, w, h, 8);
  stroke(COLORS.border);
  noFill();
  rect(x, y, w, h, 8);
  noStroke();
}

// Why: The story uses a custom text-box image instead of plain rectangles.
// What this does for the code: Draws the text-box PNG with transparency, or falls back to drawPanel().
// Codependencies and why/where: Depends on assets.textBox; used by story boxes, choice cards, and mini-game result boxes.
// Why these values: Tint alpha 224 preserves the designed transparency while keeping text readable.
function drawTextBoxUi(x, y, w, h) {
  if (assets.textBox) {
    push();
    tint(255, 224);
    image(assets.textBox, x, y, w, h);
    noTint();
    pop();
  } else {
    drawPanel(x, y, w, h, COLORS.panel);
  }
}

// Lecturer QA: UI stuff, choice layout answer.
// The three choices are positioned manually because they are part of the story composition, not generic web buttons.
// Choice 1 appears left with the green button, choice 2 in the middle with yellow, and choice 3 right with white.
// Values: x/y/w/h below are canvas coordinates in the 1376x768 scene coordinate system.
// Why: Choice cards need fixed positions that do not cover too much scene art.
// What this does for the code: Returns the x/y/width/height for each of the three choice option boxes.
// Codependencies and why/where: Used by drawChoicePage(); index order must match chooseOption() option order.
// Why these values: Positions keep choice 1 left, choice 2 middle, choice 3 right, with smaller boxes to reveal visuals.
function choiceCardBox(index) {
  const positions = [
    { x: 74, y: 514, w: 354, h: 192 },
    { x: 512, y: 514, w: 354, h: 192 },
    { x: 950, y: 514, w: 354, h: 192 },
  ];
  return positions[index];
}

// Why: Each choice option needs a consistent card with a colored physical-button cue.
// What this does for the code: Draws the choice text-box image, centered button icon, wrapped option text, and selected-button highlight.
// Codependencies and why/where: Depends on drawTextBoxUi(), drawUiButton(), wrapTextLines(), and choice index mapping.
// Why these values: 60 px button icons and 13 px text keep cards compact enough for the dog scene.
function drawChoiceCard(x, y, w, h, option, index, isSelected) {
  drawTextBoxUi(x, y, w, h);
  const uiKey = index === 0 ? "greenChoice2" : index === 1 ? "yellowChoice1" : "whiteChoice3";
  drawUiButton(uiKey, x + w / 2 - 30, y + 14, 60, 60, isSelected);
  fill(COLORS.ink);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  const textX = x + 30;
  const textY = y + 82;
  const textW = w - 60;
  const textH = h - 94;
  let fontSize = 13;
  let lineH = 17;
  let lines = [];
  while (fontSize >= 10) {
    textSize(fontSize);
    textLeading(lineH);
    lines = wrapTextLines(option.text, textW);
    if (lines.length * lineH <= textH || fontSize === 10) break;
    fontSize -= 1;
    lineH = Math.max(13, lineH - 1);
  }
  textSize(fontSize);
  textLeading(lineH);
  const visibleH = Math.min(textH, lines.length * lineH);
  text(option.text, textX, textY + Math.max(0, (textH - visibleH) / 2), textW, textH);
  textAlign(LEFT, BASELINE);
}

// Why: Image drawing should use loaded asset keys consistently.
// What this does for the code: Draws one loaded image at a supplied position and size.
// Codependencies and why/where: Depends on `assets`; used by UI and animal draw helpers.
// Why these values: Values are passed by callers because each screen needs different placement.
function drawUiImage(key, x, y, w, h) {
  image(assets[key], x, y, w, h);
}

// Lecturer QA: UI stuff, button feedback answer.
// The colored buttons are PNG images. When pressed, the code draws the same image and adds a short white
// transparent rectangle over only that button, which creates the visual "pressed" feedback.
// Values: fill alpha 58 and radius 8 make the feedback subtle; BUTTON_FEEDBACK_MS controls how long it lasts.
// Why: Buttons need an optional visual feedback state without changing the underlying image asset.
// What this does for the code: Draws a UI button image and overlays a white translucent highlight when active.
// Codependencies and why/where: Depends on drawUiImage(); used for red continue/retry and choice buttons.
// Why these values: White alpha 58 gives subtle feedback without obscuring the button color.
function drawUiButton(key, x, y, w, h, isActive = false) {
  drawUiImage(key, x, y, w, h);
  if (isActive) {
    noStroke();
    fill(255, 255, 255, 58);
    rect(x, y, w, h, 8);
  }
}

// Why: Browser audio cannot start until a user interaction occurs.
// What this does for the code: Starts the p5 audio context once and then asks updateMusic() to choose the right loop.
// Codependencies and why/where: Depends on p5.sound userStartAudio(); called from user input paths.
// Why these values: The boolean guard prevents repeated audio-start attempts.
function beginAudio() {
  if (audioStarted) return;
  audioStarted = true;
  if (typeof userStartAudio === "function") userStartAudio();
  updateMusic();
}

// Why: The music must match story phase without abrupt changes.
// What this does for the code: Chooses the desired track, crossfades away from old tracks, loops the new track, and stores state.
// Codependencies and why/where: Depends on desiredMusicKey(), music objects, MUSIC_VOLUME, and MUSIC_FADE_SECONDS.
// Why these values: 1 second fade and 0.45 volume come from top-level constants requested/tuned for ambience.
function updateMusic() {
  if (!audioStarted) return;
  const desiredKey = desiredMusicKey();
  const desiredTrack = music[desiredKey];
  if (!desiredTrack || typeof desiredTrack.loop !== "function") return;

  if (currentMusicKey === desiredKey && desiredTrack.isPlaying()) return;

  if (musicStopTimer) {
    clearTimeout(musicStopTimer);
    musicStopTimer = null;
  }

  const previousTracks = [];
  Object.entries(music).forEach(([key, track]) => {
    if (key !== desiredKey && track?.isPlaying()) {
      previousTracks.push(track);
      if (typeof track.setVolume === "function") track.setVolume(0, MUSIC_FADE_SECONDS);
    }
  });

  if (typeof desiredTrack.setVolume === "function") desiredTrack.setVolume(0);
  if (!desiredTrack.isPlaying()) desiredTrack.loop();
  if (typeof desiredTrack.setVolume === "function") desiredTrack.setVolume(MUSIC_VOLUME, MUSIC_FADE_SECONDS);

  if (previousTracks.length > 0) {
    musicStopTimer = setTimeout(() => {
      previousTracks.forEach((track) => {
        if (track?.isPlaying()) track.stop();
      });
      musicStopTimer = null;
    }, MUSIC_FADE_SECONDS * 1000);
  }

  currentMusicKey = desiredKey;
}

// Why: Returning to the main start screen should silence the game.
// What this does for the code: Cancels pending music stop timers, stops all tracks, and resets audio state.
// Codependencies and why/where: Used by resetStoryState(); depends on p5.sound isPlaying()/stop().
// Why these values: Resets to null/false so no music plays on the main starting page.
function stopAllMusic() {
  if (musicStopTimer) {
    clearTimeout(musicStopTimer);
    musicStopTimer = null;
  }
  Object.values(music).forEach((track) => {
    if (track?.isPlaying()) track.stop();
  });
  currentMusicKey = null;
  audioStarted = false;
}

// Why: Music selection should be centralized instead of repeated in draw/update functions.
// What this does for the code: Returns the current desired music key based on ending/tower/background phase.
// Codependencies and why/where: Used by updateMusic(); depends on towerMusicKeyForCurrentPage() and endingMusicKeyForCurrentPage().
// Why these values: Background is the safe fallback for all non-ending story states.
function desiredMusicKey() {
  if (appState === "fade" && fade?.image === "crash") return "tower";
  if (towerMusicKeyForCurrentPage()) return "tower";
  return endingMusicKeyForCurrentPage() || "background";
}

// Why: The new tower music should play through the robber-house scare sequence.
// What this does for the code: Detects page images that belong to the post-tower scare phase.
// Codependencies and why/where: Used by desiredMusicKey(); depends on appState, pages, and page image keys.
// Why these values: The image key list matches the crash/feast/dark/robber sequence in buildPostMiniPages().
function towerMusicKeyForCurrentPage() {
  if (appState !== "page") return null;
  const currentPage = pages[pageIndex];
  if (!currentPage) return null;
  const towerImages = ["crash", "feast", "darkHouse", "robberInside", "robberFleeing"];
  return towerImages.includes(currentPage.image) ? "tower" : null;
}

// Why: Ending music should begin only when an ending is actually visible.
// What this does for the code: Maps current ending image keys to good, neutral, or bad music.
// Codependencies and why/where: Used by desiredMusicKey(); depends on page image keys from ending page builders.
// Why these values: Good uses goodAnimals/goodFinal, bad uses bad, and neutral uses neutral-prefixed image keys.
function endingMusicKeyForCurrentPage() {
  if (appState !== "page") return null;
  const currentPage = pages[pageIndex];
  if (!currentPage) return null;
  if (currentPage.image === "bad") return "bad";
  if (currentPage.image === "goodAnimals" || currentPage.image === "goodFinal") return "good";
  if (currentPage.image === "neutralFinal" || currentPage.image.startsWith("neutral")) return "neutral";
  return null;
}

// Why: The mini-game needs to show the tower being built from the player's catches.
// What this does for the code: Draws the donkey at the slider position and draws each caught companion stacked above him.
// Codependencies and why/where: Used by drawMiniGame(); depends on lastSliderValue, miniGame.stack, body assets, animalWidth(), and animalHeight().
// Why these values: X range 196-1180 keeps the donkey on screen, baseY 640 anchors him near the ground, and 82 px spacing matches the catch window.
function drawStackedDonkeyAndCompanions() {
  const donkeyX = map(lastSliderValue, 0, 1023, 196, 1180);
  const baseY = 640;
  miniGame.donkeyX = donkeyX;
  image(assets.donkeyBody, donkeyX, baseY, 300, 168);

  miniGame.stack.forEach((kind, index) => {
    const y = baseY - 110 - index * 82;
    image(assets[`${kind}Body`], donkeyX, y, animalWidth(kind), animalHeight(kind));
  });
}

// Why: Each animal body image has a different natural shape.
// What this does for the code: Returns the display width for a stacked companion image.
// Codependencies and why/where: Used by drawStackedDonkeyAndCompanions() and updateMiniGame() visual alignment.
// Why these values: Dog 230, cat 220, and rooster 210 are tuned to look proportional on the donkey's back.
function animalWidth(kind) {
  if (kind === "dog") return 230;
  if (kind === "cat") return 220;
  return 210;
}

// Why: Width alone is not enough because each animal sprite has a different aspect feel.
// What this does for the code: Returns the display height for a stacked companion image.
// Codependencies and why/where: Used by drawStackedDonkeyAndCompanions() with animalWidth().
// Why these values: Heights 128, 122, and 118 keep the animals visually stacked without covering too much of the scene.
function animalHeight(kind) {
  if (kind === "dog") return 128;
  if (kind === "cat") return 122;
  return 118;
}

// Why: The story needs a single entry point after the light-sensor start screen.
// What this does for the code: Starts audio, resets branch state without stopping audio, loads intro pages, and enters page mode.
// Codependencies and why/where: Called by handleLightValue(); depends on beginAudio(), resetStoryState(), and introPages().
// Why these values: Page index starts at 0 because arrays are zero-based and the first intro page should show first.
function startStory() {
  beginAudio();
  resetStoryState(false);
  pages = introPages();
  pageIndex = 0;
  appState = "page";
}

// Why: Endings and manual resets must return the app to the same clean starting state.
// What this does for the code: Clears pending button actions, resets pages, choices, companions, result, mini-game, and fade state.
// Codependencies and why/where: Called by startStory(), advanceAfterPages(), and end transitions; optionally depends on stopAllMusic().
// Why these values: The default stopAudio true silences endings when returning to the main start page, while startStory(false) preserves startup music.
function resetStoryState(stopAudio = true) {
  if (pendingContinue) {
    clearTimeout(pendingContinue);
    pendingContinue = null;
  }
  if (stopAudio) stopAllMusic();
  appState = "mainStart";
  pages = [];
  pageIndex = 0;
  currentChoice = null;
  choiceFeedback = null;
  companions = { dog: false, cat: false, rooster: false };
  resultType = null;
  miniGame = null;
  fade = null;
}

// Why: Red continue input should advance only narrative pages.
// What this does for the code: Moves to the next page or hands off to advanceAfterPages() when the current page sequence is finished.
// Codependencies and why/where: Called by performContinueAction(); depends on appState, pages, pageIndex, and advanceAfterPages().
// Why these values: It ignores mainStart/start/fade so the red button cannot skip sensor gates or fade timing.
function continueStory() {
  if (appState === "mainStart" || appState === "start") return;
  if (appState === "page") {
    if (pageIndex < pages.length - 1) {
      pageIndex += 1;
    } else {
      advanceAfterPages();
    }
  } else if (appState === "fade") {
    return;
  }
}

// Why: The story has multiple page sequences that branch into choices, mini-games, endings, or reset.
// What this does for the code: Reads the current sequence's `next` marker and switches to the correct next state or page set.
// Codependencies and why/where: Called by continueStory(); depends on page().next values created by story-builder functions.
// Why these values: Marker strings such as dogChoice, catIntro, forest, miniIntro, and end are explicit route names for this story.
function advanceAfterPages() {
  const last = pages[pages.length - 1];
  if (!last || !last.next) {
    resetStoryState();
    return;
  }
  if (last.next === "dogChoice") showChoice(dogChoice());
  else if (last.next === "catIntro") {
    pages = catIntroPages();
    pageIndex = 0;
  } else if (last.next === "catChoice") showChoice(catChoice());
  else if (last.next === "roosterIntro") {
    pages = roosterIntroPages();
    pageIndex = 0;
  } else if (last.next === "roosterChoice") showChoice(roosterChoice());
  else if (last.next === "forest") {
    decideEnding();
    pages = forestPages();
    pageIndex = 0;
  } else if (last.next === "badEnding") {
    pages = badEndingPages();
    pageIndex = 0;
  } else if (last.next === "miniIntro") {
    appState = "miniIntro";
  } else if (last.next === "end") {
    resetStoryState();
  }
}

// Why: Choice screens need the selected choice data stored before drawing and input can work.
// What this does for the code: Saves the choice object, clears old feedback, and enters choice mode.
// Codependencies and why/where: Called by advanceAfterPages(); used by drawChoicePage() and chooseOption().
// Why these values: Null feedback prevents an old button highlight from appearing on a new choice screen.
function showChoice(choice) {
  currentChoice = choice;
  choiceFeedback = null;
  appState = "choice";
}

// Why: Physical and keyboard choice inputs need one shared path.
// What this does for the code: Starts audio if needed, validates the option, records feedback timing, and enters temporary feedback mode.
// Codependencies and why/where: Called by parseSerialLine() and keyPressed(); depends on currentChoice and BUTTON_FEEDBACK_MS through drawChoicePage().
// Why these values: Option index is zero-based because currentChoice.options is an array.
function chooseOption(index) {
  if (appState !== "choice") return;
  beginAudio();
  const option = currentChoice.options[index];
  if (!option) return;
  choiceFeedback = { index, startedAt: millis() };
  appState = "choiceFeedback";
}

// Why: After the brief visual cue, the chosen branch must update story state.
// What this does for the code: Marks joined companions, loads the chosen option's pages, and returns to narrative page mode.
// Codependencies and why/where: Called by drawChoicePage() after feedback timing; depends on currentChoice option shape.
// Why these values: Page index resets to 0 so the selected branch starts at its first page.
function applyChoice(index) {
  const option = currentChoice.options[index];
  if (option.joins) companions[option.joins] = true;
  pages = option.pages;
  pageIndex = 0;
  currentChoice = null;
  choiceFeedback = null;
  appState = "page";
}

// Why: The ending depends on how complete the animal band became.
// What this does for the code: Sets resultType to good, neutral, or bad based on joined companion flags.
// Codependencies and why/where: Called before forestPages(); used by forestPages(), badEndingPages(), buildPostMiniPages(), and music routing.
// Why these values: All three companions means good, at least one companion means neutral, and none means bad.
function decideEnding() {
  if (companions.dog && companions.cat && companions.rooster) resultType = "good";
  else if (joinedCompanions().length > 0) resultType = "neutral";
  else resultType = "bad";
}

// Why: Many branch texts and images need the same list of animals who joined.
// What this does for the code: Returns companion animal keys whose boolean state is true.
// Codependencies and why/where: Used by story text builders, ending logic, and mini-game setup.
// Why these values: The order dog, cat, rooster matches the order they appear in the story and mini-game.
function joinedCompanions() {
  return ["dog", "cat", "rooster"].filter((animal) => companions[animal]);
}

// Why: Dynamic story text must read naturally for one, two, or three animals.
// What this does for the code: Converts animal keys into an English list such as "the donkey and the dog".
// Codependencies and why/where: Used by travelerLabel(); depends on animal key strings from travelerAnimals().
// Why these values: Adds "the" before each animal and uses an Oxford comma for three-item readability.
function formatAnimalList(animals) {
  const names = animals.map((animal) => `the ${animal}`);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// Why: Some scenes need to describe the current group, sometimes including an animal who just joined.
// What this does for the code: Builds a unique list starting with donkey, followed by joined companions and optional extra animals.
// Codependencies and why/where: Used by travelerLabel() and travelerPronoun(); depends on joinedCompanions().
// Why these values: Donkey always appears first because he is the main traveler and is present in every branch.
function travelerAnimals(extraAnimals = []) {
  const animals = ["donkey", ...joinedCompanions()];
  extraAnimals.forEach((animal) => {
    if (!animals.includes(animal)) animals.push(animal);
  });
  return animals;
}

// Why: Story sentences should not repeat list-building logic.
// What this does for the code: Returns the formatted label for the current traveling group.
// Codependencies and why/where: Used by roosterIntroPages(), roosterChoice(), and forestPages().
// Why these values: No literal layout values here; it delegates formatting to travelerAnimals() and formatAnimalList().
function travelerLabel(extraAnimals = []) {
  return formatAnimalList(travelerAnimals(extraAnimals));
}

// Why: Dynamic labels sometimes begin a sentence and need a capital first letter.
// What this does for the code: Uppercases the first character while preserving the rest of the string.
// Codependencies and why/where: Used by roosterIntroPages() and roosterChoice() for generated sentences.
// Why these values: Character 0 is the sentence's first character; slice(1) keeps the remaining text unchanged.
function capitalizeSentence(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Why: Branch text needs singular/plural grammar based on who is traveling.
// What this does for the code: Returns "he" for donkey alone and "they" for groups.
// Codependencies and why/where: Used by roosterIntroPages(); depends on travelerAnimals().
// Why these values: One traveler is singular, more than one traveler is plural.
function travelerPronoun(extraAnimals = []) {
  return travelerAnimals(extraAnimals).length === 1 ? "he" : "they";
}

// Why: Neutral forest text needs to mention companions only when they exist.
// What this does for the code: Returns an empty string, singular companion phrase, or plural companion phrase.
// Codependencies and why/where: Used by forestPages(); depends on joinedCompanions().
// Why these values: Count 0, 1, and more-than-1 are the only grammar cases needed here.
function companionPhrase() {
  const count = joinedCompanions().length;
  if (count === 0) return "";
  return count === 1 ? "his companion" : "his companions";
}

// Why: The first narrative sequence should be kept in one readable builder.
// What this does for the code: Returns the intro page array up to the first dog choice.
// Codependencies and why/where: Called by startStory(); depends on page() and image keys from FILES.
// Why these values: Text and image keys follow the project story order and route to dogChoice at the final intro page.
function introPages() {
  return [
    page("intro", "A man had a donkey, who for long years had untiringly carried sacks to the mill, but whose strength was now failing, so that he was becoming less and less able to work.", "left"),
    page("intro", "Then his master thought that he would no longer feed him. The donkey noticed that the wind was blowing less and less and ran away, setting forth on the road to Bremen, where he thought he could become a town musician as he always had a good ear for sounds.", "left"),
    page("dogGood", "When he had gone a little way he found a hunting dog lying in the road, who was panting like one who had run himself tired.", "left"),
    page("dogGood", "\"Why are you panting so, hunting dog?\" asked the donkey. \"Oh,\" said the dog, \"because I am old and am getting weaker every day and can no longer go hunting, my master wanted to kill me, so I ran off; but now how should I earn my bread?\"", "left", "dogChoice"),
  ];
}

// Why: The dog meeting has three player options with different narrative consequences.
// What this does for the code: Builds the dog choice object, including option text, joining behavior, and branch pages.
// Codependencies and why/where: Called by advanceAfterPages(); used by drawChoicePage(), chooseOption(), and applyChoice().
// Why these values: Choice 1 and 2 set joins dog, while choice 3 leaves the dog behind and uses the bad dog image.
function dogChoice() {
  return {
    image: "dogGood",
    question: "How should the donkey answer the dog?",
    options: [
      {
        label: "Choice 1",
        text: "\"Do you know what,\" said the donkey, \"I am going to Bremen and am going to become a town musician there. Come along and take up music too. I'll play the lute with my good ears, and you can beat the drums with your good instincts.\"",
        joins: "dog",
        pages: [
          page("dogGood", "The dog was satisfied with that, and they went further.", "left"),
          page("road", "They continued along the road toward Bremen.", "left", "catIntro"),
        ],
      },
      {
        label: "Choice 2",
        text: "\"That is surely tiresome.\" Said the donkey. \"There is a town known for music, our old bones would surely fit in so join me!\"",
        joins: "dog",
        pages: [
          page("dogGood", "The dog felt skeptical at the comment about his age. He was a proud hunting dog! \"Well, it seems enticing, well alright!\" The dog relented knowing he had no more hunting left in him.", "left"),
          page("road", "They continued along the road toward Bremen.", "left", "catIntro"),
        ],
      },
      {
        label: "Choice 3",
        text: "\"Well, I'll leave you be to rest. I am off to become a musician!\"",
        pages: [
          page("dogBad", "\"Well, I'll leave you be to rest. I am off to become a musician!\" Said the donkey and happily galloped away, leaving the dog behind.", "left"),
          page("road", "The donkey continued alone along the road toward Bremen.", "left", "catIntro"),
        ],
      },
    ],
  };
}

// Why: The cat introduction image and wording depend on whether the dog is already traveling with the donkey.
// What this does for the code: Returns the cat intro pages with donkey-only or donkey-and-dog wording.
// Codependencies and why/where: Called by advanceAfterPages(); depends on companions.dog and page().
// Why these values: Sad cat images are used before any cat choice, and the final page routes to catChoice.
function catIntroPages() {
  const withDog = companions.dog;
  const text = withDog
    ? "It didn't take long, before the donkey and the former hunting dog came to a cat sitting by the side of the road and making a face like three days of rainy weather."
    : "It didn't take long, before the donkey came to a cat sitting by the side of the road and making a face like three days of rainy weather.";
  return [
    page(withDog ? "catDogSad" : "catDonkey", `${text} \"What has crossed you, old Milk-Licker?\" said the donkey.`, "left"),
    page(withDog ? "catDogSad" : "catDonkey", "\"Oh,\" answered the cat, \"who can be cheerful when his neck is at risk? I am getting on in years, and my teeth are getting dull, so I would rather sit behind the stove and purr than to chase around after mice. Therefore, my mistress wanted to drown me, but I took off. Now good advice is scarce. Where should I go?\"", "left", "catChoice"),
  ];
}

// Why: The cat choice has branch text that must match whether the dog is present.
// What this does for the code: Builds the cat choice object with dynamic pronouns, images, and follow-up pages.
// Codependencies and why/where: Called by advanceAfterPages(); depends on companions.dog, page(), and applyChoice().
// Why these values: Only choice 1 sets joins cat and switches to the happy cat image after the good choice.
function catChoice() {
  const withDog = companions.dog;
  const usOrMe = withDog ? "us" : "me";
  const continuedWithoutCat = withDog
    ? "The donkey and the dog continued along the road toward Bremen without the cat."
    : "The donkey continued along the road toward Bremen without the cat.";
  const fledFromCat = withDog
    ? "it made the donkey and the dog flee and run along the path, far away from the cat."
    : "it made the donkey flee and run along the path, far away from the cat.";
  const catJoinText = withDog
    ? "\"Come along to Bremen! After all, you understand night music. You can become a town musician there and help draw an audience!\" said the donkey excitedly. The cat was surprised by the cheerful invitation, but the thought of becoming a musician sounded much better than sitting alone and afraid. Convinced, the cat joined the donkey and dog on their journey."
    : "\"Come along to Bremen! After all, you understand night music. You can become a town musician there and help draw an audience!\" said the donkey excitedly. The cat was surprised by the cheerful invitation, but the thought of becoming a musician sounded much better than sitting alone and afraid. Convinced, the cat joined the donkey on his journey.";
  const catChoiceTwoText = `"Wouldn't it be better to have one last hurrah? In your old age. Come with ${usOrMe} to Bremen, it's better than staying here and waiting for your demise."`;
  const catChoiceThreeText = `"Well you seem to be aging alright; I wanted to invite you to join ${usOrMe} in ${withDog ? "our" : "my"} adventure to be musicians but clearly you can't use your muscles like you used to..."`;
  return {
    image: withDog ? "catDogSad" : "catDonkey",
    question: "How should the donkey answer the cat?",
    options: [
      {
        label: "Choice 1",
        text: "\"Come along to Bremen! After all, you understand night music. You can become a town musician there and help draw an audience!\"",
        joins: "cat",
        pages: [
          page(withDog ? "catGoodDog" : "catGoodDonkey", catJoinText, "left"),
          page("road", "They continued along the road toward Bremen.", "left", "roosterIntro"),
        ],
      },
      {
        label: "Choice 2",
        text: catChoiceTwoText,
        pages: [
          page(withDog ? "catDogSad" : "catDonkey", `${catChoiceTwoText} The donkey spouted. The cat was baffled by the mean words. They were true, but mean. With a big huff and puff, the cat decided to turn around and sleep, declining the offer.`, "left"),
          page("road", continuedWithoutCat, "left", "roosterIntro"),
        ],
      },
      {
        label: "Choice 3",
        text: catChoiceThreeText,
        pages: [
          page(withDog ? "catDogSad" : "catDonkey", `${catChoiceThreeText} The donkey said in a joking manner, trying to get laughs, but instead was met with a hiss from the cat so shrill and fierce that ${fledFromCat}`, "left"),
          page("road", continuedWithoutCat, "left", "roosterIntro"),
        ],
      },
    ],
  };
}

// Why: The rooster introduction must match every possible group composition.
// What this does for the code: Builds the rooster intro pages using dynamic traveler labels and the correct rooster image.
// Codependencies and why/where: Called by advanceAfterPages(); depends on roosterImage(), travelerLabel(), travelerPronoun(), and page().
// Why these values: Donkey-alone text is separate because "they were tired" would be incorrect for one animal.
function roosterIntroPages() {
  const image = roosterImage();
  const travelers = travelerLabel();
  const subject = travelerPronoun();
  const firstLine = joinedCompanions().length === 0
    ? "After travelling further along the road, the donkey came to a farmyard. He was tired from the day's journey, but he kept walking toward Bremen."
    : `After travelling further along the road, ${travelers} came to a farmyard. ${capitalizeSentence(subject)} were tired from the day's journey, but the donkey felt less alone with every new friend who had walked beside him.`;
  return [
    page(image, firstLine, "left"),
    page(image, "There, the rooster of the house was sitting on the gate, crying with all his might. \"Your cries pierce one's marrow and bone,\" said the donkey. \"What are you up to?\"", "left"),
    page(image, "\"I just prophesied good weather,\" said the rooster, \"because it is Our Dear Lady's Day, when she washes the Christ Child's shirts and wants to dry them; but because Sunday guests are coming tomorrow, the lady of the house has no mercy and told the cook that she wants to eat me tomorrow in the soup, so I am supposed to let them cut off my head this evening. Now I am going to cry at the top of my voice as long as I can.\"", "left", "roosterChoice"),
  ];
}

// Why: The rooster meeting has three choices and must respect previous companions.
// What this does for the code: Builds the rooster choice object with dynamic invitation text and branch pages.
// Codependencies and why/where: Called by advanceAfterPages(); depends on joinedCompanions(), roosterImage(), travelerLabel(), and page().
// Why these values: Choice 1 and 2 set joins rooster; choice 3 leaves the rooster behind and still routes to forest.
function roosterChoice() {
  const partyIntro = joinedCompanions().length === 0
    ? "I am headed off to the city to become a musician"
    : "My companions and I are headed off to the city to become musicians";
  const usOrMe = joinedCompanions().length === 0 ? "me" : "us";
  const afterRoosterJoin = travelerLabel(["rooster"]);
  const roosterChoiceTwoText = joinedCompanions().length === 0
    ? "\"Hey now, Red-Head,\" said the donkey, \"instead come away with me. I am going to Bremen. You can always find something better than death.\""
    : "\"Hey now, Red-Head,\" said the donkey, \"instead come away with us. We're going to Bremen. You can always find something better than death.\"";
  const roosterChoiceTwoResultText = joinedCompanions().length === 0
    ? "\"Hey now, Red-Head,\" said the donkey, \"instead come away with me. I am going to Bremen. You can always find something better than death. You have a good voice, and when we make music together, it will be very pleasing.\" The donkey added sheepishly. The rooster was taken aback by the straightforwardness but agreed nonetheless."
    : "\"Hey now, Red-Head,\" said the donkey, \"instead come away with us. We're going to Bremen. You can always find something better than death. You have a good voice, and when we make music together, it will be very pleasing.\" The donkey added sheepishly. The rooster was taken aback by the straightforwardness but agreed nonetheless.";
  return {
    image: roosterImage(),
    question: "How should the donkey answer the rooster?",
    options: [
      {
        label: "Choice 1",
        text: `"Hey now, my fellow friend! That sounds tragic! ${partyIntro}! Why not join ${usOrMe} and amaze the crowds with your beautiful voice?"`,
        joins: "rooster",
        pages: [page(roosterImage(true), `"Hey now, my fellow friend! That sounds tragic! ${partyIntro}! Why not join ${usOrMe} and amaze the crowds with your beautiful voice?" said the donkey excitedly. The rooster was happy with the proposal, and ${afterRoosterJoin} went off together.`, "left", "forest")],
      },
      {
        label: "Choice 2",
        text: roosterChoiceTwoText,
        joins: "rooster",
        pages: [page(roosterImage(true), roosterChoiceTwoResultText, "left", "forest")],
      },
      {
        label: "Choice 3",
        text: "\"Well that does sound bad but with your shrill voice, do you believe you'll make a difference if you make noises all evening long?\"",
        pages: [page(roosterImage(), `"Well that does sound bad but with your shrill voice, do you believe you'll make a difference if you make noises all evening long? Better come with ${usOrMe}; might as well put your voice to good use." The donkey snorted. The rooster was appalled and continued with the noise making, being louder than before. The donkey lowered his head in shame and walked on toward the city, regretting those words.`, "left", "forest")],
      },
    ],
  };
}

// Why: Rooster scenes need to show the correct group of animals on screen.
// What this does for the code: Selects the rooster image key based on which companions have joined.
// Codependencies and why/where: Used by roosterIntroPages() and roosterChoice(); depends on companions dog/cat state.
// Why these values: The image keys match the available asset combinations for donkey, dog, cat, and rooster.
function roosterImage(afterJoin = false) {
  const dog = companions.dog;
  const cat = companions.cat;
  if (afterJoin && dog && cat) return "roosterAll";
  if (dog && cat) return "roosterAll";
  if (dog) return "roosterDog";
  if (cat) return "roosterCat";
  return "roosterDonkey";
}

// Why: The forest and robber-house setup changes depending on the eventual ending type.
// What this does for the code: Returns the correct forest sequence for bad, good, or neutral branches.
// Codependencies and why/where: Called by advanceAfterPages(); depends on resultType, traveler helpers, and page().
// Why these values: Bad routes directly to badEnding, good uses the full original band plan, and neutral uses dynamic smaller-group wording.
function forestPages() {
  if (resultType === "bad") {
    return [
      page("house", "However, the donkey could not reach the city of Bremen in one day. In the evening, he came into a forest, where he decided to spend the night.", "left", "badEnding"),
    ];
  }

  if (resultType === "good") {
    return [
      page("house", "However, the donkey and his companions could not reach the city of Bremen in one day. In the evening, they came into a forest, where they decided to spend the night.", "left"),
      page("house", "The donkey and the dog lay down under a big tree, but the cat and the rooster took to the branches. The rooster flew right to the top, where it was safest for him.", "left"),
      page("house", "Before falling asleep he looked around once again in all four directions, and he thought that he saw a little spark burning in the distance. He hollered to his companions, that there must be a house not too far away, for a light was shining.", "left"),
      page("lookingInside", "The donkey said, \"Then we must get up and go there, because the lodging here is poor.\" The dog said that he could do well with a few bones with a little meat on them.", "left"),
      page("lookingInside", "Thus they set forth toward the place where the light was, and they soon saw it glistening more brightly, and it became larger and larger, until they came to the front of a brightly lit robbers' house.", "left"),
      page("lookingInside", "The donkey, the largest of them, approached the window and looked in. \"What do you see, Gray-Horse?\" asked the rooster. \"What do I see?\" answered the donkey. \"A table set with good things to eat and drink, and robbers sitting there enjoying themselves.\"", "left"),
      page("lookingInside", "\"That would be something for us,\" said the rooster. \"Ee-ah, ee-ah, oh, if we were there!\" said the donkey.", "left"),
      page("lookingInside", "Then the animals discussed how they might drive the robbers away, and at last they came upon a plan. The donkey was to stand with his front feet on the window, the dog to jump on the donkey's back, the cat to climb onto the dog, and finally the rooster would fly up and sit on the cat's head.", "left", "miniIntro"),
    ];
  }

  const travelers = travelerLabel();
  const capitalizedTravelers = capitalizeSentence(travelers);
  const companionText = companionPhrase();
  const companionQuestion = joinedCompanions().length === 1 ? "his companion" : "one of his companions";
  const companionResponse = joinedCompanions().length === 1 ? "his companion" : "one of his companions";

  return [
    page("house", `However, ${travelers} could not reach the city of Bremen in one day. In the evening, they came into a forest, where they decided to spend the night.`, "left"),
    page("house", `${capitalizedTravelers} settled down beneath a large tree in the forest. They had not gathered a complete band, but the donkey was no longer making the journey alone.`, "left"),
    page("house", `Before they could fall asleep, ${companionText} noticed a little spark burning in the distance. It seemed that there must be a house nearby, for a light was shining through the darkness.`, "left"),
    page("lookingInside", "\"Then we should go there,\" said the donkey. \"The lodging here is poor, and perhaps we may find something to eat.\" Tired and hungry, the small group set forth toward the light.", "left"),
    page("lookingInside", "It grew brighter and larger until they came to the front of a brightly lit robbers' house. The donkey, being the largest of them, approached the window and looked in.", "left"),
    page("lookingInside", `"What do you see?" asked ${companionQuestion}. "What do I see?" answered the donkey. "A table set with good things to eat and drink, and robbers sitting there enjoying themselves."`, "left"),
    page("lookingInside", `"That would be something for us," said ${companionResponse}. "Ee-ah, ee-ah, oh, if we were there!" said the donkey.`, "left"),
    page("lookingInside", "Although there were fewer of them than there might have been, the animals discussed how they could drive the robbers away. At last, they came upon a desperate plan: they would climb onto one another as well as they could, crash against the window, and make the most terrible music the robbers had ever heard.", "left"),
    page("lookingInside", "The donkey stood at the bottom of their small tower. Any companions who had joined him climbed above him, each trying to appear louder and more frightening than they truly felt.", "left", "miniIntro"),
  ];
}

// Why: If no animals joined, the donkey cannot believably scare the robbers alone.
// What this does for the code: Returns the lonely bad-ending page sequence and then routes back to the start.
// Codependencies and why/where: Called by advanceAfterPages() after the bad forest page; depends on page() and bad image keys.
// Why these values: The sequence keeps the house glimpse but removes group actions that would not make sense.
function badEndingPages() {
  return [
    page("lookingInside", "Before falling asleep he looked around once again in all four directions, and he thought that he saw a little spark burning in the distance.", "left"),
    page("lookingInside", "The donkey went and had a look inside the house. When he saw the robbers, he did not dare fight them alone. He carried on through the woods until, tired and hungry, he went to sleep.", "left"),
    page("bad", "Waking up in the forest with no food and feeling lonely, the donkey made his way back to the mill he had come from, dreading the day the farmer would no longer be able to feed him.", "left"),
    page("bad", "The donkey's dream of becoming a musician slowly faded away like a distant memory.", "left", "end"),
  ];
}

// Why: After the stacking mini-game, the story must resolve the robber-house sequence differently for good and neutral groups.
// What this does for the code: Builds the post-mini-game pages, including crash, feast, night, robber return, and ending pages.
// Codependencies and why/where: Called by drawFade(); depends on resultType, companions, joinedCompanions(), neutralAnimalImage(), and page().
// Why these values: The good branch uses all four animals, while neutral inserts only the joined animals' scare actions.
function buildPostMiniPages() {
  if (resultType === "good") {
    return [
      page("crash", "When they had done that, at a signal they began to make their music all together. The donkey brayed, the dog barked, the cat meowed and the rooster crowed. Then they crashed through the window into the room, shattering the panes.", "left"),
      page("feast", "The robbers jumped up at the terrible bellowing, thinking that a ghost was coming in, and fled in great fear out into the woods.", "left"),
      page("feast", "Then the four animals seated themselves at the table and freely partook of the leftovers, eating as if they would get nothing more for four weeks.", "left"),
      page("darkHouse", "When the four minstrels were finished, they put out the light and looked for a place to sleep, each according to their nature and their desire.", "left"),
      page("darkHouse", "The donkey lay down on the hay pile, the dog behind the door, the cat on the hearth next to the warm ashes, and the rooster sat on the beam of the roof. Because they were tired from their long journey, they soon fell asleep.", "left"),
      page("robberInside", "When midnight had passed and the robbers saw from the distance that the light was no longer burning in the house, and everything appeared to be quiet, the captain said, \"We shouldn't have let ourselves be chased off,\" and he told one of them to go back and investigate the house.", "left"),
      page("robberInside", "The one they sent found everything still and went into the kitchen to strike a light. He mistook the cat's glowing, fiery eyes for live coals, and held a sulfur match next to them, so that it would catch fire.", "left"),
      page("robberFleeing", "But the cat didn't think this was funny and jumped into his face, spitting, and scratching. He was terribly frightened and ran toward the back door, but the dog, who was lying there, jumped up and bit him in the leg.", "left"),
      page("robberFleeing", "When he ran across the yard past the hay pile, the donkey gave him a healthy blow with his hind foot, and the rooster, who had been awakened from his sleep by the noise and was now alert, cried down from the beam, \"Cock-a-doodle-doo!\"", "left"),
      page("goodAnimals", "Then the robber ran as fast as he could back to his captain and said, \"Oh, there is a horrible witch sitting in the house, she blew at me and scratched my face with her long nails. And there is a man with a knife standing in front of the door, and he stabbed me in the leg.\"", "left"),
      page("goodAnimals", "\"And a black monster is lying in the yard, and it struck at me with a wooden club. And the judge is sitting up there on the roof, and he was calling out, 'Bring the rascal here.' Then I did what I could to get away.\"", "left"),
      page("goodFinal", "From that time forth, the robbers did not dare go back into the house. However, the four Bremen Musicians liked it so well there, that they made that house their home, journeying on towards the city from time to time to play their music.", "left", "end"),
    ];
  }

  const companionCryText = joinedCompanions().length === 1
    ? "his companion added another cry to the dreadful concert"
    : "his companions added their own cries to the dreadful concert";
  const restText = joinedCompanions().length === 1
    ? "the donkey and his companion soon fell asleep"
    : "they soon fell asleep";

  const pagesOut = [
    page("crash", `At the donkey's signal, they began their music together. The donkey brayed at the top of his lungs, while ${companionCryText}. Then they crashed through the window into the room, shattering the panes.`, "left"),
    page("feast", "The robbers jumped up at the terrible noise. In the confusion and darkness, they believed that some horrible creature had broken into their house, and they fled in great fear into the woods.", "left"),
    page("darkHouse", "When the minstrels were finished, they put out the light and looked for places to sleep, each according to their nature and desire. The donkey lay down on the hay pile.", "left"),
  ];

  if (companions.dog) pagesOut.push(page("darkHouse", "The dog curled up behind the door, ready to wake at the slightest sound.", "left"));
  if (companions.cat) pagesOut.push(page("darkHouse", "The cat settled on the hearth beside the warm ashes, finally finding a place where no one would chase her away.", "left"));
  if (companions.rooster) pagesOut.push(page("darkHouse", "The rooster flew up onto a beam of the roof, where he could watch safely from above.", "left"));

  pagesOut.push(page("darkHouse", `Because they were tired from their long journey and the excitement of the night, ${restText}.`, "left"));
  pagesOut.push(page("robberInside", "When midnight had passed, the robbers saw from a distance that the light was no longer burning in the house and that everything appeared quiet. Their captain said, \"We should not have let ourselves be chased away,\" and he sent one of them back to investigate the house.", "left"));
  pagesOut.push(page("robberInside", "The robber carefully entered the dark house, believing that the frightening creatures from earlier had disappeared.", "left"));

  if (companions.cat) pagesOut.push(page("robberInside", "In the kitchen, the robber mistook the cat's glowing eyes for live coals and stepped closer to light his match. The cat sprang at his face, hissing and scratching until he stumbled backward in terror.", "left"));
  if (companions.dog) pagesOut.push(page("robberFleeing", "As the robber turned toward the door, the dog jumped up from the shadows and bit him sharply in the leg.", "left"));
  if (companions.rooster) pagesOut.push(page("robberFleeing", "Awakened by the noise below, the rooster cried down from the beam with a shriek so sudden and loud that the robber believed he was being judged by a monster above him.", "left"));

  pagesOut.push(page("robberFleeing", "When the robber ran across the yard past the hay pile, the donkey gave him a powerful blow with his hind foot. Terrified and bruised, the robber fled as fast as he could back to his captain.", "left"));
  pagesOut.push(page(neutralAnimalImage(), "When the robber returned to his captain, he could barely speak from fear. \"There is a black monster lying in the yard,\" he cried, \"and it struck me with a wooden club! There are other terrible creatures hiding inside as well. We must stay far away from that house!\"", "left"));
  pagesOut.push(page("neutralFinal", "From that time forth, the robbers did not dare go back into the house. The animals decided to make this their home and keep living there.", "left"));
  pagesOut.push(page("neutralFinal", "The donkey and his small band were relieved to have found safety and shelter. As the donkey looked at their group, he could not help but think of the voices that were missing from their music. They had succeeded, but they were not yet the grand band he had dreamed of becoming.", "left", "end"));
  return pagesOut;
}

// Why: Neutral endings need a final image that matches exactly which animals joined.
// What this does for the code: Returns the neutral ending asset key for one- or two-companion combinations.
// Codependencies and why/where: Used by buildPostMiniPages(); depends on companions dog/cat/rooster state.
// Why these values: The condition order checks two-animal combinations before one-animal fallbacks so the most specific image is chosen.
function neutralAnimalImage() {
  const dog = companions.dog;
  const cat = companions.cat;
  const rooster = companions.rooster;
  if (dog && cat && !rooster) return "neutralDogCat";
  if (dog && rooster && !cat) return "neutralDogRooster";
  if (cat && rooster && !dog) return "neutralCatRooster";
  if (dog) return "neutralDog";
  if (cat) return "neutralCat";
  return "neutralRooster";
}

// Why: Story screens need a consistent small data shape.
// What this does for the code: Creates a page object with image, text, textbox position, next route, and continue-hint flag.
// Codependencies and why/where: Used by all story-builder functions and consumed by drawNarrativePage() and advanceAfterPages().
// Why these values: Left position is the default text-box placement, null means no automatic route, and false hides legacy continue hints.
function page(image, text, position = "left", next = null, showContinueHint = false) {
  return { image, text, position, next, showContinueHint };
}

// Why: The tower mini-game needs fresh state every time it begins or retries.
// What this does for the code: Copies joined animals into mini-game order, resets stack/progress, spawns the first faller, and enters miniGame mode.
// Codependencies and why/where: Called by handleLightValue() and performContinueAction(); depends on joinedCompanions(), spawnNextFaller(), and millis().
// Why these values: DonkeyX 688 starts centered, currentIndex 0 starts with the first companion, and startedAt records timing for state tracking.
function startMiniGame() {
  const animals = joinedCompanions();
  miniGame = {
    animals,
    stack: [],
    currentIndex: 0,
    faller: null,
    donkeyX: 688,
    startedAt: millis(),
  };
  spawnNextFaller();
  appState = "miniGame";
}

// Why: Each uncaught companion in the mini-game needs its own falling target.
// What this does for the code: Creates the current falling animal with horizontal position, vertical start, wave phase, and fall speed.
// Codependencies and why/where: Called by startMiniGame() and advanceMiniGameFaller(); depends on miniGame.animals and p5 random().
// Why these values: X range 240-1136 keeps fallers inside the play area, y -80 starts above screen, and speed 2.5 gives catchable motion.
function spawnNextFaller() {
  const kind = miniGame.animals[miniGame.currentIndex];
  miniGame.faller = {
    kind,
    x: random(240, 1136),
    y: -80,
    baseX: random(240, 1136),
    phase: random(TWO_PI),
    speed: 2.5,
  };
}

// Why: The mini-game needs frame-by-frame falling, catching, and missing logic.
// What this does for the code: Moves the faller, checks whether it overlaps the donkey/tower catch region, and advances to the next animal.
// Codependencies and why/where: Called by drawMiniGame(); depends on stackTargetY(), MINI_GAME_CATCH_WINDOW, miniGame.donkeyX, and p5 frameCount/sin/abs.
// Why these values: Horizontal tolerance 150 matches the visual donkey width, and sine amplitude 95 creates motion without making the game unfair.
function updateMiniGame() {
  if (!miniGame.faller) return;
  const faller = miniGame.faller;
  faller.y += faller.speed;
  faller.x = faller.baseX + sin(frameCount * 0.055 + faller.phase) * 95;
  const catchY = stackTargetY(miniGame.stack.length);

  if (faller.y > catchY && faller.y < catchY + MINI_GAME_CATCH_WINDOW && abs(faller.x - miniGame.donkeyX) < 150) {
    miniGame.stack.push(faller.kind);
    miniGame.currentIndex += 1;
    advanceMiniGameFaller();
  } else if (faller.y > catchY + MINI_GAME_CATCH_WINDOW) {
    miniGame.currentIndex += 1;
    advanceMiniGameFaller();
  }
}

// Why: The catch height should rise as the tower grows.
// What this does for the code: Returns the y coordinate where the next faller should snap onto the current stack.
// Codependencies and why/where: Used by updateMiniGame(); must match drawStackedDonkeyAndCompanions() vertical spacing.
// Why these values: 640 is the donkey base, 110 offsets the first companion above the donkey, and 82 is the per-animal stack spacing.
function stackTargetY(index) {
  return 640 - 110 - index * 82;
}

// Why: After each catch or miss, the game must either continue or show the result.
// What this does for the code: Ends the mini-game when all animals have fallen or spawns the next faller.
// Codependencies and why/where: Called by updateMiniGame(); depends on miniGame.currentIndex, miniGame.animals, and spawnNextFaller().
// Why these values: The comparison uses >= so the result screen appears once the final animal has been processed.
function advanceMiniGameFaller() {
  if (miniGame.currentIndex >= miniGame.animals.length) {
    miniGame.faller = null;
    appState = "miniResult";
  } else {
    spawnNextFaller();
  }
}

// Why: Red button input should share one debounce and visual feedback path.
// What this does for the code: Rejects invalid states, starts the red-button feedback timer, and delays the actual action until feedback is visible.
// Codependencies and why/where: Called by parseSerialLine() and keyPressed(); depends on BUTTON_FEEDBACK_MS and performContinueAction().
// Why these values: Only mainStart, page, and miniResult accept continue; pendingContinue prevents double presses during the brief feedback delay.
function handleContinueButton() {
  if (pendingContinue || (appState !== "mainStart" && appState !== "page" && appState !== "miniResult")) return;
  continueFeedbackUntil = millis() + BUTTON_FEEDBACK_MS;
  pendingContinue = setTimeout(() => {
    pendingContinue = null;
    performContinueAction();
  }, BUTTON_FEEDBACK_MS);
}

// Why: The red button does different work depending on which screen is active.
// What this does for the code: Moves mainStart to start, advances story pages, starts post-mini fade, or retries the mini-game if no animals were caught.
// Codependencies and why/where: Called by handleContinueButton(); depends on beginAudio(), continueStory(), startMiniGame(), and fade state.
// Why these values: Mini-result requires at least one caught animal to continue, matching the retry rule.
function performContinueAction() {
  if (appState === "mainStart") {
    appState = "start";
    beginAudio();
  } else if (appState === "page") {
    beginAudio();
    continueStory();
  } else if (appState === "miniResult") {
    beginAudio();
    if (miniGame.stack.length > 0) {
      fade = { startedAt: millis(), image: "crash" };
      appState = "fade";
    } else {
      startMiniGame();
    }
  }
}

// Why: Light sensor readings control the story start and the mini-game start.
// What this does for the code: Stores a constrained light value and triggers transitions when thresholds are reached.
// Codependencies and why/where: Called by parseSerialLine() and keyPressed(); depends on LIGHT_START_THRESHOLD and MINI_GAME_LIGHT_THRESHOLD.
// Why these values: Light values are constrained to Arduino analog range 0-1023 before threshold comparisons.
function handleLightValue(value) {
  lastLightValue = constrain(value, 0, 1023);
  if (appState === "start" && lastLightValue >= LIGHT_START_THRESHOLD) {
    startStory();
  }
  if (appState === "miniIntro" && lastLightValue >= MINI_GAME_LIGHT_THRESHOLD) startMiniGame();
}

// Lecturer QA: How the cable and Connect Arduino button work.
// The Arduino Micro is connected by USB. Pressing the HTML "Connect Arduino" button runs this function,
// opens the browser Web Serial permission popup, then opens the selected board at the same baud rate as
// the Arduino code. After that, readSerialLoop() continuously receives button/sensor text from the cable.
// Values: SERIAL_BAUD_RATE is 9600 (serial communication) and must match Serial.begin(9600) in bremen_musicians.ino.
// Why: The browser needs explicit user permission before reading Arduino input.
// What this does for the code: Requests a serial port, opens it at the project baud rate, stores connected state, and starts reading.
// Codependencies and why/where: Called by setup() connect button; depends on Web Serial API, SERIAL_BAUD_RATE, setSerialStatus(), and readSerialLoop().
// Why these values: The unavailable message names Chrome/Edge because Web Serial support is expected there for this project.
async function connectSerial() {
  if (!("serial" in navigator)) {
    setSerialStatus("Serial: Web Serial unavailable. Use Chrome or Edge.");
    return;
  }

  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: SERIAL_BAUD_RATE });
    serialConnected = true;
    setSerialStatus("Serial: connected");
    readSerialLoop();
  } catch (error) {
    setSerialStatus(`Serial: ${error.message}`);
  }
}

// Why: Arduino messages arrive as a stream and must be read continuously.
// What this does for the code: Decodes serial bytes into text and forwards chunks until the serial connection ends or errors.
// Codependencies and why/where: Called by connectSerial(); depends on TextDecoderStream, serialPort.readable, and consumeSerialChunk().
// Why these values: The while loop follows serialConnected so disconnect/error state can stop reading.
async function readSerialLoop() {
  const decoder = new TextDecoderStream();
  serialPort.readable.pipeTo(decoder.writable).catch(() => {});
  serialReader = decoder.readable.getReader();

  while (serialConnected) {
    try {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value) consumeSerialChunk(value);
    } catch (error) {
      setSerialStatus(`Serial: ${error.message}`);
      serialConnected = false;
    }
  }
}

// Why: Serial data can split one message across multiple chunks.
// What this does for the code: Buffers incoming text, extracts complete newline-delimited lines, and parses each full line.
// Codependencies and why/where: Called by readSerialLoop(); depends on serialBuffer and parseSerialLine().
// Why these values: The line-break regex accepts both carriage return and newline because Arduino serial monitors commonly use either.
function consumeSerialChunk(chunk) {
  serialBuffer += chunk;
  let lineBreak = serialBuffer.search(/[\r\n]/);
  while (lineBreak >= 0) {
    const line = serialBuffer.slice(0, lineBreak).trim();
    serialBuffer = serialBuffer.slice(lineBreak + 1);
    if (line) parseSerialLine(line);
    lineBreak = serialBuffer.search(/[\r\n]/);
  }
}

// Lecturer QA: How Arduino messages control the UI.
// The Arduino sends simple text labels over USB. This function translates those labels into game actions:
// red continues, green/yellow/white choose options, S controls the slider mini-game, and L controls light gates.
// Values: B1=red continue, B3=green choice 1, B4=yellow choice 2, B2=white choice 3, S:/L: are 0-1023 analog values.
// Why: Arduino input needs to become game actions in one controlled place.
// What this does for the code: Normalizes a serial line, maps button codes to actions, and parses slider/light sensor values.
// Codependencies and why/where: Called by consumeSerialChunk(); depends on handleContinueButton(), chooseOption(), handleLightValue(), and updateHud().
// Why these values: B1/red is continue, B3/green is choice 1, B4/yellow is choice 2, B2/white is choice 3, and S:/L: carry analog values.
function parseSerialLine(line) {
  const normalized = line.trim().toUpperCase();

  if (normalized === "READY") {
    setSerialStatus("Serial: Arduino ready");
    return;
  }

  if (normalized === "B1" || normalized === "RED") handleContinueButton();
  else if (normalized === "B3" || normalized === "GREEN") chooseOption(0);
  else if (normalized === "B4" || normalized === "YELLOW") chooseOption(1);
  else if (normalized === "B2" || normalized === "WHITE") chooseOption(2);
  else if (normalized.startsWith("S:") || normalized.startsWith("SLIDER:")) {
    const value = Number(normalized.split(":")[1]);
    if (Number.isFinite(value)) lastSliderValue = constrain(value, 0, 1023);
  } else if (normalized.startsWith("L:") || normalized.startsWith("LIGHT:")) {
    const value = Number(normalized.split(":")[1]);
    if (Number.isFinite(value)) handleLightValue(value);
  }

  updateHud();
}

// Why: The sketch needs keyboard fallback controls for testing without Arduino hardware.
// What this does for the code: Maps keyboard keys to continue, choices, slider simulation, and light-sensor simulation.
// Codependencies and why/where: Called automatically by p5; depends on handleContinueButton(), chooseOption(), handleLightValue(), and updateHud().
// Why these values: Enter/space mirror red continue, 1-3 mirror choices, A/D or arrows move slider by 55, and L simulates the light threshold.
function keyPressed() {
  if (keyCode === ENTER || key === " ") handleContinueButton();
  else if (key === "1") chooseOption(0);
  else if (key === "2") chooseOption(1);
  else if (key === "3") chooseOption(2);
  else if (keyCode === LEFT_ARROW || key.toLowerCase() === "a") {
    lastSliderValue = max(0, lastSliderValue - 55);
    updateHud();
  } else if (keyCode === RIGHT_ARROW || key.toLowerCase() === "d") {
    lastSliderValue = min(1023, lastSliderValue + 55);
    updateHud();
  } else if (key.toLowerCase() === "l") {
    handleLightValue(MINI_GAME_LIGHT_THRESHOLD);
    updateHud();
  }
}

// Why: The UI should show whether the Arduino serial connection is working.
// What this does for the code: Writes a status string into the serial-status element.
// Codependencies and why/where: Used by connectSerial(), readSerialLoop(), and parseSerialLine(); depends on index.html element id serial-status.
// Why these values: No numeric values here; the caller supplies the exact status text.
function setSerialStatus(textValue) {
  document.getElementById("serial-status").textContent = textValue;
}

// Why: Debugging hardware input is easier when the current sensor values are visible.
// What this does for the code: Updates the on-page HUD with light and slider readings.
// Codependencies and why/where: Called after serial and keyboard input changes; depends on index.html element id sensor-status.
// Why these values: "--" means no light reading has arrived yet, and Math.round keeps slider display readable.
function updateHud() {
  document.getElementById("sensor-status").textContent =
    `Light: ${lastLightValue ?? "--"} | Slider: ${Math.round(lastSliderValue)}`;
}
