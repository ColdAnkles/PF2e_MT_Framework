"use strict";

function create_hazard(newHazardID, hazardName) {
	let newToken = MapTool.tokens.getTokenByID(newHazardID);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_npc"));
	let property = JSON.parse(read_data("pf2e_hazard"));
	let hazardData = property[hazardName];
	try{
		if ("fileURL" in hazardData) {
			hazardData = rest_call(hazardData["fileURL"], "");
		}
		hazardData = parse_hazard(hazardData);
	} catch (e) {
		MapTool.chat.broadcast("Error in create_hazard during parse");
		MapTool.chat.broadcast("hazardData: " + JSON.stringify(hazardData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	write_hazard_properties(hazardData, newToken);

	let allPossible = hazardData.basicAttacks;
	allPossible = allPossible.concat(hazardData.offensiveActions);
	allPossible = allPossible.concat(hazardData.otherDefenses);
	allPossible = allPossible.concat(hazardData.passiveDefenses);
	allPossible = allPossible.concat(hazardData.reactions);

	for (var a in allPossible) {
		let actionData = allPossible[a];
		actionData.type = "personal";
		add_action_to_token(actionData, newHazardID);
	}

	for (var s in hazardData.spellRules) {
		let spellSource = hazardData.spellRules[s];
		for (var sp in spellSource.spells) {
			let spellData = spellSource.spells[sp];
			add_action_to_token({ "name": spellData.name, "actionType": "spell", "type": "spell", "group": spellSource.name, "castLevel": spellData.castLevel, "rawData": spellData, "traits": spellData.traits.value, "creatureLevel": hazardData.level }, newHazardID);
		}
	}

	createMacro({ "label": "Character Sheet", "playerEditable": 0, "command": "[r: ca.pf2e.Hazard_View_Frame(json.set(\"{}\",\"name\",getName(),\"tokenID\",myID))]", "tooltip": "View Character Sheet", "sortBy": "", "group": "Common" }, newHazardID);
}

MTScript.registerMacro("ca.pf2e.create_hazard", create_hazard);