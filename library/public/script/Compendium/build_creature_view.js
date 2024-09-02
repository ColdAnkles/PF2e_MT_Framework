"use strict";

function build_creature_view(creatureName, tokenID = null, creatureData = null) {
	let token = null;
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).PF2E;

	let additionalData = { "rollDice": false };

	try {
		if (creatureData == null) {
			if (tokenID == null) {
				let property = JSON.parse(read_data("pf2e_npc"));
				creatureData = property[creatureName];
				if (creatureData == null) {
					property = JSON.parse(read_data("customContent")).npc;
					creatureData = property[creatureName];
				}
				if ("fileURL" in creatureData) {
					creatureData = rest_call(creatureData["fileURL"], "");
				}

				creatureData = parse_npc(creatureData);
			} else {
				token = MapTool.tokens.getTokenByID(tokenID);
				creatureData = read_creature_properties(tokenID);
			}
		}
		//MapTool.chat.broadcast(JSON.stringify(creatureData));

		if (creatureData.name.includes("Lib:")) {
			creatureData.name = creatureData.name.replaceAll("Lib:", "");
		}
		if (token != null) {
			additionalData.actor = token;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during basic-step");
		MapTool.chat.broadcast("creatureName: " + creatureName);
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	additionalData.level = creatureData.level;
	additionalData.variant = creatureData.foundryActor.variant;

	//MapTool.chat.broadcast(JSON.stringify(creatureData.senses));
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	let HTMLString = "";
	try {
		HTMLString += "<h1 class='title'><span>" + creatureData.name + "</span><span style='margin-left:auto; margin-right:0;'>Creature " + creatureData.level + "</span></h1>";
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during header-step");
		MapTool.chat.broadcast("creatureName: " + creatureName);
		MapTool.chat.broadcast("creatureData: " + JSON.stringify(creatureData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (creatureData.rarity != "common" && creatureData.rarity != "") {
			let normalRarity = capitalise(creatureData.rarity).split('-')[0];
			if ("traitDescription" + normalRarity in traitGlossary && traitGlossary["traitDescription" + normalRarity] != null) {
				HTMLString += "<span class='trait" + creatureData.rarity + "' title=\"" + traitGlossary["traitDescription" + normalRarity] + "\">" + capitalise(creatureData.rarity) + "</span>";
			} else {
				HTMLString += "<span class='trait" + creatureData.rarity + "'>" + capitalise(creatureData.rarity) + "</span>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during rarity-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	//HTMLString += "<span class='traitalignment'>" + capitalise(creatureData.alignment) + "</span>";
	let normalSize = capitalise(creatureData.size).split('-')[0];
	try {
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
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during trait-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	HTMLString += "<br />"
	try {
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
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during senses-languages");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let proficiencies = [];
	for (var s in creatureData.proficiencies) {
		proficiencies.push(creatureData.proficiencies[s].string);
	}

	if (creatureData.proficiencies.length > 0) {
		HTMLString += "<b>Skills</b> " + proficiencies.join(", ") + "<br/>";
	}
	HTMLString += "<b>Str</b> " + pos_neg_sign(creatureData.abilities.str) + ", ";
	HTMLString += "<b>Dex</b> " + pos_neg_sign(creatureData.abilities.dex) + ", ";
	HTMLString += "<b>Con</b> " + pos_neg_sign(creatureData.abilities.con) + ", ";
	HTMLString += "<b>Int</b> " + pos_neg_sign(creatureData.abilities.int) + ", ";
	HTMLString += "<b>Wis</b> " + pos_neg_sign(creatureData.abilities.wis) + ", ";
	HTMLString += "<b>Cha</b> " + pos_neg_sign(creatureData.abilities.cha) + "<br />";

	try {
		let itemText = "";
		for (var i in creatureData.inventory) {
			let itemData = creatureData.inventory[i];
			if (itemData.quantity > 1) {
				itemText = itemText + itemData.quantity + " ";
			}
			itemText = itemText + itemData.name
			if (itemData.hp > 0) {
				itemText = itemText + "(Hardness " + itemData.hardness + ", HP " + itemData.hp + ", BT " + itemData.hp / 2 + ")";
			}
			itemText = itemText + ", ";
		}

		if (Object.keys(creatureData.inventory).length > 0) {
			HTMLString += "<b>Items</b> " + itemText.substring(0, itemText.length - 2) + "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during items-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//try {
	//	for (var pSkill in creatureData.passiveSkills) {
	//		let skillData = creatureData.passiveSkills[pSkill];
	//		HTMLString += "<b>" + skillData.name + "</b> ";
	//		if (skillData.system.traits.length > 0) {
	//			HTMLString += " (" + skillData.traits.join(", ") + ") ";
	//		}
	//		additionalData.action = skillData;
	//		HTMLString += clean_description(skillData.system.description.value, true, true, true, additionalData) + "<br />";
	//	}
	//} catch (e) {
	////	MapTool.chat.broadcast("Error in build_creature_view during skills-step");
	//MapTool.chat.broadcast("" + e + "\n" + e.stack);
	//	return;
	//}

	HTMLString += "<hr />";
	HTMLString += "<b>AC</b> " + creatureData.ac.value;
	if (creatureData.ac.details.length > 0) {
		HTMLString += " " + creatureData.ac.details;
	}
	HTMLString += "; <b>Fort</b> +" + creatureData.saves.fortitude + ", "
	HTMLString += "<b>Ref</b> +" + creatureData.saves.reflex + ", "
	HTMLString += "<b>Will</b> +" + creatureData.saves.will

	try {
		if (creatureData.passiveDefenses.length > 0) {
			HTMLString += ";";
			for (var d in creatureData.passiveDefenses) {
				HTMLString += " " + creatureData.passiveDefenses[d].name;
				if (creatureData.passiveDefenses[d].system.description.value.length > 0) {
					HTMLString += " (" + clean_description(creatureData.passiveDefenses[d].system.description.value, true, true, true, additionalData) + ")";
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during passive-def-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
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

	try {
		for (var feat in creatureData.passiveSkills) {
			let featData = creatureData.passiveSkills[feat];
			let featString = "<b>" + featData.name + "</b> " + clean_description(featData.system.description.value, true, true, true, additionalData);
			HTMLString += featString + "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during passive-skills-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	HTMLString += "<hr />";

	try {
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
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during speed-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var w in creatureData.basicAttacks) {
			let attackData = creatureData.basicAttacks[w];
			//MapTool.chat.broadcast(JSON.stringify(attackData));
			let attackString = "";
			if (attackData.type == "melee") {
				attackString = "<b>Melee</b> ";
			} else {
				attackString = "<b>Ranged</b> ";
			}
			attackString = attackString + icon_img("1action", themeData.icons == "W") + " " + attackData.name + " +" + attackData.system.bonus.value;
			if ("agile" in attackData.system.traits) {
				attackString = attackString + " [" + pos_neg_sign(attackData.system.bonus.value - 4) + "/" + pos_neg_sign(attackData.system.bonus.value - 8) + "] ";
			} else {
				attackString = attackString + " [" + pos_neg_sign(attackData.system.bonus.value - 5) + "/" + pos_neg_sign(attackData.system.bonus.value - 10) + "] ";
			}
			if (attackData.system.traits.value.length > 0) {
				attackString = attackString + "(" + attackData.system.traits.value.join(", ").replaceAll("-", " ") + ")";
			}
			attackString = attackString + ", <b>Damage</b> ";
			let dmgStrings = [];
			for (var dmg in attackData.system.damageRolls) {
				let dmgData = attackData.system.damageRolls[dmg];
				dmgStrings.push(dmgData.damage + " " + dmgData.damageType);
			}
			attackString = attackString + dmgStrings.join(" plus ");
			if (attackData.system.attackEffects.length > 1 && typeof (attackData.system.attackEffects) == "object" && "custom" in attackData.system.attackEffects && attackData.system.attackEffects.custom != "") {
				attackString += " plus " + attackData.system.attackEffects.join(" and ").replaceAll("-", " ");
			} else if (attackData.system.attackEffects.length == 1 && typeof (attackData.system.attackEffects) == "object") {
				attackString += " plus " + attackData.system.attackEffects[0].replaceAll("-", " ");
			} else if (typeof (attackData.system.attackEffects) == "string") {
				attackString += "plus" + attackData.system.attackEffects.replaceAll("-", " ");
			}
			additionalData.action = attackData;

			if (attackData.system.description.value.length > 0) {
				attackString = attackString + " " + clean_description(attackData.system.description.value, true, true, true, additionalData);
			}

			//MapTool.chat.broadcast(attackString);

			HTMLString += attackString + "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during attacks-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var s in creatureData.spellRules) {
			let theRules = creatureData.spellRules[s];
			//MapTool.chat.broadcast(s);
			//MapTool.chat.broadcast(JSON.stringify(theRules));
			theRules.spells.sort((a, b) => {
				//MapTool.chat.broadcast(JSON.stringify(a));
				let testA = a.system.castLevel.value;
				if (a.system.traits.value.includes("cantrip")) {
					testA = -1;
				}
				//MapTool.chat.broadcast(JSON.stringify(b));
				let testB = b.system.castLevel.value;
				if (b.system.traits.value.includes("cantrip")) {
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
			HTMLString += "<b>" + theRules.name + "</b> DC " + theRules.spellDC + ((theRules.name != "Rituals") ? ", attack +" + theRules.spellAttack : "");
			if (theRules.type == "focus") {
				HTMLString += " " + creatureData.resources.focus.value + " Focus Point";
			}
			if ("description" in theRules && theRules.description != "") {
				HTMLString += " (" + theRules.description + ")";
			}
			let levelsPrinted = [];
			let firstCantrip = false;
			let firstConstant = false;
			let spellString = "";
			for (var aSpell in theRules.spells) {
				let spellData = theRules.spells[aSpell];
				//MapTool.chat.broadcast(JSON.stringify(spellData));
				if (!(firstCantrip) && (spellData.system.traits.value.includes("cantrip"))) {
					let cantripLevel = spellData.system.castLevel.value;
					spellString = spellString + "; <b>Cantrips (" + String(cantripLevel) + getOrdinal(cantripLevel) + ")</b> ";
					firstCantrip = true;
				} else if (!(firstConstant) && spellData.name.includes("Constant")) {
					spellString = spellString + "; <b>Constant</b> ";
					levelsPrinted = [];
					firstConstant = true;
					spellString = spellString + "<b>" + String(spellData.system.castLevel.value) + getOrdinal(spellData.system.castLevel.value) + "</b> ";
					levelsPrinted.push(spellData.system.castLevel.value);
				} else if (!(spellData.system.traits.value.includes("cantrip")) && !(levelsPrinted.includes(spellData.system.castLevel.value))) {
					spellString = spellString + "; <b>" + String(spellData.system.castLevel.value) + getOrdinal(spellData.system.castLevel.value) + "</b> ";
					levelsPrinted.push(spellData.system.castLevel.value);
				} else {
					spellString = spellString + ", ";
				}
				spellString = spellString + create_macroLink(spellData.name.replaceAll(" (Constant)", ""), "Spell_View_Frame@Lib:ca.pf2e", spellData.name.replaceAll(" (Constant)", "").replaceAll(/\(.*\)/g, "").trim());
			}

			HTMLString += spellString;
			HTMLString += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during spells-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var o in creatureData.offensiveActions) {
			let actionData = creatureData.offensiveActions[o];
			//MapTool.chat.broadcast(JSON.stringify(actionData));
			HTMLString += "<b>" + actionData.name + "</b> ";
			let actionCost = actionData.system.actions.value
			if (actionCost == 1 || actionCost == 2 || actionCost == 3) {
				HTMLString += icon_img(String(actionCost) + "action", themeData.icons == "W") + " ";
			}
			if (actionData.system.traits.length > 0) {
				HTMLString += "(" + actionData.traits.join(", ") + ") ";
			}
			additionalData.action = actionData;
			HTMLString += clean_description(actionData.system.description.value, true, true, true, additionalData);
			HTMLString += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_creature_view during offensive-actions-step");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//MapTool.chat.broadcast(JSON.stringify(offensiveActions));

	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_creature_view", build_creature_view);