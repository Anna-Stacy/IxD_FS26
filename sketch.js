"use strict";

const ASSET_DIR = "Bremen Image Material";
const LIGHT_START_THRESHOLD = 650;
const SERIAL_BAUD_RATE = 9600;

const COLORS = {
  ink: "#23180f",
  paper: "#fff5dc",
  shadow: "rgba(0, 0, 0, 0.58)",
  white: "#f6f2e8",
  red: "#c94337",
  yellow: "#e0bc35",
  green: "#4d9b55",
};

const assets = {};
let serialPort = null;
let serialReader = null;
let serialBuffer = "";
let serialConnected = false;
let lastLightValue = null;
let lastSliderValue = 512;

let scene = "start";
let sceneIndex = 0;
let currentChoices = [];
let resultType = null;
let endingAsset = null;
let companions = { dog: false, cat: false, rooster: false };
let choiceHistory = [];
let miniGame = null;
let canvasSize = { w: 1376, h: 768, scale: 1, x: 0, y: 0 };

const passiveScenes = [
  {
    id: "intro",
    bg: "bg_farm",
    title: "The Donkey Leaves the Mill",
    text:
      "An old donkey, no longer wanted at the mill, runs away toward Bremen. He believes there may still be a place for him as a musician.",
  },
  {
    id: "dog_intro",
    bg: "bg_road",
    title: "The Tired Dog",
    text:
      "On the road he finds a hunting dog, panting and exhausted. The dog has also been cast aside because he is old.",
  },
];

const choiceScenes = {
  dog: {
    bg: "bg_road",
    title: "Invite the Dog",
    question: "How should the donkey answer the dog?",
    options: [
      {
        color: "red",
        label: "Welcome him warmly",
        text:
          "Come with me to Bremen. I will play the lute, and you can beat the drums.",
        effect: "good",
        joins: "dog",
      },
      {
        color: "yellow",
        label: "Invite him bluntly",
        text:
          "Our old bones might still fit in Bremen. Join me, if you want something better.",
        effect: "neutral",
        joins: "dog",
      },
      {
        color: "green",
        label: "Leave him behind",
        text:
          "I will leave you to rest. I am off to become a musician.",
        effect: "bad",
      },
    ],
  },
  cat: {
    bg: "bg_forest",
    title: "The Cat by the Road",
    question: "The cat has escaped danger too. What does the donkey say?",
    options: [
      {
        color: "red",
        label: "Offer a place in the band",
        text:
          "Come with us to Bremen. You understand night music and can help us win an audience.",
        effect: "good",
        joins: "cat",
      },
      {
        color: "yellow",
        label: "Speak without tact",
        text:
          "One last adventure would be better than waiting here for the end.",
        effect: "neutral",
      },
      {
        color: "green",
        label: "Mock the cat",
        text:
          "You look too old for adventure. Perhaps your muscles are not what they used to be.",
        effect: "bad",
      },
    ],
  },
  rooster: {
    bg: "bg_farm",
    title: "The Rooster on the Gate",
    question: "The rooster cries because he fears the cook. What is the donkey's answer?",
    options: [
      {
        color: "red",
        label: "Encourage his voice",
        text:
          "Join our band. Your voice could amaze the crowds in Bremen.",
        effect: "good",
        joins: "rooster",
      },
      {
        color: "yellow",
        label: "Be direct but useful",
        text:
          "Come away with us. You can always find something better than death.",
        effect: "neutral",
        joins: "rooster",
      },
      {
        color: "green",
        label: "Insult his singing",
        text:
          "With such a shrill voice, you may as well put it to use somewhere else.",
        effect: "bad",
      },
    ],
  },
};

function preload() {
  [
    "bg_farm",
    "bg_forest",
    "bg_house",
    "bg_inside",
    "bg_road",
    "donkey",
    "dog",
    "cat",
    "rooster",
    "donkey_icon",
    "dog_icon",
    "cat_icon",
    "rooster_icon",
    "ending_good",
    "ending_bad",
    "ending_mid_donkey_dog",
    "ending_mid_donkey_rooster",
    "ending_mid_donkey_dog_rooster",
  ].forEach((name) => {
    assets[name] = loadImage(`${ASSET_DIR}/${name}.png`);
  });
}

function setup() {
  const canvas = createCanvas(1376, 768);
  canvas.parent("canvas-wrap");
  textFont("Georgia");
  frameRate(60);
  resizeCanvasToWrap();

  document.getElementById("connect-serial").addEventListener("click", connectSerial);
  document.getElementById("demo-start").addEventListener("click", startStory);
  updateHud();
}

