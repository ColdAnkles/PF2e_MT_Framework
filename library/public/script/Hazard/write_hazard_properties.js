"use strict";

function write_hazard_properties(data, token) {
	//MapTool.chat.broadcast(JSON.stringify(data));
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
		if (token == null) {
			MapTool.chat.broadcast("Couldn't find token!");
		}
	}

	token.setName(data.name);

	//__HEALTH__
	token.setProperty("HP", data.maxHP);
	token.setProperty("MaxHP", data.maxHP);


	//__OFFENSE__
	token.setProperty("basicAttacks", JSON.stringify(data.basicAttacks));
	token.setProperty("offensiveActions", JSON.stringify(data.offensiveActions));

	//__DEFENSES__
	token.setProperty("AC", data.ac);
	for (var s in data.saves) {
		token.setProperty(s, data.saves[s]);
		token.setProperty(s + "DC", data.saves[s] + 10);
	}
	token.setProperty("weaknesses", JSON.stringify(data.weaknesses));
	token.setProperty("resistances", JSON.stringify(data.resistances));
	token.setProperty("immunities", JSON.stringify(data.immunities));
	token.setProperty("otherDefenses", JSON.stringify(data.otherDefenses));
	token.setProperty("passiveDefenses", JSON.stringify(data.passiveDefenses));

	token.setProperty("level", data.level);
	token.setProperty("stealth", JSON.stringify(data.stealth));
	token.setProperty("size", data.size);
	token.setProperty("disable", data.disable);
	token.setProperty("reset", data.reset);
	token.setProperty("routine", data.routine);
	token.setProperty("description", data.description);
	token.setProperty("isComplex", data.isComplex);
	token.setProperty("hardness", data.hardness);
	token.setProperty("traits", JSON.stringify(data.traits));

	if ("foundryActor" in data && data.foundryActor != null) {
		token.setProperty("foundryActor", JSON.stringify(data.foundryActor));
	} else {
		token.setProperty("foundryActor", JSON.stringify({}));
	}
	if ("activeEffects" in data && data.activeEffects != null) {
		token.setProperty("activeEffects", JSON.stringify(data.activeEffects));
	} else {
		token.setProperty("activeEffects", JSON.stringify({}));
	}
	if ("specialEffects" in data && data.specialEffects != null) {
		token.setProperty("specialEffects", JSON.stringify(data.specialEffects));
	} else {
		token.setProperty("specialEffects", JSON.stringify({}));
	}
	if ("conditionDetails" in data && data.conditionDetails != null) {
		token.setProperty("conditionDetails", JSON.stringify(data.conditionDetails));
	} else {
		token.setProperty("conditionDetails", JSON.stringify({}));
	}
	if ("passiveSkills" in data && data.passiveSkills != null) {
		token.setProperty("passiveSkills", JSON.stringify(data.passiveSkills));
	} else {
		token.setProperty("passiveSkills", JSON.stringify([]));
	}



}