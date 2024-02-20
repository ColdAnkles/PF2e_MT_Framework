"use strict";

function parse_hazard(rawData, parseRaw = false) {
	if (parseRaw) {
		rawData = JSON.parse(rawData);
	}
	//MapTool.chat.broadcast(JSON.stringify(rawData));
	let hazardData = { "name": rawData.name, "description": rawData.system.details.description, "type": "hazard" };

	hazardData.level = rawData.system.details.level.value;
	hazardData.isComplex = rawData.system.details.isComplex;
	hazardData.disable = rawData.system.details.disable;
	hazardData.source = rawData.system.details.publication.title;
	hazardData.reset = rawData.system.details.reset;
	hazardData.routine = rawData.system.details.routine;
	hazardData.ac = rawData.system.attributes.ac.value;
	hazardData.maxHP = rawData.system.attributes.hp.max;
	hazardData.stealth = { "dc": rawData.system.attributes.stealth.value, "details": rawData.system.attributes.stealth.details };
	hazardData.hasHP = rawData.system.attributes.hasHealth;
	hazardData.hardness = rawData.system.attributes.hardness;
	hazardData.saves = { "fortitude": rawData.system.saves.fortitude.value, "reflex": rawData.system.saves.reflex.value, "will": rawData.system.saves.will.value };
	hazardData.rarity = rawData.system.traits.rarity;
	hazardData.traits = rawData.system.traits.value;
	hazardData.size = rawData.system.traits.size.value
	hazardData.size = { "sm": "small", "med": "medium", "huge": "huge", "lg": "large", "grg": "gargantuan", "tiny": "tiny" }[hazardData.size];

	if ("immunities" in rawData.system.attributes) {
		hazardData.immunities = rawData.system.attributes.immunities;
	} else {
		hazardData.immunities = [];
	}
	if ("weaknesses" in rawData.system.attributes) {
		hazardData.weaknesses = rawData.system.attributes.weaknesses;
	} else {
		hazardData.weaknesses = [];
	}
	if ("resistances" in rawData.system.attributes) {
		hazardData.resistances = rawData.system.attributes.resistances;
	} else {
		hazardData.resistances = [];
	}


	hazardData.skillList = [];
	hazardData.itemList = {};
	hazardData.passiveSkills = [];
	hazardData.passiveDefenses = [];
	hazardData.otherDefenses = [];
	hazardData.basicAttacks = [];
	hazardData.spellRules = {};
	hazardData.offensiveActions = [];

	if (hazardData.disable) {
		let disableAction = { "description": hazardData.disable, "mainText": "Disable", "name": "Disable", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.disable, "actionType": "passive", "actionCost": 0 };
		hazardData.passiveDefenses.push(disableAction);
	}
	if (hazardData.reset) {
		let resetAction = { "description": hazardData.reset, "mainText": "Reset", "name": "Reset", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.reset, "actionType": "passive", "actionCost": 0 };
		hazardData.passiveDefenses.push(resetAction);
	}
	if (hazardData.routine) {
		let routineAction = { "description": hazardData.routine, "mainText": "Routine", "name": "Routine", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.routine, "actionType": "passive", "actionCost": 0 };
		hazardData.passiveDefenses.push(routineAction);
	}

	for (var i in rawData.items) {
		let itemData = rawData.items[i];
		parse_feature(itemData.slug, itemData, hazardData);
	}

	hazardData.passiveDefenses = hazardData.passiveDefenses.concat(hazardData.passiveSkills);


	return hazardData;
}