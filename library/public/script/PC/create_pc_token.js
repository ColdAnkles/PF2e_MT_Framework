"use strict";

function create_pc_token(newPCTokenID, pcLibID) {

	let pcData = read_creature_properties(pcLibID)

	//__ADDING_STANDARD_MACROS
	add_common_macros(newPCTokenID);
	//__ADDING_ACTION_MACROS__
	add_common_action_macros(newPCTokenID);

	for (var s in pcData.speeds.other) {
		let speedData = pcData.speeds.other[s];
		if (speedData.type == "fly") {
			add_action_to_token({ "name": "Fly", "actionType": "action", "actionCount": 1, "type": "basic", "group": "Movement" }, newPCTokenID, MapTool.tokens.getTokenByID(pcLibID));
		} else if (speedData.type == "burrow") {
			add_action_to_token({ "name": "Burrow", "actionType": "action", "actionCount": 1, "type": "basic", "group": "Movement" }, newPCTokenID, MapTool.tokens.getTokenByID(pcLibID));
		}
	}

	for (var a in pcData.basicAttacks) {
		let actionData = pcData.basicAttacks[a];
		actionData.group = "";
		add_action_to_token(actionData, newPCTokenID, pcData);
	}

	for (var a in pcData.offensiveActions) {
		let actionData = pcData.offensiveActions[a];
		actionData.group = "4. Abilities";
		add_action_to_token(actionData, newPCTokenID, pcData);
	}

	for (var a in pcData.otherDefenses) {
		let actionData = pcData.otherDefenses[a];
		actionData.group = "4. Abilities";
		add_action_to_token(actionData, newPCTokenID, pcData);
	}

	for (var a in pcData.passiveDefenses) {
		let actionData = pcData.passiveDefenses[a];
		actionData.group = "4. Abilities";
		add_action_to_token(actionData, newPCTokenID, pcData);
	}

	for (var a in pcData.passiveSkills) {
		let actionData = pcData.passiveSkills[a];
		actionData.group = "4. Abilities";
		add_action_to_token(actionData, newPCTokenID, pcData);
	}

	let addedRefocus = false;
	for (var s in pcData.spellRules) {
		let spellSource = pcData.spellRules[s];
		for (var sp in spellSource.spells) {
			let spellData = spellSource.spells[sp];
			add_action_to_token({ "name": spellData.name, "actionType": "spell", "type": "spell", "group": spellSource.name, "castLevel": spellData.castLevel, "rawData": spellData, "traits": spellData.traits.value, "creatureLevel": pcData.level }, newPCTokenID, MapTool.tokens.getTokenByID(pcLibID));
		}
		if (spellSource.name.includes("Focus") && !addedRefocus) {
			//add_action_to_token({ "name": "Refocus", "type": "basic", "group": "1. Common" }, tokenID);
			createMacro({ "label": "Add Focus Point", "playerEditable": 0, "command": "[h: js.ca.pf2e.add_focus_point(myID)]", "tooltip": "Add 1 Focus Point", "sortBy": "", "group": "1. Common" }, newPCTokenID);
			createMacro({ "label": "Use Focus Point", "playerEditable": 0, "command": "[h: js.ca.pf2e.use_focus_point(myID)]", "tooltip": "Use 1 Focus Point", "sortBy": "", "group": "1. Common" }, newPCTokenID);
			addedRefocus = true;
		}
	}

	update_my_tokens(pcLibID);
}

MTScript.registerMacro("ca.pf2e.create_pc_token", create_pc_token);
