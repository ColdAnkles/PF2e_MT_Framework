"use strict";

function core_action(actionData, actingToken) {

	let canAct = false;
	let failAct = "Unknown Reason";

	let initiative = get_initiative(actingToken.getId());

	let actionsLeft = Number(actingToken.getProperty("actionsLeft"));
	let reactionsLeft = Number(actingToken.getProperty("reactionsLeft"));

	try {
		if (typeof (actingToken) == "string") {
			actingToken = MapTool.tokens.getTokenByID(actingToken);
		}

		//MapTool.chat.broadcast(JSON.stringify(actionData));
		//MapTool.chat.broadcast(String(initiative));
		//MapTool.chat.broadcast(String(actionsLeft));
		//MapTool.chat.broadcast(String(reactionsLeft));

		if ("requirements" in actionData.system && actionData.system.requirements != null && "value" in actionData.system.requirements && actionData.system.requirements.value != "") {
			MapTool.chat.broadcast("Test Requirements:\n" + JSON.stringify(actionData.system.requirements));
		}

		if (isNaN(initiative)) {
			canAct = true;
		} else if ("actionType" in actionData.system && "value" in actionData.system.actionType && actionData.system.actionType.value == "action" && "actions" in actionData.system && "value" in actionData.system.actions && actionsLeft >= actionData.system.actions.value) {
			canAct = true;
		} else if ((actionData.type == "ranged" || actionData.type == "melee") && actionsLeft >= 1) {
			canAct = true;
		} else if ((actionData.type == "ranged" || actionData.type == "melee") && actionsLeft <= 0) {
			MTScript.evalMacro("[h: input(\"forceUse|1|Force Use Action|CHECK\")]");
			let forceUse = (Number(MTScript.getVariable("forceUse")) == 1);
			if (!forceUse) {
				failAct = "Insufficient Actions";
			} else {
				canAct = true;
				actionData.useMAP = false;
				actionData.increaseMAP = false;
				actionData.spendAction = false;
			}
		} else if ("actionType" in actionData.system && actionData.system.actionType.value == "action") {
			failAct = "Insufficient Actions";
		} else if (isNaN(initiative) ||
			("actionType" in actionData.system && "value" in actionData.system.actionType && actionData.system.actionType.value == "reaction" &&
				("actions" in actionData.system &&
					("value" in actionData.system.actions && (reactionsLeft >= actionData.system.actions.value || actionData.system.actions.value == null)) ||
					!("value" in actionData.system.actions)))) {
			canAct = true;
		} else if ("actionType" in actionData.system && actionData.system.actionType.value == "reaction") {
			failAct = "Insufficient Reactions";
		} else if ("actionType" in actionData.system && actionData.system.actionType.value == "passive") {
			canAct = true;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in core_action during setup");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	if (canAct) {
		//MapTool.chat.broadcast("Performing Action: "+ actionData.name);
		//MapTool.chat.broadcast(JSON.stringify(actionData));
		setLibProperty("lib:ca.pf2e", "lastAction", actionData.name);

		if ("isSpell" in actionData.system && actionData.system.isSpell) {
			try {
				spell_action(actionData, actingToken);
			} catch (e) {
				MapTool.chat.broadcast("Error in spell-action during core_action");
				MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
				MapTool.chat.broadcast("actingToken: " + String(actingToken));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		} else if ("isMelee" in actionData.system || actionData.type == "melee" || actionData.type == "ranged") {
			try {
				if (!(isNaN(initiative)) && (("noQuery" in actionData && actionData.noQuery) || !("noQuery" in actionData))) {
					MTScript.setVariable("useMAP", (("useMAP" in actionData) ? ((actionData.useMAP) ? 1 : 0) : 1));
					MTScript.setVariable("increaseMAP", (("increaseMAP" in actionData) ? ((actionData.increaseMAP) ? 1 : 0) : 1));
					MTScript.setVariable("spendAction", (("spendAction" in actionData) ? ((actionData.spendAction) ? 1 : 0) : 1));
					MTScript.evalMacro("[h: input(\"useMap|\"+useMAP+\"|Use MAP|CHECK\",\"increaseMAP|\"+increaseMAP+\"|Increase MAP|CHECK\",\"spendAction|\"+spendAction+\"|Spend Action|CHECK\")]");
					actionData.useMAP = (Number(MTScript.getVariable("useMAP")) == 1);
					actionData.increaseMAP = (Number(MTScript.getVariable("increaseMAP")) == 1);
					actionData.spendAction = (Number(MTScript.getVariable("spendAction")) == 1);
				}

				attack_action(actionData, actingToken);
			} catch (e) {
				MapTool.chat.broadcast("Error in canAct-isMelee during core_action");
				MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
				MapTool.chat.broadcast("actingToken: " + String(actingToken));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		} else {
			try {
				let needsEffect = false;
				let doSave = false;
				let saveData = { "partial": true }
				let doCheck = false;
				let effectType = ""
				if (!("rules" in actionData.system)) {
					actionData.system.rules = [];
				}
				for (var r in actionData.system.rules) {
					let ruleData = actionData.system.rules[r];
					if (ruleData.selector == "saving-throw") {
						needsEffect = true;
						doSave = true;
						effectType = "saving-throw";
						if ("type" in ruleData && (ruleData.type == "circumstance" || ruleData.type == "status" || ruleData.type == "item")) {
							saveData[ruleData.type.substring(0, 1) + ((ruleData.value > 0) ? "Bonus" : "Malus")] = Math.abs(ruleData.value);
						}
					}
				}

				if ("selfEffect" in actionData.system) {
					let effectName = actionData.system.selfEffect.name;
					toggle_named_effect(effectName, actingToken, 1, actionData);
				}

				if (actionData.name == "Recall Knowledge") {
					doCheck = true;
				}
				if (actionData.system.traits.value.includes("skill")) {
					doCheck = true;
				}
				let foundryActor = JSON.parse(actingToken.getProperty("foundryActor"));
				chat_display(actionData, true, { "rollDice": true, "actor": actingToken, "action": actionData, "variant": foundryActor.variant, "isPC": actingToken.isPC() });

				if (doSave) {
					saving_throw(actingToken, saveData, { "applyEffect": actionData.name });
				}
				if (doCheck) {
					skill_check(actingToken, false, null, [actionData.baseName]);
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in canAct-else during core_action");
				MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
				MapTool.chat.broadcast("actingToken: " + String(actingToken));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		}

		//MapTool.chat.broadcast(JSON.stringify(actionData));
		try {
			if (!(isNaN(initiative)) && ("spendAction" in actionData && actionData.spendAction)) {
				if ("actionType" in actionData.system && actionData.system.actionType.value == "action" && "actions" in actionData.system) {
					actingToken.setProperty("actionsLeft", String(actionsLeft - actionData.system.actions.value));
				} else if (actionData.type == "melee" || actionData.type == "ranged") {
					actingToken.setProperty("actionsLeft", String(actionsLeft - 1));
				} else if ("actionType" in actionData.system && actionData.system.actionType.value == "reaction") {
					if (actionData.system.actions.value == null) {
						actionData.system.actions.value = 1;
					}
					actingToken.setProperty("reactionsLeft", String(reactionsLeft - actionData.system.actions.value));
				}
				update_action_bank(actingToken);
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in core_action during canAct-actionUpdate");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("actingToken: " + String(actingToken));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	} else {
		MapTool.chat.broadcast("Cannot " + actionData.name + ": " + failAct);
	}
}

MTScript.registerMacro("ca.pf2e.core_action", core_action);