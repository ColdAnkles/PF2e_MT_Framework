"use strict";

function parse_foundry_strings(foundryString, altBracketRegexp = false) {
	//bracketRegexp Changed Multiple times - Treat Wounds good example to test with
	let bracketRegexp = /\[+(.*?\]?)\]+/;
	if (altBracketRegexp) {
		bracketRegexp = /\[\[+(.*?)\]\]+/;
	}
	const braceRegexp = /\]\{(.*?)\}/;

	//MapTool.chat.broadcast(foundryString);

	let bracketContents = foundryString.match(bracketRegexp);
	let braceContents = foundryString.match(braceRegexp);

	if (bracketContents != null && bracketContents.length > 1) {
		bracketContents = bracketContents[1]
	}
	if (braceContents != null && braceContents.length > 1) {
		braceContents = braceContents[1]
	}
	let returnData = { "bracketContents": bracketContents, "braceContents": braceContents, "bracketDetail": {} }
	//MapTool.chat.broadcast(JSON.stringify(returnData));
	for (var d in bracketContents.split("|")) {
		let tempString = bracketContents.split("|")[d];
		let splitString = tempString.split(":")
		let key = splitString[0];
		let value = "";
		if (splitString.length > 1) {
			value = splitString.slice(1).join(":").split(',');
		} else {

		}
		returnData.bracketDetail[key] = value;
	}
	//MapTool.chat.broadcast(JSON.stringify(returnData));
	return returnData
}

function parse_template(templateString) {
	//MapTool.chat.broadcast(JSON.stringify(templateString));
	let parsed = parse_foundry_strings(templateString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));
	if (parsed.braceContents != null) {
		return parsed.braceContents;
	} else if (("type" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot " + parsed.bracketDetail.type.join(", ");
	} else if (("cone" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot cone";
	} else if (("line" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot line";
	} else if (("emanation" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot emanation";
	} else if (("burst" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot burst";
	}

	return templateString;
}

function parse_damage(damageString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true }) {
	let parsed = parse_foundry_strings(damageString);
	let addDamage = 0;

	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	if (additionalData.variant == "elite" && "action" in additionalData && (additionalData.action.system.category == "offensive" || additionalData.action.type == "spell")) {
		addDamage = 2;
	} else if (additionalData.variant == "weak" && "action" in additionalData && (additionalData.action.system.category == "offensive" || additionalData.action.type == "spell")) {
		addDamage = -2;
	}
	if ("action" in additionalData && (additionalData.action.system.description.value.toLowerCase().includes("recharge") || additionalData.action.type == "spell")) {
		addDamage = addDamage * 2;
	}
	//MapTool.chat.broadcast(JSON.stringify(parsed));
	let diceMatch = parsed.bracketContents.match(/([0-9d +-]+)/gm);
	//MapTool.chat.broadcast(JSON.stringify(diceMatch));
	if (additionalData.rollDice || !diceMatch[0].includes("d")) {
		if (diceMatch.length > 0) {
			diceMatch = diceMatch[0];
			let finalDice = group_dice(diceMatch + "+" + String(addDamage));
			let rolledDice = roll_dice(finalDice);
			if (!diceMatch.includes("d")) {
				parsed.bracketContents = parsed.bracketContents.replace(diceMatch, String(rolledDice));
			} else {
				parsed.bracketContents = parsed.bracketContents.replace(diceMatch, finalDice + " (" + String(rolledDice) + ") ");
			}
			return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm, "$1 $2").replaceAll(/(.*)\[(.*)\]/gm, "$1 $2");
		} else {
			let dice = group_dice(diceMatch[0] + "+" + String(addDamage));
			return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm, dice + " $2").replaceAll(/(.*)\[(.*)\]/gm, dice + " $2");
		}
	} else {
		let dice = group_dice(diceMatch[0] + "+" + String(addDamage));
		return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm, dice + " $2").replaceAll(/(.*)\[(.*)\]/gm, dice + " $2");
	}
}

