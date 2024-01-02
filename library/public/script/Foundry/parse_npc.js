"use strict";

function parse_npc(rawData, parseRaw = false){
	let npcData = {};
	
	if (parseRaw){
		rawData = JSON.parse(rawData);
	}

	//MapTool.chat.broadcast(JSON.stringify(rawData));

	npcData.type = "npc";
	npcData.name = rawData.name;
	npcData.level = rawData.system.details.level.value;
	npcData.ac = rawData.system.attributes.ac;
	npcData.hp = rawData.system.attributes.hp;
	//npcData.creatureType = rawData.system.details.creatureType;

	npcData.saves = {"fortitude":rawData.system.saves.fortitude.value,"reflex":rawData.system.saves.reflex.value,"will":rawData.system.saves.will.value};

	npcData.rarity = rawData.system.traits.rarity;
	if (rawData.system.traits.value.includes("good")){
		npcData.alignment = "good"
	}else if(rawData.system.traits.value.includes("evil")){
		npcData.alignment = "evil"
	}else{
		npcData.alignment = ""
	}
	npcData.size = rawData.system.traits.size.value;
	npcData.size = {"sm":"small","med":"medium","huge":"huge","lg":"large","grg":"gargantuan","tiny":"tiny"}[npcData.size];
	npcData.traits = rawData.system.traits.value;

	npcData.perception = rawData.system.perception.mod;
	npcData.senses = [];
	for (var s in rawData.system.perception.senses){
		npcData.senses.push(rawData.system.perception.senses[s].type);
	}
	
	npcData.source = rawData.system.details.publication.title;

	npcData.resources = rawData.system.resources;

	npcData.speeds = {"base":rawData.system.attributes.speed.value,"other":rawData.system.attributes.speed.otherSpeeds};

	npcData.languages = rawData.system.details.languages.value;
	if("custom" in rawData.system.details.languages && rawData.system.details.languages.custom != ""){
		npcData.languages.push(rawData.system.details.languages.custom);
	}
	npcData.abilities = {};
	npcData.abilities.str = rawData.system.abilities.str.mod;
	npcData.abilities.dex = rawData.system.abilities.dex.mod;
	npcData.abilities.con = rawData.system.abilities.con.mod;
	npcData.abilities.int = rawData.system.abilities.int.mod;
	npcData.abilities.wis = rawData.system.abilities.wis.mod;
	npcData.abilities.cha = rawData.system.abilities.cha.mod;
	
	npcData.skillList = [];
	npcData.itemList = {};
	npcData.passiveSkills = [];
	npcData.passiveDefenses = [];
	npcData.otherDefenses = [];
	npcData.basicAttacks = [];
	npcData.spellRules = {};
	npcData.offensiveActions = [];
	
	for (var i in rawData.items){
		let itemData = rawData.items[i];
		//MapTool.chat.broadcast(JSON.stringify(itemData));
		parse_feature(itemData, npcData);
	}

	for (var t in npcData.traits){
		let traitInherit = trait_inheritance(npcData.traits[t]);
		if (!("immunities" in rawData.system.attributes)){
			rawData.system.attributes["immunities"] = [];
		}
		if (!("resistances" in rawData.system.attributes)){
			rawData.system.attributes.resistances = [];
		}
		if (!("weaknesses" in rawData.system.attributes)){
			rawData.system.attributes.weaknesses = [];
		}
		rawData.system.attributes.immunities=rawData.system.attributes.immunities.concat(traitInherit.immunities);
		rawData.system.attributes.resistances=rawData.system.attributes.resistances.concat(traitInherit.resistances);
		rawData.system.attributes.weaknesses=rawData.system.attributes.weaknesses.concat(traitInherit.weaknesses);
	}

	npcData.immunities = rawData.system.attributes.immunities;
	npcData.resistances = rawData.system.attributes.resistances;
	npcData.weaknesses = rawData.system.attributes.weaknesses;

	//MapTool.chat.broadcast(JSON.stringify(npcData.passiveSkills));
	
	return npcData;
}

MTScript.registerMacro("ca.pf2e.parse_npc", parse_npc);