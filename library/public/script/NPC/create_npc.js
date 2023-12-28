"use strict";

function create_npc(newNPCTokenID, creatureName){
	let newToken = MapTool.tokens.getTokenByID(newNPCTokenID);
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_npc"));
	let creatureData = property[creatureName];
	creatureData = rest_call(creatureData["fileURL"],"");
	creatureData = parse_npc(creatureData);

	write_creature_properties(creatureData, newToken);

	//__ADDING_ACTION_MACROS__
	add_common_action_macros(newNPCTokenID);
	
	for (var s in creatureData.speeds.other){
		let speedData = creatureData.speeds.other[s];
		if(speedData.type=="fly"){
			add_action_to_token({"name":"Fly","actionType":"action","actionCount":1,"type":"basic","group":"Movement"},newNPCTokenID)
		}else if (speedData.type=="burrow"){
			add_action_to_token({"name":"Burrow","actionType":"action","actionCount":1,"type":"basic","group":"Movement"},newNPCTokenID)
		}
	}
	
	let allPossible = creatureData.basicAttacks;
	allPossible = allPossible.concat(creatureData.offensiveActions);
	allPossible = allPossible.concat(creatureData.otherDefenses);
	allPossible = allPossible.concat(creatureData.passiveDefenses);

	for (var a in allPossible){
		let actionData = allPossible[a];
		actionData.type = "personal";
		add_action_to_token(actionData, newNPCTokenID);
	}

	for (var s in creatureData.spellRules){
		let spellSource = creatureData.spellRules[s];
		for (var sp in spellSource.spells){
			let spellData = spellSource.spells[sp];
			add_action_to_token({"name":spellData.name,"actionType":"spell","type":"spell","group":spellSource.name,"castLevel":spellData.castLevel,"rawData":spellData,"traits":spellData.traits.value,"creatureLevel":creatureData.level},newNPCTokenID);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData));
}

MTScript.registerMacro("ca.pf2e.create_npc", create_npc);