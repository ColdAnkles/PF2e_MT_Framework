"use strict";

function knockout_creature(tokenID) {
	let token = tokenID;

	if (typeof (tokenID) == "string") {
		token = MapTool.tokens.getTokenByID(tokenID);
	}

	set_condition("Unconscious", tokenID, true, true);

	if (token.isPC()) {
		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		MTScript.evalMacro("[h: setInitiative(" + String(newInit) + ", " + tokenID + ")]")
	} else {
		MTScript.evalMacro("[h: removeFromInitiative(\"" + tokenID + "\")]");
	}

	chat_display({ "name": token.getName() + " unconscious!", "system": { "description": { "value": token.getName() + " knocked unconscious!" } } }, true);
}

MTScript.registerMacro("ca.pf2e.knockout_creature", knockout_creature);