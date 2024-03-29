"use strict";

function end_turn(turnToken, forwards = true) {
	if (turnToken == "" || turnToken == null) {
		MTScript.evalMacro("[h: sortInitiative()][h: nextInitiative()]");
		return
	}
	MTScript.evalMacro("[h: currentInit = getInitiativeToken()]");
	let currentTurnToken = MTScript.getVariable("currentInit");
	if (typeof (turnToken) == "string") {
		turnToken = MapTool.tokens.getTokenByID(turnToken);
	}
	if (currentTurnToken != turnToken.getId()) {
		return;
	}
	//MapTool.chat.broadcast(turnToken.getName());
	for (var i in [0, 1, 2, 3, 4]) {
		set_state("ActionsLeft_" + String(Number(i) + 1), 0, turnToken.getId());
	}
	let tokenConditions = JSON.parse(turnToken.getProperty("conditionDetails"));

	let decrementConditions = ["Frightened"];
	for (var cond of decrementConditions) {
		if (cond in tokenConditions && tokenConditions[cond].autoDecrease) {
			set_condition(cond, turnToken, tokenConditions[cond].value.value - 1, true);
		}
	}

	MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
	let currentInitiative = Number(MTScript.getVariable("currInit"));
	let currentRound = Number(MTScript.getVariable("currRound"));
	expire_effect_test({ "initiative": currentInitiative, "round": currentRound }, "turn-end");

	let tokenEffects = Object.assign({}, JSON.parse(turnToken.getProperty("activeEffects")), JSON.parse(turnToken.getProperty("specialEffects")));
	for (var e in tokenEffects) {
		if (e.includes("Persistent")) {
			let effectData = tokenEffects[e];

			let displayData = { "name": e, "description": "" };
			let recoveryRoll = roll_dice("1d20");

			displayData.description += "<p><b>Damage:</b> " + roll_dice(effectData.damage.dice) + " " + effectData.damage.type + "</p>";
			displayData.description += "<p><b>Recovery Check:</b> " + String(recoveryRoll);
			if (recoveryRoll >= 15) {
				displayData.description += " <b><span style='color:green'>Recovered!</span></b>";
			}
			displayData.description += "</p>";

			chat_display(displayData, true, { "rollDice": true })

			if (recoveryRoll >= 15) {
				toggle_action_effect(effectData, turnToken, 0);
			}
		}
	}

	if (forwards) {
		MTScript.evalMacro("[h: nextInitiative()]");
	} else {
		MTScript.evalMacro("[h: prevInitiative()]");
	}
}

MTScript.registerMacro("ca.pf2e.end_turn", end_turn);