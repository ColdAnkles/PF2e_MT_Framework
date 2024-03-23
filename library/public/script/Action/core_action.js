"use strict";

function core_action(actionData, actingToken) {
	if (typeof (actingToken) == "string") {
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));

	if ("requirements" in actionData && actionData.requirements != null && "value" in actionData.requirements && actionData.requirements.value != "") {
		MapTool.chat.broadcast("Test Requirements:\n" + JSON.stringify(actionData.requirements));
	}

	let canAct = false;
	let failAct = "Unknown Reason";

	let initiative = get_initiative(actingToken.getId());

	let actionsLeft = Number(actingToken.getProperty("actionsLeft"));
	let reactionsLeft = Number(actingToken.getProperty("reactionsLeft"));

	if (isNaN(initiative) || (actionData.actionType == "action" && actionsLeft >= actionData.actionCost)) {
		canAct = true;
	} else if (actionData.actionType == "action") {
		failAct = "Insufficient Actions";
	} else if (isNaN(initiative) || (actionData.actionType == "reaction" && (reactionsLeft >= actionData.actionCost || actionData.actionCost == null))) {
		canAct = true;
	} else if (actionData.actionType == "reaction") {
		failAct = "Insufficient Reactions";
	} else if (actionData.actionType == "passive") {
		canAct = true;
	}

	if (canAct) {
		//MapTool.chat.broadcast("Performing Action: "+ actionData.name);
		//MapTool.chat.broadcast(JSON.stringify(actionData));
		setLibProperty("lib:ca.pf2e", "lastAction", actionData.name);

		if ("isSpell" in actionData && actionData.isSpell) {
			spell_action(actionData, actingToken);
		} else if ("isMelee" in actionData) {

			if (!(isNaN(initiative)) && !("useMAP" in actionData)) {
				MTScript.setVariable("useMAP", 1);
				MTScript.setVariable("increaseMAP", 1);
				MTScript.setVariable("spendAction", 1);
				MTScript.evalMacro("[h: input(\"useMap|1|Use MAP|CHECK\",\"increaseMAP|1|Increase MAP|CHECK\",\"spendAction|1|Spend Action|CHECK\")]");
				actionData.useMAP = MTScript.getVariable("useMAP") == 1;
				actionData.increaseMAP = MTScript.getVariable("increaseMAP") == 1;
				actionData.spendAction = MTScript.getVariable("spendAction") == 1;
			}

			attack_action(actionData, actingToken);
		} else {
			let needsEffect = false;
			let doSave = false;
			let doCheck = false;
			let effectType = ""
			if (!("rules" in actionData)) {
				actionData.rules = [];
			}
			for (var r in actionData.rules) {
				let ruleData = actionData.rules[r];
				if (ruleData.selector == "saving-throw") {
					needsEffect = true;
					doSave = true;
					effectType = "saving-throw";
				}
			}

			if ("selfEffect" in actionData) {
				let effectName = actionData.selfEffect.name;
				toggle_named_effect(effectName, actingToken, 1, actionData);
			}

			if (actionData.name == "Recall Knowledge") {
				doCheck = true;
			}
			if (actionData.traits.includes("skill")) {
				doCheck = true;
			}

			chat_display(actionData, true, { "rollDice": true, "actor": actingToken, "action": actionData });

			if (doSave) {
				saving_throw(actingToken, null, { "applyEffect": actionData.name });
			}
			if (doCheck) {
				skill_check(actingToken, false, null, [actionData.baseName]);
			}
		}

		if (!(isNaN(initiative)) && ("spendAction" in actionData && actionData.spendAction)) {
			if (actionData.actionType == "action") {
				actingToken.setProperty("actionsLeft", String(actionsLeft - actionData.actionCost));
			} else if (actionData.actionType == "reaction") {
				actingToken.setProperty("reactionsLeft", String(reactionsLeft - actionData.actionCost));
			}
			update_action_bank(actingToken);
		}
	} else {
		MapTool.chat.broadcast("Cannot " + actionData.name + ": " + failAct);
	}
}

MTScript.registerMacro("ca.pf2e.core_action", core_action);