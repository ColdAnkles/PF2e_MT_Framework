"use strict";

function action_icon_label(actionType, actionCount) {
	//MapTool.chat.broadcast(actionType);
	//MapTool.chat.broadcast(String(actionCount));
	if (actionCount == null) {
		actionCount = 0;
	}
	if (actionType == "action" && !(isNaN(actionCount))) {
		if (actionCount == 1) {
			return "&#9670;";
		} else if (actionCount == 2) {
			return "&#9670;&#9670;";
		} else if (actionCount == 3) {
			return "&#9670;&#9670;&#9670;";
		}
	} else if (actionType == "reaction") {
		return "&#10227;";
	} else if (actionType == "freeaction" || actionType == "free") {
		return "&#9671;";
	} else if (actionType == "passive") {
		return "";
	} else if (actionType == "long") {
		return "(" + actionCount + ")";
	} else if (actionCount.includes("to")) {
		let first = actionCount.split(" to ")[0];
		let second = actionCount.split(" to ")[1];
		let char = "&#9670;";
		let returnString = "";
		for (var i = 0; i < first; i++) {
			returnString = returnString + char;
		}
		returnString = returnString + " to ";
		for (var j = 0; j < second; j++) {
			returnString = returnString + char;
		}
		return returnString;
	} else {
		MapTool.chat.broadcast(actionType);
	}
	return "Error";
}

