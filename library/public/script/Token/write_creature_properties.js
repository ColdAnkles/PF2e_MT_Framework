"use strict";

function write_creature_properties(creatureData, token){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData.passiveSkills));
	
	token.setProperty("myID", token.getId());
	token.setName(creatureData.name);
	//__STATS__
	for (var s in creatureData.abilities){
		token.setProperty(s, creatureData.abilities[s]);
	}

	//__HEALTH__
	token.setProperty("HP", creatureData.hp.max);
	token.setProperty("MaxHP", creatureData.hp.max);

	//__OFFENSE__
	token.setProperty("basicAttacks", JSON.stringify(creatureData.basicAttacks));
	token.setProperty("offensiveActions", JSON.stringify(creatureData.offensiveActions));

	//__DEFENSES__
	token.setProperty("AC", creatureData.ac.value);
	for (var s in creatureData.saves){
		token.setProperty(s, creatureData.saves[s]);
		token.setProperty(s+"DC", creatureData.saves[s]+10);
	}
	token.setProperty("weaknesses", JSON.stringify(creatureData.weaknesses));
	token.setProperty("resistances", JSON.stringify(creatureData.resistances));
	token.setProperty("immunities", JSON.stringify(creatureData.immunities));
	token.setProperty("otherDefenses", JSON.stringify(creatureData.otherDefenses));
	token.setProperty("passiveDefenses", JSON.stringify(creatureData.passiveDefenses));

	//__SKILLS__
	token.setProperty("proficiencies", JSON.stringify(creatureData.skillList));
	token.setProperty("perception", creatureData.perception);
	token.setProperty("passiveSkills", JSON.stringify(creatureData.passiveSkills));

	//__MAGIC__
	token.setProperty("spellRules", JSON.stringify(creatureData.spellRules));

	//__MISC__
	token.setProperty("type", creatureData.creatureType);
	token.setProperty("alignment", creatureData.alignment);
	token.setProperty("level", creatureData.level);
	token.setProperty("baseSpeed", creatureData.speeds.base);
	token.setProperty("otherSpeed", JSON.stringify(creatureData.speeds.other));
	token.setProperty("rarity", creatureData.rarity);
	token.setProperty("traits", JSON.stringify(creatureData.traits));
	token.setProperty("senses", creatureData.senses);
	token.setProperty("size", creatureData.size);
	token.setProperty("languages", JSON.stringify(creatureData.languages));
	token.setProperty("resources", JSON.stringify(creatureData.resources));
	token.setProperty("inventory", JSON.stringify(creatureData.itemList));
}

MTScript.registerMacro("ca.pf2e.write_creature_properties", write_creature_properties);
