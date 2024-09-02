"use strict";

function parse_npc(rawData, parseRaw = false, variant = "normal") {
	let npcData = {};

	if (parseRaw) {
		rawData = JSON.parse(rawData);
	}

	//Weak and Elite Variances TODO: Other Offensive Abilities DC, Damage, and Modifiers.
	if (variant != "normal") {
		let initialLevel = rawData.system.details.level.value;
		npcData.specialEffects = {};
		if (variant == "elite") {
			rawData.name = "Elite " + rawData.name;
			if (initialLevel <= 0) {
				rawData.system.details.level.value += 2;
			} else {
				rawData.system.details.level.value += 1;
			}
			if (initialLevel <= 1) {
				rawData.system.attributes.hp.max += 10;
			} else if (initialLevel >= 2 && initialLevel <= 4) {
				rawData.system.attributes.hp.max += 15;
			} else if (initialLevel >= 5 && initialLevel <= 19) {
				rawData.system.attributes.hp.max += 20;
			} else if (initialLevel >= 20) {
				rawData.system.attributes.hp.max += 30;
			}
			rawData.system.attributes.ac.value += 2;
			for (var save in rawData.system.saves) {
				rawData.system.saves[save].value += 2;
			}
			rawData.system.perception.mod += 2;
			for (var skill in rawData.system.skills) {
				rawData.system.skills[skill].base += 2;
			}
			for (var i in rawData.items) {
				let itemData = rawData.items[i];
				if (itemData.type == "melee" || itemData.type == "ranged") {
					itemData.system.bonus.value += 2;
					for (var d in itemData.system.damageRolls) {
						let damageData = itemData.system.damageRolls[d];
						damageData.damage = group_dice(damageData.damage + "+2");
						break; //only adds the +2 once
					}
				} else if (itemData.type == "spellcastingEntry") {
					itemData.system.spelldc.dc += 2;
					itemData.system.spelldc.value += 2;
					itemData.system.description.value = "+4 dmg";
				}
			}
			rawData.variant = "elite";
			npcData.variant = "elite";
			} else if (variant == "weak") {
			rawData.name = "Weak " + rawData.name;
			if (initialLevel == 1) {
				rawData.system.details.level.value -= 2;
			} else {
				rawData.system.details.level.value -= 1;
			}
			if (initialLevel >= 1 && initialLevel <= 2) {
				rawData.system.attributes.hp.max -= 10;
			} else if (initialLevel >= 3 && initialLevel <= 5) {
				rawData.system.attributes.hp.max -= 15;
			} else if (initialLevel >= 6 && initialLevel <= 20) {
				rawData.system.attributes.hp.max -= 20;
			} else if (initialLevel >= 21) {
				rawData.system.attributes.hp.max -= 30;
			}
			rawData.system.attributes.ac.value -= 2;
			for (var save in rawData.system.saves) {
				rawData.system.saves[save].value -= 2;
			}
			rawData.system.perception.mod -= 2;
			for (var skill in rawData.system.skills) {
				rawData.system.skills[skill].base -= 2;
			}
			for (var i in rawData.items) {
				let itemData = rawData.items[i];
				if (itemData.type == "melee" || itemData.type == "ranged") {
					itemData.system.bonus.value -= 2;
					for (var d in itemData.system.damageRolls) {
						let damageData = itemData.system.damageRolls[d];
						damageData.damage = group_dice(damageData.damage + "-2");
						break; //only adds the -2 once
					}
				} else if (itemData.type == "spellcastingEntry") {
					itemData.system.spelldc.dc -= 2;
					itemData.system.spelldc.value -= 2;
					itemData.system.description.value = "-4 dmg";
				}
			}
			rawData.variant = "weak";
			npcData.variant = "weak";
		}
	} else {
		rawData.variant = "normal";
		npcData.variant = "normal";
	}

	//MapTool.chat.broadcast(JSON.stringify(rawData));

	try {
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


		npcData.source = rawData.system.details.publication.title;

		npcData.resources = rawData.system.resources;
		if (rawData.type == "npc") {
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

			npcData.speeds = { "base": rawData.system.attributes.speed.value, "other": rawData.system.attributes.speed.otherSpeeds };

			npcData.languages = rawData.system.details.languages.value;
			if ("custom" in rawData.system.details.languages && rawData.system.details.languages.custom != "") {
				npcData.languages.push(rawData.system.details.languages.custom);
			}
			npcData.perception = rawData.system.perception.mod;
			npcData.abilities = {};
			npcData.abilities.str = rawData.system.abilities.str.mod;
			npcData.abilities.dex = rawData.system.abilities.dex.mod;
			npcData.abilities.con = rawData.system.abilities.con.mod;
			npcData.abilities.int = rawData.system.abilities.int.mod;
			npcData.abilities.wis = rawData.system.abilities.wis.mod;
			npcData.abilities.cha = rawData.system.abilities.cha.mod;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_npc during basic-step");
		MapTool.chat.broadcast("rawData: " + JSON.stringify(rawData));
		MapTool.chat.broadcast("npcData: " + JSON.stringify(npcData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	npcData.proficiencies = [];
	for (var s in rawData.system.skills) {
		let prof = rawData.system.skills[s].base;
		npcData.proficiencies.push({ "string": capitalise(s) + " +" + prof, "name": s, "bonus": prof });
	}

	npcData.inventory = {};
	npcData.passiveSkills = [];
	npcData.passiveDefenses = [];
	npcData.otherDefenses = [];
	npcData.basicAttacks = [];
	npcData.spellRules = {};
	if ("spellcasting" in rawData.system && "rituals" in rawData.system.spellcasting) {
		npcData.spellRules.rituals = { "name": "Rituals", "spells": [], "spellDC": rawData.system.spellcasting.rituals.dc, "spellAttack": 0, "type": "ritual" };
	}
	npcData.offensiveActions = [];
	npcData.features = {};

	let errorItem = null;
	try {
		for (var i in rawData.items) {
			let itemData = rawData.items[i];
			errorItem = itemData;
			parse_item(itemData, npcData);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_npc during items-step");
		MapTool.chat.broadcast("npcData: " + JSON.stringify(npcData));
		MapTool.chat.broadcast("rawData: " + JSON.stringify(rawData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(errorItem));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
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
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during traits-step");
		MapTool.chat.broadcast("npcData: " + JSON.stringify(npcData));
		MapTool.chat.broadcast("rawData: " + JSON.stringify(rawData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
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

	try {
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
				npcData.otherDefenses.push(featureData);
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_npc during features-step");
		MapTool.chat.broadcast("npcData: " + JSON.stringify(npcData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}


	return npcData;
}

MTScript.registerMacro("ca.pf2e.parse_npc", parse_npc);