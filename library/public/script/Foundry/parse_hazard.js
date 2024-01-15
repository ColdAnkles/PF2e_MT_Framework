"use strict";

function parse_hazard(rawData, parseRaw = false){    
	if (parseRaw){
		rawData = JSON.parse(rawData);
	}
    let hazardData = {"name":rawData.name, "description":rawData.system.details.description,"type":"hazard"};

	hazardData.level = rawData.system.details.level.value;
	hazardData.isComplex = rawData.system.details.isComplex;
	hazardData.disable = rawData.system.details.disable;
	hazardData.source = rawData.system.details.publication.title;
	hazardData.reset = rawData.system.details.reset;
	hazardData.routine = rawData.system.details.routine;
	hazardData.ac = rawData.system.attributes.ac.value;
    hazardData.maxHP = rawData.system.attributes.hp.max;
    hazardData.stealth = {"dc":rawData.system.attributes.stealth.value, "details":rawData.system.attributes.stealth.details};
    hazardData.hasHP = rawData.system.attributes.hasHealth;
    hazardData.hardness = rawData.system.attributes.hardness;
    hazardData.saves = {"fortitude":rawData.system.saves.fortitude.value,"reflex":rawData.system.saves.reflex.value,"will":rawData.system.saves.will.value};
    hazardData.rarity = rawData.system.traits.rarity;
    hazardData.traits = rawData.system.traits.value;
    hazardData.size = rawData.system.traits.size.value
	hazardData.size = {"sm":"small","med":"medium","huge":"huge","lg":"large","grg":"gargantuan","tiny":"tiny"}[hazardData.size];

    hazardData.skillList = [];
	hazardData.itemList = {};
	hazardData.passiveSkills = [];
	hazardData.passiveDefenses = [];
	hazardData.otherDefenses = [];
	hazardData.basicAttacks = [];
	hazardData.spellRules = {};
	hazardData.offensiveActions = [];
	
	for (var i in rawData.items){
		let itemData = rawData.items[i];
		parse_feature(itemData, hazardData);
	}

    return hazardData;
}