"use strict";

function feature_require_choice(feature, assignDict, possibleSelections = []) {
    let rules = feature.rules;
    let nameSplit = feature.name.split(".");
    let choiceTitle = nameSplit[nameSplit.length - 1];
    MTScript.setVariable("choiceTitle", choiceTitle);
    for (var r in rules) {
        let newRule = rules[r];
        if ("key" in newRule && newRule.key == "ChoiceSet") {
            let choicePrompt = newRule.prompt;
            if (choicePrompt.includes("Feat")) {
                continue;
            }
            let choiceFlag = newRule.flag;
            //MapTool.chat.broadcast(feature.name)
            //MapTool.chat.broadcast(JSON.stringify(newRule));
            if (choicePrompt.includes("WeaponGroup")) {
                choicePrompt = "Choose a Weapon Group";
            }
            if (newRule.prompt.includes("GeneralTraining")) {
                continue;
            }
            let choices = [];
            if (newRule.choices == "weaponGroups") {
                choices = ["Axe", "Bomb", "Bow", "Brawling", "Club", "Crossbow", "Dart", "Firearm", "Flail", "Hammer", "Knife", "Pick", "Polearm", "Shield", "Sling", "Spear", "Sword"];
            } else if (typeof (newRule.choices) == "object") {
                for (var e in newRule.choices) {
                    let pChoice = newRule.choices[e];
                    if (typeof (pChoice) == "String") {
                        choices.push(capitalise(pChoice));
                    } else if (typeof (pChoice) == "object") {
                        if ("value" in pChoice) {
                            choices.push(capitalise(pChoice.value));
                        }
                    }
                }
            }
            let choiceResult = null;
            //MapTool.chat.broadcast(JSON.stringify(choices));
            //MapTool.chat.broadcast(JSON.stringify(possibleSelections));
            let intersect = choices.filter(value => possibleSelections.includes(value));
            if (intersect.length == 1) {
                choiceResult = intersect[0];
            }
            //MapTool.chat.broadcast(String(choiceResult));

            if (choiceResult == null) {
                MTScript.setVariable("choices", JSON.stringify(choices));
                MTScript.setVariable("prompt", choicePrompt);
                MTScript.evalMacro("[h: choice=json.get(choices,0)][h: input(\"dummyVar|\"+choiceTitle+\"||LABEL|SPAN=TRUE\",\"choice|\"+choices+\"|\"+prompt+\"|LIST|VALUE=STRING DELIMITER=JSON\")]");
                choiceResult = MTScript.getVariable("choice");
            }
            //MapTool.chat.broadcast(choiceResult);
            assignDict[choiceFlag] = choiceResult.toLowerCase();
        }
    }
}