function parse_uuid(uuidString, additionalData = { "rollDice": false }) {
	let parsed = parse_foundry_strings(uuidString);

	//MapTool.chat.broadcast(JSON.stringify(parsed));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	if (parsed.braceContents != null) {
		uuidString = parsed.braceContents;
	} else if ("Compendium.pf2e.bestiary-effects.Item.Effect" in parsed.bracketDetail) {
		uuidString = "";
	} else if (parsed.bracketContents.includes("spell-effects") && !additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(/[^(Vs)]\./);
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(effectName), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "effect", "itemName": effectName });
	} else if (parsed.bracketContents.includes("spell-effects") && additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(/[^(Vs)]\./);
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink("Apply " + effectName, "Apply_Effect_Query@Lib:ca.pf2e", { "effectName": effectName, "effectSource": additionalData.item });
	} else if (parsed.bracketContents.includes("Effect") && !additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(".");
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(effectName), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "effect", "itemName": effectName });
	} else if (parsed.bracketContents.includes("Effect") && additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(".");
		let effectName = tempArray[tempArray.length - 1];
		tempArray = tempArray[tempArray.length - 1].split(":");
		uuidString = create_macroLink("Apply " + effectName, "Apply_Effect_Query@Lib:ca.pf2e", { "effectName": effectName, "effectSource": additionalData.item });
	} else if (parsed.bracketContents.includes("spells-srd")) {
		let tempArray = parsed.bracketContents.split(".");
		let spellName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(spellName), "Spell_View_Frame@Lib:ca.pf2e", spellName);
	} else if (parsed.bracketContents.includes("conditionitems")) {
		let tempArray = parsed.bracketContents.split(".");
		let conditionName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(conditionName), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "condition", "itemName": conditionName });
	} else if (parsed.bracketContents.includes("actionspf2e")) {
		let tempArray = parsed.bracketContents.split(".");
		let actionName = tempArray[tempArray.length - 1];
		uuidString = actionName;
	} else if (parsed.bracketContents.includes("feats-srd")) {
		let tempArray = parsed.bracketContents.split(".");
		let featName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(featName), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "feat", "itemName": featName });
	} else if (parsed.bracketContents.includes("classfeatures")) {
		let tempArray = parsed.bracketContents.split(".");
		let featName = tempArray[tempArray.length - 1];
		uuidString = featName;
	} else if (parsed.bracketContents.includes("equipment-srd.Item")) {
		let tempArray = parsed.bracketContents.split(".");
		let itemName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(itemName), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "item", "itemName": itemName });
	} else if (parsed.bracketContents.includes("pf2e-macros")) {
		uuidString = "";
	}
	//MapTool.chat.broadcast(uuidString);
	return uuidString;

}

function parse_check(checkString, additionalData = { "variant": "normal" }) {
	let skillList = ["acrobatics", "arcana", "athletics", "crafting", "deception", "diplomacy", "intimidation", "medicine", "nature", "occultism", "performance", "religion", "society", "stealth", "survival", "thievery"]
	let parsed = parse_foundry_strings(checkString);
	let data = parsed.bracketContents.split("|");
	let dcMod = 0;
	if (additionalData.variant == "elite") {
		dcMod = 2;
	} else if (additionalData.variant == "weak") {
		dcMod = -2;
	}

	//MapTool.chat.broadcast(JSON.stringify(parsed));
	//MapTool.chat.broadcast(JSON.stringify(data));

	checkString = "";

	if (data.length == 1) {
		return data[0];
	}

	let checkDC = ""
	let checkSkill = ""

	for (var i in data) {
		i = data[i];
		if (i.includes("dc")) {
			checkDC = "DC " + String(Number(i.split(":")[1]) + dcMod) + " ";
		} else if (skillList.includes(i)) {
			checkSkill = i.charAt(0).toUpperCase() + i.slice(1) + " ";
		}
	}

	checkString = checkDC + checkSkill;

	if (data.includes("basic")) {
		checkString += "basic "
	}

	if (data.includes("will")) {
		checkString += "Will"
	} else if (data.includes("reflex")) {
		checkString += "Reflex"
	} else if (data.includes("fortitude") || data.includes("fort")) {
		checkString += "Fortitude"
	}

	return checkString;
}

