# Story Branch Image Order

This file documents the current image order in `sketch.js`.

## Shared Start

1. `the old mill donkey intro.png`
2. `bg_road for walking.png`
3. Dog choice screen: `meeting the dog  happy and neutral choices .png`

## Dog Choice Branches

Choice 1, yellow, dog joins:

1. `meeting the dog  happy and neutral choices .png`
2. `bg_road for walking.png`
3. Cat intro

Choice 2, green, dog joins:

1. `meeting the dog  happy and neutral choices .png`
2. `bg_road for walking.png`
3. Cat intro

Choice 3, white, dog does not join:

1. `meeting the dog bad choice.png`
2. `bg_road for walking.png`
3. Cat intro

## Cat Intro

If dog joined:

1. `meeting the cat with donkey and dog.png`

If dog did not join:

1. `meeting cat only donkey bad and neutral choice.png`

## Cat Choice Branches

Choice 1, yellow, cat joins:

1. `Donkey meeting cat good choice.png`
2. `bg_road for walking.png`
3. Rooster intro

Choice 2, green, cat does not join:

1. If dog joined: `meeting the cat with donkey and dog.png`
2. If dog did not join: `meeting cat only donkey bad and neutral choice.png`
3. `bg_road for walking.png`
4. Rooster intro

Choice 3, white, cat does not join:

1. If dog joined: `meeting the cat with donkey and dog.png`
2. If dog did not join: `meeting cat only donkey bad and neutral choice.png`
3. `bg_road for walking.png`
4. Rooster intro

## Rooster Intro

If only donkey:

1. `meeting the rooster with only donkey.png`

If donkey and dog:

1. `meeting the rooster with donkey and dog.png`

If donkey and cat:

1. `meeting rooster with donkey and cat.png`

If donkey, dog, and cat:

1. `meeting the rooster with donkey cat and dog.png`

## Rooster Choice Branches

Choice 1, yellow, rooster joins:

1. Same rooster scene variant as above
2. Forest / house sequence

Choice 2, green, rooster joins:

1. Same rooster scene variant as above
2. Forest / house sequence

Choice 3, white, rooster does not join:

1. Same rooster scene variant as above
2. Forest / house sequence

## Forest And House

Bad ending route:

1. `bg_house for first view of the house and for the sleeping scene.png`
2. `looking inside the hut seeing robbers.png`
3. `ending_bad.png`

Good route:

1. `bg_house for first view of the house and for the sleeping scene.png`
2. `looking inside the hut seeing robbers.png`
3. Mini-game explanation
4. Tower stacking mini-game
5. `Broken glass ambush of towereed animals neutral and good choices .png`
6. `Feast scene good and neutral choices.png`
7. `scene house with no lights before robbers go inside and after.png`
8. `robber inside the house.png`
9. `robber fleeing the house.png`
10. `ending_good.png`
11. `good ending after animals are shown last image.png`

Neutral route:

1. `bg_house for first view of the house and for the sleeping scene.png`
2. `looking inside the hut seeing robbers.png`
3. Mini-game explanation
4. Tower stacking mini-game
5. `Broken glass ambush of towereed animals neutral and good choices .png`
6. `Feast scene good and neutral choices.png`
7. `scene house with no lights before robbers go inside and after.png`
8. `robber inside the house.png`
9. `robber fleeing the house.png`
10. Matching neutral animal image:
   - dog: `ending_neutral_donkey_dog.png`
   - cat: `ending_neutral_donkey_cat.png`
   - rooster: `ending_neutral_donkey_rooster.png`
   - dog + cat: `ending_neutral_donkey_dog_cat.png`
   - dog + rooster: `ending_neutral_donkey_dog_rooster.png`
   - cat + rooster: `ending neutral_donkey_cat_rooster.png`
11. `neutral ending background after animal ending is shown last image.png`

