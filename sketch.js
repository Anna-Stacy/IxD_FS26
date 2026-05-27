"use strict";

const ASSET_DIR = "Bremen Image Material";
const LIGHT_START_THRESHOLD = 650;
const MINI_GAME_LIGHT_THRESHOLD = 650;
const SERIAL_BAUD_RATE = 9600;
const MINI_GAME_CATCH_WINDOW = 82;

const COLORS = {
  ink: "#2b1b10",
  paper: "#fff4db",
  muted: "#dacfb9",
  panel: "rgba(15, 13, 11, 0.68)",
  panelStrong: "rgba(15, 13, 11, 0.82)",
  border: "rgba(255, 244, 219, 0.26)",
  accent: "#e8c86b",
};

const FILES = {
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

const assets = {};
let serialPort = null;
let serialReader = null;
let serialBuffer = "";
let serialConnected = false;
let lastLightValue = null;
let lastSliderValue = 512;

let appState = "start";
let canvasSize = { scale: 1, x: 0, y: 0 };
let pages = [];
let pageIndex = 0;
let currentChoice = null;
let companions = { dog: false, cat: false, rooster: false };
let resultType = null;
let miniGame = null;
let fade = null;

function preload() {
  Object.entries(FILES).forEach(([key, filename]) => {
    assets[key] = loadImage(`${ASSET_DIR}/${filename}`);
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
  background(16);
  push();
  translate(canvasSize.x, canvasSize.y);
  scale(canvasSize.scale);

  if (appState === "start") drawStart();
  else if (appState === "page") drawNarrativePage();
  else if (appState === "choice") drawChoicePage();
  else if (appState === "miniIntro") drawMiniIntro();
  else if (appState === "miniGame") drawMiniGame();
  else if (appState === "miniResult") drawMiniResult();
  else if (appState === "fade") drawFade();

  pop();
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
    scale,
    x: (width - 1376 * scale) / 2,
    y: (height - 768 * scale) / 2,
  };
}

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

function drawStart() {
  drawSceneImage("start", 48);
  fill(COLORS.paper);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(58);
  text("The Bremen", 688, 206);
  text("Town Musicians", 688, 274);

  textStyle(NORMAL);
  textSize(18);
  textLeading(22);
  const buttonY = 390;
  drawUiImage("lightUi", 284, buttonY - 34, 128, 92);
  drawUiImage("redContinue", 510, buttonY, 54, 54);
  drawUiImage("yellowChoice1", 662, buttonY, 54, 54);
  drawUiImage("greenChoice2", 814, buttonY, 54, 54);
  drawUiImage("whiteChoice3", 966, buttonY, 54, 54);
  fill(COLORS.paper);
  text(`Start story\nLight ${lastLightValue ?? "--"}/${LIGHT_START_THRESHOLD}`, 348, 484, 170, 54);
  text("Continue", 537, 484, 130, 44);
  text("Choice 1", 689, 484, 130, 44);
  text("Choice 2", 841, 484, 130, 44);
  text("Choice 3", 993, 484, 130, 44);
  textAlign(LEFT, BASELINE);
}

function drawNarrativePage() {
  const page = pages[pageIndex];
  drawSceneImage(page.image, page.overlay ?? 46);
  drawTextBox(page.text, "Press red to continue.", page.position || "left");
}

function drawChoicePage() {
  drawSceneImage(currentChoice.image, currentChoice.overlay ?? 42);
  drawTextBox(currentChoice.question, "Choose with yellow, green, or white.", "top");
  currentChoice.options.forEach((option, index) => {
    drawChoiceCard(54 + index * 436, 452, 398, 258, option, index);
  });
}

function drawMiniIntro() {
  drawSceneImage("lookingInside", 50);
  drawTextBox(
    `The companions have a plan: they will climb into a tower and make the most terrible music the robbers have ever heard. Cover the light sensor until the value is ${MINI_GAME_LIGHT_THRESHOLD} or higher to start the stacking game.`,
    "Use the light sensor to start.",
    "left"
  );
  drawUiImage("lightUi", 1110, 66, 150, 108);
}

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
    drawUiImage("redContinue", 638, 184, 54, 54);
    text("Press red to continue.", 430, 248, 516, 30);
  } else {
    text("Catch at least one animal before the story continues.", 430, 180, 516, 52);
    drawUiImage("redRetry", 638, 244, 54, 54);
    text("Press red to retry.", 430, 310, 516, 30);
  }
  textAlign(LEFT, BASELINE);
}

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

