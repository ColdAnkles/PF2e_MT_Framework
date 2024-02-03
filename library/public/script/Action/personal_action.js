"use strict";

function personal_action(actionName, actingToken){
	actingToken = MapTool.tokens.getTokenByID(actingToken);

	let allPossible = JSON.parse(actingToken.getProperty("basicAttacks"));
	allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("offensiveActions")));
	allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("otherDefenses")));
	allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("passiveDefenses")));
	allPossible = allPossible.concat(JSON.parse(actingToken.getProperty("passiveSkills")));

	for (var o in allPossible){
		let actionData = allPossible[o];
		actionData.spendAction = true;
		if (actionData.name == actionName){
			core_action(actionData, actingToken);
			return;
		}
	}

	MapTool.chat.broadcast("Unable to find action: " + actionName);
	
}

MTScript.registerMacro("ca.pf2e.personal_action", personal_action);