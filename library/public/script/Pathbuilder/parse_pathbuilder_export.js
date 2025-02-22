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
	let classLibrary = JSON.parse(read_data("pf2e_class"));
	let ancestryLibrary = JSON.parse(read_data("pf2e_ancestry"));
	let heritageLibrary = JSON.parse(read_data("pf2e_heritage"));
	let spellLibrary = JSON.parse(read_data("pf2e_spell"));
	let itemLibrary = JSON.parse(read_data("pf2e_item"));

	let unfoundData = [];

	function matching_keys(arr, sub) {
		sub = sub.toLowerCase();
		return arr.filter(str => (str
			.toLowerCase()
			.startsWith(sub.slice(0, Math.max(str.length - 1, 1)) + "|") ? str : null) != null
		);
	}

	function find_object_data(objectName, searchSet = ["all"]) {
		try {
			if (objectName == "Versatile Heritage") {
				objectName = "Versatile";
				searchSet = "heritage";
			}

			if (objectName == "Oil") {
				objectName = "Oil (1 pint)";
			}

			let keyList = [];

			let libraryTypes = ["feat", "action", "heritage", "item", "class"]

			libraryTypes.forEach(libType => {
				if (searchSet.includes("all") || searchSet.includes(libType)) {
					keyList = eval("keyList.concat(Object.keys(" + libType + "Library))");
				}
			});

			keyList = matching_keys(keyList, objectName);

			if (keyList.length == 0) {
				return null;
			}

			objectName = keyList[0];

			let testVar = objectName;
			let testCaps = capitalise(objectName);
			let testVar2 = testVar.replaceAll(" ", "-");
			let testCaps2 = capitalise(testVar2);
			let testVar3 = testVar.replaceAll(" ", "-") + " " + data.ancestry;
			let testCaps3 = capitalise(testVar3);
			let testVar4 = testVar + " Armor";
			let testCaps4 = capitalise(testVar4);

			if (testVar == "Darkvision") {
				characterData.senses.push("darkvision");
				return;
			} else {
				if ((testVar in featLibrary || testCaps in featLibrary) && (searchSet.includes("all") || searchSet.includes("feat"))) {
					return featLibrary[testVar];
				} else if ((testVar in actionLibrary || testCaps in actionLibrary) && (searchSet.includes("all") || searchSet.includes("action"))) {
					return actionLibrary[testVar];
				} else if ((testVar in heritageLibrary || testCaps in heritageLibrary) && (searchSet.includes("all") || searchSet.includes("heritage"))) {
					return heritageLibrary[testVar];
				} else if ((testVar2 in heritageLibrary || testCaps2 in heritageLibrary) && (searchSet.includes("all") || searchSet.includes("heritage"))) {
					return heritageLibrary[testVar2];
				} else if ((testVar3 in heritageLibrary || testCaps3 in heritageLibrary) && (searchSet.includes("all") || searchSet.includes("heritage"))) {
					return heritageLibrary[testVar3];
				} else if ((testVar in itemLibrary || testCaps in itemLibrary) && (searchSet.includes("all") || searchSet.includes("item"))) {
					return itemLibrary[testVar];
				} else if ((testVar4 in itemLibrary || testCaps4 in itemLibrary) && (searchSet.includes("all") || searchSet.includes("item"))) {
					return itemLibrary[testVar4];
				} else if ((testVar in classLibrary || testCaps in classLibrary) && (searchSet.includes("all") || searchSet.includes("class"))) {
					return classLibrary[testVar];
				}
			}
			return null;
		} catch (e) {
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - find_object_data");
			MapTool.chat.broadcast("objectName: " + String(objectName));
			MapTool.chat.broadcast("searchSet: " + JSON.stringify(searchSet));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}

	function setup_spell(spellName) {
		let testSpellName = null;
		let fSpellData = null;
		try {
			let keyList = matching_keys(Object.keys(spellLibrary), spellName);
			if (keyList.length != 0) {
				testSpellName = keyList[0];
			}
			if (testSpellName in spellLibrary) {
				fSpellData = spellLibrary[testSpellName];
				if ("fileURL" in fSpellData) {
					let loadedData = rest_call(fSpellData.fileURL);
					loadedData.source = loadedData.system.publication.title;
					loadedData.rarity = loadedData.system.traits.rarity;
					loadedData.traits = loadedData.system.traits.value;
					loadedData.traditions = loadedData.system.traits.traditions;
					loadedData.level = loadedData.system.level.value;
					return loadedData
				} else {
					return fSpellData;
				}
			} else {
				let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;

				if (!(spellName in remasterChanges)) {
					MapTool.chat.broadcast("Couldn't Find " + spellName);
					return null;
				} else {
					spellName = remasterChanges[spellName];
					keyList = matching_keys(spellLibrary, spellName);
					if (keyList.length != 0) {
						testSpellName = keyList[0];
					}
					fSpellData = spellLibrary[testSpellName];
					if ("fileURL" in fSpellData) {
						let loadedData = rest_call(fSpellData.fileURL);
						loadedData.source = loadedData.system.publication.title;
						loadedData.rarity = loadedData.system.traits.rarity;
						loadedData.traits = loadedData.system.traits.value;
						loadedData.traditions = loadedData.system.traits.traditions;
						loadedData.level = loadedData.system.level.value;
						return loadedData
					} else {
						return fSpellData;
					}
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - find setup_spell");
			MapTool.chat.broadcast("testSpellName: " + testSpellName);
			MapTool.chat.broadcast("fSpellData: " + JSON.stringify(fSpellData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(JSON.stringify(data.specials));
	let characterData = {};

	message_window("Importing " + data.name, "Importing Basics");

	let classData = null;

	try {
		classData = find_object_data(data.class, ["class"]);
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - find class data");
		MapTool.chat.broadcast("class: " + JSON.stringify(data.class));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	if (classData == null) {
		message_window("Importing " + data.name, "Could Not Find Class");
	}

	if ("fileURL" in classData) {
		try {
			classData = rest_call(classData.fileURL);
		} catch (e) {
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - retrieve class data");
			MapTool.chat.broadcast("classData: " + JSON.stringify(classData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}

	characterData.foundryActor = { "name": data.name, "flags": {}, "system": {} };

	//__STATS__	
	try {
		characterData.abilities = {};
		characterData.abilities.str = Math.floor((data.abilities.str - 10) / 2);
		characterData.abilities.dex = Math.floor((data.abilities.dex - 10) / 2);
		characterData.abilities.con = Math.floor((data.abilities.con - 10) / 2);
		characterData.abilities.int = Math.floor((data.abilities.int - 10) / 2);
		characterData.abilities.wis = Math.floor((data.abilities.wis - 10) / 2);
		characterData.abilities.cha = Math.floor((data.abilities.cha - 10) / 2);
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - Stats setup");
		MapTool.chat.broadcast("abilities: " + JSON.stringify(data.abilities));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__HEALTH__
	try {
		characterData.hp = { "max": data.attributes.ancestryhp + ((data.attributes.classhp + characterData.abilities.con) * data.level) + (data.attributes.bonushpPerLevel * data.level) + data.attributes.bonushp };
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - HP setup");
		MapTool.chat.broadcast("attributes: " + JSON.stringify(data.attributes));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//__OFFENSE__
	characterData.offensiveActions = [];
	characterData.basicAttacks = [];

	//__DEFENSES__
	characterData.ac = { "value": data.acTotal.acTotal };
	try {
		characterData.saves = { "fortitude": 0, "reflex": 0, "will": 0 };
		if (data.proficiencies.fortitude > 0) {
			characterData.saves.fortitude = data.proficiencies.fortitude + data.level + characterData.abilities.con;
		} else {
			characterData.saves.fortitude = characterData.abilities.con;
		}
		if (data.proficiencies.reflex > 0) {
			characterData.saves.reflex = data.proficiencies.reflex + data.level + characterData.abilities.dex;
		} else {
			characterData.saves.reflex = characterData.abilities.dex;
		}
		if (data.proficiencies.will > 0) {
			characterData.saves.will = data.proficiencies.will + data.level + characterData.abilities.wis;
		} else {
			characterData.saves.will = characterData.abilities.wis;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - saves setup");
		MapTool.chat.broadcast("saves: " + JSON.stringify(data.proficiencies));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	characterData.immunities = [];
	characterData.resistances = [];

	try {
		for (var r in data.resistances) {
			let resString = data.resistances[r].split(" ");
			characterData.resistances.push({ "type": resString[0], "value": Number(resString[1]) })
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - resistances setup");
		MapTool.chat.broadcast("resistances: " + JSON.stringify(data.resistances));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	characterData.weaknesses = [];
	characterData.passiveDefenses = [];
	characterData.otherDefenses = [];
	characterData.passiveSkills = [];
	characterData.rections = [];
	characterData.resources = {};

	message_window("Importing " + data.name, "Importing Skills");

	//__SKILLS__	
	let unarmedProf = 0;
	characterData.proficiencies = [];
	for (var p in data.proficiencies) {
		if (data.proficiencies[p] != 0 && p != "fortitude" && p != "reflex" && p != "will") {
			let newProf = { "bonus": data.proficiencies[p] + data.level, "name": capitalise(p), "string": capitalise(p) + " " + pos_neg_sign(data.proficiencies[p] + data.level) };
			characterData.proficiencies.push(newProf);
			if (p == "unarmed") {
				unarmedProf = newProf.bonus;
			}
		}
	}
	for (var l in data.lores) {
		let newProf = { "bonus": data.lores[l][1] + data.level + characterData.abilities.int, "name": "Lore: " + data.lores[l][0], "string": "Lore: " + data.lores[l][0] + " " + pos_neg_sign(data.proficiencies[p] + data.level) };
		characterData.proficiencies.push(newProf);
	}
	if (data.proficiencies.perception > 0) {
		characterData.perception = data.proficiencies.perception + data.level + characterData.abilities.wis;
	} else {
		characterData.perception = characterData.abilities.wis;
	}

	//__MAGIC__
	message_window("Importing " + data.name, "Importing Spellcasting");
	characterData.spellRules = {};
	for (var i in data.spellCasters) {
		let castingData = data.spellCasters[i];
		let id = castingData.name;
		let newCastingRules = { "name": castingData.name, "spellAttack": 0, "spellDC": 0, "spells": [], "type": castingData.spellcastingType, "castingAbility": castingData.ability, "castLevels": [], "upcastLevels": [] }
		if (castingData.proficiency > 0) {
			newCastingRules.spellAttack = characterData.abilities[castingData.ability] + castingData.proficiency + data.level;
		} else {
			newCastingRules.spellAttack = characterData.abilities[castingData.ability];
		}
		newCastingRules.spellDC = 10 + newCastingRules.spellAttack;
		newCastingRules.totalSlots = castingData.perDay;
		newCastingRules.currentSlots = castingData.perDay;
		for (var l in castingData.spells) {
			let castLevel = castingData.spells[l].spellLevel;
			if (!(newCastingRules.castLevels.includes(castLevel))) {
				newCastingRules.castLevels.push(castLevel);
				if (castLevel != 0) {
					newCastingRules.upcastLevels.push(castLevel)
				}
			}
			if (castLevel == 0) {
				castLevel = Math.max(1, Math.ceil(data.level / 2))
			}
			for (var s in castingData.spells[l].list) {
				let spellName = castingData.spells[l].list[s];
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": castLevel };
					spellData.system.group = { "value": newCastingRules.name }
					newCastingRules.spells.push(spellData)
				}
			}
		}

		characterData.spellRules[id] = newCastingRules;
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
				newCastingRules.spellAttack = characterData.abilities[j] + castingData.proficiency + data.level;
			} else {
				newCastingRules.spellAttack = characterData.abilities[j];
			}
			newCastingRules.spellDC = 10 + newCastingRules.spellAttack;
			newCastingRules.totalSlots = [0];
			newCastingRules.currentSlots = [0];
			let focusLevel = Math.max(1, Math.ceil(data.level / 2));
			for (var l in castingData.focusCantrips) {
				let spellName = castingData.focusCantrips[l].replaceAll(" (Amped)", "");
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": focusLevel };
					spellData.system.group = { "value": newCastingRules.name }
				}
				newCastingRules.spells.push(spellData)
			}
			for (var l in castingData.focusSpells) {
				let spellName = castingData.focusSpells[l].replaceAll(" (Amped)", "");
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": focusLevel };
					spellData.system.group = { "value": newCastingRules.name }
				}
				newCastingRules.spells.push(spellData)
			}

			characterData.spellRules[id] = newCastingRules;
		}
	}

	if (data.focusPoints > 0) {
		characterData.resources.focus = { "current": data.focusPoints, "max": data.focusPoints };
	}

	//__MISC__
	characterData.name = data.name;
	characterData.creatureType = data.ancestry;
	characterData.alignment = data.alignment;
	characterData.level = data.level;
	characterData.senses = [];
	characterData.speeds = { "base": data.attributes.speed, "other": [] };
	characterData.rarity = "unique";
	characterData.traits = [data.ancestry, data.class];
	characterData.size = data.sizeName;
	characterData.languages = data.languages;
	characterData.inventory = {};
	characterData.features = {};
	characterData.foundryActor = {
		"system": {
			"abilities": {
				"cha": { "mod": characterData.abilities.cha },
				"con": { "mod": characterData.abilities.con },
				"dex": { "mod": characterData.abilities.dex },
				"int": { "mod": characterData.abilities.int },
				"str": { "mod": characterData.abilities.str },
				"wis": { "mod": characterData.abilities.wis }
			},
			"attributes": {
				"shield": null,
				"ac": {
					"details": "",
					"value": characterData.ac
				},
				"hp": {
					"details": "",
					"max": characterData.hp.max,
					"temp": 0,
					"value": characterData.hp.max
				},
				"speed": {
					"otherSpeeds": [],
					"value": characterData.speeds.base
				},
				"initiative": {
					"statistic": "perception"
				},
				"perception": {
					"details": "",
					"mod": characterData.perception,
					"senses": []
				},
			}
		}, "flags": { "pf2e": { "rulesSelections": {} } }
	};

	let features_to_parse = [];
	let featSubChoices = [];

	let removeRegex = [
		/ (Racket)$/,
		/ (Style)$/,
		/ (Initiate Benefit)$/,
		/ Mystery$/,
		/ (Doctrine)$/,
		/ (Element)$/,
		/ (Impulse Junction)$/,
		/ (Gate Junction:).*$/,
		/ (Patron)$/,
		/^(Arcane Thesis): /,
		/^(Arcane School): /,
		/^(The) /,
		/^(Blessing): /,
		/^(Empiricism) Selected Skill: /,
	];

	for (var f in data.feats) {
		let tempName = data.feats[f][0];
		let subChoice = data.feats[f][1];
		for (var r in removeRegex) {
			tempName = tempName.replace(removeRegex[r], "");
		}
		let tempData = find_object_data(tempName, ["feat", "action", "heritage"]);
		if (tempData != null) {
			features_to_parse.push(tempData);
			featSubChoices.push({ "name": tempName, "value": subChoice });
		} else {
			if (data.feats[f][0] != null) {
				unfoundData.push(data.feats[f][0]);
			}
		}
	}

	message_window("Importing " + data.name, "Importing Specials");

	for (var i in classData.system.items) {
		let classItem = classData.system.items[i];
		//MapTool.chat.broadcast(JSON.stringify(classItem));
		if (data.level >= classItem.level) {
			if (!(data.specials.includes(classItem.name))) {
				//MapTool.chat.broadcast(JSON.stringify(data.specials));
				data.specials = [classItem.name].concat(data.specials);
			}
		}
	}

	let foundSpecials = [];
	for (var s in data.specials) {
		let tempName = data.specials[s];
		if (tempName == "") {
			continue;
		}
		for (var r in removeRegex) {
			tempName = tempName.replace(removeRegex[r], "");
		}
		if (tempName == "Aquatic Adaptation" && data.ancestry == "Lizardfolk") {
			tempName = "Aquatic Adaptation (Lizardfolk)";
		}
		if (tempName == "Spellbook") {
			continue; //Spellbook not treated as a feature in foundry
		}
		if (tempName == "Anathema") {
			continue; //There are more specific anathema features per class
		}
		let tempData = find_object_data(tempName, ["feat", "action", "heritage"]);
		if (tempData != null && !foundSpecials.includes(tempName)) {
			features_to_parse.push(tempData);
			featSubChoices.push({ "name": tempName, "value": null });
			foundSpecials.push(tempName);
		} else if (tempData == null && tempName != null) {
			unfoundData.push(tempName);
		}
		data.specials[s] = tempName;
	}

	let grantedAttacks = [];
	for (var f in features_to_parse) {
		let featureData = features_to_parse[f];
		//MapTool.chat.broadcast(JSON.stringify(featureData))
		if ("fileURL" in featureData) {
			featureData = rest_call(featureData.fileURL);
		}
		characterData.features[featureData.name] = featureData;
		//MapTool.chat.broadcast(JSON.stringify(featureData));
		//MapTool.chat.broadcast(featureData.baseName);
		if (featureData != null && "rules" in featureData.system && featureData.system.rules != null && featureData.system.rules.length > 0) {
			//MapTool.chat.broadcast(JSON.stringify(addedFeature.rules));
			//MapTool.chat.broadcast(JSON.stringify(featSubChoices[f]));
			let choice = feature_require_choice(featureData, characterData.foundryActor, data.specials.concat(featSubChoices[f].value));
			if (choice != null) {
				data.specials = data.specials.filter(item => !choice.includes(item));
			}
			feature_cause_definition(featureData, characterData);
			let newAttacks = rules_grant_attack(featureData.system.rules);
			for (var a in newAttacks) {
				let newAttack = newAttacks[a];
				newAttack.damage[0].damage = String(newAttack.damage[0].dice) + String(newAttack.damage[0].die) + ((Number(characterData.abilities.str) != 0) ? "+" + Number(characterData.abilities.str) : "");
			}
			grantedAttacks = grantedAttacks.concat(newAttacks);
		}
		if (featureData != null && featureData.name == "Low-Light Vision") {
			characterData.senses.push("low-light");
		} else if (featureData != null && featureData.name == "Darkvision") {
			characterData.senses.push("darkvision");
		} else if (featureData != null && featureData.name == "Greater Darkvision") {
			characterData.senses.push("greater darkvision");
		}
	}
	characterData.basicAttacks = characterData.basicAttacks.concat(grantedAttacks);

	if (characterData.senses.length == 0) {
		characterData.senses.push("normal");
	}

	//Armor
	message_window("Importing " + data.name, "Importing Armor");
	for (var a in data.armor) {
		let thisArmor = data.armor[a];
		let tempData = find_object_data(thisArmor.name, "item");
		if ("fileURL" in tempData) {
			let itemData = rest_call(tempData.fileURL);
			let trueID = itemData._id + String(Object.keys(characterData.inventory).length);
			characterData.inventory[trueID] = itemData;
			//parse_feature(tempData.baseName, itemData, characterData);
			itemData.system.quantity = thisArmor.qty;
			itemData.system.equipped = thisArmor.worn;
			itemData.system.runes = { "property": [], "potency": ((thisArmor.pot == "") ? 0 : thisArmor.pot), "resilient": 0 };
			if (thisArmor.res == "resilient") {
				itemData.system.runes.resilient = 1;
			} else if (thisArmor.res == "greaterResilient") {
				itemData.system.runes.resilient = 2;
			} else if (thisArmor.res == "majorResilient") {
				itemData.system.runes.resilient = 3;
			}
			for (var rI of thisArmor.runes) {
				let runeData = find_object_data(rI.replaceAll(" (Minor)", ""), "item");
				if (runeData != null && "fileURL" in runeData) {
					runeData = parse_feature(runeData.baseName, rest_call(runeData.fileURL), null);
					itemData.system.runes.property.push(runeData);
				}
			}
			itemData.system.id = trueID;
		} else if (tempData == null && thisArmor.name != null) {
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
				let itemData = rest_call(tempData.fileURL);
				let trueID = tempData.id + String(Object.keys(characterData.inventory).length);
				characterData.inventory[trueID] = itemData;
				itemData.system.quantity = thisWeapon.qty;
				let newAttackData = {
					"name": itemData.name,
					"system": {
						"actionCost": 1, "actionType": "action", "bonus": { "value": thisWeapon.attack }, "damageRolls": { "0": itemData.system.damage },
						"description": { "value": "" }, "attackEffects": { "custom": "", "value": [] },
						"traits": itemData.system.traits, "category": itemData.system.category, "group": itemData.system.group
					},
					"type": ((itemData.system.range == null) ? "melee" : "ranged"),
					"flags": { "pf2e": {} }
				}
				if (thisWeapon.str == "striking") {
					itemData.system.runes.striking = 1;
					newAttackData.damage[0].dice += 1;
				} else if (thisWeapon.str == "greaterStriking") {
					itemData.system.runes.striking = 2;
					newAttackData.damage[0].dice += 2;
				} else if (thisWeapon.str == "majorStriking") {
					itemData.system.runes.striking = 3;
					newAttackData.damage[0].dice += 3;
				}
				newAttackData.flags.pf2e.linkedWeapon = trueID;
				newAttackData.system.damageRolls["0"].damage = String(newAttackData.system.damageRolls["0"].dice) + newAttackData.system.damageRolls["0"].die + ((thisWeapon.damageBonus > 0) ? "+" + String(thisWeapon.damageBonus) : "");
				itemData.system.runes.potency = thisWeapon.pot;
				for (var rI of thisWeapon.runes) {
					let runeData = find_object_data(rI.replaceAll(" (Minor)", ""), "item");
					if (runeData != null && "fileURL" in runeData) {
						runeData = parse_feature(runeData.baseName, rest_call(runeData.fileURL), null);
						itemData.system.runes.property.push(runeData);
					}
				}
				if (thisWeapon.mat != null && thisWeapon.mat != "") {
					if (thisWeapon.mat.match(/([^\s]*) \((.*)\)/)) {
						let matParse = thisWeapon.mat.match(/([^\s]*) \((.*)\)/);
						itemData.system.material.type = matParse[1].toLowerCase();
						itemData.system.material.grade = matParse[2].toLowerCase();
					} else {
						itemData.system.material.type = thisWeapon.mat.toLowerCase();
					}
				}
				itemData.id = trueID;
				characterData.basicAttacks.push(newAttackData);
			}
		} else {
			if (thisWeapon.name != "Fist" && thisWeapon.name != null) {
				unfoundData.push(thisWeapon.name);
			}
		}
	}

	let unarmedAttack = {
		"name": "Fist",
		"system": {
			"actions": { "value": 1 }, "actionType": { "value": "action" }, "bonus": { "value": unarmedProf }, "damageRolls": { "0": { "die": "d4", "dice": 1, "damageType": "bludgeoning" } },
			"description": { "value": "" }, "attackEffects": { "value": [] }, "isMelee": true, "group": "",
			"traits": { "value": ["agile", "finesse", "nonlethal", "unarmed"] }, "category": "unarmed"
		},
		"flags": { "pf2e": { "linkedWeapon": "unarmed" } },
		"type": "melee"
	}
	unarmedAttack.system.damageRolls["0"].damage = String(unarmedAttack.system.damageRolls["0"].dice) + unarmedAttack.system.damageRolls["0"].die + ((Number(characterData.abilities.str) != 0) ? "+" + Number(characterData.abilities.str) : "");
	characterData.basicAttacks.push(unarmedAttack);

	//Other Items
	message_window("Importing " + data.name, "Importing Gear");
	for (var e in data.equipment) {
		let eqName = data.equipment[e][0];
		let tempData = find_object_data(eqName, "item");
		if (tempData == null) {
			eqName = eqName.match(/([^\(\)]*) \(.*\)/);
			if (eqName != null) {
				if (eqName.length > 1) {
					eqName = eqName[1];
					tempData = find_object_data(eqName, "item");
				} else {
					eqName = eqName[0];
					tempData = find_object_data(eqName, "item");
				}
			}
		}
		if (tempData != null) {
			if ("fileURL" in tempData) {
				let itemData = rest_call(tempData.fileURL)
				//parse_feature(tempData.baseName, rest_call(tempData.fileURL), characterData);
				let trueID = tempData.id + String(Object.keys(characterData.inventory).length);
				characterData.inventory[trueID] = itemData;
				itemData.system.quantity = data.equipment[e][1];
				itemData.id = trueID;
				itemData.system.equipped = true;
				if (eqName == "Handwraps of Mighty Blows") {
					let handwrapsLevels = { 0: { 0: 0 }, 1: { 0: 2, 1: 4 }, 2: { 1: 10, 2: 12 }, 3: { 2: 16, 3: 19 } };
					let handwrapsBonus = data.equipment[e][0].match(/\+([0-9])/);
					let handwrapsStrike = data.equipment[e][0].match(/((Minor|Major|Greater) )?(Striking)/);
					if (handwrapsBonus != null) {
						itemData.system.runes.potency = handwrapsBonus[1];
						handwrapsBonus = handwrapsBonus[1];
					} else {
						handwrapsBonus = 0;
					}
					if (handwrapsStrike != null) {
						if (handwrapsStrike[2] == null) {
							itemData.system.runes.striking = 1;
							handwrapsStrike = 1;
						} else if (handwrapsStrike[2] == "Greater") {
							itemData.system.runes.striking = 2;
							handwrapsStrike = 2;
						} else if (handwrapsStrike[2] == "Major") {
							itemData.system.runes.striking = 3;
							handwrapsStrike = 3;
						}
					} else {
						handwrapsStrike = 0;
					}
					itemData.system.level.value = handwrapsLevels[handwrapsBonus][handwrapsStrike];
				}
			}
		} else {
			if (eqName != null) {
				unfoundData.push(eqName);
			}
		}
	}

	try {
		characterData.pets = data.pets;
		characterData.familiars = data.familiars;
	} catch (e) {
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - pet and familiar assignment");
		MapTool.chat.broadcast("data: " + JSON.stringify(data));
		MapTool.chat.broadcast("characterData: " + JSON.stringify(characterData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//Familiars
	message_window("Importing " + data.name, "Importing Familiars");
	for (var f in characterData.familiars) {
		characterData.familiars[f].familiarAbilities = [];
		for (var a in characterData.familiars[f].abilities) {
			let ability = characterData.familiars[f].abilities[a];
			let tempData = find_object_data(ability);
			if (tempData != null) {
				characterData.familiars[f].familiarAbilities.push(tempData);
			} else if (ability != "Darkvision") {
				MapTool.chat.broadcast("Couldn't find familiar ability " + ability);
			} else {
				if (ability != null) {
					unfoundData.push(ability);
				}
			}
		}
	}

	for (var f in characterData.features) {
		let featureData = characterData.features[f];
		//MapTool.chat.broadcast(JSON.stringify(featureData));
		if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "passive" && featureData.system.category != "offensive") {
			if (featureData.system.description.value.length < 100 && featureData.system.category == "defensive") {
				characterData.passiveDefenses.push(featureData);
			} else {
				characterData.passiveSkills.push(featureData);
			}
		} else if (("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "action") || featureData.system.category == "offensive") {
			characterData.offensiveActions.push(featureData);
		} else if ("actionType" in featureData.system && "value" in featureData.system.actionType && featureData.system.actionType.value == "reaction") {
			characterData.rections.push(featureData);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(characterData.inventory));

	if (unfoundData.length > 0) {
		message_window("Importing " + data.name, "<b>The following features/items could not be located/assigned.</b><br />" + unfoundData.join("<br />"));
	} else {
		close_message_window("Importing " + data.name);
	}
	return characterData;
}

MTScript.registerMacro("ca.pf2e.parse_pathbuilder_export", parse_pathbuilder_export);