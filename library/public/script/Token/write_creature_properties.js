"use strict";

function write_creature_properties(creatureData, token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData));

	token.setName(creatureData.name);
	//__STATS__
	for (var s in creatureData.abilities) {
		token.setProperty(s, parseInt(creatureData.abilities[s]));
	}

	//__HEALTH__
	if ("current" in creatureData.hp) {
		token.setProperty("HP", parseInt(creatureData.hp.current));
	} else {
		token.setProperty("HP", parseInt(creatureData.hp.max));
	}
	token.setProperty("MaxHP", parseInt(creatureData.hp.max));
	if ("temp" in creatureData.hp && !isNaN(creatureData.hp.temp)) {
		token.setProperty("TempHP", parseInt(creatureData.hp.temp));
	} else {
		token.setProperty("TempHP", "0");
	}

	//__OFFENSE__
	token.setProperty("basicAttacks", JSON.stringify(creatureData.basicAttacks));
	token.setProperty("offensiveActions", JSON.stringify(creatureData.offensiveActions));

	//__DEFENSES__
	token.setProperty("AC", parseInt(creatureData.ac.value));
	for (var s in creatureData.saves) {
		token.setProperty(s, parseInt(creatureData.saves[s]));
		token.setProperty(s + "DC", parseInt(Number(creatureData.saves[s]) + 10));
	}
	token.setProperty("weaknesses", JSON.stringify(creatureData.weaknesses));
	token.setProperty("resistances", JSON.stringify(creatureData.resistances));
	token.setProperty("immunities", JSON.stringify(creatureData.immunities));
	token.setProperty("otherDefenses", JSON.stringify(creatureData.otherDefenses));
	token.setProperty("passiveDefenses", JSON.stringify(creatureData.passiveDefenses));

	//__SKILLS__
	token.setProperty("proficiencies", JSON.stringify(creatureData.skillList));
	token.setProperty("perception", parseInt(creatureData.perception));
	token.setProperty("passiveSkills", JSON.stringify(creatureData.passiveSkills));

	//__MAGIC__
	token.setProperty("spellRules", JSON.stringify(creatureData.spellRules));

	//__MISC__
	//token.setProperty("type", creatureData.creatureType);
	token.setProperty("alignment", creatureData.alignment);
	token.setProperty("level", parseInt(creatureData.level));
	token.setProperty("baseSpeed", parseInt(creatureData.speeds.base));
	token.setProperty("otherSpeed", JSON.stringify(creatureData.speeds.other));
	token.setProperty("rarity", creatureData.rarity);
	token.setProperty("traits", JSON.stringify(creatureData.traits));
	token.setProperty("senses", JSON.stringify(creatureData.senses));
	token.setProperty("size", creatureData.size);
	token.setProperty("languages", JSON.stringify(creatureData.languages));
	token.setProperty("resources", JSON.stringify(creatureData.resources));
	token.setProperty("inventory", JSON.stringify(creatureData.itemList));

	if ("pets" in creatureData && creatureData.pets != null) {
		token.setProperty("pets", JSON.stringify(creatureData.pets));
	}

	//__CALCULATION_DATA__
	if ("activeEffects" in creatureData && creatureData.activeEffects != null) {
		token.setProperty("activeEffects", JSON.stringify(creatureData.activeEffects));
	} else {
		token.setProperty("activeEffects", JSON.stringify({}));
	}
	if ("specialEffects" in creatureData && creatureData.specialEffects != null) {
		token.setProperty("specialEffects", JSON.stringify(creatureData.specialEffects));
	} else {
		token.setProperty("specialEffects", JSON.stringify({}));
	}
	if ("conditionDetails" in creatureData && creatureData.conditionDetails != null) {
		token.setProperty("conditionDetails", JSON.stringify(creatureData.conditionDetails));
	} else {
		token.setProperty("conditionDetails", JSON.stringify({}));
	}
	if ("attacksThisRound" in creatureData && creatureData.attacksThisRound != null) {
		token.setProperty("attacksThisRound", Number(creatureData.attacksThisRound));
	} else {
		token.setProperty("attacksThisRound", "0");
	}
	if ("actionsLeft" in creatureData && creatureData.actionsLeft != null) {
		token.setProperty("actionsLeft", Number(creatureData.actionsLeft));
	} else {
		token.setProperty("actionsLeft", "0");
	}
	if ("reactionsLeft" in creatureData && creatureData.reactionsLeft != null) {
		token.setProperty("reactionsLeft", Number(creatureData.reactionsLeft));
	} else {
		token.setProperty("reactionsLeft", "0");
	}
	if ("features" in creatureData && creatureData.features != null) {
		token.setProperty("features", JSON.stringify(creatureData.features));
	} else {
		token.setProperty("features", JSON.stringify([]));
	}

	if ("foundryActor" in creatureData && creatureData.foundryActor != null) {
		token.setProperty("foundryActor", JSON.stringify(creatureData.foundryActor));
	} else {
		token.setProperty("foundryActor", JSON.stringify({}));
	}

}

MTScript.registerMacro("ca.pf2e.write_creature_properties", write_creature_properties);
