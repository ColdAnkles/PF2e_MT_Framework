"use strict";

function feature_require_choice(feature, assignDict) {
    let rules = feature.rules;
    let choiceTitle = feature.name;
    MTScript.setVariable("choiceTitle", choiceTitle);
	for (var r in rules) {
		let newRule = rules[r];
		if ("key" in newRule && newRule.key == "ChoiceSet") {
            //MapTool.chat.broadcast(JSON.stringify(newRule));
            let choicePrompt = newRule.prompt;
            let choiceFlag = newRule.flag;
            if(newRule.prompt.includes("WeaponGroup")){
                choicePrompt = "Choose a Weapon Group";
            }
            if(newRule.prompt.includes("GeneralTraining")){
                continue;
            }
            let choices = [];
            if(newRule.choices=="weaponGroups"){
                choices = ["Axe","Bomb","Bow","Brawling","Club","Crossbow","Dart", "Firearm","Flail","Hammer","Knife","Pick","Polearm","Shield","Sling","Spear","Sword"];
            }


            MTScript.setVariable("choices", JSON.stringify(choices));
            MTScript.setVariable("prompt", choicePrompt);
            MTScript.evalMacro("[h: choice=json.get(choices,0)][h: input(\"dummyVar|\"+choiceTitle+\"||LABEL|SPAN=TRUE\",\"choice|\"+choices+\"|\"+prompt+\"|LIST|VALUE=STRING DELIMITER=JSON\")]");
            let choiceResult = MTScript.getVariable("choice");
            //MapTool.chat.broadcast(choiceResult);
            assignDict[choiceFlag] = choiceResult;
		}
	}
}