"use strict";

function feature_require_choice(feature, assignDict, possibleSelections = []) {
    let rules = feature.rules;
    let nameSplit = feature.name.split(".");
    let choiceTitle = nameSplit[nameSplit.length - 1];
    MTScript.setVariable("choiceTitle", choiceTitle);
    let chosenValues = [];
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
            //MapTool.chat.broadcast(String(newRule.choices.constructor.name));
            if (newRule.choices == "weaponGroups") {
                choices = ["Axe", "Bomb", "Bow", "Brawling", "Club", "Crossbow", "Dart", "Firearm", "Flail", "Hammer", "Knife", "Pick", "Polearm", "Shield", "Sling", "Spear", "Sword"];
            } else if (newRule.choices.constructor.name == "Object") {
                if ("filter" in newRule.choices) {
                    if (newRule.choices.filter == "item:tag:wizard-arcane-thesis") {
                        choices = ["Experimental Spellshaping", "Improved Familiar Attunement", "Spell Blending", "Spell Substitution", "Staff Nexus"];
                    } else if (newRule.choices.filter == "item:tag:wizard-arcane-school") {
                        choices = ["School of Ars Grammatica", "School of Battle Magic", "School of Civic Wizardry", "School of Mentalism", "School of Protean Form", "School of the Boundary", "School of Unified Magical Theory"];
                    }
                }
            } else if (newRule.choices.constructor.name == "Array") {
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
            if (choiceFlag in assignDict) {
                assignDict[choiceFlag].push(choiceResult.toLowerCase());
            } else {
                assignDict[choiceFlag] = [choiceResult.toLowerCase()];
            }
            chosenValues.push(choiceResult);
        }
    }
    return chosenValues;
}