function parse_localize(localizeString, additionalData) {
	let parsed = parse_foundry_strings(localizeString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));

	if (parsed.bracketContents != "") {
		let keySplit = parsed.bracketContents.split(".");
		let glossaryData = JSON.parse(read_data("pf2e_glossary"));
		for (var k in keySplit) {
			if (!(keySplit[k] in glossaryData)) {
				return "";
			}
			glossaryData = glossaryData[keySplit[k]]
		}
		return glossaryData;
	}

	//if (parsed.bracketContents.includes("NPC.Abilities")) {
	//	let tempArray = parsed.bracketContents.split(".");
	//	let abilityName = tempArray[tempArray.length - 1];
	//	let actionList = JSON.parse(read_data("pf2e_glossary")).PF2E;
	//	if (abilityName in actionList) {
	//		let actionDesc = actionList[abilityName];
	//		return "<br />" + clean_description(actionDesc, additionalData.removeLineBreaks, additionalData.removeHR, additionalData.removeP, additionalData);
	//	}
	//}

	return "";
}

function parse_roll(rollString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true }) {
	//MapTool.chat.broadcast(rollString);
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
	if (rollString.includes("/br") || rollString.includes("/gmr") || (!(rollString.substring(1, 4).includes("(")) || !(rollString.includes(")")))) {
		//MapTool.chat.broadcast("Case One");
		let parsed = parse_foundry_strings(rollString, true);
		//MapTool.chat.broadcast(JSON.stringify(parsed));
		if (parsed.braceContents != null) {
			try{
				if (additionalData.rollDice) {
					let diceMatch = parsed.braceContents.match(/([0-9+ d-]*)/g);
					//MapTool.chat.broadcast(JSON.stringify(diceMatch));
					if (diceMatch.length > 0) {
						diceMatch = diceMatch[0].replaceAll("/r ", "").replaceAll("/r", "");
						let rolledDice = roll_dice(diceMatch);
						let replaceString = "";
						if (diceMatch.includes("d") && rollString.includes("/r")) {
							replaceString = diceMatch + " (" + String(rolledDice) + ") ";
						} else if (diceMatch.includes("d") && (rollString.includes("/br") || rollString.includes("/gmr")) && !additionalData.gm) {
							if (additionalData.replaceGMRolls) {
								replaceString = diceMatch;
							} else {
								return rollString;
							}
						} else if (diceMatch.includes("d") && (rollString.includes("/br") || rollString.includes("/gmr")) && additionalData.gm) {
							replaceString = diceMatch + " (" + String(rolledDice) + ") ";
						} else {
							replaceString = diceMatch;
						}
						return parsed.braceContents.replace(diceMatch, replaceString);
					} else {
						return parsed.braceContents;
					}
				} else {
					return parsed.braceContents;
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in parse_roll during case one - brace contents");
				MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
				MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		} else {
			try{
				if (additionalData.rollDice) {
					let diceMatch = parsed.bracketContents.match(/\/r ([0-9+ d-]*)[^[]]*/g);
					//MapTool.chat.broadcast(JSON.stringify(diceMatch));
					if (diceMatch.length > 0) {
						diceMatch = diceMatch[0];
						let dice = diceMatch.replaceAll("/r ", "").replaceAll("/r", "");
						let replaceString = "";
						if (dice.includes("d") && additionalData.rollDice) {
							replaceString = String(roll_dice(dice));
						} else {
							replaceString = dice;
						}
						if(rollString.includes("#")){
							return replaceString;
						}
						return parsed.bracketContents.replace(diceMatch, replaceString);
					} else {
						return parsed.bracketContents;
					}
				} else {
					return parsed.bracketContents.replace(/\/r ([0-9+ d-]*).*/g, "$1");
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in parse_roll during case one - null brace contents");
				MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
				MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		}
	} else {
		try{
			const rollRegexp = /\(([^[\]]*)\)/g;
			const infoRegexp = /\[([^[\]]*)\]/g;
			let rollMatch = [...rollString.matchAll(rollRegexp)];
			let infoMatch = [...rollString.matchAll(infoRegexp)];
			//MapTool.chat.broadcast("Case Two");
			//MapTool.chat.broadcast(rollString);
			//MapTool.chat.broadcast(JSON.stringify(rollMatch));
			//MapTool.chat.broadcast(JSON.stringify(infoMatch));
			if (rollMatch != null && rollMatch.length > 0) {
				rollMatch = rollMatch[rollMatch.length - 1];
			}
			if (infoMatch != null && infoMatch.length > 0) {
				infoMatch = infoMatch[infoMatch.length - 1];
			}
			if (rollMatch != null && rollMatch.length > 0) {
				rollMatch = rollMatch[rollMatch.length - 1];
			}
			if (infoMatch != null && infoMatch.length > 0) {
				infoMatch = infoMatch[infoMatch.length - 1];
			}

			if (rollMatch.includes("@level") && "level" in additionalData) {
				rollMatch = rollMatch.replaceAll("@level", String(additionalData.level));
			} else if (rollMatch.includes("@item.level") && "level" in additionalData) {
				rollMatch = rollMatch.replaceAll("@item.level", String(additionalData.level));
			} else if (rollMatch.includes("@actor.level") && "level" in additionalData) {
				rollMatch = rollMatch.replaceAll("@actor.level", String(additionalData.level));
			}

			if ((additionalData.rollDice && !(rollMatch.includes("d"))) || !(rollMatch.includes("d"))) {
				rollMatch = String(eval(rollMatch));
			} else if (additionalData.rollDice) {
				rollMatch = String(roll_dice(rollMatch));
			}

			//MapTool.chat.broadcast(rollMatch);
			//MapTool.chat.broadcast(infoMatch);

			return rollMatch + " " + infoMatch.replaceAll(",", " ");
		} catch (e) {
			MapTool.chat.broadcast("Error in parse_roll during case two");
			MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}

	return rollString;
}

function parse_resolve(resolveString, additionalData) {
	let resolved = resolveString;
	let parsed = [...resolveString.matchAll(/\((.*)\)/g)]

	//MapTool.chat.broadcast(resolveString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));

	if (parsed != null && parsed.length > 0) {
		parsed = parsed[parsed.length - 1];
	}
	if (parsed != null && parsed.length > 0) {
		parsed = parsed[parsed.length - 1];
	}

	if (parsed == "@actor.attributes.spellDC.value") {
		if ("actor" in additionalData && "action" in additionalData && "traits" in additionalData.action) {
			let castingAbilities = JSON.parse(additionalData.actor.getProperty("spellRules"));
			let castingAbility = null;
			for (var ca in castingAbilities) {
				if (additionalData.action.traits.includes(ca.toLowerCase())) {
					castingAbility = Number(additionalData.actor.getProperty(castingAbilities[ca].castingAbility));
				}
			}
			let castStats = ["arcana", "occult", "nature", "religion"];
			for (var c in castStats) {
				if (additionalData.action.traits.includes(castStats[c])) {
					let castName = "Casting" + capitalise(castStats[c]);
					let actorProfs = JSON.parse(additionalData.actor.getProperty("proficiencies"));
					for (var p in actorProfs) {
						if (actorProfs[p].name == castName) {
							return String(Number(actorProfs[p].bonus + 10 + castingAbility));
						}
					}
				}
			}

		}
	}


	return resolved;
}

function clean_calculations(calculationString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true }) {
	//MapTool.chat.broadcast(calculationString);
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
	if (calculationString.includes("@level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@level", String(additionalData.level));
	} else if (calculationString.includes("@item.level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@item.level", String(additionalData.level));
	} else if (calculationString.includes("@item.rank") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@item.rank", String(additionalData.level));
	} else if (calculationString.includes("@actor.level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@actor.level", String(additionalData.level));
	}
	let completedCalculation = eval(calculationString)
	return String(completedCalculation);
}

function clean_description(description, removeLineBreaks = true, removeHR = true, removeP = true, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true, "invertImages": true }) {
	//MapTool.chat.broadcast(description.replaceAll("<","&lt;"));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	additionalData.removeP = removeP;
	additionalData.removeHR = removeHR;
	additionalData.removeLineBreaks = removeLineBreaks;

	if (!("removeP" in additionalData)) {
		additionalData.removeP = true;
	}
	if (!("removeHR" in additionalData)) {
		additionalData.removeHR = true;
	}
	if (!("removeLineBreaks" in additionalData)) {
		additionalData.removeLineBreaks = true;
	}
	if (!("invertImages" in additionalData)) {
		additionalData.invertImages = true;
	}
	if ("actor" in additionalData && !("level" in additionalData)) {
		additionalData.level = additionalData.actor.getProperty("level");
	}

	let cleanDescription = description;

	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">1.?<\/span>/g, icon_img("1action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">2.?<\/span>/g, icon_img("2action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">3.?<\/span>/g, icon_img("3action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">R.?<\/span>/g, icon_img("reaction", additionalData.invertImages) + " ");

	if (removeP) {
		cleanDescription = cleanDescription.replaceAll("<p>", "").replaceAll(".</p>", ". ").replaceAll("</p>", " ");
	} else {
		cleanDescription = cleanDescription.replaceAll("<p>", "").replaceAll(".</p>", ".<br />").replaceAll("</p>", "<br />");
	}
	if (removeLineBreaks) {
		cleanDescription = cleanDescription.replaceAll("<br/>", "").replaceAll(/\n/mg, "")
	}
	if (removeHR) {
		cleanDescription = cleanDescription.replaceAll("<hr />", "");
	}

	//Horrible Regex to balance parens
	let calculation_matches = cleanDescription.match(/((floor|ceil|max|min)\([^d)(]*(?:\([^d)(]*(?:\([^d)(]*(?:\([^d)(]*\)[^d)(]*)*\)[^d)(]*)*\)[^d)(]*)*\))/gm);
	for (var m in calculation_matches) {
		let replaceString = clean_calculations(calculation_matches[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(calculation_matches[m], replaceString);
	}

	let resolve_matches = cleanDescription.match(/resolve\([^()]*\)/gm);
	for (var m in resolve_matches) {
		let replaceString = parse_resolve(resolve_matches[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(resolve_matches[m], replaceString);
	}

	let template_matches = cleanDescription.match(/(@Template\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in template_matches) {
		let replaceString = parse_template(template_matches[m]);
		cleanDescription = cleanDescription.replaceAll(template_matches[m], replaceString);
	}

	let damage_matches = cleanDescription.match(/(@Damage\[.*?\]?\])({.*?})?/gm);
	for (var m in damage_matches) {
		let replaceString = parse_damage(damage_matches[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(damage_matches[m], replaceString);
	}

	let check_matches = cleanDescription.match(/(@Check\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in check_matches) {
		let replaceString = parse_check(check_matches[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(check_matches[m], replaceString);
	}

	let uuid_matches = cleanDescription.match(/(@UUID\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in uuid_matches) {
		let replaceString = parse_uuid(uuid_matches[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(uuid_matches[m], replaceString);
	}

	let localize_matches = cleanDescription.match(/@Localize\[.*\]/gm);
	for (var m in localize_matches) {
		let replaceString = clean_description(parse_localize(localize_matches[m], additionalData), false, removeHR, false, additionalData);
		cleanDescription = cleanDescription.replaceAll(localize_matches[m], replaceString);
	}

	let roll_matchesA = cleanDescription.match(/(\[\[+\/g?m?b?r.*?\]\]+)(\{.*?\})?/gm);
	for (var m in roll_matchesA) {
		let replaceString = parse_roll(roll_matchesA[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(roll_matchesA[m], replaceString);
	}

	let roll_matchesB = cleanDescription.match(/(\[+\/g?m?b?r.*?\]+)(\{.*?\})?/gm);
	for (var m in roll_matchesB) {
		let replaceString = parse_roll(roll_matchesB[m], additionalData);
		cleanDescription = cleanDescription.replaceAll(roll_matchesB[m], replaceString);
	}

	cleanDescription = cleanDescription.replaceAll(/\[\[\/act.*\]\]{(.*)}/g, "$1");

	cleanDescription = cleanDescription.replaceAll(/\[\[\/act(.*)\]\]/g, "$1");

	cleanDescription = cleanDescription.replaceAll(/\[(.*)\|.*\]/g, " $1 ");

	cleanDescription = cleanDescription.replaceAll("emanation Aura", "Aura");

	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">1</span>", icon_img("1action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">2</span>", icon_img("2action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">3</span>", icon_img("3action"));

	//MapTool.chat.broadcast(cleanDescription.replaceAll("<","&lt;"));

	return cleanDescription;
}


MTScript.registerMacro("ca.pf2e.clean_description", clean_description);