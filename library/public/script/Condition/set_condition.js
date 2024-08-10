"use strict";

function set_condition(conditionName, token, conditionValue = null, silent = false) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
		token = token.getProperty("myID");
		token = MapTool.tokens.getTokenByID(token);
	}

	let autoDecrease = true;
	let trueConditionName = conditionName.replaceAll(" (Time)", "");
	if (conditionName.includes("Time")) {
		autoDecrease = false;
	}

	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_condition"));
	let property = JSON.parse(read_data("pf2e_condition"));
	let conditionData = null

	if (!(trueConditionName in property)){
		conditionData = {
			"_id":"specialUnknownCondition",
			"name":trueConditionName,
			"system":{
				"description":{"value":conditionName},
				"duration": {
					"expiry": null,
					"unit": "unlimited",
					"value": 0
				},
				"overrides": [],
				"rules": [],
				"traits": {
					"value": []
				},
				"value": {
					"isValued": false,
					"value": null
				}
				},
			"type": "condition"
			}
	}else{
		conditionData = property[trueConditionName];
	}

	if ("fileURL" in conditionData){
		conditionData = rest_call(conditionData["fileURL"]);
	}

	let oldValue = null;

	let tokenConditions = JSON.parse(token.getProperty("conditionDetails"));
	try {
		oldValue = conditionData.system.value.value;
		conditionData.system.value.value = Number(conditionValue);

		if (conditionValue != null) {
			conditionValue = Number(conditionValue);
		}

		conditionData.system.autoDecrease = autoDecrease;

		if (tokenConditions == null) {
			tokenConditions = {};
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_condition during pre-setup");
		MapTool.chat.broadcast("conditionData: " + JSON.stringify(conditionData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let conditionApplication = 0;
	try{
		if (conditionName in tokenConditions && (conditionValue == null || conditionValue == 0)) {
			delete tokenConditions[conditionName];
			//MapTool.chat.broadcast("Removing condition: " + conditionName);
			//MTScript.evalMacro("[h: setState(stateName, 0, tokenID)]");
			if (!((conditionName + " (Time)" in tokenConditions && trueConditionName == conditionName)) && !(trueConditionName in tokenConditions && trueConditionName != conditionName)) {
				set_state(trueConditionName, 0, token.getId());
			}
		} else if ((conditionValue == null && !(conditionName in tokenConditions)) || Number(conditionValue) > 0) {
			if (!silent) {
				chat_display(conditionData);
			}
			tokenConditions[conditionName] = conditionData;
			set_state(trueConditionName, 1, token.getId());
			conditionApplication = 1;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_condition during apply-condition");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("trueConditionName: " + trueConditionName);
		MapTool.chat.broadcast("conditionData: " + JSON.stringify(conditionData));
		MapTool.chat.broadcast("tokenConditions: " + JSON.stringify(tokenConditions));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	token.setProperty("conditionDetails", JSON.stringify(tokenConditions))

	conditionData.system.value.value = oldValue;

	//Special Case for invisibility.
	if (conditionData.name == "Invisible") {
		toggle_owner_only_visible(token);
	}

	//MapTool.chat.broadcast("conditionApplication: " + String(conditionApplication));
	try{
		for (var r in conditionData.system.rules) {
			let ruleData = conditionData.system.rules[r];
			if (conditionData.system.value.isValued) {
				ruleData.value = foundry_calc_value(ruleData.value, token, conditionData);
			}
			//MapTool.chat.broadcast(JSON.stringify(ruleData));
			if (ruleData.key == "GrantItem") {
				let uuidSplit = ruleData.uuid.split(".");
				if (ruleData.uuid.includes("conditionitems")) {
					let applyCondition = uuidSplit[uuidSplit.length - 1];
					set_condition(applyCondition, token, conditionApplication);
				}
			} else if (ruleData.key == "LoseHitPoints" && conditionApplication == 1) {
				let currentHP = Number(token.getProperty("HP"));
				currentHP -= Number(ruleData.value);
				token.setProperty("HP", String(currentHP));
			} else if (ruleData.key == "FlatModifier" && "selector" in ruleData && ruleData.selector == "hp") {
				let currentMaxHP = Number(token.getProperty("MaxHP"));
				if (conditionApplication == 1) {
					currentMaxHP += Number(ruleData.value);
				} else {
					currentMaxHP -= Number(ruleData.value);
				}
				token.setProperty("MaxHP", String(currentMaxHP));
			}

		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_condition during condition-rules");
		MapTool.chat.broadcast("conditionData: " + JSON.stringify(conditionData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try{
		tokenConditions = JSON.parse(token.getProperty("conditionDetails"));
		for (var c in tokenConditions) {
			//MapTool.chat.broadcast(JSON.stringify(tokenConditions[c]));
			for (var r in tokenConditions[c].rules) {
				let ruleData = tokenConditions[c].rules[r];
				//MapTool.chat.broadcast(JSON.stringify(ruleData));
				if (ruleData.key == "GrantItem") {
					let uuidSplit = ruleData.uuid.split(".");
					if (ruleData.uuid.includes("conditionitems")) {
						let applyCondition = uuidSplit[uuidSplit.length - 1];
						if (!(applyCondition in tokenConditions)) {
							set_condition(applyCondition, token, 1, true);
						}
					}
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_condition during condition-reapply-condition");
		MapTool.chat.broadcast("conditionData: " + JSON.stringify(conditionData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}


	//MapTool.chat.broadcast(JSON.stringify(tokenConditions));

	if (is_pc(token)) {
		update_my_tokens(token);
	}

}

MTScript.registerMacro("ca.pf2e.set_condition", set_condition);