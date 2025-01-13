"use strict";

function knockout_creature(tokenID) {
	set_state("Unconscious", true, tokenID)

	if (get_token_type(tokenID) == PC) {
		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		MTScript.evalMacro("[h: setInitiative(" + String(newInit) + ", " + tokenID + ")]")
	}

	chat_display({ "name": token.getName() + " unconscious!", "description": token.getName() + " knocked unconscious!" }, true);
}

MTScript.registerMacro("ca.pf2e.knockout_creature", knockout_creature);