"use strict";

function feature_require_choice(feature, assignDict, possibleSelections = []) {
    let tagData = JSON.parse(read_data("pf2e_tagData"));
    let rules = feature.system.rules;
    let nameSplit = feature.name.split(".");
    let choiceTitle = nameSplit[nameSplit.length - 1];
    MTScript.setVariable("choiceTitle", choiceTitle);
    //MapTool.chat.broadcast(JSON.stringify(possibleSelections));
    //MapTool.chat.broadcast(JSON.stringify(feature));
    //MapTool.chat.broadcast(JSON.stringify(assignDict.flags));
    let chosenValues = [];
    for (var r in rules) {
        let newRule = rules[r];
        if ("key" in newRule && newRule.key == "ChoiceSet") {
            let choicePrompt = "Choose"
            if ("prompt" in newRule) {
                let testPrompt = glossary_find(newRule.prompt);
                if (testPrompt != null) {
                    choicePrompt = testPrompt;
                } else {
                    choicePrompt = newRule.prompt;
                }
            }
            if (choicePrompt.includes("Feat")) {
                continue;
            } else if (newRule.itemType == "feat") {
                continue;
            }
            let choiceFlag = newRule.flag;
            //MapTool.chat.broadcast(feature.name)
            //MapTool.chat.broadcast(JSON.stringify(newRule));
            if (choicePrompt.includes("WeaponGroup")) {
                choicePrompt = "Choose a Weapon Group";
            }
            if ("prompt" in newRule && newRule.prompt.includes("GeneralTraining")) {
                continue;
            }
            let choices = [];
            //MapTool.chat.broadcast(String(newRule.choices.constructor.name));
            try {
                if (newRule.choices == "weaponGroups") {
                    choices = ["Axe", "Bomb", "Bow", "Brawling", "Club", "Crossbow", "Dart", "Firearm", "Flail", "Hammer", "Knife", "Pick", "Polearm", "Shield", "Sling", "Spear", "Sword"];
                } else if (newRule.choices.constructor.name == "Object") {
                    if ("filter" in newRule.choices) {
                        for (var c in newRule.choices.filter) {
                            if (typeof (newRule.choices.filter[c]) == "string" && newRule.choices.filter[c].includes(":tag:")) {
                                let filterSplit = newRule.choices.filter[c].split(":");
                                let tagKey = filterSplit[filterSplit.length - 1];
                                choices = choices.concat(tagData[tagKey]);
                            }
                        }
                    } else if ("config" in newRule.choices) {
                        if (newRule.choices.config == "skills") {
                            choices = ["Acrobatics", "Arcana", "Athletics", "Crafting", "Deception", "Diplomacy", "Intimidation", "Medicine", "Nature", "Occultism", "Performance", "Religion", "Society", "Stealth", "Survival", "Thievery", "Lore"];
                        }
                    }
                } else if (newRule.choices.constructor.name == "Array") {
                    for (var e in newRule.choices) {
                        let pChoice = newRule.choices[e];
                        if (typeof (pChoice) == "String") {
                            choices.push(capitalise(pChoice));
                        } else if (typeof (pChoice) == "object") {
                            if ("value" in pChoice) {
                                if (pChoice.value.includes("system.")) {
                                    let choiceSplit = pChoice.value.split(".");
                                    choices.push(capitalise(choiceSplit[choiceSplit.length - 2]));
                                } else {
                                    choices.push(capitalise(pChoice.value));
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                MapTool.chat.broadcast("Error in feature_require_choice during choice-list-setup");
                MapTool.chat.broadcast("newRule: " + JSON.stringify(newRule));
                MapTool.chat.broadcast("" + e + "\n" + e.stack);
                return;
            }
            let choiceResult = null;
            //MapTool.chat.broadcast(JSON.stringify(choices));
            //MapTool.chat.broadcast(JSON.stringify(possibleSelections));
            let intersect = choices.filter(value => possibleSelections.includes(value));
            if (intersect.length == 1) {
                choiceResult = intersect[0];
            } else if (intersect.length > 1) {
                choices = intersect;
            }
            for (var c in choices) {
                if (choices[c].includes(".pf2e.")) {
                    let choiceSplit = choices[c].split(".");
                    choices[c] = choiceSplit[choiceSplit.length - 1];
                }
            }
            //MapTool.chat.broadcast(String(choiceResult));
            try {
                if (choiceResult == null && choices.length > 0) {
                    MTScript.setVariable("choices", JSON.stringify(choices));
                    MTScript.setVariable("prompt", choicePrompt);
                    MTScript.evalMacro("[h: choice=json.get(choices,0)][h: input(\"dummyVar|\"+choiceTitle+\"||LABEL|SPAN=TRUE\",\"choice|\"+choices+\"|\"+prompt+\"|LIST|VALUE=STRING DELIMITER=JSON\")]");
                    choiceResult = MTScript.getVariable("choice");
                } else if (choices.length == 0) {
                    //MapTool.chat.broadcast("Error: No choices available for " + feature.name);
                    return;
                }
            } catch (e) {
                MapTool.chat.broadcast("Error in feature_require_choice during ask-choice");
                MapTool.chat.broadcast("choices: " + JSON.stringify(choices));
                MapTool.chat.broadcast("newRule: " + JSON.stringify(newRule));
                MapTool.chat.broadcast("" + e + "\n" + e.stack);
                return;
            }
            //MapTool.chat.broadcast(choiceResult);
            try {
                if ("flags" in assignDict && "pf2e" in assignDict.flags && "rulesSelections" in assignDict.flags.pf2e && choiceFlag in assignDict.flags.pf2e.rulesSelections) {
                    assignDict.flags.pf2e.rulesSelections[choiceFlag].push(choiceResult.toLowerCase());
                } else {
                    assignDict.flags.pf2e.rulesSelections[choiceFlag] = [choiceResult.toLowerCase()];
                }
                if ("rollOption" in newRule && "pf2e" in assignDict.flags && "rulesSelections" in assignDict.flags.pf2e && newRule.rollOption in assignDict.flags.pf2e.rulesSelections) {
                    assignDict.flags.pf2e.rulesSelections[newRule.rollOption].push(choiceResult.toLowerCase());
                } else if ("rollOption" in newRule) {
                    assignDict.flags.pf2e.rulesSelections[newRule.rollOption] = [choiceResult.toLowerCase()];
                }
                chosenValues.push(choiceResult);
            } catch (e) {
                MapTool.chat.broadcast("Error in feature_require_choice during assign-ruleSelection");
                MapTool.chat.broadcast("assignDict.flags.pf2e.rulesSelections: " + JSON.stringify(assignDict.flags.pf2e.rulesSelections));
                MapTool.chat.broadcast("choiceFlag: " + choiceFlag);
                MapTool.chat.broadcast("choiceResult: " + choiceResult);
                MapTool.chat.broadcast("chosenValues: " + JSON.stringify(chosenValues));
                MapTool.chat.broadcast("" + e + "\n" + e.stack);
                return;
            }
        }
    }
    return chosenValues;
}