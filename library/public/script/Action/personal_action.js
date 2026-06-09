"use strict";

function personal_action(actionName, actingToken) {

	if (actionName == "Signature Spells") {
		MTScript.evalMacro("[h: returnVar = input(\"labelVar|Configure Signature Spells?|prompt|LABEL|SPAN=TRUE\")]");
		let answer = Number(MTScript.getVariable("returnVar")) == 1;
		if (answer) {
			configure_signature_spells(actingToken.getProperty("myID"));
			return;
		}
	}

	try {
		actingToken = MapTool.tokens.getTokenByID(actingToken);

		let allPossible = JSON.parse(actingToken.getProperty("basicAttacks"));
		allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("offensiveActions")));
		allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("otherDefenses")));
		allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("passiveDefenses")));
		allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("passiveSkills")));

		for (var o in allPossible) {
			let actionData = allPossible[o];
			if (actionData.name == actionName || ("_id" in actionData && actionData._id == actionName)) {
				actionData.spendAction = true;
				//Special Case for Elemental Blast
				if (actionData.name == "Elemental Blast") {
					let inputText = "actionCount|";
					for (let i = 1; i <= 2; i++) {
						inputText = inputText + String(i) + " " + icon_img(String(i) + "action", false, true) + ",";
					}
					inputText = inputText.substring(0, inputText.length - 1) + "|Actions to use|LIST|ICON=TRUE ICONSIZE=30 SELECT=0";
					MTScript.evalMacro("[h: input(\"" + inputText + "\",\"isMelee|0|Is Melee?|CHECK\",\"element|Air,Earth,Fire,Metal,Water,Wood|Element|LIST|VALUE=STRING\")]");
					actionData.system.actions.value = Number(MTScript.getVariable("actionCount"))+1;
					let isMelee = Number(MTScript.getVariable("isMelee"))==1;
					let element = MTScript.getVariable("element");
					let damageType = null;
					let die = null;
					let range = null;
					switch (element) {
						case "Air":
							damageType = "electricity or slashing";
							die = "d6";
							range = {"value":"60 feet"};
							break;
						case "Earth":
							damageType = "bludgeoning or piercing";
							die = "d8";
							range = {"value":"30 feet"};
							break;
						case "Fire":
							damageType = "fire";
							die = "d6";
							range = {"value":"60 feet"};
							break;
						case "Metal":
							damageType = "piercing or slashing";
							die = "d8";
							range = {"value":"30 feet"};
							break;
						case "Water":
							damageType = "bludgeoning or cold";
							die = "d8";
							range = {"value":"30 feet"};
							break;
						case "Wood":
							damageType = "bludgeoning or vitality";
							die = "d8";
							range = {"value":"30 feet"};
							break;
					}
					let tokenLevel = actingToken.getProperty("Level");
					let dice = Math.max(1 + Math.floor((tokenLevel - 1) / 4), 1);
					actionData.system.damageRolls = { "0": { "die": die, "dice": dice, "damageType": damageType } };
					actionData.type = ((isMelee)?"melee":"ranged");
					actionData.isMelee = isMelee;
					if (!isMelee){
						actionData.system.range = range;
					}
				}
				core_action(actionData, actingToken);
				return;
			}
		}

		MapTool.chat.broadcast("Unable to find action: " + actionName);
	} catch (e) {
		MapTool.chat.broadcast("Error in personalAction");
		MapTool.chat.broadcast("actionName: " + actionName);
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

}

MTScript.registerMacro("ca.pz2e.personal_action", personal_action);