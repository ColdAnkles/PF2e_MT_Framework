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
	try {
		for (var s in creatureData.abilities) {
			creatureData.abilities[s] = token.getProperty(s);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during abilities");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__HEALTH__
	try {
		creatureData.hp.max = Number(token.getProperty("MaxHP"));
		creatureData.hp.current = Number(token.getProperty("HP"));
		creatureData.hp.temp = Number(token.getProperty("TempHP"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during health");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__OFFENSE__
	try {
		creatureData.basicAttacks = JSON.parse(token.getProperty("basicAttacks"));
		creatureData.offensiveActions = JSON.parse(token.getProperty("offensiveActions"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during offense");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__DEFENSES__
	try {
		creatureData.ac.value = token.getProperty("AC");
		for (var s in creatureData.saves) {
			creatureData.saves[s] = token.getProperty(s);
		}
		creatureData.weaknesses = JSON.parse(token.getProperty("weaknesses"));
		creatureData.resistances = JSON.parse(token.getProperty("resistances"));
		creatureData.immunities = JSON.parse(token.getProperty("immunities"));
		creatureData.otherDefenses = JSON.parse(token.getProperty("otherDefenses"));
		creatureData.passiveDefenses = JSON.parse(token.getProperty("passiveDefenses"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during defenses");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__SKILLS__
	try {
		creatureData.proficiencies = JSON.parse(token.getProperty("proficiencies"));
		creatureData.perception = token.getProperty("perception");
		creatureData.passiveSkills = JSON.parse(token.getProperty("passiveSkills"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during skills");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__MAGIC__
	try {
		creatureData.spellRules = JSON.parse(token.getProperty("spellRules"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during magic");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__MISC__
	let step = "none"
	try {
		step = "type"
		creatureData.creatureType = token.getProperty("type");
		step = "level"
		creatureData.level = token.getProperty("level");
		step = "alignment"
		creatureData.alignment = token.getProperty("alignment");
		step = "baseSpeed"
		creatureData.speeds.base = token.getProperty("baseSpeed");
		step = "otherSpeed"
		creatureData.speeds.other = JSON.parse(token.getProperty("otherSpeed"));
		step = "rarity"
		creatureData.rarity = token.getProperty("rarity");
		step = "traits"
		creatureData.traits = JSON.parse(token.getProperty("traits"));
		step = "senses"
		creatureData.senses = JSON.parse(token.getProperty("senses"));
		step = "size"
		creatureData.size = token.getProperty("size");
		step = "languages"
		creatureData.languages = JSON.parse(token.getProperty("languages"));
		step = "resources"
		creatureData.resources = JSON.parse(token.getProperty("resources"));
		step = "inventory"
		creatureData.inventory = JSON.parse(token.getProperty("inventory"));
		step = "pets"
		creatureData.pets = token.getProperty("pets");
		if (creatureData.pets == null) {
			creatureData.pets = {};
		} else if (creatureData.pets == "") {
			creatureData.pets = {};
		} else {
			creatureData.pets = JSON.parse(creatureData.pets);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during misc");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("step: " + step);
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__CALCULATION_DATA__
	try {
		creatureData.activeEffects = JSON.parse(token.getProperty("activeEffects"));
		creatureData.specialEffects = JSON.parse(token.getProperty("specialEffects"));
		creatureData.conditionDetails = JSON.parse(token.getProperty("conditionDetails"));
		creatureData.attacksThisRound = Number(token.getProperty("attacksThisRound"));
		creatureData.actionsLeft = Number(token.getProperty("actionsLeft"));
		creatureData.reactionsLeft = Number(token.getProperty("reactionsLeft"));
		creatureData.features = JSON.parse(token.getProperty("features"));
		creatureData.foundryActor = JSON.parse(token.getProperty("foundryActor"));
	} catch (e) {
		MapTool.chat.broadcast("Error in read_creature_properties during calculation data");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

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
	if (creatureData.features == null) {
		creatureData.features = [];
	}
	if (creatureData.foundryActor == null) {
		creatureData.foundryActor = {};
	}


	//MapTool.chat.broadcast(JSON.stringify(creatureData));
	return creatureData;

}

MTScript.registerMacro("ca.pf2e.read_creature_properties", read_creature_properties);