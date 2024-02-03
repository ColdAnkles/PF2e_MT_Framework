"use strict";

function create_pc_token(newPCTokenID, pcLibID){

    let pcData = read_creature_properties(pcLibID)

	//__ADDING_STANDARD_MACROS
	add_common_macros(newPCTokenID);
	//__ADDING_ACTION_MACROS__
	add_common_action_macros(newPCTokenID);
	
	for (var s in pcData.speeds.other){
		let speedData = pcData.speeds.other[s];
		if(speedData.type=="fly"){
			add_action_to_token({"name":"Fly","actionType":"action","actionCount":1,"type":"basic","group":"Movement"},newPCTokenID)
		}else if (speedData.type=="burrow"){
			add_action_to_token({"name":"Burrow","actionType":"action","actionCount":1,"type":"basic","group":"Movement"},newPCTokenID)
		}
	}
	
	let allPossible = pcData.basicAttacks;
	allPossible = allPossible.concat(pcData.offensiveActions);
	allPossible = allPossible.concat(pcData.otherDefenses);
	allPossible = allPossible.concat(pcData.passiveDefenses);

	for (var a in allPossible){
		let actionData = allPossible[a];
		//actionData.type = "personal";
		add_action_to_token(actionData, newPCTokenID, pcData.level);
	}

	for (var s in pcData.spellRules){
		let spellSource = pcData.spellRules[s];
		for (var sp in spellSource.spells){
			let spellData = spellSource.spells[sp];
			add_action_to_token({"name":spellData.name,"actionType":"spell","type":"spell","group":spellSource.name,"castLevel":spellData.castLevel,"rawData":spellData,"traits":spellData.traits.value,"creatureLevel":pcData.level},newPCTokenID);
		}
	}
	
	update_my_tokens(pcLibID);
}

MTScript.registerMacro("ca.pf2e.create_pc_token", create_pc_token);