function draw() {
  renderFrame(() => {
    if (scene === "start") drawStart();
    else if (scene === "passive") drawPassiveScene();
    else if (scene === "choice") drawChoiceScene();
    else if (scene === "transition") drawTransitionScene();
    else if (scene === "minigame") drawMiniGame();
    else if (scene === "ending") drawEnding();
  });
}

function windowResized() {
  resizeCanvasToWrap();
}

function resizeCanvasToWrap() {
  const wrap = document.getElementById("canvas-wrap");
  const w = Math.max(320, wrap.clientWidth);
  const h = Math.max(320, wrap.clientHeight);
  resizeCanvas(w, h);
  const scale = Math.min(width / 1376, height / 768);
  canvasSize = {
    w: 1376,
    h: 768,
    scale,
    x: (width - 1376 * scale) / 2,
    y: (height - 768 * scale) / 2,
  };
}

function renderFrame(drawFn) {
  background(16);
  push();
  translate(canvasSize.x, canvasSize.y);
  scale(canvasSize.scale);
  drawFn();
  pop();
}

function drawBackground(name) {
  const img = assets[name] || assets.bg_road;
  image(img, 0, 0, 1376, 768);
  noStroke();
  fill(0, 0, 0, 95);
  rect(0, 0, 1376, 768);
}

function drawStart() {
  drawBackground("bg_farm");
  drawPanel(92, 80, 620, 460);
  fill(COLORS.paper);
  textSize(58);
  textStyle(BOLD);
  text("The Bremen", 134, 158);
  text("Town Musicians", 134, 224);
  textStyle(NORMAL);
  textSize(25);
  textLeading(36);
  text(
    `Cover the light sensor until it reaches ${LIGHT_START_THRESHOLD} or higher. The story begins from this page once the threshold is met.`,
    136,
    282,
    520,
    160
  );

  drawButtonGuide(136, 438, COLORS.white, "White", "Continue");
  drawButtonGuide(292, 438, COLORS.red, "Red", "Choice 1");
  drawButtonGuide(448, 438, COLORS.yellow, "Yellow", "Choice 2");
  drawButtonGuide(604, 438, COLORS.green, "Green", "Choice 3");

  fill(COLORS.paper);
  textSize(22);
  text(`Current light: ${lastLightValue ?? "--"}`, 136, 522);
}

function drawPassiveScene() {
  const entry = passiveScenes[sceneIndex];
  drawBackground(entry.bg);
  drawStoryText(entry.title, entry.text, "Press the white button to continue.");
  drawParty();
}

function drawChoiceScene() {
  const entry = currentChoices[0];
  drawBackground(entry.bg);
  drawStoryText(entry.title, entry.question, "Choose with red, yellow, or green.");
  entry.options.forEach((option, index) => {
    drawChoiceCard(120 + index * 386, 510, 340, 146, option);
  });
  drawParty();
}

function drawTransitionScene() {
  drawBackground("bg_house");
  const textLines = [
    "Night falls before Bremen is reached.",
    "A light shines from a robber's house in the forest.",
  ];
  if (resultType === "bad") {
    textLines.push("The donkey has no reliable companion for the plan.");
  } else {
    textLines.push("The companions prepare to form a noisy tower at the window.");
  }
  drawStoryText("The House in the Forest", textLines.join(" "), "Press the white button to continue.");
  drawParty();
}

function drawMiniGame() {
  drawBackground("bg_inside");
  updateMiniGame();

  fill(COLORS.paper);
  textSize(34);
  textStyle(BOLD);
  text("Catch the Falling Musicians", 78, 74);
  textStyle(NORMAL);
  textSize(20);
  text("Use the slider to move the donkey. Catch enough companions before time runs out.", 78, 110);
  text(`Caught: ${miniGame.caught}/${miniGame.target}   Missed: ${miniGame.missed}`, 78, 142);

  const donkeyX = map(lastSliderValue, 0, 1023, 132, 1244);
  imageMode(CENTER);
  image(assets.donkey_icon, donkeyX, 642, 190, 106);

  miniGame.fallers.forEach((faller) => {
    image(assets[`${faller.kind}_icon`], faller.x, faller.y, 90, 50);
  });
  imageMode(CORNER);

  const remaining = max(0, Math.ceil((miniGame.endsAt - millis()) / 1000));
  fill(COLORS.paper);
  textSize(28);
  text(`Time: ${remaining}`, 1156, 74);
}

