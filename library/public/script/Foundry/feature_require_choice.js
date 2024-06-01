"use strict";

function feature_require_choice(feature, assignDict, possibleSelections = []) {
    let tagData = JSON.parse(read_data("pf2e_tagData"));
    let rules = feature.rules;
    let nameSplit = feature.name.split(".");
    let choiceTitle = nameSplit[nameSplit.length - 1];
    MTScript.setVariable("choiceTitle", choiceTitle);
    //MapTool.chat.broadcast(JSON.stringify(possibleSelections));
    MapTool.chat.broadcast(JSON.stringify(feature));
    let chosenValues = [];
    for (var r in rules) {
        let newRule = rules[r];
        if ("key" in newRule && newRule.key == "ChoiceSet") {
            let choicePrompt = "Choose"
            if("prompt" in newRule){
                choicePrompt = newRule.prompt;
            }
            if (choicePrompt.includes("Feat")) {
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
            if("prompt" in newRule && newRule.prompt.includes("specificRule")){
                let promptSplit = newRule.prompt.split(".")
                choicePrompt = promptSplit[promptSplit.length - 1]
            }
            let choices = [];
            //MapTool.chat.broadcast(String(newRule.choices.constructor.name));
            if (newRule.choices == "weaponGroups") {
                choices = ["Axe", "Bomb", "Bow", "Brawling", "Club", "Crossbow", "Dart", "Firearm", "Flail", "Hammer", "Knife", "Pick", "Polearm", "Shield", "Sling", "Spear", "Sword"];
            } else if (newRule.choices.constructor.name == "Object") {
                if ("filter" in newRule.choices) {
                    for(var c in newRule.choices.filter){
                        if(newRule.choices.filter[c].includes(":tag:")){
                            let filterSplit = newRule.choices.filter[c].split(":");
                            let tagKey = filterSplit[filterSplit.length - 1];
                            choices = choices.concat(tagData[tagKey]);
                        }
                    }
                }
            } else if (newRule.choices.constructor.name == "Array") {
                for (var e in newRule.choices) {
                    let pChoice = newRule.choices[e];
                    if (typeof (pChoice) == "String") {
                        choices.push(capitalise(pChoice));
                    } else if (typeof (pChoice) == "object") {
                        if ("value" in pChoice) {
                            if(pChoice.value.includes("system.")){
                                let choiceSplit = pChoice.value.split(".");
                                choices.push(capitalise(choiceSplit[choiceSplit.length - 2]));
                            }else{
                                choices.push(capitalise(pChoice.value));
                            }
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