function add_action_to_token(actionData, tokenID, token) {
	//MapTool.chat.broadcast(JSON.stringify(actionData));
	let actionKey = actionData.name;
	if (!("type" in actionData)) {
		if ("actionType" in actionData.system) {
			actionData.type = actionData.system.actionType.value;
		} else {
			let property = JSON.parse(read_data("pf2e_action"));
			let lookupAction = property[actionData.name];
			if ("source" in actionData) {
				lookupAction = property[actionData.name + "|" + actionData.source];
				actionKey = actionData.name + "|" + actionData.source;
			}
			if (lookupAction == null) {
				lookupAction = property[actionData.name + "|Pathfinder Player Core"];
				actionKey = actionData.name + "|Pathfinder Player Core";
			}

			if (lookupAction == null) {
				actionData.type = "basic";
			} else {
				actionData.type = "feat";
			}
		}
	}
	if (!("description" in actionData.system)) {
		actionData.system.description = { "value": "" };
	}
	if (token == null) {
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	let variant = JSON.parse(token.getProperty("foundryActor")).variant;
	if (actionData.type == "basic") {

		try {
			//let libToken = get_runtime("libToken");
			//let property = JSON.parse(libToken.getProperty("pf2e_action"));
			let property = JSON.parse(read_data("pf2e_action"));
			let lookupAction = property[actionData.name];
			if ("source" in actionData) {
				lookupAction = property[actionData.name + "|" + actionData.source];
				actionKey = actionData.name + "|" + actionData.source;
			}
			if (lookupAction == null) {
				lookupAction = property[actionData.name + "|Pathfinder Player Core"];
				actionKey = actionData.name + "|Pathfinder Player Core";
			}

			if (lookupAction == null) {
				MapTool.chat.broadcast("Cannot find action: " + actionData.name);
				return;
			}
			//MapTool.chat.broadcast(JSON.stringify(lookupAction));
			if ("fileURL" in lookupAction) {
				lookupAction = rest_call(lookupAction.fileURL);
			}

			let actionDesc = chat_display(lookupAction, false, { "level": token.getProperty("level"), "rollDice": false, "actor": token, "variant": variant, "action": lookupAction });
			let props = { "label": action_icon_label(lookupAction.system.actionType.value, lookupAction.system.actions.value) + " " + actionData.name, "playerEditable": 0, "command": "[r: js.ca.pf2e.simple_action(\"" + actionKey + "\",currentToken())]", "tooltip": actionDesc, "sortBy": actionData.name };
			if ("group" in actionData) {
				props.group = actionData.group;
			}
			createMacro(props, tokenID);
		} catch (e) {
			MapTool.chat.broadcast("Error in add_action_to_token during type=basic");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("token: " + String(token));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	} else if (actionData.type == "personal" || actionData.type == "feat" || actionData.type == "action" || actionData.type == "melee" || actionData.type == "ranged") {
		try {
			if ("isMelee" in actionData.system || (actionData.type == "melee" || actionData.type == "ranged")) {
				actionData.system.actionType = { "value": "action" };
				actionData.system.actions = { "value": 1 };

			}
			let actionLabel = action_icon_label(actionData.system.actionType.value, actionData.system.actions.value) + " " + actionData.name;
			if ("isMelee" in actionData.system || (actionData.type == "melee" || actionData.type == "ranged")) {
				if (actionData.system.isMelee || actionData.type == "melee") {
					actionLabel = actionLabel + " " + icon_img("melee");
				} else {
					actionLabel = actionLabel + " " + icon_img("ranged");
				}
			}
			let actionDesc = chat_display(actionData, false, { "level": token.getProperty("level"), "rollDice": false, "actor": token, "variant": variant, "action": actionData });
			let props = null;
			if ("_id" in actionData) {
				props = { "label": actionLabel, "playerEditable": 0, "command": "[r: js.ca.pf2e.personal_action(\"" + actionData._id + "\",currentToken())]", "tooltip": actionDesc, "sortBy": actionData.name };
			} else {
				props = { "label": actionLabel, "playerEditable": 0, "command": "[r: js.ca.pf2e.personal_action(\"" + actionData.name + "\",currentToken())]", "tooltip": actionDesc, "sortBy": actionData.name };
			}
			if ("group" in actionData.system) {
				props.group = actionData.system.group;
			}
			createMacro(props, tokenID);
		} catch (e) {
			MapTool.chat.broadcast("Error in add_action_to_token during type=personal-feat-action-melee-ranged");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("token: " + String(token));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	} else if (actionData.type == "spell") {

		try {
			//let libToken = get_runtime("libToken");
			//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
			let property = JSON.parse(read_data("pf2e_spell"));
			let spellName = actionData.name.replaceAll(/\(.*\)/g, "").trim();
			let lookupSpell = null;
			if (!(spellName in property)) {
				lookupSpell = JSON.parse(JSON.stringify(actionData));
				let storeSpell = lookupSpell;
				delete storeSpell.system.castLevel;
				delete storeSpell.system.location;
				store_object_data(storeSpell);
			} else {
				lookupSpell = property[spellName];
				if ("fileURL" in lookupSpell) {
					//lookupSpell = parse_spell(lookupSpell.baseName, rest_call(lookupSpell["fileURL"], ""));
					lookupSpell = rest_call(lookupSpell["fileURL"], "");
				}
			}

			//MapTool.chat.broadcast(JSON.stringify(lookupSpell));
			actionData.system.description.value = "";
			//MapTool.chat.broadcast(JSON.stringify(actionData));

			if (!("actions" in actionData.system)) {
				actionData.system.actions = { "value": null };
			}
			if (!("actionType" in actionData.system)) {
				actionData.system.actionType = { "value": null };
			}

			if (!isNaN(lookupSpell.system.time.value)) {
				actionData.system.actionType.value = "action";
				actionData.system.actions = { "value": lookupSpell.system.time.value };
			} else if (lookupSpell.system.time.value.includes("to")) {
				actionData.system.actionType.value = "action";
				actionData.system.actions = { "value": lookupSpell.system.time.value };
			} else if (lookupSpell.system.time.value == "reaction") {
				actionData.system.actionType.value = "reaction";
				actionData.system.actions = { "value": 1 };
			} else if (lookupSpell.system.time.value == "free") {
				actionData.system.actionType.value = "free";
				actionData.system.actions = { "value": 1 };
			} else {
				actionData.system.actionType.value = "long";
				actionData.system.actions = { "value": lookupSpell.system.time.value };
			}

			if (lookupSpell.system.area != null) {
				if ("details" in lookupSpell.system.area && lookupSpell.system.area.details != "") {
					actionData.system.description.value += "<b>Area</b> " + lookupSpell.system.area.details;
				} else {
					actionData.system.description.value += "<b>Area</b> " + lookupSpell.system.area.value + "-foot " + lookupSpell.system.area.type;
				}
			} else if (lookupSpell.system.range.value != null && lookupSpell.system.range.value != "") {
				actionData.system.description.value += "<b>Range</b> " + lookupSpell.system.range.value;
			}

			if (lookupSpell.system.target.value != null && lookupSpell.system.target.value != "") {
				if (lookupSpell.system.area != null || lookupSpell.system.range.value != null && lookupSpell.system.range.value != "") {
					actionData.system.description.value += "; ";
				}
				actionData.system.description.value += "<b>Targets</b> " + lookupSpell.system.target.value + "<br />"
			} else if (lookupSpell.system.area != null || lookupSpell.system.range.value != null && lookupSpell.system.range.value != "") {
				actionData.system.description.value += "<br />"
			}

			if (lookupSpell.system.defense != null && "save" in lookupSpell.system.defense && lookupSpell.system.defense.save != null && lookupSpell.system.defense.save.statistic != "") {
				actionData.system.description.value += "<b>Saving Throw</b> ";
				if (lookupSpell.system.defense.save.basic) {
					actionData.system.description.value += "basic ";
				}
				actionData.system.description.value += capitalise(lookupSpell.system.defense.save.statistic);
			}
			let hasDuration = lookupSpell.system.duration != null && lookupSpell.system.duration != "" && lookupSpell.system.duration.value != "" && lookupSpell.system.duration.value != null;
			if (lookupSpell.system.defense != null && "save" in lookupSpell.system.defense && lookupSpell.system.defense.save != null && lookupSpell.system.defense.save.statistic != "" && hasDuration) {
				actionData.system.description.value += "; ";
			} else if (lookupSpell.system.defense != null && "save" in lookupSpell.system.defense && lookupSpell.system.defense.save != null && lookupSpell.system.defense.save.statistic != "") {
				actionData.system.description.value += "<br />";
			}
			if (hasDuration) {
				actionData.system.description.value += "<b>Duration</b> " + lookupSpell.system.duration.value;
				actionData.system.description.value += "<br />";
			}
			actionData.system.description.value += lookupSpell.system.description.value;


			if ("focus" in lookupSpell.system.traits.value) {
				if ("cantrip" in lookupSpell.system.traits.value) {
					actionData.type = "Focus Cantrip";
				} else {
					actionData.type = "focus";
				}
			} else if ("cantrip" in lookupSpell.system.traits.value) {
				actionData.type = "cantrip"
			}
			actionData.system.level.value = lookupSpell.system.level.value;
			//actionData.traits = lookupSpell.traits.value.push(lookupSpell.traits.rarity);

			let spellLabel = action_icon_label(actionData.system.actionType.value, actionData.system.actions.value) + " " + actionData.name;
			actionData.name = spellName;
			let tooltipDescription = chat_display(actionData, false, { "level": actionData.system.castLevel.value, "rollDice": false, "variant": variant, "action": actionData });

			let sortNum = actionData.system.castLevel.value;
			if (actionData.system.traits.value.includes("cantrip")) {
				spellLabel += " (C)";
				sortNum = 0;
			} else {
				spellLabel += " (" + String(actionData.system.castLevel.value) + ")";
			}

			let props = { "label": spellLabel, "playerEditable": 0, "command": "[r: js.ca.pf2e.cast_spell(\"" + spellName + "|" + lookupSpell.source + "\"," + actionData.system.castLevel.value + ",\"" + actionData.system.group.value + "\",currentToken())]", "tooltip": tooltipDescription, "sortBy": String(sortNum), "group": actionData.system.group.value };

			//MapTool.chat.broadcast(JSON.stringify(props));
			createMacro(props, tokenID);
		} catch (e) {
			MapTool.chat.broadcast("Error in add_action_to_token during type=spell");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("tokenID: " + String(tokenID));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}
}

MTScript.registerMacro("ca.pf2e.add_action_to_token", add_action_to_token);