function drawEnding() {
  drawBackground(endingAsset);
  const copy = getEndingCopy();
  drawStoryText(copy.title, copy.text, "Press the white button to restart.");
}

function drawStoryText(title, body, footer) {
  drawPanel(78, 76, 670, 360);
  fill(COLORS.paper);
  textSize(42);
  textStyle(BOLD);
  text(title, 120, 132, 590);
  textStyle(NORMAL);
  textSize(25);
  textLeading(35);
  text(body, 120, 184, 590, 170);
  fill(255, 229, 154);
  textSize(21);
  text(footer, 120, 390, 590);
}

function drawPanel(x, y, w, h) {
  noStroke();
  fill(COLORS.shadow);
  rect(x, y, w, h, 8);
  stroke(255, 245, 220, 80);
  noFill();
  rect(x, y, w, h, 8);
  noStroke();
}

function drawChoiceCard(x, y, w, h, option) {
  drawPanel(x, y, w, h);
  fill(option.color === "red" ? COLORS.red : option.color === "yellow" ? COLORS.yellow : COLORS.green);
  ellipse(x + 38, y + 38, 34, 34);
  fill(COLORS.paper);
  textSize(23);
  textStyle(BOLD);
  text(option.label, x + 68, y + 32, w - 92);
  textStyle(NORMAL);
  textSize(17);
  textLeading(23);
  text(option.text, x + 26, y + 72, w - 52, 60);
}

function drawButtonGuide(x, y, color, label, action) {
  fill(color);
  stroke(0, 0, 0, 80);
  ellipse(x, y, 34, 34);
  noStroke();
  fill(COLORS.paper);
  textSize(16);
  textStyle(BOLD);
  text(label, x - 42, y + 46, 92);
  textStyle(NORMAL);
  text(action, x - 42, y + 68, 110);
}

function drawParty() {
  const members = ["donkey"];
  if (companions.dog) members.push("dog");
  if (companions.cat && resultType !== "neutral") members.push("cat");
  if (companions.rooster) members.push("rooster");

  imageMode(CENTER);
  members.forEach((member, index) => {
    image(assets[`${member}_icon`], 952 + index * 90, 678, 104, 58);
  });
  imageMode(CORNER);
}

function handleWhiteButton() {
  if (scene === "start") startStory();
  else if (scene === "passive") advancePassive();
  else if (scene === "transition") startEndingSequence();
  else if (scene === "ending") resetStory();
}

function handleChoice(choiceIndex) {
  if (scene !== "choice") return;
  const entry = currentChoices[0];
  const option = entry.options[choiceIndex];
  if (!option) return;
  if (option.joins) companions[option.joins] = true;
  choiceHistory.push({
    scene: entry.title,
    color: option.color,
    effect: option.effect,
    joins: option.joins || null,
  });

  if (entry === choiceScenes.dog) {
    currentChoices = [choiceScenes.cat];
  } else if (entry === choiceScenes.cat) {
    currentChoices = [choiceScenes.rooster];
  } else {
    decideEnding();
    scene = "transition";
  }
}

function advancePassive() {
  if (sceneIndex < passiveScenes.length - 1) {
    sceneIndex += 1;
  } else {
    scene = "choice";
    currentChoices = [choiceScenes.dog];
  }
}

function startStory() {
  resetStory();
  scene = "passive";
}

function resetStory() {
  scene = "start";
  sceneIndex = 0;
  currentChoices = [];
  resultType = null;
  endingAsset = null;
  companions = { dog: false, cat: false, rooster: false };
  choiceHistory = [];
  miniGame = null;
}

function decideEnding() {
  if (companions.dog && companions.cat && companions.rooster) {
    resultType = "good";
    endingAsset = "ending_good";
    return;
  }

  const neutralCompanions = getNeutralCompanions();
  if (neutralCompanions.length > 0) {
    resultType = "neutral";
    if (neutralCompanions.includes("dog") && neutralCompanions.includes("rooster")) {
      endingAsset = "ending_mid_donkey_dog_rooster";
    } else if (neutralCompanions.includes("dog")) {
      endingAsset = "ending_mid_donkey_dog";
    } else {
      endingAsset = "ending_mid_donkey_rooster";
    }
    return;
  }

  resultType = "bad";
  endingAsset = "ending_bad";
}

function getNeutralCompanions() {
  const list = [];
  if (companions.dog) list.push("dog");
  if (companions.rooster) list.push("rooster");
  return list;
}

