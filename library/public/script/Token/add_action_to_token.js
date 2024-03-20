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
	if (!("type" in actionData)) {
		if ("actionType" in actionData) {
			actionData.type = actionData.actionType;
		} else {
			let property = JSON.parse(read_data("pf2e_action"));
			let lookupAction = property[actionData.name];
			if (lookupAction == null) {
				actionData.type = "basic";
			} else {
				actionData.type = "feat";
			}
		}
	}
	if (!("description" in actionData)) {
		actionData.description = "";
	}
	if (token == null) {
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	if (actionData.type == "basic") {

		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_action"));
		let property = JSON.parse(read_data("pf2e_action"));
		let lookupAction = property[actionData.name];

		if (lookupAction == null) {
			MapTool.chat.broadcast("Cannot find action: " + actionData.name);
			return;
		}
		//MapTool.chat.broadcast(JSON.stringify(lookupAction));

		let actionDesc = chat_display(lookupAction, false, { "level": token.getProperty("level"), "rollDice": false, "actor": token });
		let props = { "label": action_icon_label(lookupAction.actionType, lookupAction.actionCost) + " " + actionData.name, "playerEditable": 0, "command": "[r: js.ca.pf2e.simple_action(\"" + actionData.name + "\",currentToken())]", "tooltip": actionDesc, "sortBy": actionData.name };
		if ("group" in actionData) {
			props.group = actionData.group;
		}
		createMacro(props, tokenID);

	} else if (actionData.type == "personal" || actionData.type == "feat" || actionData.type == "action") {
		let actionLabel = action_icon_label(actionData.actionType, actionData.actionCost) + " " + actionData.name;
		if ("isMelee" in actionData) {
			if (actionData.isMelee) {
				actionLabel = actionLabel + " " + icon_img("melee");
			} else {
				actionLabel = actionLabel + " " + icon_img("ranged");
			}
		}
		let actionDesc = chat_display(actionData, false, { "level": token.level, "rollDice": false, "actor": token });
		let props = { "label": actionLabel, "playerEditable": 0, "command": "[r: js.ca.pf2e.personal_action(\"" + actionData.name + "\",currentToken())]", "tooltip": actionDesc, "sortBy": actionData.name };
		if ("group" in actionData) {
			props.group = actionData.group;
		}
		createMacro(props, tokenID);

	} else if (actionData.type == "spell") {

		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
		let property = JSON.parse(read_data("pf2e_spell"));
		let spellName = actionData.name.replaceAll(/\(.*\)/g, "").trim();
		let lookupSpell = null;
		if (!(spellName in property)) {
			lookupSpell = actionData.rawData
			let storeSpell = JSON.parse(JSON.stringify(lookupSpell));
			delete storeSpell.castLevel;
			delete storeSpell.location;
			store_object_data(storeSpell);
		} else {
			lookupSpell = property[spellName];
			if ("fileURL" in lookupSpell) {
				lookupSpell = parse_spell(lookupSpell.baseName, rest_call(lookupSpell["fileURL"], ""));
			}
		}

		//MapTool.chat.broadcast(lookupSpell.name);

		if (!isNaN(lookupSpell.time)) {
			actionData.actionType = "action";
			actionData.actionCost = lookupSpell.time;
		} else if (lookupSpell.time.includes("to")) {
			actionData.actionType = "action";
			actionData.actionCost = lookupSpell.time;
		} else if (lookupSpell.time == "reaction") {
			actionData.actionType = "reaction";
			actionData.actionCost = 1;
		} else if (lookupSpell.time == "free") {
			actionData.actionType = "free";
			actionData.actionCost = 1;
		} else {
			actionData.actionType = "long";
			actionData.actionCost = lookupSpell.time;
		}

		if (lookupSpell.area != null) {
			actionData.description += "<b>Area</b> " + lookupSpell.area.details + "; <b>Targets</b> " + lookupSpell.target + "<br />";
		} else if (lookupSpell.range != null && lookupSpell.range != "") {
			actionData.description += "<b>Range</b> " + lookupSpell.range + "; <b>Targets</b> " + lookupSpell.target + "<br />";
		}

		if (lookupSpell.spellType == "save" && lookupSpell.save.value != "") {
			actionData.description += "<b>Saving Throw</b> ";
			if (lookupSpell.save.basic) {
				actionData.description += "basic ";
			}
			actionData.description += capitalise(lookupSpell.save.statistic);
		}
		let hasDuration = lookupSpell.duration != null && lookupSpell.duration != "" && lookupSpell.duration.value != "" && lookupSpell.duration.value != null;
		if (lookupSpell.spellType == "save" && lookupSpell.save.statistic != "" && hasDuration) {
			actionData.description += "; ";
		} else if (lookupSpell.spellType == "save" && lookupSpell.save.statistic != "") {
			actionData.description += "<br />";
		}
		if (hasDuration) {
			actionData.description += "<b>Duration</b> " + lookupSpell.duration.value;
			actionData.description += "<br />";
		}
		actionData.description += lookupSpell.description;

		actionData.type = lookupSpell.category;
		if (actionData.traits.includes("cantrip") && actionData.type == "spell") {
			actionData.type = "Cantrip";
			//actionData.castLevel = Math.floor(actionData.creatureLevel/2);
		} else if (actionData.traits.includes("cantrip") && actionData.type == "focus") {
			actionData.type = "Focus Cantrip";
			//actionData.castLevel = Math.floor(actionData.creatureLevel/2);
		}
		actionData.level = lookupSpell.level;
		//actionData.traits = lookupSpell.traits.value.push(lookupSpell.traits.rarity);

		let spellLabel = action_icon_label(actionData.actionType, actionData.actionCost) + " " + actionData.name;
		actionData.name = spellName;
		let tooltipDescription = chat_display(actionData, false, { "level": actionData.castLevel, "rollDice": false });

		let sortNum = actionData.castLevel;
		if (actionData.traits.includes("cantrip")) {
			spellLabel += " (C)";
			sortNum = 0;
		} else {
			spellLabel += " (" + String(actionData.castLevel) + ")";
		}

		let props = { "label": spellLabel, "playerEditable": 0, "command": "[r: js.ca.pf2e.cast_spell(\"" + spellName + "\"," + actionData.castLevel + ",\"" + actionData.group + "\",currentToken())]", "tooltip": tooltipDescription, "sortBy": String(sortNum), "group": actionData.group };

		//MapTool.chat.broadcast(JSON.stringify(props));
		createMacro(props, tokenID);
	}
}

MTScript.registerMacro("ca.pf2e.add_action_to_token", add_action_to_token);