"use strict";

function write_creature_properties(creatureData, token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData));
	try {
		token.setName(creatureData.name);
		//__STATS__
		for (var s in creatureData.abilities) {
			token.setProperty(s, parseInt(creatureData.abilities[s]));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during name-abilities");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__HEALTH__
	try {
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
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during hp");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__OFFENSE__
	try {
		token.setProperty("basicAttacks", JSON.stringify(creatureData.basicAttacks));
		token.setProperty("offensiveActions", JSON.stringify(creatureData.offensiveActions));
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during offense");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__DEFENSES__
	try {
		token.setProperty("AC", parseInt(creatureData.ac.value));
		token.setProperty("saves", JSON.stringify(creatureData.saves));
		token.setProperty("weaknesses", JSON.stringify(creatureData.weaknesses));
		token.setProperty("resistances", JSON.stringify(creatureData.resistances));
		token.setProperty("immunities", JSON.stringify(creatureData.immunities));
		token.setProperty("otherDefenses", JSON.stringify(creatureData.otherDefenses));
		token.setProperty("passiveDefenses", JSON.stringify(creatureData.passiveDefenses));
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during defemses");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__SKILLS__
	try {
		token.setProperty("proficiencies", JSON.stringify(creatureData.proficiencies));
		token.setProperty("perception", parseInt(creatureData.perception));
		token.setProperty("passiveSkills", JSON.stringify(creatureData.passiveSkills));
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during skills");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__MAGIC__
	try {
		token.setProperty("spellRules", JSON.stringify(creatureData.spellRules));
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during magic");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__MISC__
	let step = "";
	try {
		//token.setProperty("type", creatureData.creatureType);
		//step = "alignment";
		//token.setProperty("alignment", creatureData.alignment);
		step = "level";
		token.setProperty("level", parseInt(creatureData.level));
		step = "baseSpeed";
		token.setProperty("baseSpeed", parseInt(creatureData.speeds.base));
		step = "otherSpeed";
		token.setProperty("otherSpeed", JSON.stringify(creatureData.speeds.other));
		step = "rarity";
		token.setProperty("rarity", creatureData.rarity);
		step = "traits";
		token.setProperty("traits", JSON.stringify(creatureData.traits));
		step = "senses";
		token.setProperty("senses", JSON.stringify(creatureData.senses));
		step = "size";
		token.setProperty("size", creatureData.size);
		step = "languages";
		token.setProperty("languages", JSON.stringify(creatureData.languages));
		step = "resources";
		token.setProperty("resources", JSON.stringify(creatureData.resources));
		step = "inventory";
		token.setProperty("inventory", JSON.stringify(creatureData.inventory));
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during misc");
		MapTool.chat.broadcast("step: " + step);
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("pets" in creatureData && creatureData.pets != null) {
			token.setProperty("pets", JSON.stringify(creatureData.pets));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error write_creature_properties during pets");
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
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
