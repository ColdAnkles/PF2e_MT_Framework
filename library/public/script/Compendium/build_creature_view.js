"use strict";

function build_creature_view(creatureName, tokenID = null) {
	let creatureData = null;
	let token = null;
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).PF2E;

	if (tokenID == null) {
		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_npc"));
		let property = JSON.parse(read_data("pf2e_npc"));
		creatureData = property[creatureName];
		creatureData = rest_call(creatureData["fileURL"], "");

		creatureData = parse_npc(creatureData);
	} else {
		token = MapTool.tokens.getTokenByID(tokenID);
		creatureData = read_creature_properties(tokenID);
	}

	if (creatureData.name.includes("Lib:")) {
		creatureData.name = creatureData.name.replaceAll("Lib:", "");
	}

	let additionalData = { "rollDice": false, "level": creatureData.level };
	if (token != null) {
		additionalData.actor = token;
	}

	//MapTool.chat.broadcast(JSON.stringify(creatureData.senses));

	let HTMLString = "";

	HTMLString += "<h1 class='title'><span>" + creatureData.name + "</span><span style='margin-left:auto; margin-right:0;'>Creature " + creatureData.level + "</span></h1>";


	if (creatureData.rarity != "common" && creatureData.rarity != "") {
		let normalRarity = capitalise(creatureData.rarity).split('-')[0];
		if ("traitDescription" + normalRarity in traitGlossary && traitGlossary["traitDescription" + normalRarity] != null) {
			HTMLString += "<span class='trait" + creatureData.rarity + "' title=\"" + traitGlossary["traitDescription" + normalRarity] + "\">" + capitalise(creatureData.rarity) + "</span>";
		} else {
			HTMLString += "<span class='trait" + creatureData.rarity + "'>" + capitalise(creatureData.rarity) + "</span>";
		}
	}
	//HTMLString += "<span class='traitalignment'>" + capitalise(creatureData.alignment) + "</span>";
	let normalSize = capitalise(creatureData.size).split('-')[0];
	if ("traitDescription" + normalSize in traitGlossary && traitGlossary["traitDescription" + normalSize] != null) {
		HTMLString += "<span class='traitsize' title=\"" + traitGlossary["traitDescription" + normalSize] + "\">" + capitalise(creatureData.size) + "</span>"
	} else {
		HTMLString += "<span class='traitsize'>" + capitalise(creatureData.size) + "</span>"
	}
	for (var t in creatureData.traits) {
		let traitName = creatureData.traits[t];
		let traitNormal = capitalise(traitName).split('-')[0];
		if ("traitDescription" + traitNormal in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
			HTMLString += "<span class='trait' title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + capitalise(traitName) + "</span>";
		} else {
			HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
		}
	}
	HTMLString += "<br />"
	if (tokenID != null) {
		HTMLString += "<img style='float:right;margin:5px' src=" + getTokenImage(tokenID, 200) + "></img>";
	}
	if ("source" in creatureData) {
		HTMLString += "<b>Source </b><span class='ext-link'>" + creatureData.source + "</span><br />";
	}
	HTMLString += "<b>Perception</b> +" + creatureData.perception + "; " + creatureData.senses.join(", ") + "<br />";
	if (creatureData.languages.length > 0) {
		HTMLString += "<b>Languages</b> " + creatureData.languages.join(", ");
		HTMLString += "<br />";
	}

	let skillList = [];
	for (var s in creatureData.skillList) {
		skillList.push(creatureData.skillList[s].string);
	}

	if (creatureData.skillList.length > 0) {
		HTMLString += "<b>Skills</b> " + skillList.join(", ") + "<br/>";
	}
	HTMLString += "<b>Str</b> +" + creatureData.abilities.str + ", ";
	HTMLString += "<b>Dex</b> +" + creatureData.abilities.dex + ", ";
	HTMLString += "<b>Con</b> +" + creatureData.abilities.con + ", ";
	HTMLString += "<b>Int</b> +" + creatureData.abilities.int + ", ";
	HTMLString += "<b>Wis</b> +" + creatureData.abilities.wis + ", ";
	HTMLString += "<b>Cha</b> +" + creatureData.abilities.cha + "<br />";

	let itemText = "";
	for (var i in creatureData.itemList) {
		let itemData = creatureData.itemList[i];
		if (itemData.quantity > 1) {
			itemText = itemText + itemData.quantity + " ";
		}
		itemText = itemText + itemData.name
		if (itemData.hp > 0) {
			itemText = itemText + "(Hardness " + itemData.hardness + ", HP " + itemData.hp + ", BT " + itemData.hp / 2 + ")";
		}
		itemText = itemText + ", ";
	}

	if (Object.keys(creatureData.itemList).length > 0) {
		HTMLString += "<b>Items</b> " + itemText.substring(0, itemText.length - 2) + "<br />";
	}

	for (var pSkill in creatureData.passiveSkills) {
		let skillData = creatureData.passiveSkills[pSkill];
		HTMLString += "<b>" + skillData.mainText + "</b> ";
		if (skillData.traits.length > 0) {
			HTMLString += " (" + skillData.traits.join(", ") + ") ";
		}
		additionalData.action = skillData;
		HTMLString += clean_description(skillData.subText, true, true, true, additionalData) + "<br />";
	}

	HTMLString += "<hr />";
	HTMLString += "<b>AC</b> " + creatureData.ac.value;
	if (creatureData.ac.details.length > 0) {
		HTMLString += " " + creatureData.ac.details;
	}
	HTMLString += "; <b>Fort</b> " + creatureData.saves.fortitude + ", "
	HTMLString += "<b>Ref</b> " + creatureData.saves.reflex + ", "
	HTMLString += "<b>Will</b> " + creatureData.saves.will

	if (creatureData.passiveDefenses.length > 0) {
		HTMLString += ";";
		for (var d in creatureData.passiveDefenses) {
			HTMLString += " " + creatureData.passiveDefenses[d].mainText;
			if (creatureData.passiveDefenses[d].subText.length > 0) {
				HTMLString += " (" + creatureData.passiveDefenses[d].subText + ")";
			}
		}
	}
	HTMLString += "<br /><b>HP </b>" + creatureData.hp.max;
	if (creatureData.hp.details.length > 0) {
		HTMLString += " (" + creatureData.hp.details + ")";
	}

	if (creatureData.immunities.length > 0) {
		creatureData.immunities.sort((a, b) => {
			let testA = a.type.toUpperCase();
			let testB = b.type.toUpperCase();
			if (testA < testB) {
				return -1;
			}
			if (testA > testB) {
				return 1;
			}
		});
		HTMLString += "; <b>Immunities</b> ";
		let immunityString = ""
		for (var imm in creatureData.immunities) {
			immunityString = immunityString + creatureData.immunities[imm].type + ", ";
		}
		HTMLString += immunityString.substring(0, immunityString.length - 2);
	}

	if (creatureData.resistances.length > 0) {
		creatureData.resistances.sort((a, b) => {
			const nameA = a.type.toUpperCase();
			const nameB = b.type.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
		});
		HTMLString += "; <b>Resistances</b> ";
		let resistancesString = ""
		for (var imm in creatureData.resistances) {
			resistancesString = resistancesString + creatureData.resistances[imm].type + " " + creatureData.resistances[imm].value;
			if ("exceptions" in creatureData.resistances[imm]) {
				resistancesString = resistancesString + " (except " + creatureData.resistances[imm].exceptions.join(", ") + ")";
			}
			resistancesString = resistancesString + "; ";
		}
		HTMLString += resistancesString.substring(0, resistancesString.length - 2);
	}

	if (creatureData.weaknesses.length > 0) {
		creatureData.weaknesses.sort((a, b) => {
			const nameA = a.type.toUpperCase();
			const nameB = b.type.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
		});
		HTMLString += "; <b>Weaknesses</b> ";
		let weaknessesString = ""
		for (var imm in creatureData.weaknesses) {
			weaknessesString = weaknessesString + creatureData.weaknesses[imm].type + " ";
			if (creatureData.weaknesses[imm].value > 0) {
				weaknessesString = weaknessesString + creatureData.weaknesses[imm].value;
			}
			if ("exceptions" in creatureData.weaknesses[imm]) {
				weaknessesString = weaknessesString + " (except " + creatureData.weaknesses[imm].exceptions.join(", ") + ")";
			}
			weaknessesString = weaknessesString + "; ";
		}
		HTMLString += weaknessesString.substring(0, weaknessesString.length - 2).replaceAll("-", " ");
	}

	HTMLString += "<br />";

	for (var feat in creatureData.otherDefenses) {
		let featData = creatureData.otherDefenses[feat];
		const regex = new RegExp(featData.name.replaceAll("(", "\\(").replaceAll(")", "\\)"), "gmi");
		if (!(regex.test(HTMLString))) {
			//MapTool.chat.broadcast(JSON.stringify(featData));
			let iconLookup = featData.actionType;
			if (featData.actionCost != null) {
				iconLookup = String(featData.actionCost) + iconLookup;
			}
			additionalData.action = featData;
			featData.description = clean_description(featData.description, true, true, true, additionalData);
			let traitText = "";
			if (featData.traits.length > 0) {
				traitText = " (" + featData.traits.join(", ") + ")";
			}
			let featString = "<b>" + featData.name + "</b>" + traitText + " " + icon_img(iconLookup, true) + " " + featData.description;
			//MapTool.chat.broadcast(featString.replace("<","&lt;"));
			HTMLString += featString;
			const testPattern = /<\/ul>$/
			if (!(testPattern.test(featString))) {
				HTMLString += "<br />";
			}
		}
	}
	HTMLString += "<hr />";

	if (tokenID != null) {
		let baseSpeed = Number(creatureData.speeds.base);
		let speedBonus = calculate_bonus(tokenID, ["speed", "land-speed"]);
		speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;

		HTMLString += "<b>Speed</b> " + String(Math.max(baseSpeed + speedBonus, 0)) + " feet";
		let otherSpeeds = "";
		for (var s in creatureData.speeds.other) {
			let speedData = creatureData.speeds.other[s];
			let otherSpeedBase = Number(speedData.value);
			let speedBonus = calculate_bonus(tokenID, ["speed", s]);
			speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;
			otherSpeeds = otherSpeeds + speedData.type + " " + String(otherSpeedBase + speedBonus) + " feet, ";
		}
		if (otherSpeeds.length > 0) {
			HTMLString += ", " + otherSpeeds.substring(0, otherSpeeds.length - 2) + "<br />";
		} else {
			HTMLString += "<br />"
		}
	} else {
		HTMLString += "<b>Speed</b> " + creatureData.speeds.base + " feet";
		let otherSpeeds = "";
		for (var s in creatureData.speeds.other) {
			let speedData = creatureData.speeds.other[s];
			otherSpeeds = otherSpeeds + speedData.type + " " + speedData.value + " feet, ";
		}
		if (otherSpeeds.length > 0) {
			HTMLString += ", " + otherSpeeds.substring(0, otherSpeeds.length - 2) + "<br />";
		} else {
			HTMLString += "<br />"
		}
	}

	for (var w in creatureData.basicAttacks) {
		let attackData = creatureData.basicAttacks[w];
		//MapTool.chat.broadcast(JSON.stringify(attackData));
		let attackString = "";
		if (attackData.isMelee) {
			attackString = "<b>Melee</b> ";
		} else {
			attackString = "<b>Ranged</b> ";
		}
		attackString = attackString + icon_img("1action", true) + " " + attackData.name + " +" + attackData.bonus;
		if ("agile" in attackData.traits) {
			attackString = attackString + " [" + pos_neg_sign(attackData.bonus - 4) + "/" + pos_neg_sign(attackData.bonus - 8) + "] ";
		} else {
			attackString = attackString + " [" + pos_neg_sign(attackData.bonus - 5) + "/" + pos_neg_sign(attackData.bonus - 10) + "] ";
		}
		if (attackData.traits.length > 0) {
			attackString = attackString + "(" + attackData.traits.join(", ").replaceAll("-", " ") + ")";
		}
		attackString = attackString + ", <b>Damage</b> ";
		let dmgStrings = [];
		for (var dmg in attackData.damage) {
			let dmgData = attackData.damage[dmg];
			dmgStrings.push(dmgData.damage + " " + dmgData.damageType);
		}
		attackString = attackString + dmgStrings.join(" plus ");

		if (attackData.effects.length > 1 && typeof (attackData.effects) == "object") {
			attackString += " plus " + attackData.effects.join(" and ").replaceAll("-", " ");
		} else if (attackData.effects.length == 1 && typeof (attackData.effects) == "object") {
			attackString += " plus " + attackData.effects[0].replaceAll("-", " ");
		} else if (typeof (attackData.effects) == "string") {
			attackString += "plus" + attackData.effects.replaceAll("-", " ");
		}
		additionalData.action = attackData;

		if (attackData.description.length > 0) {
			attackString = attackString + " " + clean_description(attackData.description, true, true, true, additionalData);
		}

		//MapTool.chat.broadcast(attackString);

		HTMLString += attackString + "<br />";
	}

	for (var s in creatureData.spellRules) {
		let theRules = creatureData.spellRules[s];
		//MapTool.chat.broadcast(s);
		//MapTool.chat.broadcast(JSON.stringify(theRules));
		theRules.spells.sort((a, b) => {
			//MapTool.chat.broadcast(JSON.stringify(a));
			let testA = a.castLevel;
			if (a.traits.value.includes("cantrip")) {
				testA = -1;
			}
			//MapTool.chat.broadcast(JSON.stringify(b));
			let testB = b.castLevel;
			if (b.traits.value.includes("cantrip")) {
				testB = -1;
			}
			if (a.name.includes("Constant") && b.name.includes("Constant")) {
				testA = testA - testB;
				testB = testB - testA;
			} else if (a.name.includes("Constant")) {
				testA = -1;
			} else if (b.name.includes("Constant")) {
				testB = -1;
			}
			if (testA > testB) {
				//MapTool.chat.broadcast("chose A");
				return -1;
			}
			if (testA < testB) {
				//MapTool.chat.broadcast("chose B");
				return 1;
			}
		});
		HTMLString += "<b>" + theRules.name + "</b> DC " + theRules.spellDC + ", attack +" + theRules.spellAttack;
		if (theRules.type == "focus") {
			HTMLString += " (" + creatureData.resources.focus.value + " Focus Point)";
		}
		let levelsPrinted = [];
		let firstCantrip = false;
		let firstConstant = false;
		let spellString = "";
		for (var aSpell in theRules.spells) {
			let spellData = theRules.spells[aSpell];
			//MapTool.chat.broadcast(JSON.stringify(spellData));
			if (!(firstCantrip) && (spellData.traits.value.includes("cantrip"))) {
				let cantripLevel = spellData.castLevel;
				spellString = spellString + "; <b>Cantrips (" + String(cantripLevel) + getOrdinal(cantripLevel) + ")</b> ";
				firstCantrip = true;
			} else if (!(firstConstant) && spellData.name.includes("Constant")) {
				spellString = spellString + "; <b>Constant</b> ";
				levelsPrinted = [];
				firstConstant = true;
				spellString = spellString + "<b>" + String(spellData.castLevel) + getOrdinal(spellData.castLevel) + "</b> ";
				levelsPrinted.push(spellData.castLevel);
			} else if (!(spellData.traits.value.includes("cantrip")) && !(levelsPrinted.includes(spellData.castLevel))) {
				spellString = spellString + "; <b>" + String(spellData.castLevel) + getOrdinal(spellData.castLevel) + "</b> ";
				levelsPrinted.push(spellData.castLevel);
			} else {
				spellString = spellString + ", ";
			}
			spellString = spellString + create_macroLink(spellData.name.replaceAll(" (Constant)", ""), "Spell_View_Frame@Lib:ca.pf2e", spellData.name.replaceAll(" (Constant)", "").replaceAll(/\(.*\)/g, "").trim());
		}

		HTMLString += spellString;
		HTMLString += "<br />";
	}

	for (var o in creatureData.offensiveActions) {
		let actionData = creatureData.offensiveActions[o];
		//MapTool.chat.broadcast(JSON.stringify(actionData));
		HTMLString += "<b>" + actionData.name + "</b> ";
		if (actionData.actionCost == 1 || actionData.actionCost == 2 || actionData.actionCost == 3) {
			HTMLString += icon_img(String(actionData.actionCost) + "action", true) + " ";
		}
		if (actionData.traits.length > 0) {
			HTMLString += "(" + actionData.traits.join(", ") + ") ";
		}
		additionalData.action = actionData;
		HTMLString += clean_description(actionData.description, true, true, true, additionalData);
		HTMLString += "<br />";
	}

	//MapTool.chat.broadcast(JSON.stringify(offensiveActions));

	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_creature_view", build_creature_view);