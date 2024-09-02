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
			if (actionData.name == actionName) {
				actionData.spendAction = true;
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

MTScript.registerMacro("ca.pf2e.personal_action", personal_action);