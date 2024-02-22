"use strict";

function parse_feature(featureName, feature, assignDict = null) {
	let itemData = feature;
	let simpleReturn = assignDict == null;
	itemData.baseName = featureName;
	let returnObject = null;
	//MapTool.chat.broadcast(JSON.stringify(itemData));
	//MapTool.chat.broadcast(String(simpleReturn));

	if (featureName != null && assignDict != null && "allFeatures" in assignDict && itemData.type == "feat") {
		assignDict.allFeatures.push(featureName);
	}

	if (itemData.type == "feat" || (itemData.type == "heritage" && "actionType" in itemData.system)) {
		itemData.type = "action";
	}

	if (itemData.type == "lore") {
		let newSkill = { "string": itemData.name + " +" + itemData.system.mod.value, "name": itemData.name, "bonus": itemData.system.mod.value };
		if (!simpleReturn) {
			assignDict.skillList.push(newSkill);
		}
		returnObject = newSkill;

	} else if (itemData.type == "weapon" || itemData.type == "armor" || itemData.type == "consumable" || itemData.type == "shield" || itemData.type == "treasure" || itemData.type == "equipment" || itemData.type == "backpack") {
		//MapTool.chat.broadcast(JSON.stringify(itemData));
		let newItem = { "name": itemData.name, "hardness": itemData.system.hardness, "hp": itemData.system.hp.max, "type": itemData.type, "id": itemData._id, "description": itemData.system.description.value, "level": itemData.system.level.value };
		if (itemData.type == "armor") {
			newItem.armorType = itemData.system.category;
			newItem.traits = itemData.system.traits.value;
			if (itemData.system.category == "shield") {
				newItem.acBonus = itemData.system.acBonus;
				newItem.armorType = "shield";
			}
			newItem.acBonus = itemData.system.acBonus;
			if ("checkPenalty" in itemData.system) {
				newItem.checkPenalty = itemData.system.checkPenalty;
			} else {
				newItem.checkPenalty = 0;
			}
			if ("speedPenalty" in itemData.system) {
				newItem.speedPenalty = itemData.system.speedPenalty;
			} else {
				newItem.speedPenalty = 0;
			}
			if ("dexCap" in itemData.system) {
				newItem.dexCap = itemData.system.dexCap;
			} else {
				newItem.dexCap = 999;
			}
			if ("strength" in itemData.system) {
				newItem.strReq = itemData.system.strength;
			} else {
				newItem.strReq = -999;
			}
		} else if (itemData.type == "weapon") {
			newItem.damage = itemData.system.damage;
			newItem.reload = itemData.system.reload;
			newItem.runes = itemData.system.runes;
			newItem.material = itemData.system.material;
			newItem.traits = itemData.system.traits.value;
			if (itemData.system.range == null) {
				newItem.isMelee = true;
			} else {
				newItem.isMelee = false;
			}
		}
		if ("potencyRune" in itemData.system && "value" in itemData.system.potencyRune) {
			newItem.potencyRune = itemData.system.potencyRune.value;
		}
		if ("strikingRune" in itemData.system && "value" in itemData.system.strikingRune) {
			newItem.strikingRune = itemData.system.strikingRune.value;
		}
		if ("quantity" in itemData.system) {
			newItem.quantity = itemData.system.quantity;
		} else {
			newItem.quantity = 1;
		}
		if (itemData.type != "armor" && itemData.type != "weapon" && itemData.type != "consumable") {
			itemData.type = "item";
		}
		newItem.source = itemData.system.publication.title;
		newItem.rarity = itemData.system.traits.rarity;
		newItem.baseItem = itemData.system.baseItem;
		newItem.equipped = false;
		if (!simpleReturn) {
			//Assign with a length number on the end in case multiple unique items with same ID
			assignDict.itemList[itemData._id + String(Object.keys(assignDict.itemList).length)] = newItem;
		}

		returnObject = newItem;

	} else if (itemData.type == "action" && ((itemData.system.category == "interaction" || itemData.system.category == "class") || (assignDict != null && assignDict.type != "npc")) && itemData.system.actionType.value == "passive" && itemData.system.rules.length > 0) {
		let tempString = clean_description(itemData.system.description.value)
		let newAction = { "mainText": itemData.name, "subText": tempString, "rules": itemData.system.rules, "description": tempString, "name": itemData.name, "actionType": "passive", "actionCost": 0 };
		newAction.source = itemData.system.publication.title;
		newAction.rarity = itemData.system.traits.rarity;
		newAction.traits = itemData.system.traits.value;
		newAction.baseName = itemData.baseName;
		if ("requirements" in itemData.system) {
			newAction.requirements = itemData.system.requirements;
		}
		if ("selfEffect" in itemData.system) {
			newAction.selfEffect = itemData.system.selfEffect;
		}
		if (!simpleReturn) {
			assignDict.passiveSkills.push(newAction);
		}

		returnObject = newAction;

	} else if (itemData.type == "action" && ((itemData.system.category == "defensive" || itemData.system.category == "interaction") || (assignDict != null && assignDict.type != "npc")) && itemData.system.actionType.value == "passive" && itemData.system.rules.length > 0 && "selector" in itemData.system.rules[0] && itemData.system.rules[0].selector == "saving-throw") {
		let tempString = clean_description(itemData.system.description.value)
		let newAction = { "mainText": itemData.name, "subText": tempString, "rules": itemData.system.rules, "actionType": "passive", "actionCost": 0, "description": tempString, "name": itemData.name };
		newAction.source = itemData.system.publication.title;
		newAction.rarity = itemData.system.traits.rarity;
		newAction.baseName = itemData.baseName;
		if ("requirements" in itemData.system) {
			itemData.requirements = itemData.system.requirements;
		}
		if ("selfEffect" in itemData.system) {
			newAction.selfEffect = itemData.system.selfEffect;
		}
		if (!simpleReturn) {
			assignDict.passiveDefenses.push(newAction);
		}

		returnObject = newAction;

	} else if (itemData.type == "action" && (itemData.system.category != null && (itemData.system.category == "defensive" || itemData.system.category == "general" || itemData.system.category.includes("class")) || (assignDict != null && assignDict.type != "npc"))) {
		let newAction = { "description": itemData.system.description.value, "name": itemData.name, "actionType": itemData.system.actionType.value, "actionCost": itemData.system.actions.value }
		newAction.traits = itemData.system.traits.value;
		newAction.rules = itemData.system.rules;
		newAction.baseName = itemData.baseName;
		if ("requirements" in itemData.system) {
			itemData.requirements = itemData.system.requirements;
		}
		newAction.type = "feat";
		if ("level" in itemData.system) {
			newAction.level = itemData.system.level.value;
		} else {
			newAction.level = 0;
		}
		if ("selfEffect" in itemData.system) {
			newAction.selfEffect = itemData.system.selfEffect;
		}
		newAction.source = itemData.system.publication.title;
		newAction.rarity = itemData.system.traits.rarity;
		if (!simpleReturn) {
			assignDict.otherDefenses.push(newAction);
		}

		returnObject = newAction;

	} else if (itemData.type == "melee") {
		//MapTool.chat.broadcast(JSON.stringify(itemData));
		let itemDescription = itemData.system.description.value;
		let newItem = { "name": itemData.name, "bonus": itemData.system.bonus.value, "damage": itemData.system.damageRolls, "traits": itemData.system.traits.value, "isMelee": (itemData.system.weaponType.value == "melee") }
		newItem.description = itemDescription;
		newItem.effects = itemData.system.attackEffects.value
		newItem.actionType = "action";
		newItem.actionCost = 1;
		newItem.source = itemData.system.publication.title;
		newItem.rarity = itemData.system.traits.rarity;
		newItem.baseName = itemData.baseName;
		if ("flags" in itemData && "pf2e" in itemData.flags && "linkedWeapon" in itemData.flags.pf2e) {
			newItem.linkedWeapon = itemData.flags.pf2e.linkedWeapon;
		}
		if (!simpleReturn) {
			assignDict.basicAttacks.push(newItem);
		}

		returnObject = newItem;

	} else if (itemData.type == "spellcastingEntry") {
		let newSpellEntry = { "name": itemData.name, "spells": [], "spellDC": itemData.system.spelldc.dc, "spellAttack": itemData.system.spelldc.value, "type": itemData.system.prepared.value }
		//MapTool.chat.broadcast(JSON.stringify(itemData));
		if ("autoHeightenLevel" in itemData.system && "value" in itemData.system.autoHeightenLevel && itemData.system.autoHeightenLevel.value != null) {
			newSpellEntry["autoHeighten"] = itemData.system.autoHeightenLevel.value
		} else {
			newSpellEntry["autoHeighten"] = 1;
		}
		//MapTool.chat.broadcast(JSON.stringify(newSpellEntry));
		if (!simpleReturn) {
			assignDict.spellRules[itemData._id] = newSpellEntry;
		}

		returnObject = newSpellEntry;

	} else if (itemData.type == "spell") {
		//MapTool.chat.broadcast(JSON.stringify(itemData));
		let newSpellEntry = parse_spell(itemData);
		//let newSpellEntry = {"name":itemData.name,"level":itemData.system.level.value,"traits":itemData.system.traits.value};
		if (itemData.system.traits.value.includes("cantrip")) {
			//MapTool.chat.broadcast(JSON.stringify(itemData));
			//MapTool.chat.broadcast(JSON.stringify(assignDict.spellRules[itemData.system.location.value]));
			newSpellEntry.castLevel = assignDict.spellRules[itemData.system.location.value].autoHeighten;
		} else {
			newSpellEntry.castLevel = newSpellEntry.level;
		}
		if (!simpleReturn) {
			if (itemData.system.location.value in assignDict.spellRules) {
				assignDict.spellRules[itemData.system.location.value].spells.push(newSpellEntry);
			}
		}

		returnObject = newSpellEntry;

	} else if (itemData.type == "action" && (itemData.system.category == "offensive" || (assignDict != null && assignDict.type != "npc"))) {
		let newAction = { "description": itemData.system.description.value, "name": itemData.name, "actionType": itemData.system.actionType.value, "actionCost": itemData.system.actions.value, "traits": itemData.system.traits.value };
		newAction.source = itemData.system.publication.title;
		newAction.rarity = itemData.system.traits.rarity;
		newAction.baseName = itemData.baseName;
		if (!simpleReturn) {
			assignDict.offensiveActions.push(newAction);
		}

		returnObject = newAction;

	} else if (itemData.type == "hazard") {
		let newItem = parse_hazard(itemData);

		returnObject = newItem;
	} else if (itemData.type == "effect") {
		let newEffect = { "name": itemData.name, "type": "effect" }
		newEffect.rules = itemData.system.rules;
		newEffect.level = itemData.system.level.value;
		newEffect.start = itemData.system.start;
		newEffect.traits = itemData.system.traits.value;
		newEffect.rarity = itemData.system.traits.rarity;
		newEffect.source = itemData.system.publication.title;
		newEffect.duration = itemData.system.duration;
		newEffect.description = itemData.system.description.value;
		newEffect.baseName = itemData.baseName;

		returnObject = newEffect;
	} else if (itemData.type == "condition") {
		let newCond = {}
		newCond.name = itemData.name;
		newCond.description = itemData.system.description.value;
		newCond.source = itemData.system.publication.title;
		newCond.overrides = itemData.system.overrides;
		newCond.rules = itemData.system.rules;
		newCond.value = itemData.system.value;
		newCond.baseName = itemData.baseName;

		returnObject = newCond;
	} else if (itemData.type == "action") {
		let newAction = { "description": itemData.system.description.value, "name": itemData.name, "actionType": itemData.system.actionType.value, "actionCost": itemData.system.actions.value, "traits": itemData.system.traits.value };
		newAction.source = itemData.system.publication.title;
		newAction.rarity = itemData.system.traits.rarity;
		newAction.baseName = itemData.baseName;

		returnObject = newAction;
	} else {
		//MapTool.chat.broadcast(JSON.stringify(itemData));
	}

	return returnObject;
}
