"use strict";

function read_creature_properties(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
		if (token == null) {
			MapTool.chat.broadcast("Couldn't find token!");
		}
	}

	let creatureData = { "name": token.getName(), "hp": { "max": 0, "details": "" }, "abilities": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 }, "ac": { "value": 0, "details": "" }, "saves": { "fortitude": 0, "reflex": 0, "will": 0 }, "speeds": { "base": null, "other": null } };

	//__STATS__
	for (var s in creatureData.abilities) {
		creatureData.abilities[s] = token.getProperty(s);
	}

	//__HEALTH__
	creatureData.hp.max = token.getProperty("MaxHP");

	//__OFFENSE__
	creatureData.basicAttacks = JSON.parse(token.getProperty("basicAttacks"));
	creatureData.offensiveActions = JSON.parse(token.getProperty("offensiveActions"));

	//__DEFENSES__
	creatureData.ac.value = token.getProperty("AC");
	for (var s in creatureData.saves) {
		creatureData.saves[s] = token.getProperty(s);
	}
	creatureData.weaknesses = JSON.parse(token.getProperty("weaknesses"));
	creatureData.resistances = JSON.parse(token.getProperty("resistances"));
	creatureData.immunities = JSON.parse(token.getProperty("immunities"));
	creatureData.otherDefenses = JSON.parse(token.getProperty("otherDefenses"));
	creatureData.passiveDefenses = JSON.parse(token.getProperty("passiveDefenses"));

	//__SKILLS__
	creatureData.skillList = JSON.parse(token.getProperty("proficiencies"));
	creatureData.perception = token.getProperty("perception");
	creatureData.passiveSkills = JSON.parse(token.getProperty("passiveSkills"));

	//__MAGIC__
	creatureData.spellRules = JSON.parse(token.getProperty("spellRules"));

	//__MISC__
	creatureData.creatureType = token.getProperty("type");
	creatureData.level = token.getProperty("level");
	creatureData.alignment = token.getProperty("alignment");
	creatureData.speeds.base = token.getProperty("baseSpeed");
	creatureData.speeds.other = JSON.parse(token.getProperty("otherSpeed"));
	creatureData.rarity = token.getProperty("rarity");
	creatureData.traits = JSON.parse(token.getProperty("traits"));
	creatureData.senses = JSON.parse(token.getProperty("senses"));
	creatureData.size = token.getProperty("size");
	creatureData.languages = JSON.parse(token.getProperty("languages"));
	creatureData.resources = JSON.parse(token.getProperty("resources"));
	creatureData.itemList = JSON.parse(token.getProperty("inventory"));
	creatureData.pets = JSON.parse(token.getProperty("pets"));
	if (creatureData.pets == null) {
		creatureData.pets = {};
	}

	//__CALCULATION_DATA__
	creatureData.activeEffects = JSON.parse(token.getProperty("activeEffects"));
	creatureData.specialEffects = JSON.parse(token.getProperty("specialEffects"));
	creatureData.conditionDetails = JSON.parse(token.getProperty("conditionDetails"));
	creatureData.attacksThisRound = Number(token.getProperty("attacksThisRound"));
	creatureData.actionsLeft = Number(token.getProperty("actionsLeft"));
	creatureData.reactionsLeft = Number(token.getProperty("reactionsLeft"));

	if (creatureData.activeEffects == null) {
		creatureData.activeEffects = {};
	}
	if (creatureData.specialEffects == null) {
		creatureData.specialEffects = {};
	}
	if (creatureData.conditionDetails == null) {
		creatureData.conditionDetails = {};
	}
	if (creatureData.attacksThisRound == null) {
		creatureData.attacksThisRound = 0;
	}
	if (creatureData.actionsLeft == null) {
		creatureData.actionsLeft = 0;
	}
	if (creatureData.reactionsLeft == null) {
		creatureData.reactionsLeft = 0;
	}


	//MapTool.chat.broadcast(JSON.stringify(creatureData));
	return creatureData;

}

MTScript.registerMacro("ca.pf2e.read_creature_properties", read_creature_properties);