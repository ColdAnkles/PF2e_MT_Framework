"use strict";

function skill_check(checkToken, altStat = false, checkData = null, extraScopes = [], silent = false) {
	//MapTool.chat.broadcast(JSON.stringify(extraScopes));
	altStat = Boolean(altStat);
	if (typeof (checkToken) == "string") {
		checkToken = MapTool.tokens.getTokenByID(checkToken);
	}
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	let skills = {
		"Acrobatics": { "name": "Acrobatics", "stat": "dex" },
		"Arcana": { "name": "Arcana", "stat": "int" },
		"Athletics": { "name": "Athletics", "stat": "str" },
		"Crafting": { "name": "Crafting", "stat": "int" },
		"Deception": { "name": "Deception", "stat": "cha" },
		"Diplomacy": { "name": "Diplomacy", "stat": "cha" },
		"Intimidation": { "name": "Intimidation", "stat": "cha" },
		"Medicine": { "name": "Medicine", "stat": "wis" },
		"Nature": { "name": "Nature", "stat": "wis" },
		"Occultism": { "name": "Occultism", "stat": "int" },
		"Perception": { "name": "Perception", "stat": "wis" },
		"Performance": { "name": "Performance", "stat": "cha" },
		"Religion": { "name": "Religion", "stat": "wis" },
		"Society": { "name": "Society", "stat": "int" },
		"Stealth": { "name": "Stealth", "stat": "dex" },
		"Survival": { "name": "Survival", "stat": "wis" },
		"Thievery": { "name": "Thievery", "stat": "dex" }
	};

	let stats = ["str", "dex", "con", "int", "wis", "cha"];

	if (checkData === null) {
		try {
			let queryHTML = "<html>";

			let skillStrings = {};

			let statStrings = {};

			if (altStat) {
				for (var s in stats) {
					statStrings[s] = { "name": stats[s], "string": (capitalise(stats[s]) + " +" + checkToken.getProperty(stats[s])) };
				}
			}

			let tokenType = get_token_type(checkToken);

			for (var p in skills) {
				let skillData = skills[p];
				let abilityMod = checkToken.getProperty(skillData.stat);
				skillStrings[skillData.name] = skillData.name + " " + pos_neg_sign(abilityMod) + ((checkToken.isPC()) ? " (U)" : "");
			}

			let profList = JSON.parse(checkToken.getProperty("proficiencies"));

			for (var p in profList) {
				let profData = profList[p];
				if (!(profData.name in skills) && !(profData.name.includes("Lore"))) {
					continue
				}
				let attMod = 0;
				if (profData.name in skills) {
					attMod = Number(checkToken.getProperty(skills[profData.name].stat));
				} else if (profData.name.includes("Lore")) {
					attMod = Number(checkToken.getProperty("int"));
				}

				let displayNumber = profData.bonus;
				if (tokenType == "PC") {
					if (!altStat) {
						displayNumber = profData.bonus + attMod;
					} else {
						displayNumber = profData.bonus;
					}
				} else {
					if (altStat) {
						displayNumber = profData.bonus - attMod;
					}
				}
				skillStrings[profData.name] = profData.name + " " + pos_neg_sign(displayNumber);
				if (profData.pName != "") {
					skillStrings[profData.name] += " (" + profData.pName + ")"
				} else {
					skillStrings[profData.name] += " (U)"
				}
			}



			queryHTML += "<table width=100% class='staticTable'><link rel=\"stylesheet\" type=\"text/css\" href=\"lib://ca.pf2e/css/" + themeData.css + "\"><form action='macro://Skill_Check_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
			queryHTML += "<input type='hidden' name='checkTokenID' value='" + checkToken.getId() + "'>";
			queryHTML += "<input type='hidden' name='tokenType' value='" + tokenType + "'>";
			queryHTML += "<input type='hidden' name='secretCheck' value='0'>";
			queryHTML += "<input type='hidden' name='altStat' value='" + Number(altStat) + "'>";
			queryHTML += "<input type='hidden' name='extraScopes' value='" + JSON.stringify(extraScopes) + "'>";
			queryHTML += "<input type='hidden' name='useMAP' value='0'>";
			queryHTML += "<input type='hidden' name='increaseMAP' value='0'>";

			queryHTML += "<tr><th colspan='5' style='text-align:center'><b>Skill Check</b></th></tr>";
			queryHTML += "<tr><td " + ((altStat) ? "" : "colspan='2'") + ">Skill:</td><td " + ((altStat) ? "" : "colspan='3'") + "><select name='skillName'>";
			for (var s in skillStrings) {
				queryHTML += "<option value='" + s + "'>" + skillStrings[s] + "</option>";
			}
			queryHTML += "</select></td>";

			if (altStat) {
				queryHTML += "<td>Attribute:</td><td colspan=2><select name='statName'>";
				for (var s in statStrings) {
					queryHTML += "<option value='" + statStrings[s].name + "'>" + statStrings[s].string + "</option>";
				}
				queryHTML += "</select></td>";
			}
			queryHTML += "</tr>";

			queryHTML += "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
			<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='cMalus' value='0' size='2'></input></td></tr>";

			queryHTML += "<tr><td>Secret Check?</td><td><input type='checkbox' id='secretCheck' name='secretCheck' value='1'></td>\
			<td>Status:</b></td><td>+<input type='text' name='sBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='sMalus' value='0' size='2'></input></td></tr>";

			queryHTML += "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >" + checkToken.getName() + " tries to be skillful.</textarea></td>\
			<td>Item:</b></td><td>+<input type='text' name='iBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='iMalus' value='0' size='2'></input></td></tr>";

			queryHTML += "<tr><td colspan='2' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td>\
			<td>Other:</b></td><td>+<input type='text' name='oBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='oMalus' value='0' size='2'></input></td></tr>";

			let initiative = get_initiative(checkToken.getId());
			if (!(isNaN(initiative))) {
				queryHTML += "<tr><td colspan='2' style='text-align:center'>Use MAP:<input type='checkbox' id='useMAP' name='useMAP' value='useMAP'></td>\
				<td colspan='3' style='text-align:center'>Increase MAP:<input type='checkbox' id='increaseMAP' name='increaseMAP' value='increaseMAP'></td></tr>";
			}
			//queryHTML += "<tr><td colspan='5' style='text-align:center'>Secret Check:<input type='checkbox' id='secretCheck' name='secretCheck' value='secretCheck'></td></tr>";

			queryHTML += "<tr><td colspan='5' style='text-align:center'><input type='submit' name='skillCheckSubmit' value='Submit'></td></tr>";

			queryHTML += "</form></table></html>"

			MTScript.setVariable("queryHTML", queryHTML);
			let windowHeight = 360;
			if (!(isNaN(initiative))) {
				windowHeight += 20;
			}
			MTScript.evalMacro("[dialog5('Skill Check','width=600;height=" + String(windowHeight) + ";temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");

		} catch (e) {
			MapTool.chat.broadcast("Error in checkData-NULL during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	} else {
		//MapTool.chat.broadcast("Submitted :" + JSON.stringify(checkData));
		try {

			if (!("cBonus" in checkData)) {
				checkData.cBonus = 0;
			} else {
				checkData.cBonus = Math.abs(checkData.cBonus);
			}
			if (!("sBonus" in checkData)) {
				checkData.sBonus = 0;
			} else {
				checkData.sBonus = Math.abs(checkData.sBonus);
			}
			if (!("iBonus" in checkData)) {
				checkData.iBonus = 0;
			} else {
				checkData.iBonus = Math.abs(checkData.iBonus);
			}
			if (!("oBonus" in checkData)) {
				checkData.oBonus = 0;
			} else {
				checkData.oBonus = Math.abs(checkData.oBonus);
			}
			if (!("cMalus" in checkData)) {
				checkData.cMalus = 0;
			} else {
				checkData.cMalus = Math.abs(checkData.cMalus) * -1;
			}
			if (!("sMalus" in checkData)) {
				checkData.sMalus = 0;
			} else {
				checkData.sMalus = Math.abs(checkData.sMalus) * -1;
			}
			if (!("iMalus" in checkData)) {
				checkData.iMalus = 0;
			} else {
				checkData.iMalus = Math.abs(checkData.iMalus) * -1;
			}
			if (!("oMalus" in checkData)) {
				checkData.oMalus = 0;
			} else {
				checkData.oMalus = Math.abs(checkData.oMalus) * -1;
			}
			if (!("fortuneSelect" in checkData)) {
				checkData.fortuneSelect = "normal";
			}
			if ("extraScopes" in checkData) {
				extraScopes = checkData.extraScopes;
			}
			if (!("overrideBonus" in checkData)) {
				checkData.overrideBonus = null;
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in default-checkData during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let dTwenty = 0;
		let dTwentyColour = themeData.colours.standardText;
		try {
			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			dTwenty = Number(MTScript.getVariable("dTwenty"));
			if (checkData.fortuneSelect == "fortune") {
				MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
				dTwenty = Math.max(dTwenty, Number(MTScript.getVariable("dTwenty")));
			} else if (checkData.fortuneSelect == "misfortune") {
				MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
				dTwenty = Math.min(dTwenty, Number(MTScript.getVariable("dTwenty")));
			}
			if (dTwenty == 1) {
				dTwentyColour = "red";
			} else if (dTwenty == 20) {
				dTwentyColour = "green";
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in d20Roll during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let stat_bonus = 0;
		try {
			if ("statName" in checkData) {
				stat_bonus = Number(checkToken.getProperty(checkData.statName));
			}
			if (checkData.skillName in skills && !("statName" in checkData)) {
				stat_bonus = Number(checkToken.getProperty(skills[checkData.skillName].stat));
			} else if (checkData.skillName.includes("Lore")) {
				stat_bonus = Number(checkToken.getProperty("int"));
			}

			if (!("statName" in checkData) && checkData.skillName in skills) {
				checkData.statName = skills[checkData.skillName].stat;
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in get-stat-bonus during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("checkData.statName: " + String(checkData.statName));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let initiative = 0;
		let currentAttackCount = 0;

		try {
			initiative = get_initiative(checkToken.getId());
			currentAttackCount = Number(checkToken.getProperty("attacksThisRound"));
			if (isNaN(currentAttackCount)) {
				currentAttackCount = 0;
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in get-init during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let map_malus = Math.min(currentAttackCount, 2) * -5;

		if ("useMAP" in checkData && !checkData.useMAP) {
			map_malus = 0;
		}

		let prof_bonus = 0;
		let misc_bonus = Number(checkData.miscBonus);
		let effect_bonus_raw = 0;
		let effect_bonus = 0;
		let applyAssurance = 0;
		let assuranceIndex = null;
		try {
			//MapTool.chat.broadcast("Submitted :" + JSON.stringify(checkData));
			effect_bonus_raw = calculate_bonus(checkToken, [lowercase(checkData.skillName), checkData.statName + "-based", "skill-check"].concat(extraScopes), true);
			effect_bonus = Math.max(effect_bonus_raw.bonuses.circumstance, checkData.cBonus) + Math.max(effect_bonus_raw.bonuses.status, checkData.sBonus) + Math.max(effect_bonus_raw.bonuses.item, checkData.iBonus) + Math.max(effect_bonus_raw.bonuses.none, checkData.oBonus)
				+ Math.min(effect_bonus_raw.maluses.circumstance, checkData.cMalus) + Math.min(effect_bonus_raw.maluses.status, checkData.sMalus) + Math.min(effect_bonus_raw.maluses.item, checkData.iMalus) + Math.min(effect_bonus_raw.maluses.none, checkData.oMalus);

			//MapTool.chat.broadcast(JSON.stringify(effect_bonus_raw));

			if (effect_bonus_raw.appliedEffects.includes("Assurance")) {
				MTScript.evalMacro("[h: apply=0][h: input(\"apply|0|Apply Assurance|CHECK\")]");
				applyAssurance = Number(MTScript.getVariable("apply")) == 1;
				//MapTool.chat.broadcast(String(applyAssurance));
				if (applyAssurance) {
					dTwenty = 10;
					dTwentyColour = themeData.colours.standardText;
					effect_bonus = 0;
					misc_bonus = 0;
					stat_bonus = 0;
					map_malus = 0;
					effect_bonus_raw.appliedEffects = ["Assurance"];
				} else {
					assuranceIndex = effect_bonus_raw.appliedEffects.indexOf("Assurance");
					effect_bonus_raw.appliedEffects.splice(assuranceIndex, 1);
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in get-effect-bonuses during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		//MapTool.chat.broadcast(JSON.stringify(effect_bonus_raw));

		try {
			if (checkData.tokenType == "NPC" || checkData.tokenType == "PC") {
				let profList = JSON.parse(checkToken.getProperty("proficiencies"));
				for (var p in profList) {
					let profData = profList[p];
					if (checkData.skillName.toLowerCase() == profData.name.toLowerCase() && checkData.tokenType == "NPC") {
						prof_bonus = Number(profData.bonus - stat_bonus);
					} else if (checkData.skillName.toLowerCase() == profData.name.toLowerCase() && checkData.tokenType == "PC") {
						prof_bonus = Number(profData.bonus);
					} else if (checkData.skillName == "Perception" && checkData.tokenType == "NPC") {
						prof_bonus = Number(Number(checkToken.getProperty("Perception")) - stat_bonus);
					}
				}
			}

			if (effect_bonus_raw.bonuses.proficiency > 0 && prof_bonus == 0) {
				prof_bonus = effect_bonus_raw.bonuses.proficiency;
			}

			let armorPenalty = 0;

			if (checkData.statName == "str" || checkData.statName == "dex") {
				let tokenArmor = get_equipped_armor(checkToken);
				let tokenStr = checkToken.getProperty("str")
				if (tokenArmor != null && "checkPenalty" in tokenArmor && "strReq" in tokenArmor && tokenStr < tokenArmor.strReq) {
					armorPenalty = tokenArmor.checkPenalty;
				}
			}

			let checkMod = stat_bonus + prof_bonus + misc_bonus + effect_bonus + map_malus + armorPenalty;
			if (checkData.overrideBonus != null) {
				checkMod = checkData.overrideBonus + misc_bonus + effect_bonus + map_malus + armorPenalty;
				stat_bonus = 0;
				prof_bonus = 0;
			}
			let checkResult = dTwenty + checkMod;

			let displayData = { "name": checkToken.getName() + " - " + checkData.skillName + " " + pos_neg_sign(checkMod), "system": { "description": { "value": "" } } };
			displayData.system.description.value = checkData.flavourText + "<br/><div style='font-size:20px'><b><span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span>"
			if (stat_bonus != 0 && stat_bonus != null) {
				displayData.system.description.value += " " + pos_neg_sign(stat_bonus, true);
			}
			if (prof_bonus != 0 && prof_bonus != null) {
				displayData.system.description.value += " " + pos_neg_sign(prof_bonus, true);
			}
			if (checkData.overrideBonus != 0 && checkData.overrideBonus != null) {
				displayData.system.description.value += " " + pos_neg_sign(checkData.overrideBonus, true);
			}
			if (effect_bonus != 0 && effect_bonus != null) {
				displayData.system.description.value += " " + pos_neg_sign(effect_bonus, true);
			}
			if (misc_bonus != 0 && misc_bonus != null) {
				displayData.system.description.value += " " + pos_neg_sign(misc_bonus, true);
			}
			if (map_malus != 0 && map_malus != null) {
				displayData.system.description.value += " " + pos_neg_sign(map_malus, true);
			}
			if (armorPenalty != 0 && armorPenalty != null) {
				displayData.system.description.value += " " + pos_neg_sign(armorPenalty, true);
			}
			displayData.system.description.value += " = " + String(checkResult) + "</div></b>";

			displayData.system.appliedEffects = effect_bonus_raw.appliedEffects;
			displayData.system.gmOnly = checkData.secretCheck;

			if (!silent) {
				chat_display(displayData);
			}

			if (!(isNaN(initiative)) && "increaseMAP" in checkData && checkData.increaseMAP) {
				checkToken.setProperty("attacksThisRound", String(currentAttackCount + 1));
			}

			return checkResult;
		} catch (e) {
			MapTool.chat.broadcast("Error in checkData-else during skill_check");
			MapTool.chat.broadcast("checkToken: " + String(checkToken));
			MapTool.chat.broadcast("altStat: " + String(altStat));
			MapTool.chat.broadcast("checkData: " + JSON.stringify(checkData));
			MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}
}

MTScript.registerMacro("ca.pf2e.skill_check", skill_check);