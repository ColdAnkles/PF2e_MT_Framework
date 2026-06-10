"use strict";

function parse_pathbuilder_export(data) {

	let featLibrary = JSON.parse(read_data("pz2e_feat"));
	let actionLibrary = JSON.parse(read_data("pz2e_action"));
	let classLibrary = JSON.parse(read_data("pz2e_class"));
	let ancestryLibrary = JSON.parse(read_data("pz2e_ancestry"));
	let heritageLibrary = JSON.parse(read_data("pz2e_heritage"));
	let spellLibrary = JSON.parse(read_data("pz2e_spell"));
	let itemLibrary = JSON.parse(read_data("pz2e_item"));
	let profList = ["Acrobatics", "Arcana", "Athletics", "Crafting", "Deception", "Diplomacy", "Intimidation", "Medicine", "Nature", "Occultism", "Performance", "Religion", "Society", "Stealth", "Survival", "Thievery"];

	let gameSystem = read_data("gameSystem");

	let unfoundData = [];

	function find_object_data(objectName, searchSet = ["all"], searchKey = "name") {
		try {
			if (objectName == "Versatile Heritage") {
				objectName = "Versatile";
				searchSet = "heritage";
			}

			if (objectName == "Oil") {
				objectName = "Oil (1 pint)";
			} else if (objectName == "Clothing") {
				objectName = "Clothing (Ordinary)";
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
				characterData.senses.push("darkvision");
				return;
			} else {
				let lookupItems = []
				if ((searchSet.includes("all") || searchSet.includes("feat"))) {
					lookupItems = lookupItems.concat(search_dict(featLibrary, searchKey, testVar));
					lookupItems = lookupItems.concat(search_dict(featLibrary, searchKey, testCaps));
				}
				if ((searchSet.includes("all") || searchSet.includes("action"))) {
					lookupItems = lookupItems.concat(search_dict(actionLibrary, searchKey, testVar));
					lookupItems = lookupItems.concat(search_dict(actionLibrary, searchKey, testCaps));
				}
				if ((searchSet.includes("all") || searchSet.includes("heritage"))) {
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testVar));
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testCaps));
				}
				if ((searchSet.includes("all") || searchSet.includes("heritage"))) {
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testVar2));
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testCaps2));
				}
				if ((searchSet.includes("all") || searchSet.includes("heritage"))) {
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testVar3));
					lookupItems = lookupItems.concat(search_dict(heritageLibrary, searchKey, testCaps3));
				}
				if ((searchSet.includes("all") || searchSet.includes("item"))) {
					lookupItems = lookupItems.concat(search_dict(itemLibrary, searchKey, testVar));
					lookupItems = lookupItems.concat(search_dict(itemLibrary, searchKey, testCaps));
				}
				if ((searchSet.includes("all") || searchSet.includes("item"))) {
					lookupItems = lookupItems.concat(search_dict(itemLibrary, searchKey, testVar4));
					lookupItems = lookupItems.concat(search_dict(itemLibrary, searchKey, testCaps4));
				}
				if ((searchSet.includes("all") || searchSet.includes("class"))) {
					lookupItems = lookupItems.concat(search_dict(classLibrary, searchKey, testVar));
					lookupItems = lookupItems.concat(search_dict(classLibrary, searchKey, testCaps));
				}
				if (lookupItems.length > 0) {
					let returnData = [];
					let foundItems = [];
					for (var i in lookupItems) {
						let item = lookupItems[i];
						let id = null;
						if ("id" in item) {
							id = item.id;
						} else if ("_id" in item) {
							id = item._id;
						} else {
							id = item.name;
						}
						if (!(foundItems.includes(id)) && ![null, "", "Pathfinder Monster Core"].includes(item.source)) {
							returnData.push(item);
							foundItems.push(id);
						}
					}
					return returnData;
				}
			}
			return null;
		} catch (e) {
			if (String(e).startsWith("Error: PZ2E")) {
				throw e;
			}
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - find_object_data");
			MapTool.chat.broadcast("objectName: " + String(objectName));
			MapTool.chat.broadcast("searchSet: " + JSON.stringify(searchSet));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			throw new Error("PZ2E: parse_pathbuilder_export - find_object_data");
		}
	}

	function setup_spell(spellName) {
		let fSpellData = null;
		let lookupItems = []
		let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
		if (spellName in remasterChanges) {
			spellName = remasterChanges[spellName];
		}
		try {
			lookupItems = lookupItems.concat(search_dict(spellLibrary, "name", spellName));
			if (lookupItems.length == 0) {
				return null;
			}
			fSpellData = lookupItems[0];
			if ("fileURL" in fSpellData) {
				let loadedData = rest_call(fSpellData.fileURL);
				loadedData.source = loadedData.system.publication.title;
				loadedData.rarity = loadedData.system.traits.rarity;
				loadedData.traits = loadedData.system.traits.value;
				loadedData.traditions = loadedData.system.traits.traditions;
				loadedData.level = loadedData.system.level.value;
				return loadedData
			}
			return fSpellData
		} catch (e) {
			if (String(e).startsWith("Error: PZ2E")) {
				throw e;
			}
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - find setup_spell");
			MapTool.chat.broadcast("spellName: " + spellName);
			MapTool.chat.broadcast("fSpellData: " + JSON.stringify(fSpellData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			throw new Error("PZ2E: parse_pathbuilder_export - find setup_spell");
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(JSON.stringify(data.specials));
	let characterData = {};

	message_window("Importing " + data.name, "Importing Basics");

	let classData = null;

	try {
		classData = find_object_data(data.class, ["class"])[0];
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - find class data");
		MapTool.chat.broadcast("class: " + JSON.stringify(data.class));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - find class data");
	}

	if (classData == null) {
		message_window("Importing " + data.name, "Could Not Find Class");
	}

	if ("fileURL" in classData) {
		try {
			classData = rest_call(classData.fileURL);
		} catch (e) {
			if (String(e).startsWith("Error: PZ2E")) {
				throw e;
			}
			MapTool.chat.broadcast("Error in parse_pathbuilder_export - retrieve class data");
			MapTool.chat.broadcast("classData: " + JSON.stringify(classData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			throw new Error("PZ2E: Error in parse_pathbuilder_export - retrieve class data");
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
		throw new Error("PZ2E: Error in parse_pathbuilder_export - Stats setup");
	}

	//__HEALTH__
	try {
		characterData.hp = { "max": data.attributes.ancestryhp + ((data.attributes.classhp + characterData.abilities.con) * data.level) + (data.attributes.bonushpPerLevel * data.level) + data.attributes.bonushp };
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - HP setup");
		MapTool.chat.broadcast("attributes: " + JSON.stringify(data.attributes));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - HP setup");
	}

	//__OFFENSE__
	characterData.offensiveActions = [];
	characterData.basicAttacks = [];

	//__DEFENSES__
	characterData.ac = { "value": data.acTotal.acTotal };
	try {
		var saveNames = ["fortitude", "reflex", "will"]
		var saveAbilities = { "fortitude": "con", "reflex": "dex", "will": "wis" }
		characterData.saves = { "fortitude": 0, "reflex": 0, "will": 0, "fortitudeProf": "U", "reflexProf": "U", "willProf": "U" };
		for (var p in saveNames) {
			var pN = saveNames[p];
			if (data.proficiencies[pN] > 0) {
				characterData.saves[pN] = data.proficiencies[pN] + data.level + characterData.abilities[saveAbilities[pN]];
				if (data.proficiencies[pN] == 2) {
					characterData.saves[pN + "Prof"] = "T";
				} else if (data.proficiencies[pN] == 4) {
					characterData.saves[pN + "Prof"] = "E";
				} else if (data.proficiencies[pN] == 6) {
					characterData.saves[pN + "Prof"] = "M";
				} else if (data.proficiencies[pN] == 8) {
					characterData.saves[pN + "Prof"] = "L";
				}
			} else {
				characterData.saves[pN] = characterData.abilities[saveAbilities[pN]];
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - saves setup");
		MapTool.chat.broadcast("saves: " + JSON.stringify(data.proficiencies));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - saves setup");
	}

	characterData.immunities = [];
	characterData.resistances = [];

	try {
		for (var r in data.resistances) {
			let resString = data.resistances[r].split(" ");
			characterData.resistances.push({ "type": resString[0], "value": Number(resString[1]) })
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - resistances setup");
		MapTool.chat.broadcast("resistances: " + JSON.stringify(data.resistances));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - resistances setup");
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
			if (data.proficiencies[p] == 2) {
				newProf.pName = "T";
			} else if (data.proficiencies[p] == 4) {
				newProf.pName = "E";
			} else if (data.proficiencies[p] == 6) {
				newProf.pName = "M";
			} else if (data.proficiencies[p] == 8) {
				newProf.pName = "L";
			} else {
				newProf.pName = "";
			}
			characterData.proficiencies.push(newProf);
			if (p == "unarmed") {
				unarmedProf = newProf.bonus;
			}
		}
	}
	for (var l in data.lores) {
		let newProf = { "bonus": Number(data.lores[l][1]) + Number(data.level), "name": "Lore: " + data.lores[l][0], "string": "Lore: " + data.lores[l][0] + " " + pos_neg_sign(Number(data.lores[l][1]) + Number(data.level)) };
		if (data.lores[l][1] == 2) {
			newProf.pName = "T";
		} else if (data.lores[l][1] == 4) {
			newProf.pName = "E";
		} else if (data.lores[l][1] == 6) {
			newProf.pName = "M";
		} else if (data.lores[l][1] == 8) {
			newProf.pName = "L";
		} else {
			newProf.pName = "";
		}
		characterData.proficiencies.push(newProf);
	}
	if (data.proficiencies.perception > 0) {
		characterData.perception = data.proficiencies.perception + data.level + characterData.abilities.wis;
	} else {
		characterData.perception = characterData.abilities.wis;
	}

	//__MAGIC__
	message_window("Importing " + data.name, "Importing Spellcasting");
	let importedSpells = [];
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
				message_window("Importing " + data.name, "Importing Focus Spells\n" + newCastingRules.name + " - " + spellName);
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": castLevel };
					spellData.system.group = { "value": newCastingRules.name }
					newCastingRules.spells.push(spellData)
					importedSpells.push(spellData.name);
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
				message_window("Importing " + data.name, "Importing Focus Spells\n" + newCastingRules.name + " - " + spellName);
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": focusLevel };
					spellData.system.group = { "value": newCastingRules.name }
				}
				newCastingRules.spells.push(spellData)
			}
			for (var l in castingData.focusSpells) {
				let spellName = castingData.focusSpells[l].replaceAll(" (Amped)", "");
				message_window("Importing " + data.name, "Importing Focus Spells\n" + newCastingRules.name + " - " + spellName);
				let spellData = setup_spell(spellName);
				if (spellData != null) {
					spellData.system.castLevel = { "value": focusLevel };
					spellData.system.group = { "value": newCastingRules.name }
				}
				newCastingRules.spells.push(spellData)
				importedSpells.push(spellData.name);
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
		}, "flags": {}
	};
	characterData.foundryActor.flags[gameSystem] = { "rulesSelections": {} };

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
		/^Hunter's Edge: /,
	];

	for (var f in data.feats) {
		let tempName = data.feats[f][0];
		let subChoice = data.feats[f][1];
		for (var r in removeRegex) {
			tempName = tempName.replace(removeRegex[r], "");
		}
		let tempDataList = find_object_data(tempName, ["feat", "action", "heritage"]);
		for (var t in tempDataList) {
			let tempData = tempDataList[t];
			if (tempData != null && "error" in tempData) {
				unfoundData.push(data.feats[f][0] + " (Feats)");
			} else if (tempData != null) {
				features_to_parse.push(tempData);
				featSubChoices.push({ "name": tempName, "value": subChoice });
			} else {
				if (data.feats[f][0] != null && !data.specials.includes(data.feats[f][0])) {
					unfoundData.push(data.feats[f][0] + " (Feat)");
				}
			}
		}
	}

	message_window("Importing " + data.name, "Importing Specials");
	try {
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
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - specials setup");
		MapTool.chat.broadcast("classData.system.items: " + JSON.stringify(classData.system.items));
		MapTool.chat.broadcast("data.specials: " + JSON.stringify(data.specials));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - specials setup");
	}

	let foundSpecials = [];
	let unfoundSpecials = [];

	//Kineticist Name Differeces
	try {
		if (data.specials.includes("Single Gate") && data.class == "Kineticist") {
			data.specials.push("Single-gate");
			data.specials.splice(data.specials.indexOf("Single Gate"), 1);
		}
		var s = 0;
		if (data.class == "Kineticist") {
			while (s < data.specials.length) {
				let tempName = data.specials[s];
				let elementMatch = tempName.match("(.*) Element");
				if (elementMatch != null && elementMatch.length > 1 && elementMatch[1] != "Channel") {
					data.specials.push(elementMatch[1] + " Gate");
					data.specials.splice(data.specials.indexOf(tempName), 1);
					s = 0;
				} else {
					s += 1;
				}
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - kineticist fixes");
		MapTool.chat.broadcast("data.specials: " + JSON.stringify(data.specials));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - kineticist fixes");
	}

	try {
		for (var s in data.specials) {
			let tempName = data.specials[s];
			if (tempName == "") {
				continue;
			}
			if (importedSpells.includes(tempName)) {
				continue;
			}
			for (var r in removeRegex) {
				tempName = tempName.replace(removeRegex[r], "");
			}
			if (profList.includes(tempName)) {
				continue; //No need to include proficiency
			}
			if (tempName == "Aquatic Adaptation" && data.ancestry == "Lizardfolk") {
				tempName = "Aquatic Adaptation (Lizardfolk)";
			}
			if (tempName == "Spellbook" || tempName == "Vessel Spells") {
				continue; //Spellbook/Spell Lists not treated as a feature in foundry
			}
			if (tempName.includes("Spellcasting")) {
				continue; //Spellcasting Done Differently
			}
			if (tempName == "Anathema") {
				continue; //There are more specific anathema features per class
			}
			if (tempName == "Darkvision" || tempName == "Greater Darkvision" || tempName == "Low-Light Vision") {
				features_to_parse.push({ "name": tempName, "system": {} });
				continue; //Vision Not Handled as Feature
			}
			let tempDataList = find_object_data(tempName, ["feat", "action", "heritage"]);
			for (var t in tempDataList) {
				let tempData = tempDataList[t];
				if (tempData != null && "error" in tempData) {
					unfoundSpecials.push(tempName + " (Special)");
				} else if (tempData != null && !foundSpecials.includes(tempName)) {
					features_to_parse.push(tempData);
					featSubChoices.push({ "name": tempName, "value": null });
					foundSpecials.push(tempName);
				} else if (tempData == null && tempName != null && tempName != data.heritage && !tempName.includes("-gate")) {
					unfoundSpecials.push(tempName + " (Special)");
				}
			}
			data.specials[s] = tempName;
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - specials finding");
		MapTool.chat.broadcast("foundSpecials: " + JSON.stringify(foundSpecials));
		MapTool.chat.broadcast("unfoundSpecials: " + JSON.stringify(unfoundSpecials));
		MapTool.chat.broadcast("featSubChoices: " + JSON.stringify(featSubChoices));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - specials finding");
	}

	let grantedAttacks = [];
	let featureData = null;
	try {
		for (var f in features_to_parse) {
			featureData = features_to_parse[f];
			//MapTool.chat.broadcast(JSON.stringify(featureData))
			if ("fileURL" in featureData) {
				featureData = import_and_parse(featureData.name, featureData.type, false);
			}
			characterData.features[featureData.id] = featureData;
			//MapTool.chat.broadcast(featureData.name + " - " + featureData.type);
			//MapTool.chat.broadcast(JSON.stringify(featureData));
			if (featureData.name == "Elemental Blast") {
				featureData.system.actions.value = "1 to 2";
			}
			if (featureData != null && "rules" in featureData.system && featureData.system.rules != null && featureData.system.rules.length > 0) {
				//MapTool.chat.broadcast(JSON.stringify(addedFeature.rules));
				//MapTool.chat.broadcast(JSON.stringify(featSubChoices[f]));
				let choice = null;
				if (f in featSubChoices) {
					feature_require_choice(featureData, characterData.foundryActor, data.specials.concat(featSubChoices[f].value));
				}
				if (choice != null) {
					data.specials = data.specials.filter(item => !choice.includes(item));
					unfoundSpecials = unfoundSpecials.filter(item => !choice.includes(item));
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
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - specials parsing");
		MapTool.chat.broadcast("featureData: " + JSON.stringify(featureData));
		MapTool.chat.broadcast("grantedAttacks: " + JSON.stringify(grantedAttacks));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in parse_pathbuilder_export - specials parsing");
	}
	characterData.basicAttacks = characterData.basicAttacks.concat(grantedAttacks);

	if (characterData.senses.length == 0) {
		characterData.senses.push("normal");
	}

	unfoundData = unfoundData.concat(unfoundSpecials);
	let eqShield = null;

	//Armor
	message_window("Importing " + data.name, "Importing Armor");
	for (var a in data.armor) {
		let thisArmor = data.armor[a];
		let itemData = find_object_data(thisArmor.name, "item");
		if (itemData == null || itemData.length == 0) {
			continue;
		} else {
			itemData = itemData[0]
		}
		if ("fileURL" in itemData) {
			itemData = rest_call(itemData.fileURL);
		} else if (itemData == null && thisArmor.name != null) {
			unfoundData.push(thisArmor.name + " (Armor)");
		}
		let trueID = "armor";
		if ("_id" in itemData) {
			trueID = itemData._id + String(Object.keys(characterData.inventory).length);
			itemData.id = trueID;
			itemData._id = trueID;
		} else if ("id" in itemData) {
			trueID = itemData.id + String(Object.keys(characterData.inventory).length);
			itemData._id = trueID;
			itemData.id = trueID;
		}
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
			itemData.system.runes.property.push(rI.replaceAll(" (Minor)", ""));
		}
		itemData.system.id = trueID;
		itemData.system._id = trueID;
		if ("type" in itemData && itemData.type != "shield") {
			itemData.type = "armor";
		}
		if (thisArmor.worn && thisArmor.prof == "shield") {
			eqShield = itemData;
		}
		characterData.inventory[trueID] = itemData;
	}

	//Weapons
	message_window("Importing " + data.name, "Importing Weapons");
	let bashAttack = null;
	let fistAttack = null;
	let thisWeapon = null;
	let tempData = null;
	try {
		for (var w in data.weapons) {
			thisWeapon = data.weapons[w];
			tempData = find_object_data(thisWeapon.name, "item");
			if (tempData == null) {
				//pass
			} else if (tempData != null && tempData.length == 0) {
				tempData = null;
			} else {
				tempData = tempData[0]
			}
			//MapTool.chat.broadcast(JSON.stringify(tempData))
			if (tempData != null) {
				let itemData = tempData;
				if ("fileURL" in tempData) {
					itemData = rest_call(tempData.fileURL);
				}
				//MapTool.chat.broadcast(JSON.stringify(itemData))
				let trueID = tempData.id + String(Object.keys(characterData.inventory).length);
				characterData.inventory[trueID] = itemData;
				itemData.system.quantity = thisWeapon.qty;
				itemData.display = thisWeapon.display;
				let newAttackData = {
					"name": itemData.name,
					"display": itemData.display,
					"system": {
						"actionCost": 1, "actionType": "action", "bonus": { "value": thisWeapon.attack }, "damageRolls": { "0": itemData.system.damage },
						"description": { "value": "" }, "attackEffects": { "custom": "", "value": [] },
						"traits": itemData.system.traits, "category": itemData.system.category, "group": itemData.system.group
					},
					"type": ((itemData.system.range == null) ? "melee" : "ranged"),
					"flags": {}
				};
				newAttackData.flags[gameSystem] = {};
				if (thisWeapon.str == "striking") {
					itemData.system.runes.striking = 1;
					newAttackData.system.damageRolls["0"].dice += 1;
				} else if (thisWeapon.str == "greaterStriking") {
					itemData.system.runes.striking = 2;
					newAttackData.system.damageRolls["0"].dice += 2;
				} else if (thisWeapon.str == "majorStriking") {
					itemData.system.runes.striking = 3;
					newAttackData.system.damageRolls["0"].dice += 3;
				}
				newAttackData.flags.pf2e.linkedWeapon = trueID;
				newAttackData.system.damageRolls["0"].damage = String(newAttackData.system.damageRolls["0"].dice) + newAttackData.system.damageRolls["0"].die + ((thisWeapon.damageBonus > 0) ? "+" + String(thisWeapon.damageBonus) : "");
				itemData.system.runes.potency = thisWeapon.pot;
				for (var rI of thisWeapon.runes) {
					itemData.system.runes.property.push(rI.replaceAll(" (Minor)", ""));
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
				itemData._id = trueID;
				characterData.basicAttacks.push(newAttackData);
			} else {
				if (thisWeapon.name != "Fist" && thisWeapon.name != "Shield Bash" && thisWeapon.name != null) {
					unfoundData.push(thisWeapon.name + " (Weapon)");
				} else if (thisWeapon.name == "Fist") {
					fistAttack = thisWeapon;
				} else if (thisWeapon.name == "Shield Bash") {
					bashAttack = thisWeapon;
				}
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - weapons");
		MapTool.chat.broadcast("weapons: " + JSON.stringify(data.weapons));
		MapTool.chat.broadcast("inventory: " + JSON.stringify(characterData.inventory));
		MapTool.chat.broadcast("attacks: " + JSON.stringify(characterData.basicAttacks));
		MapTool.chat.broadcast("thisWeapon: " + JSON.stringify(thisWeapon));
		MapTool.chat.broadcast("tempData: " + JSON.stringify(tempData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: parse_pathbuilder_export - weapons");
	}

	if (eqShield != null) {
		let bashDie = "d4";
		if (bashAttack != null) {
			bashDie = bashAttack.die;
		}
		let shieldBash = {
			"name": "Shield Bash",
			"system": {
				"actions": { "value": 1 }, "actionType": { "value": "action" }, "bonus": { "value": unarmedProf }, "damageRolls": { "0": { "die": bashDie, "dice": 1, "damageType": "bludgeoning" } },
				"description": { "value": "A shield bash is not actually a weapon, but a maneuver in which you thrust or swing your shield to hit your foe with an impromptu attack." }, "attackEffects": { "value": [] }, "isMelee": true,
				"traits": { "value": [] }, "category": "martial"
			},
			"flags": {},
			"type": "melee"
		}
		shieldBash[gameSystem] = { "linkedWeapon": eqShield.id };
		shieldBash.system.damageRolls["0"].damage = String(shieldBash.system.damageRolls["0"].dice) + shieldBash.system.damageRolls["0"].die + ((Number(characterData.abilities.str) != 0) ? "+" + Number(characterData.abilities.str) : "");
		characterData.basicAttacks.push(shieldBash);
	}

	let fistDie = "d4";
	if (fistAttack != null) {
		fistDie = fistAttack.die;
	}

	let unarmedAttack = {
		"name": "Fist",
		"system": {
			"actions": { "value": 1 }, "actionType": { "value": "action" }, "bonus": { "value": unarmedProf }, "damageRolls": { "0": { "die": fistDie, "dice": 1, "damageType": "bludgeoning" } },
			"description": { "value": "" }, "attackEffects": { "value": [] }, "isMelee": true,
			"traits": { "value": ["agile", "finesse", "nonlethal", "unarmed"] }, "category": "unarmed"
		},
		"flags": {},
		"type": "melee"
	}
	unarmedAttack[gameSystem] = { "linkedWeapon": "unarmed" };
	unarmedAttack.system.damageRolls["0"].damage = String(unarmedAttack.system.damageRolls["0"].dice) + unarmedAttack.system.damageRolls["0"].die + ((Number(characterData.abilities.str) != 0) ? "+" + Number(characterData.abilities.str) : "");
	characterData.basicAttacks.push(unarmedAttack);

	//Other Items
	message_window("Importing " + data.name, "Importing Gear");
	for (var e in data.equipment) {
		let eqName = data.equipment[e][0];
		tempData = find_object_data(eqName, "item");
		if (tempData == null) {
			//pass
		} else if (tempData != null && tempData.length == 0) {
			tempData = null;
		} else {
			tempData = tempData[0]
		}
		if (tempData == null) {
			eqName = eqName.match(/([^\(\)]*) \(.*\)/);
			if (eqName != null) {
				if (eqName.length > 1) {
					eqName = eqName[1];
					tempData = find_object_data(eqName, "item");
					if (tempData == null) {
						//pass
					} else if (tempData != null && tempData.length == 0) {
						tempData = null;
					} else {
						tempData = tempData[0]
					}
				} else {
					eqName = eqName[0];
					tempData = find_object_data(eqName, "item");
					if (tempData == null) {
						//pass
					} else if (tempData != null && tempData.length == 0) {
						tempData = null;
					} else {
						tempData = tempData[0]
					}
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
				itemData._id = trueID;
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
				unfoundData.push(eqName + " (Gear)");
			}
		}
	}

	try {
		characterData.pets = data.pets;
		characterData.familiars = data.familiars;
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - pet and familiar assignment");
		MapTool.chat.broadcast("data: " + JSON.stringify(data));
		MapTool.chat.broadcast("characterData: " + JSON.stringify(characterData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: parse_pathbuilder_export - pet and familiar assignment");
	}

	//Familiars
	message_window("Importing " + data.name, "Importing Familiars");
	try {
		for (var f in characterData.familiars) {
			characterData.familiars[f].familiarAbilities = [];
			for (var a in characterData.familiars[f].abilities) {
				let ability = characterData.familiars[f].abilities[a];
				tempData = find_object_data(ability);
				if (tempData == null) {
					//pass
				} else if (tempData != null && tempData.length == 0) {
					tempData = null;
				} else {
					tempData = tempData[0]
				}
				if (tempData != null) {
					characterData.familiars[f].familiarAbilities.push(tempData);
				} else if (ability != "Darkvision" && ability != "Low-Light Vison" && ability != "Greater Darkvision") {
					unfoundData.push(ability + " (Familiar)")
				} else {
					if (ability != null) {
						unfoundData.push(ability + " (Familiar)");
					}
				}
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in parse_pathbuilder_export - familiar importing");
		MapTool.chat.broadcast("tempData: " + JSON.stringify(tempData));
		MapTool.chat.broadcast("characterData.familiars: " + JSON.stringify(characterData.familiars));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: parse_pathbuilder_export - familiar importing");
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
			characterData.otherDefenses.push(featureData);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(characterData.inventory));

	if (unfoundData.length > 0) {
		message_window("Importing " + data.name, "<b>The following features/items could not be located/assigned.</b><br />" + unfoundData.join("<br />") + "<br /><br /><i>Explanation:<br />Many Features in Pathbuilder do not have corresponding entries in the Foundry Data. Check whether any of these missing things will impact your play, or if they are included in other features, or are unncessary.</i>");
	} else {
		close_message_window("Importing " + data.name);
	}
	return characterData;
}

MTScript.registerMacro("ca.pz2e.parse_pathbuilder_export", parse_pathbuilder_export);