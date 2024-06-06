"use strict";

function parse_npc(rawData, parseRaw = false) {
	let npcData = {};

	if (parseRaw) {
		rawData = JSON.parse(rawData);
	}

	//MapTool.chat.broadcast(JSON.stringify(rawData));

	npcData.type = "npc";
	npcData.name = rawData.name;
	npcData.level = rawData.system.details.level.value;
	npcData.ac = rawData.system.attributes.ac;
	npcData.hp = rawData.system.attributes.hp;
	npcData.foundryActor = rawData;
	//npcData.creatureType = rawData.system.details.creatureType;

	npcData.saves = { "fortitude": rawData.system.saves.fortitude.value, "reflex": rawData.system.saves.reflex.value, "will": rawData.system.saves.will.value };

	npcData.rarity = rawData.system.traits.rarity;
	if (rawData.system.traits.value.includes("good")) {
		npcData.alignment = "good"
	} else if (rawData.system.traits.value.includes("evil")) {
		npcData.alignment = "evil"
	} else {
		npcData.alignment = ""
	}
	npcData.size = rawData.system.traits.size.value;
	npcData.size = { "sm": "small", "med": "medium", "huge": "huge", "lg": "large", "grg": "gargantuan", "tiny": "tiny" }[npcData.size];
	npcData.traits = rawData.system.traits.value;

	npcData.perception = rawData.system.perception.mod;
	npcData.senses = [];
	for (var s in rawData.system.perception.senses) {
		npcData.senses.push(rawData.system.perception.senses[s].type);
	}
	if (npcData.senses.includes("low-light-vision")) {
		npcData.senses.push("low-light");
		var index = npcData.senses.indexOf("low-light-vision");
		if (index > -1) {
			npcData.senses.splice(index, 1);
		}
	}
	if (npcData.senses.length == 0) {
		npcData.senses.push("Normal");
	}

	npcData.source = rawData.system.details.publication.title;

	npcData.resources = rawData.system.resources;

	npcData.speeds = { "base": rawData.system.attributes.speed.value, "other": rawData.system.attributes.speed.otherSpeeds };

	npcData.languages = rawData.system.details.languages.value;
	if ("custom" in rawData.system.details.languages && rawData.system.details.languages.custom != "") {
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
	npcData.reactions = [];
	npcData.features = {};

	for (var i in rawData.items) {
		let itemData = rawData.items[i];
		if (itemData.type == "lore") {
			let newSkill = { "string": itemData.name + " +" + itemData.system.mod.value, "name": itemData.name, "bonus": itemData.system.mod.value };
			npcData.skillList.push(newSkill);
		} else if (itemData.type == "item" || itemData.type == "shield" || itemData.type == "weapon" || itemData.type == "armor" || itemData.type == "consumable") {
			npcData.itemList[itemData._id + String(Object.keys(npcData.itemList).length)] = itemData;
		} else if (itemData.type == "melee" || itemData.type == "ranged") {
			npcData.basicAttacks.push(itemData);
		} else if (itemData.type == "spellcastingEntry") {
			let newSpellEntry = { "name": itemData.name, "spells": [], "spellDC": itemData.system.spelldc.dc, "spellAttack": itemData.system.spelldc.value, "type": itemData.system.prepared.value }
			if ("autoHeightenLevel" in itemData.system && "value" in itemData.system.autoHeightenLevel && itemData.system.autoHeightenLevel.value != null) {
				newSpellEntry["autoHeighten"] = itemData.system.autoHeightenLevel.value
			} else {
				newSpellEntry["autoHeighten"] = Math.ceil(npcData.level / 2);
			}
			npcData.spellRules[itemData._id] = newSpellEntry;
		} else if (itemData.type == "spell") {
			if (itemData.system.traits.value.includes("cantrip") || itemData.system.traits.value.includes("focus")) {
				itemData.system.castLevel = { "value": npcData.spellRules[itemData.system.location.value].autoHeighten };
			} else {
				itemData.system.castLevel = itemData.system.level;
			}
			itemData.system.actionType = { "value": "spell" };
			itemData.system.group = { "value": npcData.spellRules[itemData.system.location.value].name };
			itemData.system.creatureLevel = { "value": npcData.level };
			npcData.spellRules[itemData.system.location.value].spells.push(itemData);
		} else {
			npcData.features[itemData.name] = itemData;
		}
	}

	for (var t in npcData.traits) {
		let traitInherit = trait_inheritance(npcData.traits[t]);
		if (!("immunities" in rawData.system.attributes)) {
			rawData.system.attributes["immunities"] = [];
		}
		if (!("resistances" in rawData.system.attributes)) {
			rawData.system.attributes.resistances = [];
		}
		if (!("weaknesses" in rawData.system.attributes)) {
			rawData.system.attributes.weaknesses = [];
		}
		rawData.system.attributes.immunities = rawData.system.attributes.immunities.concat(traitInherit.immunities);
		rawData.system.attributes.resistances = rawData.system.attributes.resistances.concat(traitInherit.resistances);
		rawData.system.attributes.weaknesses = rawData.system.attributes.weaknesses.concat(traitInherit.weaknesses);
	}

	npcData.immunities = rawData.system.attributes.immunities;
	npcData.resistances = rawData.system.attributes.resistances;
	npcData.weaknesses = rawData.system.attributes.weaknesses;

	//MapTool.chat.broadcast(JSON.stringify(npcData.passiveSkills));
	//Fix for Casting Format Change
	let oldNPCCasting = npcData.spellRules;
	npcData.spellRules = {};
	for (var key in oldNPCCasting) {
		let castData = oldNPCCasting[key];
		npcData.spellRules[castData.name] = castData;
	}

	for (var f in npcData.features) {
		let featureData = npcData.features[f];
		//MapTool.chat.broadcast(JSON.stringify(featureData));
		if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "passive" && featureData.system.category != "offensive") {
			if (featureData.system.description.value.length < 100 && featureData.system.category == "defensive" && !featureData.system.description.value.includes("@")) {
				npcData.passiveDefenses.push(featureData);
			} else {
				npcData.passiveSkills.push(featureData);
			}
		} else if (("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "action") || featureData.system.category == "offensive") {
			npcData.offensiveActions.push(featureData);
		} else if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "reaction") {
			npcData.reactions.push(featureData);
		}
	}

	return npcData;
}

MTScript.registerMacro("ca.pf2e.parse_npc", parse_npc);