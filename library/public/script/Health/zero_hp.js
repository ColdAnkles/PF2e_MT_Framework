"use strict";

function kill_creature(token) {
	let tokenID = token;
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	} else {
		tokenID = token.getId();
	}
	let tokenDisplayName = token.getName().replace("Lib:", "");
	set_state("Dead", true, tokenID);
	chat_display({ "name": tokenDisplayName + " dies!", "system": { "description": { "value": tokenDisplayName + " dies!" } } }, true);
	MTScript.evalMacro("[h: removeFromInitiative(\"" + tokenID + "\")]");
}

MTScript.registerMacro("ca.pf2e.kill_creature", kill_creature);

function zero_hp(tokenID) {

	let token = tokenID;

	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(tokenID);
	}

	let tokenDisplayName = token.getName().replace("Lib:", "");

	token.setProperty("actionsLeft", 0);
	token.setProperty("reactionsLeft", 0);
	update_action_bank(token);


	let regenData = calculate_bonus(token, ["regen"]);
	let regenerating = false;
	let actorData = JSON.parse(token.getProperty("foundryActor"));
	if ("FastHealing" in regenData.otherEffects) {
		let regenDisabled = false;
		if ("regen" in actorData) {
			regenDisabled = !actorData.regen;
		}
		regenData = regenData.otherEffects.FastHealing;
		regenerating = (!regenDisabled && regenData.type == "regeneration");
	}

	if (token.isPC() || regenerating) {

		try {
			MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()][h:initiativeTokens=getInitiativeList()]")
			let currentInitiative = Number(MTScript.getVariable("currInit"));
			let newInit = round(currentInitiative + 1);
			let myTokens = JSON.parse(token.getProperty("pcTokens"));
			if (!token.isPC()) {
				myTokens = [token.getId()]
			}
			let initTokens = JSON.parse(MTScript.getVariable("initiativeTokens")).tokens;
			for (var t in initTokens) {
				let initToken = initTokens[t];
				if (myTokens.includes(initToken.tokenId)) {
					MTScript.evalMacro("[h: setInitiative(" + String(newInit) + ", \"" + initToken.tokenId + "\")]")
				}
			}

			MTScript.evalMacro("[h: ans=input(\"junkVar|Was the damage a crit?|blah|LABEL|SPAN=TRUE\")]");
			let askResponse = (Number(MTScript.getVariable("ans")) == 1);

			let tokenConditions = JSON.parse(token.getProperty("conditionDetails"));

			let woundedVal = 0;

			if ("Wounded" in tokenConditions) {
				woundedVal = tokenConditions.Wounded.value.value;
			}

			set_condition("Dying", tokenID, ((askResponse) ? 2 : 1) + woundedVal, true);

			chat_display({ "name": tokenDisplayName + " unconscious!", "system": { "description": { "value": tokenDisplayName + " knocked unconscious!" } } }, true);

		} catch (e) {
			MapTool.chat.broadcast("Error in zero_hp during PC/Regen");
			MapTool.chat.broadcast("token: " + String(token));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	} else {
		kill_creature(token);
	}
}

MTScript.registerMacro("ca.pf2e.zero_hp", zero_hp);