function drawTextBox(body, footer, position) {
  const box = layoutTextBox(body, footer, position);
  drawTextBoxUi(box.x, box.y, box.w, box.h);
  fill(COLORS.ink || "#2b1b10");
  textStyle(NORMAL);
  textSize(box.fontSize);
  textLeading(box.leading);
  textAlign(LEFT, TOP);
  text(body, box.x + box.padX, box.bodyY, box.w - box.padX * 2, box.bodyH);
  fill("#5a3518");
  textSize(18);
  textLeading(23);
  if (footer.toLowerCase().includes("red")) {
    drawUiImage("redContinue", box.x + box.padX, box.footerY - 9, 42, 42);
    text(footer, box.x + box.padX + 54, box.footerY, box.w - box.padX * 2 - 54, 34);
  } else {
    text(footer, box.x + box.padX, box.footerY, box.w - box.padX * 2, 34);
  }
  textAlign(LEFT, BASELINE);
}

function getTextBox(position) {
  if (position === "top") return { x: 74, y: 74, w: 1228, h: 178, minW: 660, minH: 126, fontSize: 21, leading: 28, padX: 42, padY: 34 };
  if (position === "right") return { x: 716, y: 112, w: 586, h: 394, minW: 430, minH: 158, fontSize: 21, leading: 29, padX: 38, padY: 36 };
  if (position === "bottom") return { x: 84, y: 536, w: 1208, h: 180, minW: 620, minH: 128, fontSize: 20, leading: 27, padX: 42, padY: 34 };
  return { x: 74, y: 112, w: 610, h: 420, minW: 430, minH: 158, fontSize: 21, leading: 29, padX: 38, padY: 36 };
}

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

  fitTextToBox(body, box, footer);
  return box;
}

function fitTextToBox(body, box, footer) {
  const footerH = footer ? 42 : 0;
  const footerGap = footer ? 18 : 0;
  let lines = [];

  while (box.fontSize >= 17) {
    textSize(box.fontSize);
    textLeading(box.leading);
    lines = wrapTextLines(body, box.w - box.padX * 2);
    const bodyH = lines.length * box.leading;
    const wantedH = bodyH + box.padY * 2 + footerGap + footerH;
    if (wantedH <= box.h || box.fontSize === 17) break;
    box.fontSize -= 1;
    box.leading = Math.max(23, box.leading - 1);
  }

  const bodyH = lines.length * box.leading;
  const wantedH = bodyH + box.padY * 2 + footerGap + footerH;
  box.h = Math.max(box.minH, Math.min(box.h, Math.ceil(wantedH)));
  const bodyAreaH = box.h - box.padY * 2 - footerGap - footerH;
  box.bodyH = bodyAreaH;
  box.bodyY = box.y + box.padY + Math.max(0, (bodyAreaH - bodyH) / 2);
  box.footerY = box.y + box.h - box.padY - footerH + 3;
}

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

function drawPanel(x, y, w, h, colorValue) {
  noStroke();
  fill(colorValue);
  rect(x, y, w, h, 8);
  stroke(COLORS.border);
  noFill();
  rect(x, y, w, h, 8);
  noStroke();
}

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

function drawChoiceCard(x, y, w, h, option, index) {
  drawTextBoxUi(x, y, w, h);
  const uiKey = index === 0 ? "yellowChoice1" : index === 1 ? "greenChoice2" : "whiteChoice3";
  drawUiImage(uiKey, x + w / 2 - 31, y + 18, 62, 62);
  fill(COLORS.ink);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(15);
  textLeading(20);
  text(option.text, x + 30, y + 96, w - 60, h - 118);
  textAlign(LEFT, BASELINE);
}

function drawUiImage(key, x, y, w, h) {
  image(assets[key], x, y, w, h);
}

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

function animalWidth(kind) {
  if (kind === "dog") return 230;
  if (kind === "cat") return 220;
  return 210;
}

