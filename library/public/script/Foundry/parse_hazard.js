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
	hazardData.stealth = { "dc": rawData.system.attributes.stealth.value + 10, "details": rawData.system.attributes.stealth.details };
	hazardData.hasHP = rawData.system.attributes.hasHealth;
	hazardData.hardness = rawData.system.attributes.hardness;
	hazardData.saves = { "fortitude": rawData.system.saves.fortitude.value, "reflex": rawData.system.saves.reflex.value, "will": rawData.system.saves.will.value };
	hazardData.rarity = rawData.system.traits.rarity;
	hazardData.traits = rawData.system.traits.value;
	hazardData.size = rawData.system.traits.size.value
	hazardData.size = { "sm": "small", "med": "medium", "huge": "huge", "lg": "large", "grg": "gargantuan", "tiny": "tiny" }[hazardData.size];
	hazardData.foundryActor = rawData;

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


	hazardData.proficiencies = [];
	hazardData.inventory = {};
	hazardData.passiveSkills = [];
	hazardData.passiveDefenses = [];
	hazardData.otherDefenses = [];
	hazardData.basicAttacks = [];
	hazardData.spellRules = {};
	hazardData.offensiveActions = [];
	hazardData.reactions = [];
	hazardData.features = {};

	//if (hazardData.disable) {
	//	let disableAction = { "description": hazardData.disable, "mainText": "Disable", "name": "Disable", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.disable, "actionType": "passive", "actionCost": 0 };
	//	hazardData.passiveDefenses.push(disableAction);
	//}
	//if (hazardData.reset) {
	//	let resetAction = { "description": hazardData.reset, "mainText": "Reset", "name": "Reset", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.reset, "actionType": "passive", "actionCost": 0 };
	//	hazardData.passiveDefenses.push(resetAction);
	//}
	//if (hazardData.routine) {
	//	let routineAction = { "description": hazardData.routine, "mainText": "Routine", "name": "Routine", "rarity": "common", "traits": "", "rules": [], "source": "", "subtext": hazardData.routine, "actionType": "passive", "actionCost": 0 };
	//	hazardData.passiveDefenses.push(routineAction);
	//}

	let errorItem = null;
	try {
		for (var i in rawData.items) {
			let itemData = rawData.items[i];
			errorItem = itemData;
			parse_item(itemData, hazardData);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_hazard during items-step");
		MapTool.chat.broadcast("hazardData: " + JSON.stringify(hazardData));
		MapTool.chat.broadcast("rawData: " + JSON.stringify(rawData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(errorItem));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var f in hazardData.features) {
			let featureData = hazardData.features[f];
			//MapTool.chat.broadcast(JSON.stringify(featureData));
			if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "passive" && featureData.system.category != "offensive") {
				if (featureData.system.description.value.length < 100 && featureData.system.category == "defensive" && !featureData.system.description.value.includes("@")) {
					hazardData.passiveDefenses.push(featureData);
				} else {
					hazardData.passiveSkills.push(featureData);
				}
			} else if (("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "action") || featureData.system.category == "offensive") {
				hazardData.offensiveActions.push(featureData);
			} else if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "reaction") {
				hazardData.passiveDefenses.push(featureData);
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_hazard during features-step");
		MapTool.chat.broadcast("hazardData: " + JSON.stringify(hazardData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	hazardData.passiveDefenses = hazardData.passiveDefenses.concat(hazardData.passiveSkills);


	return hazardData;
}