"use strict";

function parse_pathbuilder_export(data){
	
	let libToken = get_runtime("libToken");
	let featLibrary = JSON.parse(libToken.getProperty("pf2e_feat"));
	let actionLibrary = JSON.parse(libToken.getProperty("pf2e_action"));
	let ancestryLibrary = JSON.parse(libToken.getProperty("pf2e_ancestry"));
	let heritageLibrary = JSON.parse(libToken.getProperty("pf2e_heritage"));
	let spellLibrary = JSON.parse(libToken.getProperty("pf2e_spell"));
	
	function find_object_data(objectName){
		//MapTool.chat.broadcast(objectName);
		let testVar = objectName;
		let testVar2 = testVar.replaceAll(" ","-");
		let testVar3 = testVar.replaceAll(" ","-") + " " + data.ancestry;

		if (testVar == "Darkvision"){
			parsedData.senses.push("darkvision");
		}else{
			if (testVar in featLibrary){
				return featLibrary[testVar];
			}else if (testVar in actionLibrary){
				return actionLibrary[testVar];
			}else if (testVar in heritageLibrary){
				return heritageLibrary[testVar];
			}else if (testVar2 in heritageLibrary){
				return heritageLibrary[testVar2];
			}else if (testVar3 in heritageLibrary){
				return heritageLibrary[testVar3];
			}
		}	
	}

	function setup_spell(spellName){
		let fSpellData = null;
		if ( spellName in spellLibrary){
			fSpellData = spellLibrary[spellName];
			fSpellData = rest_call(fSpellData.fileURL);
			//MapTool.chat.broadcast(JSON.stringify(fSpellData));
			return fSpellData;
		}else{
			MapTool.chat.broadcast("Couldn't Find " + spellName);
			return null;
		}
	}
	
	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(JSON.stringify(data.specials));
	let parsedData = {};

	//__STATS__	
	parsedData.abilities = {};
	parsedData.abilities.str = Math.floor((data.abilities.str - 10)/2);
	parsedData.abilities.dex = Math.floor((data.abilities.dex - 10)/2);
	parsedData.abilities.con = Math.floor((data.abilities.con - 10)/2);
	parsedData.abilities.int = Math.floor((data.abilities.int - 10)/2);
	parsedData.abilities.wis = Math.floor((data.abilities.wis - 10)/2);
	parsedData.abilities.cha = Math.floor((data.abilities.cha - 10)/2);

	//__HEALTH__
	parsedData.hp = {"max":data.attributes.ancestryhp + ((data.attributes.classhp + parsedData.abilities.con) * data.level) + (data.attributes.bonushpPerLevel * data.level) + data.attributes.bonushp};

	//__OFFENSE__
	parsedData.offensiveActions = [];
	parsedData.basicAttacks = [];

	//__DEFENSES__
	parsedData.ac = {"value":data.acTotal.acTotal};
	parsedData.saves = {"fortitude":0,"reflex":0,"will":0};
	if (data.proficiencies.fortitude>0){
		parsedData.saves.fortitude = data.proficiencies.fortitude + data.level + parsedData.abilities.con;
	}else{
		parsedData.saves.fortitude = parsedData.abilities.con;
	}
	if (data.proficiencies.reflex>0){
		parsedData.saves.reflex = data.proficiencies.reflex + data.level + parsedData.abilities.dex;
	}else{
		parsedData.saves.reflex = parsedData.abilities.dex;
	}
	if (data.proficiencies.will>0){
		parsedData.saves.will = data.proficiencies.will + data.level + parsedData.abilities.wis;
	}else{
		parsedData.saves.will = parsedData.abilities.wis;
	}
	parsedData.immunities = [];
	parsedData.resistances = data.resistances;
	parsedData.weaknesses = [];
	parsedData.passiveDefenses = [];
	parsedData.otherDefenses = [];

	//__SKILLS__	
	parsedData.skillList = {};
	for (var p in data.proficiencies){
		if (data.proficiencies[p]!=0 && p != "fortitude" && p != "reflex" && p != "will"){
			parsedData.skillList[p]=data.proficiencies[p];
		}
	}
	for (var l in data.lores){
		parsedData.skillList["Lore: " + data.lores[l][0]] = data.lores[l][1];
	}
	if (data.proficiencies.perception>0){
		parsedData.perception = data.proficiencies.perception + data.level + parsedData.abilities.wis;
	}else{
		parsedData.perception = parsedData.abilities.wis;
	}
	parsedData.passiveSkills = [];

	//__MAGIC__
	parsedData.spellRules = {};
	for (var i in data.spellCasters){
		let castingData = data.spellCasters[i];
		let id = castingData.name;
		let newCastingRules = {"name":castingData.name,"spellAttack":0,"spellDC":0,"spells":[],"type":castingData.spellcastingType}
		if (castingData.proficiency > 0){
			newCastingRules.spellAttack = parsedData.abilities[castingData.ability] + castingData.proficiency + data.level;
		}else{
			newCastingRules.spellAttack = parsedData.abilities[castingData.ability];
		}
		newCastingRules.spellDC = 10 + newCastingRules.spellAttack;

		for (var l in castingData.spells){
			let castLevel = castingData.spells[l].spellLevel;
			if (castLevel == 0){
				castLevel = Math.max(1,Math.floor(data.level/2))
			}
			for (var s in castingData.spells[l].list){
				let spellName = castingData.spells[l].list[s];
				let spellData = setup_spell(spellName);
				if (spellData != null){
					spellData.castLevel = castLevel;
					newCastingRules.spells.push(spellData)
				}
			}
		}
		
		parsedData.spellRules[id]=newCastingRules;
		//MapTool.chat.broadcast(JSON.stringify(castingData));
		//MapTool.chat.broadcast(JSON.stringify(newCastingRules));
	}

	for (var i in data.focus){
		for (var j in data.focus[i]){
			let castingData = data.focus[i][j];
			let id = capitalise(i) + " " + capitalise(j) + " Focus";
			let newCastingRules = {"name":id,"spellAttack":0,"spellDC":0,"spells":[],"type":castingData.focus}
			if (castingData.proficiency > 0){
				newCastingRules.spellAttack = parsedData.abilities[j] + castingData.proficiency + data.level;
			}else{
				newCastingRules.spellAttack = parsedData.abilities[j];
			}
			newCastingRules.spellDC = 10 + newCastingRules.spellAttack;
			let focusLevel = Math.max(1,Math.floor(data.level/2));
			for (var l in castingData.focusCantrips){
				let spellName = castingData.focusCantrips[l].replaceAll(" (Amped)","");
				let spellData = setup_spell(spellName);
				if (spellData != null){
					spellData.castLevel = focusLevel;
				}
			}
			for (var l in castingData.focusSpells){
				let spellName = castingData.focusCantrips[l].replaceAll(" (Amped)","");
				let spellData = setup_spell(spellName);
				if (spellData != null){
					spellData.castLevel = focusLevel;
				}
			}
			
		}
	}

	//__MISC__
	parsedData.name = data.name;
	parsedData.creatureType = data.ancestry;
	parsedData.alignment = data.alignment;
	parsedData.level = data.level;
	parsedData.senses = [];
	parsedData.speeds = {"base":data.attributes.speed,"other":[]};
	parsedData.rarity = "unique";
	parsedData.traits = [data.ancestry,data.class];
	parsedData.size = data.sizeName;
	parsedData.languages = data.languages;
	parsedData.resources = {};
	parsedData.itemList = {};



	let features_to_parse = [];
	for (var f in data.feats){
		let tempData = find_object_data(data.feats[f][0]);
		if (tempData != null){
			features_to_parse.push(tempData);
		}
	}

	for (var s in data.specials){
		let tempData = find_object_data(data.specials[s]);
		if (tempData != null){
			features_to_parse.push(tempData);
		}
	}

	for (var f in features_to_parse){
		let featureData = features_to_parse[f];
		//MapTool.chat.broadcast(featureData.name);
		if ("fileURL" in featureData){
			parse_feature(rest_call(featureData.fileURL), parsedData);
		}
	}
	parsedData.senses = parsedData.senses.join(", ");

	//MapTool.chat.broadcast(JSON.stringify(parsedData));
	return parsedData;
}

MTScript.registerMacro("ca.pf2e.parse_pathbuilder_export", parse_pathbuilder_export);