function animalHeight(kind) {
  if (kind === "dog") return 128;
  if (kind === "cat") return 122;
  return 118;
}

function startStory() {
  resetStoryState();
  pages = introPages();
  pageIndex = 0;
  appState = "page";
}

function resetStoryState() {
  appState = "start";
  pages = [];
  pageIndex = 0;
  currentChoice = null;
  companions = { dog: false, cat: false, rooster: false };
  resultType = null;
  miniGame = null;
  fade = null;
}

function continueStory() {
  if (appState === "start") return;
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

function showChoice(choice) {
  currentChoice = choice;
  appState = "choice";
}

function chooseOption(index) {
  if (appState !== "choice") return;
  const option = currentChoice.options[index];
  if (!option) return;
  if (option.joins) companions[option.joins] = true;
  pages = option.pages;
  pageIndex = 0;
  currentChoice = null;
  appState = "page";
}

function decideEnding() {
  if (companions.dog && companions.cat && companions.rooster) resultType = "good";
  else if (joinedCompanions().length > 0) resultType = "neutral";
  else resultType = "bad";
}

function joinedCompanions() {
  return ["dog", "cat", "rooster"].filter((animal) => companions[animal]);
}

function introPages() {
  return [
    page("intro", "A man had a donkey, who for long years had untiringly carried sacks to the mill, but whose strength was now failing, so that he was becoming less and less able to work.", "left"),
    page("intro", "Then his master thought that he would no longer feed him. The donkey noticed that the wind was blowing less and less and ran away, setting forth on the road to Bremen, where he thought he could become a town musician as he always had a good ear for sounds.", "left"),
    page("dogGood", "When he had gone a little way he found a hunting dog lying in the road, who was panting like one who had run himself tired.", "left"),
    page("dogGood", "\"Why are you panting so, hunting dog?\" asked the donkey. \"Oh,\" said the dog, \"because I am old and am getting weaker every day and can no longer go hunting, my master wanted to kill me, so I ran off; but now how should I earn my bread?\"", "left", "dogChoice"),
  ];
}

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
          page("dogGood", "The dog felt sceptic at the comment about his age. He was a proud hunting dog! \"Well, it seems enticing, well alright!\" The dog relented knowing he had no more hunting left in him.", "left"),
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

function catChoice() {
  const withDog = companions.dog;
  return {
    image: withDog ? "catDogSad" : "catDonkey",
    question: "How should the donkey answer the cat?",
    options: [
      {
        label: "Choice 1",
        text: "\"Come along to Bremen! After all, you understand night music. You can become a town musician there and help draw an audience!\"",
        joins: "cat",
        pages: [
          page(withDog ? "catGoodDog" : "catGoodDonkey", "\"Come along to Bremen! After all, you understand night music. You can become a town musician there and help draw an audience!\" said the donkey excitedly. The cat was surprised by the cheerful invitation, but the thought of becoming a musician sounded much better than sitting alone and afraid. Convinced, the cat joined the donkey on his journey.", "left"),
          page("road", "They continued along the road toward Bremen.", "left", "roosterIntro"),
        ],
      },
      {
        label: "Choice 2",
        text: "\"Wouldn't it be better to have one last hurray? In your old age. Come with us/me to Bremen, its better than staying here and waiting for your demise.\"",
        pages: [
          page(withDog ? "catDogSad" : "catDonkey", "\"Wouldn't it be better to have one last hurray? In your old age. Come with us/me to Bremen, its better than staying here and waiting for your demise.\" The donkey spouted. The cat was baffled by the mean words, they were true but mean. With a big huff and puff the cat decided to turn around and sleep declining the offer.", "left"),
          page("road", "The donkey continued along the road toward Bremen without the cat.", "left", "roosterIntro"),
        ],
      },
      {
        label: "Choice 3",
        text: "\"Well you seem to be aging alright; I wanted to invite you to join us/me in our adventure to be musicians but clearly you can't use your muscles like you used to...\"",
        pages: [
          page(withDog ? "catDogSad" : "catDonkey", "\"Well you seem to be aging alright; I wanted to invite you to join us/me in our adventure to be musicians but clearly you can't use your muscles like you used to...\" The donkey said in a joking manner, trying to get laughs but instead was met with a hiss from the cat so shrill and lethal, it made the donkey flee and run along the path, far away from the cat.", "left"),
          page("road", "The donkey continued along the road toward Bremen without the cat.", "left", "roosterIntro"),
        ],
      },
    ],
  };
}

function roosterIntroPages() {
  const image = roosterImage();
  return [
    page(image, "After travelling further along the road, the donkey and their companion came to a farmyard. They were tired from the day's journey, but the donkey felt less alone with every new friend who had walked beside him.", "left"),
    page(image, "There, the rooster of the house was sitting on the gate, crying with all his might. \"Your cries pierce one's marrow and bone,\" said the donkey. \"What are you up to?\"", "left"),
    page(image, "\"I just prophesied good weather,\" said the rooster, \"because it is Our Dear Lady's Day, when she washes the Christ Child's shirts and wants to dry them; but because Sunday guests are coming tomorrow, the lady of the house has no mercy and told the cook that she wants to eat me tomorrow in the soup, so I am supposed to let them cut off my head this evening. Now I am going to cry at the top of my voice as long as I can.\"", "left", "roosterChoice"),
  ];
}

function roosterChoice() {
  return {
    image: roosterImage(),
    question: "How should the donkey answer the rooster?",
    options: [
      {
        label: "Choice 1",
        text: "\"Hey now my fellow friend! That sounds tragic! My party and me are headed of to the city to become musicians! Why not join us and amaze the crowds with your beautiful voice?\"",
        joins: "rooster",
        pages: [page(roosterImage(true), "\"Hey now my fellow friend! That sounds tragic! My party and me are headed of to the city to become musicians! Why not join us and amaze the crowds with your beautiful voice?\" Said the donkey excitedly. The rooster was happy with the proposal, and all four went off together.", "left", "forest")],
      },
      {
        label: "Choice 2",
        text: "\"Hey now, Red-Head,\" said the donkey, \"instead come away with us. We're going to Bremen. You can always find something better than death.\"",
        joins: "rooster",
        pages: [page(roosterImage(true), "\"Hey now, Red-Head,\" said the donkey, \"instead come away with us. We're going to Bremen. You can always find something better than death. You have a good voice, and when we make music together, it will be very pleasing.\" Mentioned the Donkey sheepishly. The rooster was taken aback by the straight forwardness but agreed nonetheless.", "left", "forest")],
      },
      {
        label: "Choice 3",
        text: "\"Well that does sound bad but with your shrill voice, do you believe you'll make a difference if you make noises all evening long?\"",
        pages: [page(roosterImage(), "\"Well that does sound bad but with your shrill voice, do you believe you'll make a difference if you make noises all evening long? Better come with us, might as well put your voice to good use.\" The donkey snorted. The rooster was appalled and continued with the noise making, being louder than before. The donkey lowered their head in shame and walked on towards the city, regretting their choice of words.", "left", "forest")],
      },
    ],
  };
}

function roosterImage(afterJoin = false) {
  const dog = companions.dog;
  const cat = companions.cat;
  if (afterJoin && dog && cat) return "roosterAll";
  if (dog && cat) return "roosterAll";
  if (dog) return "roosterDog";
  if (cat) return "roosterCat";
  return "roosterDonkey";
}

function forestPages() {
  if (resultType === "bad") {
    return [
      page("house", "However, the donkey and his companions, could not reach the city of Bremen in one day. In the evening, they came into a forest, where they decided to spend the night.", "left", "badEnding"),
    ];
  }

  if (resultType === "good") {
    return [
      page("house", "However, the donkey and his companions, could not reach the city of Bremen in one day. In the evening, they came into a forest, where they decided to spend the night.", "left"),
      page("house", "The donkey and the dog lay down under a big tree, but the cat and the rooster took to the branches. The rooster flew right to the top, where it was safest for him.", "left"),
      page("house", "Before falling asleep he looked around once again in all four directions, and he thought that he saw a little spark burning in the distance. He hollered to his companions, that there must be a house not too far away, for a light was shining.", "left"),
      page("lookingInside", "The donkey said, \"Then we must get up and go there, because the lodging here is poor.\" The dog said that he could do well with a few bones with a little meat on them.", "left"),
      page("lookingInside", "Thus they set forth toward the place where the light was, and they soon saw it glistening more brightly, and it became larger and larger, until they came to the front of a brightly lit robbers' house.", "left"),
      page("lookingInside", "The donkey, the largest of them, approached the window and looked in. \"What do you see, Gray-Horse?\" asked the rooster. \"What do I see?\" answered the donkey. \"A table set with good things to eat and drink, and robbers sitting there enjoying themselves.\"", "left"),
      page("lookingInside", "\"That would be something for us,\" said the rooster. \"Ee-ah, ee-ah, oh, if we were there!\" said the donkey.", "left"),
      page("lookingInside", "Then the animals discussed how they might drive the robbers away, and at last they came upon a plan. The donkey was to stand with his front feet on the window, the dog to jump on the donkey's back, the cat to climb onto the dog, and finally the rooster would fly up and sit on the cat's head.", "left", "miniIntro"),
    ];
  }

  return [
    page("house", "However, the donkey and his companions, could not reach the city of Bremen in one day. In the evening, they came into a forest, where they decided to spend the night.", "left"),
    page("house", "The donkey and his companion or companions settled down beneath a large tree in the forest. They had not gathered a complete band, but the donkey was no longer making the journey alone.", "left"),
    page("house", "Before they could fall asleep, one of the animals noticed a little spark burning in the distance. It seemed that there must be a house nearby, for a light was shining through the darkness.", "left"),
    page("lookingInside", "\"Then we should go there,\" said the donkey. \"The lodging here is poor, and perhaps we may find something to eat.\" Tired and hungry, the small group set forth toward the light.", "left"),
    page("lookingInside", "It grew brighter and larger until they came to the front of a brightly lit robbers' house. The donkey, being the largest of them, approached the window and looked in.", "left"),
    page("lookingInside", "\"What do you see?\" asked one of his companions. \"What do I see?\" answered the donkey. \"A table set with good things to eat and drink, and robbers sitting there enjoying themselves.\"", "left"),
    page("lookingInside", "\"That would be something for us,\" said his companion. \"Ee-ah, ee-ah, oh, if we were there!\" said the donkey.", "left"),
    page("lookingInside", "Although there were fewer of them than there might have been, the animals discussed how they could drive the robbers away. At last, they came upon a desperate plan: they would climb onto one another as well as they could, crash against the window, and make the most terrible music the robbers had ever heard.", "left"),
    page("lookingInside", "The donkey stood at the bottom of their small tower. Any companions who had joined him climbed above him, each trying to appear louder and more frightening than they truly felt.", "left", "miniIntro"),
  ];
}

function badEndingPages() {
  return [
    page("lookingInside", "Before falling asleep he looked around once again in all four directions, and he thought that he saw a little spark burning in the distance.", "left"),
    page("lookingInside", "The donkey went and had a look inside the house, seeing robbers the donkey did not dare fight them alone. Carrying on throughout the woods. Tired, the donkey went to sleep.", "left"),
    page("bad", "Waking up in the forest with no food and feeling lonely, the donkey made their way back to the mill it came from. Treading the day the farmer would not be able to feed them anymore.", "left"),
    page("bad", "The donkey dream of being a musician slowly fades away like a distant memory.", "left", "end"),
  ];
}

function buildPostMiniPages() {
  if (resultType === "good") {
    return [
      page("crash", "When they had done that, at a signal they began to make their music all together. The donkey brayed, the dog barked, the cat meowed and the rooster crowed. Then they crashed through the window into the room, shattering the panes.", "left"),
      page("feast", "The robbers jumped up at the terrible bellowing, thinking that a ghost was coming in, and fled in great fear out into the woods.", "left"),
      page("feast", "Then the four companions seated themselves at the table and freely partook of the leftovers, eating as if they would get nothing more for four weeks.", "left"),
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

  const pagesOut = [
    page("crash", "At the donkey's signal, they began their music together. The donkey brayed at the top of his lungs, while his companion or companions added their own cries to the dreadful concert. Then they crashed through the window into the room, shattering the panes.", "left"),
    page("feast", "The robbers jumped up at the terrible noise. In the confusion and darkness, they believed that some horrible creature had broken into their house, and they fled in great fear into the woods.", "left"),
    page("darkHouse", "When the minstrels were finished, they put out the light and looked for places to sleep, each according to their nature and desire. The donkey lay down on the hay pile.", "left"),
  ];

  if (companions.dog) pagesOut.push(page("darkHouse", "The dog curled up behind the door, ready to wake at the slightest sound.", "left"));
  if (companions.cat) pagesOut.push(page("darkHouse", "The cat settled on the hearth beside the warm ashes, finally finding a place where no one would chase her away.", "left"));
  if (companions.rooster) pagesOut.push(page("darkHouse", "The rooster flew up onto a beam of the roof, where he could watch safely from above.", "left"));

  pagesOut.push(page("darkHouse", "Because they were tired from their long journey and the excitement of the night, they soon fell asleep.", "left"));
  pagesOut.push(page("robberInside", "When midnight had passed, the robbers saw from a distance that the light was no longer burning in the house and that everything appeared quiet. Their captain said, \"We should not have let ourselves be chased away,\" and he sent one of them back to investigate the house.", "left"));
  pagesOut.push(page("robberInside", "The robber carefully entered the dark house, believing that the frightening creatures from earlier had disappeared.", "left"));

  if (companions.cat) pagesOut.push(page("robberInside", "In the kitchen, the robber mistook the cat's glowing eyes for live coals and stepped closer to light his match. The cat sprang at his face, hissing and scratching until he stumbled backward in terror.", "left"));
  if (companions.dog) pagesOut.push(page("robberFleeing", "As the robber turned toward the door, the dog jumped up from the shadows and bit him sharply in the leg.", "left"));
  if (companions.rooster) pagesOut.push(page("robberFleeing", "Awakened by the noise below, the rooster cried down from the beam with a shriek so sudden and loud that the robber believed he was being judged by a monster above him.", "left"));

  pagesOut.push(page("robberFleeing", "When the robber ran across the yard past the hay pile, the donkey gave him a powerful blow with his hind foot. Terrified and bruised, the robber fled as fast as he could back to his captain.", "left"));
  pagesOut.push(page(neutralAnimalImage(), "When the robber returned to his captain, he could barely speak from fear. \"There is a black monster lying in the yard,\" he cried, \"and it struck me with a wooden club! There are other terrible creatures hiding inside as well. We must stay far away from that house!\"", "left"));
  pagesOut.push(page("neutralFinal", "From that time forth, the robbers did not dare go back into the house. The animals decided to make this their home and keep living there.", "left"));
  pagesOut.push(page("neutralFinal", "The donkey and his band were relieved to have found safety and shelter. As the donkey looked at their small group, he could not help but think of the voices that were missing from their music. They had succeeded, but they were not yet the grand band he had dreamed of becoming.", "left", "end"));
  return pagesOut;
}

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

function page(image, text, position = "left", next = null) {
  return { image, text, position, next };
}

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

function stackTargetY(index) {
  return 640 - 110 - index * 82;
}

function advanceMiniGameFaller() {
  if (miniGame.currentIndex >= miniGame.animals.length) {
    miniGame.faller = null;
    appState = "miniResult";
  } else {
    spawnNextFaller();
  }
}

function handleContinueButton() {
  if (appState === "page") continueStory();
  else if (appState === "miniResult") {
    if (miniGame.stack.length > 0) {
      fade = { startedAt: millis(), image: "crash" };
      appState = "fade";
    } else {
      startMiniGame();
    }
  }
}

function handleLightValue(value) {
  lastLightValue = constrain(value, 0, 1023);
  if (appState === "start" && lastLightValue >= LIGHT_START_THRESHOLD) startStory();
  if (appState === "miniIntro" && lastLightValue >= MINI_GAME_LIGHT_THRESHOLD) startMiniGame();
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

  if (normalized === "B1" || normalized === "RED") handleContinueButton();
  else if (normalized === "B4" || normalized === "YELLOW") chooseOption(0);
  else if (normalized === "B3" || normalized === "GREEN") chooseOption(1);
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

function setSerialStatus(textValue) {
  document.getElementById("serial-status").textContent = textValue;
}

function updateHud() {
  document.getElementById("sensor-status").textContent =
    `Light: ${lastLightValue ?? "--"} | Slider: ${Math.round(lastSliderValue)}`;
}
