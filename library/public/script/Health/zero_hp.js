"use strict";

function zero_hp(tokenID) {

	let token = tokenID;

	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(tokenID);
	}

	let tokenDisplayName = token.getName().replace("Lib:", "");

	token.setProperty("actionsLeft", 0);
	token.setProperty("reactionsLeft", 0);
	update_action_bank(token);

	if (get_token_type(tokenID) == "PC") {

		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()][h:initiativeTokens=getInitiativeList()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		let myTokens = JSON.parse(token.getProperty("pcTokens"));
		let initTokens = JSON.parse(MTScript.getVariable("initiativeTokens")).tokens;
		for (var t in initTokens) {
			let initToken = initTokens[t];
			if (initToken.tokenID in myTokens) {
				MTScript.evalMacro("[h: setInitiative(" + String(newInit) + ", \"" + initToken.tokenID + "\")]")
			}
		}

		MTScript.evalMacro("[h: ans=input(\"junkVar|Was the damage a crit?|blah|LABEL|SPAN=TRUE\")]");
		let askResponse = (MTScript.getVariable("ans") == 1);

		let tokenConditions = JSON.parse(token.getProperty("conditionDetails"));

		let woundedVal = 0;

		if ("Wounded" in tokenConditions) {
			woundedVal = tokenConditions.Wounded.value.value;
		}

		set_condition("Dying", tokenID, ((askResponse) ? 2 : 1) + woundedVal, true);

		//tokenConditions = JSON.parse(token.getProperty("conditionDetails"));

		//if ("Wounded" in tokenConditions) {
		//	tokenConditions.Wounded.value.value += 1;
		//}

		//token.setProperty("conditionDetails", JSON.stringify(tokenConditions));

		chat_display({ "name": tokenDisplayName + " unconscious!", "system": { "description": { "value": tokenDisplayName + " knocked unconscious!" } } }, true);

	} else {
		set_state("Dead", true, tokenID);
		chat_display({ "name": tokenDisplayName + " dies!", "system": { "description": { "value": tokenDisplayName + " dies!" } } }, true);
		MTScript.evalMacro("[h: removeFromInitiative(\"" + tokenID + "\")]");
	}
}

MTScript.registerMacro("ca.pf2e.zero_hp", zero_hp);