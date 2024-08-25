"use strict";

function create_npc(newNPCTokenID, creatureName, variant = "normal") {
	let newToken = MapTool.tokens.getTokenByID(newNPCTokenID);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_npc"));
	let property = JSON.parse(read_data("pf2e_npc"));
	let creatureData = property[creatureName];
	if (creatureData == null) {
		property = JSON.parse(read_data("customContent")).npc;
		creatureData = property[creatureName];
	}
	if ("fileURL" in creatureData) {
		creatureData = rest_call(creatureData["fileURL"], "");
	}
	creatureData = parse_npc(creatureData, false, variant);

	write_creature_properties(creatureData, newToken);

	//__ADDING_STANDARD_MACROS
	add_common_macros(newNPCTokenID);
	//__ADDING_ACTION_MACROS__
	add_common_action_macros(newNPCTokenID);

	for (var s in creatureData.speeds.other) {
		let speedData = creatureData.speeds.other[s];
		if (speedData.type == "fly") {
			add_action_to_token({ "name": "Fly", "type": "basic", "system": { "actionType": "action", "actionCount": 1, "type": "basic", "group": "Movement", "description": { "value": "" } } }, newNPCTokenID)
		} else if (speedData.type == "burrow") {
			add_action_to_token({ "name": "Burrow", "type": "basic", "system": { "actionType": "action", "actionCount": 1, "group": "Movement", "description": { "value": "" } } }, newNPCTokenID)
		}
	}

	if (creatureData.foundryActor.system.attributes.shield != null) {
		add_action_to_token({ "name": "Raise a Shield", "type": "basic", "system": { "group": "", "description": { "value": "" } } }, newNPCTokenID);
	}

	let allPossible = creatureData.basicAttacks;
	allPossible = allPossible.concat(creatureData.offensiveActions);
	allPossible = allPossible.concat(creatureData.otherDefenses);
	allPossible = allPossible.concat(creatureData.passiveDefenses);

	for (var a in allPossible) {
		let actionData = allPossible[a];
		if (!("type" in actionData)) {
			actionData.type = "personal";
		}
		add_action_to_token(actionData, newNPCTokenID);
	}

	for (var s in creatureData.spellRules) {
		let spellSource = creatureData.spellRules[s];
		for (var sp in spellSource.spells) {
			let spellData = spellSource.spells[sp];
			add_action_to_token(spellData, newNPCTokenID);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData));
}

MTScript.registerMacro("ca.pf2e.create_npc", create_npc);