function startEndingSequence() {
  if (resultType === "bad") {
    scene = "ending";
    return;
  }
  miniGame = createMiniGame();
  scene = "minigame";
}

function createMiniGame() {
  const kinds = resultType === "good" ? ["dog", "cat", "rooster"] : getNeutralCompanions();
  return {
    kinds,
    fallers: [],
    caught: 0,
    missed: 0,
    target: resultType === "good" ? 8 : 5,
    nextSpawnAt: 0,
    endsAt: millis() + 22000,
  };
}

function updateMiniGame() {
  if (millis() >= miniGame.nextSpawnAt) {
    const kind = random(miniGame.kinds);
    miniGame.fallers.push({
      kind,
      x: random(160, 1216),
      y: -40,
      speed: random(3.2, 5.8),
    });
    miniGame.nextSpawnAt = millis() + random(560, 920);
  }

  const donkeyX = map(lastSliderValue, 0, 1023, 132, 1244);
  for (let i = miniGame.fallers.length - 1; i >= 0; i -= 1) {
    const faller = miniGame.fallers[i];
    faller.y += faller.speed;
    if (faller.y > 590 && abs(faller.x - donkeyX) < 96) {
      miniGame.caught += 1;
      miniGame.fallers.splice(i, 1);
    } else if (faller.y > 800) {
      miniGame.missed += 1;
      miniGame.fallers.splice(i, 1);
    }
  }

  if (miniGame.caught >= miniGame.target || millis() >= miniGame.endsAt) {
    scene = "ending";
  }
}

function getEndingCopy() {
  if (resultType === "good") {
    return {
      title: "Good Ending",
      text:
        "All four musicians stand together. Their terrible music scares the robbers away, and the house becomes their safe new home.",
    };
  }

  if (resultType === "neutral") {
    const names = getNeutralCompanions().join(" and ");
    return {
      title: "Neutral Ending",
      text:
        `The donkey reaches the robber's house with ${names}. The plan works, but the group is incomplete. The cat is not part of this ending path.`,
    };
  }

  return {
    title: "Bad Ending",
    text:
      "The donkey reaches the forest alone. Without companions, he cannot face the robbers and turns back toward the uncertain life he tried to escape.",
  };
}

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

function parseSerialLine(line) {
  const normalized = line.trim().toUpperCase();

  if (normalized === "READY") {
    setSerialStatus("Serial: Arduino ready");
    return;
  }

  if (normalized === "B1" || normalized === "WHITE") handleWhiteButton();
  else if (normalized === "B2" || normalized === "RED") handleChoice(0);
  else if (normalized === "B3" || normalized === "YELLOW") handleChoice(1);
  else if (normalized === "B4" || normalized === "GREEN") handleChoice(2);
  else if (normalized.startsWith("S:") || normalized.startsWith("SLIDER:")) {
    const value = Number(normalized.split(":")[1]);
    if (Number.isFinite(value)) lastSliderValue = constrain(value, 0, 1023);
  } else if (normalized.startsWith("L:") || normalized.startsWith("LIGHT:")) {
    const value = Number(normalized.split(":")[1]);
    if (Number.isFinite(value)) {
      lastLightValue = constrain(value, 0, 1023);
      if (scene === "start" && lastLightValue >= LIGHT_START_THRESHOLD) startStory();
    }
  }

  updateHud();
}

function keyPressed() {
  if (keyCode === ENTER || key === " ") handleWhiteButton();
  else if (key === "1") handleChoice(0);
  else if (key === "2") handleChoice(1);
  else if (key === "3") handleChoice(2);
  else if (keyCode === LEFT_ARROW || key.toLowerCase() === "a") {
    lastSliderValue = max(0, lastSliderValue - 55);
    updateHud();
  } else if (keyCode === RIGHT_ARROW || key.toLowerCase() === "d") {
    lastSliderValue = min(1023, lastSliderValue + 55);
    updateHud();
  } else if (key.toLowerCase() === "l") {
    lastLightValue = LIGHT_START_THRESHOLD;
    parseSerialLine(`L:${LIGHT_START_THRESHOLD}`);
  }
}

function setSerialStatus(textValue) {
  document.getElementById("serial-status").textContent = textValue;
}

function updateHud() {
  document.getElementById("sensor-status").textContent =
    `Light: ${lastLightValue ?? "--"} | Slider: ${Math.round(lastSliderValue)}`;
}
