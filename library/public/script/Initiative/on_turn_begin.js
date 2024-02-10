"use strict";

function on_turn_begin(turnToken, turnData = {}) {
	if (typeof (turnToken) == "string") {
		turnToken = MapTool.tokens.getTokenByID(turnToken);
	}
	//MapTool.chat.broadcast(turnToken.getName());

	let newActionCount = 3;
	let newReactionCount = 1;

	let currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));

	if (currentConditions == null) {
		currentConditions = {};
		turnToken.setProperty("conditionDetails", JSON.stringify(currentConditions));
	}

	//MapTool.chat.broadcast(JSON.stringify(currentConditions));

	let subBy = 0;

	if ("Stunned" in currentConditions || "Stunned (Time)" in currentConditions) {
		let stunnedValue = 0;
		if ("Stunned" in currentConditions && "Stunned (Time)" in currentConditions) {
			stunnedValue = max(currentConditions.Slowed.value.value, currentConditions["Stunned (Time)"].value.value);
		} else if ("Stunned" in currentConditions) {
			stunnedValue = currentConditions.Slowed.value.value;
		} else if ("Stunned (Time)" in currentConditions) {
			stunnedValue = currentConditions["Stunned (Time)"].value.value;
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
	currentConditions = JSON.parse(turnToken.getProperty("conditionDetails"));
	if ("Slowed" in currentConditions || "Slowed (Time)" in currentConditions) {
		let slowedValue = 0;
		if ("Slowed" in currentConditions && "Slowed (Time)" in currentConditions) {
			slowedValue = max(currentConditions.Slowed.value.value, currentConditions["Slowed (Time)"].value.value);
		} else if ("Slowed" in currentConditions) {
			slowedValue = currentConditions.Slowed.value.value;
		} else if ("Slowed (Time)" in currentConditions) {
			slowedValue = currentConditions["Slowed (Time)"].value.value;
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

	for (var i in [0, 1, 2, 3, 4, 5]) {
		if (i == newActionCount) {
			set_state("ActionsLeft_" + String(i), 1, turnToken.getId());
		} else if (i != 0) {
			set_state("ActionsLeft_" + String(i), 0, turnToken.getId());
		}
	}

	if (newReactionCount == 1) {
		set_state("Reaction", 1, turnToken.getId());
	} else {
		set_state("Reaction", 0, turnToken.getId());
	}

	turnToken.setProperty("actionsLeft", newActionCount);
	turnToken.setProperty("reactionsLeft", newReactionCount);
	turnToken.setProperty("attacksThisRound", 0);

	expire_effect_test(turnData, "turn-begin");

}

MTScript.registerMacro("ca.pf2e.on_turn_begin", on_turn_begin);