"use strict";

function on_turn_begin(turnToken, turnData = {}) {
	if (typeof (turnToken) == "string") {
		turnToken = MapTool.tokens.getTokenByID(turnToken);
	}
	//MapTool.chat.broadcast(turnToken.getName());

	let newActionCount = 3;
	let newReactionCount = 1;

	let currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));

	try {
		if (currentConditions == null) {
			currentConditions = {};
			turnToken.setProperty("conditionDetails", JSON.stringify(currentConditions));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during null-conditions");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//Regeneration and Fast Healing
	let regenData = calculate_bonus(turnToken, ["regen"]);
	let actorData = JSON.parse(turnToken.getProperty("foundryActor"));

	if ("FastHealing" in regenData.otherEffects) {
		regenData = regenData.otherEffects.FastHealing;
		let activeRegen = true;
		if ("regen" in actorData) {
			activeRegen = actorData.regen;
		} else {
			actorData.regen = true;
			turnToken.setProperty("foundryActor", JSON.stringify(actorData));
		}

		if (activeRegen) {
			let hpData = {
				"hpChangeVal": regenData.value,
				"tokenID": turnToken.getId(),
				"currentTempHPChange": Number(turnToken.getProperty("TempHP")),
				"changeHPSubmit": "Submit",
				"hpChangeType": "healing",
				"currentHPChange": Number(turnToken.getProperty("HP")),
				"currentMaxHPChange": Number(turnToken.getProperty("MaxHP")),
				"silent": true
			};
			change_hp(turnToken.getId(), hpData);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(currentConditions));

	//Recovery Check Section
	if ("Dying" in currentConditions) {
		recovery_check(turnToken);
		currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));
	}

	//Lost Actions from Stunned/Slowed
	let subBy = 0;
	try {
		if ("Stunned" in currentConditions || "Stunned (Time)" in currentConditions || "Stunned (Unlimited)" in currentConditions) {
			let stunnedValue = 0;
			if ("Stunned" in currentConditions && "Stunned (Time)" in currentConditions && "Stunned (Unlimited)" in currentConditions) {
				stunnedValue = max(currentConditions.Stunned.value.value, currentConditions["Stunned (Time)"].value.value, currentConditions["Stunned (Unlimited)"].value.value);
			} else if ("Stunned" in currentConditions && "Stunned (Time)" in currentConditions) {
				stunnedValue = max(currentConditions.Stunned.value.value, currentConditions["Stunned (Time)"].value.value);
			} else if ("Stunned (Unlimited)" in currentConditions && "Stunned (Time)" in currentConditions) {
				stunnedValue = max(currentConditions["Stunned (Unlimited)"].value.value, currentConditions["Stunned (Time)"].value.value);
			} else if ("Stunned" in currentConditions && "Stunned (Unlimited)" in currentConditions) {
				stunnedValue = max(currentConditions.Stunned.value.value, currentConditions["Stunned (Unlimited)"].value.value);
			} else if ("Stunned" in currentConditions) {
				stunnedValue = currentConditions.Stunned.value.value;
			} else if ("Stunned (Time)" in currentConditions) {
				stunnedValue = currentConditions["Stunned (Time)"].value.value;
			} else if ("Stunned (Unlimited)" in currentConditions) {
				stunnedValue = currentConditions["Stunned (Unlimited)"].value.value;
			}
			subBy = min(stunnedValue, newActionCount);
			//MapTool.chat.broadcast(String(subBy));
			if ("Stunned" in currentConditions) {
				currentConditions.Stunned.value.value = currentConditions.Stunned.value.value - subBy;
			}
			turnToken.setProperty("conditionDetails", JSON.stringify(currentConditions));
			newActionCount = newActionCount - subBy;
			currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));
			if ("Stunned" in currentConditions) {
				currentConditions.Stunned.value.value = currentConditions.Stunned.value.value - subBy;
				if (currentConditions.Stunned.value.value <= 0) {
					set_condition("Stunned", turnToken, 0);
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during stunned-eval");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("currentConditions: " + JSON.stringify(currentConditions));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));
	try {
		if ("Slowed" in currentConditions || "Slowed (Time)" in currentConditions || "Slowed (Unlimited)" in currentConditions) {
			let slowedValue = 0;
			if ("Slowed" in currentConditions && "Slowed (Time)" in currentConditions && "Slowed (Unlimited)" in currentConditions) {
				slowedValue = max(currentConditions.Slowed.value.value, currentConditions["Slowed (Time)"].value.value, currentConditions["Slowed (Unlimited)"].value.value);
			} else if ("Slowed" in currentConditions && "Slowed (Time)" in currentConditions) {
				slowedValue = max(currentConditions.Slowed.value.value, currentConditions["Slowed (Time)"].value.value);
			} else if ("Slowed (Unlimited)" in currentConditions && "Slowed (Time)" in currentConditions) {
				slowedValue = max(currentConditions["Slowed (Unlimited)"].value.value, currentConditions["Slowed (Time)"].value.value);
			} else if ("Slowed" in currentConditions && "Slowed (Unlimited)" in currentConditions) {
				slowedValue = max(currentConditions.Slowed.value.value, currentConditions["Slowed (Unlimited)"].value.value);
			} else if ("Slowed" in currentConditions) {
				slowedValue = currentConditions.Slowed.value.value;
			} else if ("Slowed (Time)" in currentConditions) {
				slowedValue = currentConditions["Slowed (Time)"].value.value;
			} else if ("Slowed (Unlimited)" in currentConditions) {
				slowedValue = currentConditions["Slowed (Unlimited)"].value.value;
			}
			subBy = min(slowedValue, newActionCount);
			//MapTool.chat.broadcast(String(subBy));
			turnToken.setProperty("conditionDetails", JSON.stringify(currentConditions));
			if ("Slowed" in currentConditions) {
				currentConditions.Slowed.value.value = currentConditions.Slowed.value.value - subBy;
				if (currentConditions.Slowed.value.value <= 0) {
					set_condition("Slowed", turnToken, 0);
				}
			}
			newActionCount = newActionCount - subBy;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during slowed-eval");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("currentConditions: " + JSON.stringify(currentConditions));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var i in [0, 1, 2, 3, 4, 5]) {
			if (i == newActionCount) {
				set_state("ActionsLeft_" + String(i), true, turnToken.getId());
			} else if (i != 0) {
				set_state("ActionsLeft_" + String(i), false, turnToken.getId());
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during action_state_set");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("newActionCount: " + String(newActionCount));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (newReactionCount == 1) {
			set_state("Reaction", true, turnToken.getId());
		} else {
			set_state("Reaction", false, turnToken.getId());
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during reaction_state_set");
		MapTool.chat.broadcast("turnToken: " + String(turnToken));
		MapTool.chat.broadcast("newReactionCount: " + String(newReactionCount));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		expire_effect_test(turnData, "turn-begin");
	} catch (e) {
		MapTool.chat.broadcast("Error in on_turn_begin during expire_effect_test");
		MapTool.chat.broadcast("turnData: " + JSON.stringify(turnData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	turnToken.setProperty("actionsLeft", newActionCount);
	turnToken.setProperty("reactionsLeft", newReactionCount);
	turnToken.setProperty("attacksThisRound", 0);

}

MTScript.registerMacro("ca.pf2e.on_turn_begin", on_turn_begin);