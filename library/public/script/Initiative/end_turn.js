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
		set_state("ActionsLeft_" + String(Number(i) + 1), false, turnToken.getId());
	}

	let tokenConditions = JSON.parse(turnToken.getProperty("conditionDetails"));

	let decrementConditions = ["Frightened"];
	try {
		for (var cond of decrementConditions) {
			if (cond in tokenConditions && tokenConditions[cond].system.autoDecrease) {
				set_condition(cond, turnToken, tokenConditions[cond].value.value - 1, true);
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in end_turn during decrement-conditions");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("tokenConditions: " + JSON.stringify(tokenConditions));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
	let currentInitiative = Number(MTScript.getVariable("currInit"));
	let currentRound = Number(MTScript.getVariable("currRound"));

	try {
		expire_effect_test({ "initiative": currentInitiative, "round": currentRound }, "turn-end");
	} catch (e) {
		MapTool.chat.broadcast("Error in end_turn during expire_effect_test");
		MapTool.chat.broadcast("initiative: " + String(currentInitiative));
		MapTool.chat.broadcast("round: " + String(currentRound));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let tokenEffects = Object.assign({}, JSON.parse(turnToken.getProperty("activeEffects")), JSON.parse(turnToken.getProperty("specialEffects")));
	try {
		for (var e in tokenEffects) {
			if (tokenEffects[e].baseName == "persistent-damage") {
				let effectData = tokenEffects[e];

				let displayData = { "name": e, "system": { "description": { "value": "" } } };
				let recoveryRoll = roll_dice("1d20");

				let damageValue = roll_dice(effectData.damage.dice);

				displayData.system.description.value += "<p><b>Damage:</b> " + damageValue + " " + effectData.damage.type + "</p>";
				displayData.system.description.value += "<p><b>Recovery Check:</b> " + String(recoveryRoll);
				if (recoveryRoll >= 15) {
					displayData.system.description.value += " <b><span style='color:green'>Recovered!</span></b>";
				}
				displayData.system.description.value += "</p>";

				let hpData = {
					"hpChangeVal": damageValue,
					"tokenID": turnToken.getId(),
					"currentTempHPChange": Number(turnToken.getProperty("TempHP")),
					"changeHPSubmit": "Submit",
					"hpChangeType": "lethal",
					"currentHPChange": Number(turnToken.getProperty("HP")),
					"currentMaxHPChange": Number(turnToken.getProperty("MaxHP")),
					"silent": true
				};

				change_hp(turnToken.getId(), hpData);

				chat_display(displayData, true, { "rollDice": true })

				if (recoveryRoll >= 15) {
					toggle_action_effect(effectData, turnToken, 0);
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in end_turn during persistent-damage-check");
		MapTool.chat.broadcast("tokenEffects: " + JSON.stringify(tokenEffects));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	if (forwards) {
		MTScript.evalMacro("[h: nextInitiative()]");
	} else {
		MTScript.evalMacro("[h: prevInitiative()]");
	}
}

MTScript.registerMacro("ca.pf2e.end_turn", end_turn);