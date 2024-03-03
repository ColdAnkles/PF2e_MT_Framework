"use strict";

function parse_pathbuilder_export(data) {

	//let libToken = get_runtime("libToken");
	//let featLibrary = JSON.parse(libToken.getProperty("pf2e_feat"));
	//let actionLibrary = JSON.parse(libToken.getProperty("pf2e_action"));
	//let ancestryLibrary = JSON.parse(libToken.getProperty("pf2e_ancestry"));
	//let heritageLibrary = JSON.parse(libToken.getProperty("pf2e_heritage"));
	//let spellLibrary = JSON.parse(libToken.getProperty("pf2e_spell"));

	let featLibrary = JSON.parse(read_data("pf2e_feat"));
	let actionLibrary = JSON.parse(read_data("pf2e_action"));
	let ancestryLibrary = JSON.parse(read_data("pf2e_ancestry"));
	let heritageLibrary = JSON.parse(read_data("pf2e_heritage"));
	let spellLibrary = JSON.parse(read_data("pf2e_spell"));
	let itemLibrary = JSON.parse(read_data("pf2e_item"));

	let unfoundData = [];

	function find_object_data(objectName, searchSet = "all") {
		if (objectName == "Versatile Heritage") {
			objectName = "Versatile";
			searchSet = "heritage";
		}

		if (objectName == "Oil") {
			objectName = "Oil (1 pint)";
		}

		let testVar = objectName;
		let testCaps = capitalise(objectName);
		let testVar2 = testVar.replaceAll(" ", "-");
		let testCaps2 = capitalise(testVar2);
		let testVar3 = testVar.replaceAll(" ", "-") + " " + data.ancestry;
		let testCaps3 = capitalise(testVar3);
		let testVar4 = testVar + " Armor";
		let testCaps4 = capitalise(testVar4);

		if (testVar == "Darkvision") {
			parsedData.senses.push("darkvision");
			return;
		} else {
			if ((testVar in featLibrary || testCaps in featLibrary) && (searchSet == "all" || searchSet == "feat")) {
				return featLibrary[testVar];
			} else if ((testVar in actionLibrary || testCaps in actionLibrary) && (searchSet == "all" || searchSet == "action")) {
				return actionLibrary[testVar];
			} else if ((testVar in heritageLibrary || testCaps in heritageLibrary) && (searchSet == "all" || searchSet == "heritage")) {
				return heritageLibrary[testVar];
			} else if ((testVar2 in heritageLibrary || testCaps2 in heritageLibrary) && (searchSet == "all" || searchSet == "heritage")) {
				return heritageLibrary[testVar2];
			} else if ((testVar3 in heritageLibrary || testCaps3 in heritageLibrary) && (searchSet == "all" || searchSet == "heritage")) {
				return heritageLibrary[testVar3];
			} else if ((testVar in itemLibrary || testCaps in itemLibrary) && (searchSet == "all" || searchSet == "item")) {
				return itemLibrary[testVar];
			} else if ((testVar4 in itemLibrary || testCaps4 in itemLibrary) && (searchSet == "all" || searchSet == "item")) {
				return itemLibrary[testVar4];
			}
		}
		return null;
	}

	function setup_spell(spellName) {
		let fSpellData = null;
		if (spellName in spellLibrary) {
			fSpellData = spellLibrary[spellName];
			let spellBaseName = fSpellData.baseName;
			fSpellData = rest_call(fSpellData.fileURL);
			//MapTool.chat.broadcast(JSON.stringify(fSpellData));
			return parse_spell(spellBaseName, fSpellData);
		} else {
			let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
			if (!(spellName in remasterChanges) || !(remasterChanges[spellName] in spellLibrary)) {
				MapTool.chat.broadcast("Couldn't Find " + spellName);
				return null;
			} else {
				spellName = remasterChanges[spellName];
				fSpellData = spellLibrary[spellName];
				let spellBaseName = fSpellData.baseName;
				if ("fileURL" in fSpellData) {
					fSpellData = rest_call(fSpellData.fileURL);
				}
				return parse_spell(spellBaseName, fSpellData);
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(JSON.stringify(data.specials));
	let parsedData = {};

	message_window("Importing " + data.name, "Importing Basics");

	//__STATS__	
	parsedData.abilities = {};
	parsedData.abilities.str = Math.floor((data.abilities.str - 10) / 2);
	parsedData.abilities.dex = Math.floor((data.abilities.dex - 10) / 2);
	parsedData.abilities.con = Math.floor((data.abilities.con - 10) / 2);
	parsedData.abilities.int = Math.floor((data.abilities.int - 10) / 2);
	parsedData.abilities.wis = Math.floor((data.abilities.wis - 10) / 2);
	parsedData.abilities.cha = Math.floor((data.abilities.cha - 10) / 2);

	//__HEALTH__
	parsedData.hp = { "max": data.attributes.ancestryhp + ((data.attributes.classhp + parsedData.abilities.con) * data.level) + (data.attributes.bonushpPerLevel * data.level) + data.attributes.bonushp };

	//__OFFENSE__
	parsedData.offensiveActions = [];
	parsedData.basicAttacks = [];

	//__DEFENSES__
	parsedData.ac = { "value": data.acTotal.acTotal };
	parsedData.saves = { "fortitude": 0, "reflex": 0, "will": 0 };
	if (data.proficiencies.fortitude > 0) {
		parsedData.saves.fortitude = data.proficiencies.fortitude + data.level + parsedData.abilities.con;
	} else {
		parsedData.saves.fortitude = parsedData.abilities.con;
	}
	if (data.proficiencies.reflex > 0) {
		parsedData.saves.reflex = data.proficiencies.reflex + data.level + parsedData.abilities.dex;
	} else {
		parsedData.saves.reflex = parsedData.abilities.dex;
	}
	if (data.proficiencies.will > 0) {
		parsedData.saves.will = data.proficiencies.will + data.level + parsedData.abilities.wis;
	} else {
		parsedData.saves.will = parsedData.abilities.wis;
	}
	parsedData.immunities = [];
	parsedData.resistances = data.resistances;
	parsedData.weaknesses = [];
	parsedData.passiveDefenses = [];
	parsedData.otherDefenses = [];
	parsedData.resources = {};

	//__SKILLS__	
	let unarmedProf = 0;
	parsedData.skillList = [];
	for (var p in data.proficiencies) {
		if (data.proficiencies[p] != 0 && p != "fortitude" && p != "reflex" && p != "will") {
			let newProf = { "bonus": data.proficiencies[p] + data.level, "name": capitalise(p), "string": capitalise(p) + " " + pos_neg_sign(data.proficiencies[p] + data.level) };
			parsedData.skillList.push(newProf);
			if (p == "unarmed") {
				unarmedProf = newProf.bonus;
			}
		}
	}
	for (var l in data.lores) {
		let newProf = { "bonus": data.lores[l][1] + data.level + parsedData.abilities.int, "name": "Lore: " + data.lores[l][0], "string": "Lore: " + data.lores[l][0] + " " + pos_neg_sign(data.proficiencies[p] + data.level) };
		parsedData.skillList.push(newProf);
	}
	if (data.proficiencies.perception > 0) {
		parsedData.perception = data.proficiencies.perception + data.level + parsedData.abilities.wis;
	} else {
		parsedData.perception = parsedData.abilities.wis;
	}
	parsedData.passiveSkills = [];

	//__MAGIC__
	message_window("Importing " + data.name, "Importing Spellcasting");
	parsedData.spellRules = {};
	for (var i in data.spellCasters) {
		let castingData = data.spellCasters[i];
		let id = castingData.name;
		let newCastingRules = { "name": castingData.name, "spellAttack": 0, "spellDC": 0, "spells": [], "type": castingData.spellcastingType, "castingAbility": castingData.ability, "castLevels": [] }
		if (castingData.proficiency > 0) {
			newCastingRules.spellAttack = parsedData.abilities[castingData.ability] + castingData.proficiency + data.level;
		} else {
			newCastingRules.spellAttack = parsedData.abilities[castingData.ability];
		}
		newCastingRules.spellDC = 10 + newCastingRules.spellAttack;
		newCastingRules.totalSlots = castingData.perDay;
		newCastingRules.currentSlots = castingData.perDay;
		for (var l in castingData.spells) {
			let castLevel = castingData.spells[l].spellLevel;
			if (!(newCastingRules.castLevels.includes(castLevel))) {
				newCastingRules.castLevels.push(castLevel);
			}
			if (castLevel == 0) {
				castLevel = Math.max(1, Math.floor(data.level / 2))
			}
			for (var s in castingData.spells[l].list) {
				let spellName = castingData.spells[l].list[s];
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.castLevel = castLevel;
					newCastingRules.spells.push(spellData)
				}
			}
		}

		parsedData.spellRules[id] = newCastingRules;
		//MapTool.chat.broadcast(JSON.stringify(castingData));
		//MapTool.chat.broadcast(JSON.stringify(newCastingRules));
	}

	message_window("Importing " + data.name, "Importing Focus Spells");
	for (var i in data.focus) {
		for (var j in data.focus[i]) {
			let castingData = data.focus[i][j];
			//MapTool.chat.broadcast(JSON.stringify(castingData));
			let id = capitalise(i) + " " + capitalise(j) + " Focus";
			let newCastingRules = { "name": id, "spellAttack": 0, "spellDC": 0, "spells": [], "type": castingData.focus, "castingAbility": j }
			if (castingData.proficiency > 0) {
				newCastingRules.spellAttack = parsedData.abilities[j] + castingData.proficiency + data.level;
			} else {
				newCastingRules.spellAttack = parsedData.abilities[j];
			}
			newCastingRules.spellDC = 10 + newCastingRules.spellAttack;
			let focusLevel = Math.max(1, Math.floor(data.level / 2));
			for (var l in castingData.focusCantrips) {
				let spellName = castingData.focusCantrips[l].replaceAll(" (Amped)", "");
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.castLevel = focusLevel;
				}
				newCastingRules.spells.push(spellData)
			}
			for (var l in castingData.focusSpells) {
				let spellName = castingData.focusSpells[l].replaceAll(" (Amped)", "");
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.castLevel = focusLevel;
				}
				newCastingRules.spells.push(spellData)
			}

			parsedData.spellRules[id] = newCastingRules;
		}
	}

	if (data.focusPoints > 0) {
		parsedData.resources.focus = { "current": data.focusPoints, "max": data.focusPoints };
	}

	//__MISC__
	parsedData.name = data.name;
	parsedData.creatureType = data.ancestry;
	parsedData.alignment = data.alignment;
	parsedData.level = data.level;
	parsedData.senses = [];
	parsedData.speeds = { "base": data.attributes.speed, "other": [] };
	parsedData.rarity = "unique";
	parsedData.traits = [data.ancestry, data.class];
	parsedData.size = data.sizeName;
	parsedData.languages = data.languages;
	parsedData.itemList = {};
	parsedData.allFeatures = [];

	let features_to_parse = [];
	let featureNotes = {};
	for (var f in data.feats) {
		let tempData = find_object_data(data.feats[f][0]);
		if (tempData != null) {
			if (tempData.name == "Assurance") {
				if (!("assuranceChoices" in featureNotes)) {
					featureNotes.assuranceChoices = [];
				}
				featureNotes.assuranceChoices.push(data.feats[f][1].toLowerCase());
			}
			features_to_parse.push(tempData);
		} else {
			unfoundData.push(data.feats[f][0]);
		}
	}

	message_window("Importing " + data.name, "Importing Specials");
	for (var s in data.specials) {
		let tempName = data.specials[s];
		if (tempName == "") {
			continue;
		}
		tempName = tempName.replaceAll("Arcane School: ", "").replaceAll("Arcane Thesis: ", "");
		tempName = tempName.replaceAll(" Patron", "");
		if (tempName == "Aquatic Adaptation" && data.ancestry == "Lizardfolk") {
			tempName = "Aquatic Adaptation (Lizardfolk)";
		}
		if (tempName == "Spellbook") {
			continue; //Spellbook not treated as a feature in foundry
		}
		let tempData = find_object_data(tempName);
		if (tempData != null) {
			features_to_parse.push(tempData);
		} else {
			unfoundData.push(tempName);
		}
	}

	let grantedAttacks = [];
	for (var f in features_to_parse) {
		let featureData = features_to_parse[f];
		if ("fileURL" in featureData) {
			let addedFeature = parse_feature(featureData.baseName, rest_call(featureData.fileURL), parsedData);
			if (addedFeature != null && "rules" in addedFeature && addedFeature.rules != null && addedFeature.rules.length > 0) {
				//MapTool.chat.broadcast(JSON.stringify(addedFeature.rules));
				let newAttacks = rules_grant_attack(addedFeature.rules);
				for (var a in newAttacks) {
					let newAttack = newAttacks[a];
					for (var p in parsedData.skillList) {
						if (parsedData.skillList[p].name.toUpperCase() == newAttack.category.toUpperCase()) {
							newAttack.bonus = parsedData.skillList[p].bonus;
							break;
						}
					}
					newAttack.damage[0].damage = String(newAttack.damage[0].dice) + String(newAttack.damage[0].die) + ((Number(parsedData.abilities.str) != 0) ? "+" + Number(parsedData.abilities.str) : "");
				}
				grantedAttacks = grantedAttacks.concat(newAttacks);
			}
		}
	}
	parsedData.basicAttacks = parsedData.basicAttacks.concat(grantedAttacks);

	if ("assuranceChoices" in featureNotes) {
		let assuranceData = null;
		for (var s in parsedData.passiveSkills) {
			if (parsedData.passiveSkills[s].mainText == "Assurance") {
				assuranceData = parsedData.passiveSkills[s];
				break;
			}
		}
		if (assuranceData != null) {
			for (var r in assuranceData.rules) {
				let ruleData = assuranceData.rules[r];
				if (ruleData.key == "SubstituteRoll" || ruleData.key == "AdjustModifier") {
					ruleData.selector = featureNotes.assuranceChoices;
				}
			}
		}
	}

	if (parsedData.senses.length == 0) {
		parsedData.senses.push("normal");
	}

	//Armor
	message_window("Importing " + data.name, "Importing Armor");
	for (var a in data.armor) {
		let thisArmor = data.armor[a];
		let tempData = find_object_data(thisArmor.name, "item");
		if ("fileURL" in tempData) {
			parse_feature(tempData.baseName, rest_call(tempData.fileURL), parsedData);
			let trueID = tempData.id + String(Object.keys(parsedData.itemList).length - 1);
			parsedData.itemList[trueID].quantity = thisArmor.qty;
			parsedData.itemList[trueID].equipped = thisArmor.worn;
			parsedData.itemList[trueID].runes = { "property": [], "potency": ((thisArmor.pot == "") ? 0 : thisArmor.pot), "resilient": ((thisArmor.res == "") ? 0 : thisArmor.res) };
			for (var rI of thisArmor.runes) {
				let runeData = find_object_data(rI.replaceAll(" (Minor)", ""), "item");
				if (runeData != null && "fileURL" in runeData) {
					runeData = parse_feature(runeData.baseName, rest_call(runeData.fileURL), null);
					parsedData.itemList[trueID].runes.property.push(runeData);
				}
			}
			parsedData.itemList[trueID].id = trueID;
		} else if (tempData == null) {
			unfoundData.push(thisArmor.name);
		}
	}

	//Weapons
	message_window("Importing " + data.name, "Importing Weapons");
	for (var w in data.weapons) {
		let thisWeapon = data.weapons[w];
		let tempData = find_object_data(thisWeapon.name, "item");
		if (tempData != null) {
			if ("fileURL" in tempData) {
				let success = parse_feature(tempData.baseName, rest_call(tempData.fileURL), parsedData) != null;
				if (!success) {
					unfoundData.push(thisWeapon.name);
					continue;
				}
				let trueID = tempData.id + String(Object.keys(parsedData.itemList).length - 1);
				let newWeapon = parsedData.itemList[trueID];
				newWeapon.quantity = thisWeapon.qty;
				let newAttackData = {
					"actionCost": 1, "actionType": "action", "bonus": 0, "damage": [newWeapon.damage],
					"description": "", "effects": [], "isMelee": newWeapon.isMelee,
					"name": newWeapon.name, "traits": newWeapon.traits
				}
				if (thisWeapon.str == "striking") {
					thisWeapon.runes.striking = 1;
					newAttackData.damage[0].dice += 1;
				} else if (thisWeapon.str == "greaterStriking") {
					thisWeapon.runes.striking = 2;
					newAttackData.damage[0].dice += 2;
				} else if (thisWeapon.str == "majorStriking") {
					thisWeapon.runes.striking = 3;
					newAttackData.damage[0].dice += 3;
				}
				newAttackData.linkedWeapon = trueID;
				newAttackData.damage[0].damage = String(newAttackData.damage[0].dice) + newAttackData.damage[0].die + ((thisWeapon.damageBonus > 0) ? "+" + String(thisWeapon.damageBonus) : "");
				newWeapon.runes.potency = thisWeapon.pot;
				for (var rI of thisWeapon.runes) {
					let runeData = find_object_data(rI.replaceAll(" (Minor)", ""), "item");
					if (runeData != null && "fileURL" in runeData) {
						runeData = parse_feature(runeData.baseName, rest_call(runeData.fileURL), null);
						newWeapon.runes.property.push(runeData);
					}
				}
				if (thisWeapon.mat != null && thisWeapon.mat != "") {
					if (thisWeapon.mat.match(/([^\s]*) \((.*)\)/)) {
						let matParse = thisWeapon.mat.match(/([^\s]*) \((.*)\)/);
						newWeapon.material.type = matParse[1].toLowerCase();
						newWeapon.material.grade = matParse[2].toLowerCase();
					} else {
						newWeapon.material.type = thisWeapon.mat.toLowerCase();
					}
				}
				newWeapon.id = trueID;
				parsedData.basicAttacks.push(newAttackData);
			}
		} else {
			unfoundData.push(thisWeapon.name);
		}
	}

	let unarmedAttack = {
		"actionCost": 1, "actionType": "action", "bonus": unarmedProf, "damage": [{ "die": "d4", "dice": 1, "damageType": "bludgeoning" }],
		"description": "", "effects": [], "isMelee": true, "group": "",
		"name": "Fist", "traits": ["agile", "finesse", "nonlethal", "unarmed"], "linkedWeapon": "unarmed", "category": "unarmed", "type": "action"
	}
	unarmedAttack.damage[0].damage = String(unarmedAttack.damage[0].dice) + unarmedAttack.damage[0].die + ((Number(parsedData.abilities.str) != 0) ? "+" + Number(parsedData.abilities.str) : "");
	parsedData.basicAttacks.push(unarmedAttack);

	//Other Items
	message_window("Importing " + data.name, "Importing Gear");
	for (var e in data.equipment) {
		let eqName = data.equipment[e][0];
		let tempData = find_object_data(eqName, "item");
		if (tempData == null) {
			eqName = eqName.match(/([^\(\)]*) \(.*\)/);
			if (eqName.length > 1) {
				eqName = eqName[1];
				tempData = find_object_data(eqName, "item");
			} else {
				eqName = eqName[0];
				tempData = find_object_data(eqName, "item");
			}
		}
		if (tempData != null) {
			if ("fileURL" in tempData) {
				parse_feature(tempData.baseName, rest_call(tempData.fileURL), parsedData);
				let trueID = tempData.id + String(Object.keys(parsedData.itemList).length - 1);
				parsedData.itemList[trueID].quantity = data.equipment[e][1];
				parsedData.itemList[trueID].id = trueID;
				parsedData.itemList[trueID].equipped = true;
				if (eqName == "Handwraps of Mighty Blows") {
					let handwrapsLevels = { 0: { 0: 0 }, 1: { 0: 2, 1: 4 }, 2: { 1: 10, 2: 12 }, 3: { 2: 16, 3: 19 } };
					let handwrapsBonus = data.equipment[e][0].match(/\+([0-9])/);
					let handwrapsStrike = data.equipment[e][0].match(/((Minor|Major|Greater) )?(Striking)/);
					if (handwrapsBonus != null) {
						parsedData.itemList[trueID].runes.potency = handwrapsBonus[1];
						handwrapsBonus = handwrapsBonus[1];
					} else {
						handwrapsBonus = 0;
					}
					if (handwrapsStrike != null) {
						if (handwrapsStrike[2] == null) {
							parsedData.itemList[trueID].runes.striking = 1;
							handwrapsStrike = 1;
						} else if (handwrapsStrike[2] == "Greater") {
							parsedData.itemList[trueID].runes.striking = 2;
							handwrapsStrike = 2;
						} else if (handwrapsStrike[2] == "Major") {
							parsedData.itemList[trueID].runes.striking = 3;
							handwrapsStrike = 3;
						}
					} else {
						handwrapsStrike = 0;
					}
					parsedData.itemList[trueID].level = handwrapsLevels[handwrapsBonus][handwrapsStrike];
				}
			}
		} else {
			unfoundData.push(eqName);
		}
	}

	parsedData.pets = data.pets;
	parsedData.familiars = data.familiars;

	//Familiars
	message_window("Importing " + data.name, "Importing Familiars");
	for (var f in parsedData.familiars) {
		parsedData.familiars[f].familiarAbilities = [];
		for (var a in parsedData.familiars[f].abilities) {
			let ability = parsedData.familiars[f].abilities[a];
			let tempData = find_object_data(ability);
			if (tempData != null) {
				parsedData.familiars[f].familiarAbilities.push(tempData);
			} else if (ability != "Darkvision") {
				MapTool.chat.broadcast("Couldn't find familiar ability " + ability);
			} else {
				unfoundData.push(ability);
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(parsedData.itemList));

	if (unfoundData.length > 0) {
		message_window("Importing " + data.name, "<b>The following features/items could not be located/assigned.</b><br />" + unfoundData.join("<br />"));
	} else {
		close_message_window("Importing " + data.name);
	}
	return parsedData;
}

MTScript.registerMacro("ca.pf2e.parse_pathbuilder_export", parse_pathbuilder_export);