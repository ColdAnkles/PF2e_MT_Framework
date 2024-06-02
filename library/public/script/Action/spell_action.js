"use strict";

function spell_action(actionData, actingToken) {
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));

	if (!(actionData.name in property)) {
		MapTool.chat.broadcast("<h2>Could not find spell " + actionData.name + "</h2>");
		return;
	}

	let spellData = property[actionData.name];
	let spellBaseName = spellData.baseName;
	if ("fileURL" in spellData) {
		spellData = rest_call(spellData["fileURL"], "");
	}
	spellData = parse_spell(spellBaseName, spellData);

	if (typeof (actingToken) == "string") {
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	let damageScopes = ["spell", "damage", "spell-damage"];
	let attackScopes = ["spell", "attack", "spell-attack"];
	let spellRules = JSON.parse(actingToken.getProperty("spellRules"));
	let tokenSpell = null;
	let castData = null;
	let disableCrit = false;

	for (var spellcasting in spellRules) {
		let spellCastData = spellRules[spellcasting];
		for (var aSpell in spellCastData.spells) {
			let aSpellData = spellCastData.spells[aSpell];
			if (aSpellData.name == actionData.name) {
				tokenSpell = aSpellData;
				castData = spellCastData;
			}
		}
	}

	let hh_targetType = null;
	let alt_hh_test = null;
	if (((spellData.name == "Heal" || spellData.name == "Harm") && actionData.actionCost == "2") || spellData.name == "Lay on Hands") {
		MTScript.evalMacro("[h: targetChoice=\"Living\"][h: input(\"targetChoice|Living,Dead|Target Type|LIST|VALUE=STRING\")]");

		hh_targetType = MTScript.getVariable("targetChoice");
		if (hh_targetType == "Living") {
			alt_hh_test = "Healing";
		} else {
			alt_hh_test = "Harming";
		}
	}
	if ((spellData.name == "Heal" || spellData.name == "Lay on Hands") && (hh_targetType == "Living" || hh_targetType == null)) {
		damageScopes = ["spell", "healing"];
	} else if ((spellData.name == "Harm" || spellData.name == "Lay on Hands") && (hh_targetType == "Undead" || hh_targetType == null)) {
		damageScopes = ["spell", "healing"];
	}

	for (var d in spellData.damage) {
		if ("kinds" in spellData.damage[d]) {
			if (spellData.damage[d].kinds.includes("healing")) {
				damageScopes = ["spell", "healing"];
				break;
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));

	if ("overlays" in actionData) {
		for (var o in actionData.overlays) {
			let overlayData = spellData.overlays[actionData.overlays[o]];
			if (overlayData.overlayType == "override") {
				if (hh_targetType != null && "name" in overlayData && overlayData.name != null && (!(overlayData.name.toUpperCase().includes(hh_targetType.toUpperCase())) && !(overlayData.name.toUpperCase().includes(alt_hh_test.toUpperCase())))) {
					continue;
				};
				for (var key in overlayData.system) {
					if (typeof (overlayData.system[key]) == "object" && overlayData.system[key] != null && "value" in overlayData.system[key] && Object.keys(overlayData.system[key]).length == 1 && key != "traits") {
						spellData[key] = overlayData.system[key].value;
					} else if (key == "damage" || key == "heightening") {
						if (!(key in spellData)) {
							spellData[key] = {};
						}
						for (var e in overlayData.system[key]) {
							if (!(e in spellData[key])) {
								spellData[key][e] = overlayData.system[key][e];
							} else {
								for (var k2 in overlayData.system[key][e]) {
									spellData[key][e][k2] = overlayData.system[key][e][k2];
								}
							}
						}
					} else {
						spellData[key] = overlayData.system[key];
					}
				}
			}
		}
	}

	let spellMod = Number(actingToken.getProperty(actionData.castingAbility));

	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let displayData = { "description": "", "name": actingToken.getName() + " - " + actionData.name, "level": actionData.castLevel, "type": spellData.category };
	if (spellData.area != null) {
		if ("details" in spellData.area) {
			displayData.description += "<b>Area</b> " + spellData.area.details;
		} else {
			displayData.description += "<b>Area</b> " + String(spellData.area.value) + " ft. " + spellData.area.type;
		}
		if (spellData.target != null && spellData.target != "") {
			displayData.description += "; <b>Targets</b> " + spellData.target;
		}
		displayData.description += "<br />";
	} else if (spellData.range != null && spellData.range != "") {
		displayData.description += "<b>Range</b> " + spellData.range;
		if (spellData.target != null && spellData.target != "") {
			displayData.description += "; <b>Targets</b> " + spellData.target;
		}
		displayData.description += "<br />";
	}

	let hasDuration = spellData.duration != null && spellData.duration != "" && spellData.duration.value != "" && spellData.duration.value != null;
	if (hasDuration) {
		displayData.description += "<b>Duration</b> " + spellData.duration.value;
		displayData.description += "<br />";
	}

	if (spellData.traits.value.includes("attack")) {

		displayData.description += "<i>Attack Roll</i><br /><div style='font-size:10px'><b>";

		let currentAttackCount = Number(actingToken.getProperty("attacksThisRound"));
		if (isNaN(currentAttackCount)) {
			currentAttackCount = 0;
		}
		let map_malus = currentAttackCount * -5;
		let attack_bonus = castData.spellAttack;
		let attackIncrease = 1;

		MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
		let dTwenty = Number(MTScript.getVariable("dTwenty"));
		let effect_bonus_raw = calculate_bonus(actingToken, attackScopes, true, spellData);
		let effect_bonus = effect_bonus_raw.bonuses.circumstance + effect_bonus_raw.bonuses.status + effect_bonus_raw.bonuses.item + effect_bonus_raw.bonuses.none +
			effect_bonus_raw.maluses.circumstance + effect_bonus_raw.maluses.status + effect_bonus_raw.maluses.item + effect_bonus_raw.maluses.none;
		displayData.appliedEffects = effect_bonus_raw.appliedEffects;

		let dTwentyColour = "black";
		if (dTwenty == 1) {
			dTwentyColour = "red";
		} else if (dTwenty == 20) {
			dTwentyColour = "green";
		}

		let attackMod = attack_bonus + effect_bonus - map_malus;
		let attackResult = dTwenty + attackMod;

		displayData.description += "<span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span> ";
		if (attack_bonus != 0) {
			displayData.description += pos_neg_sign(attack_bonus, true);
		}
		if (effect_bonus != 0) {
			displayData.description += " " + pos_neg_sign(effect_bonus, true);
		}
		if (map_malus != 0) {
			displayData.description += " " + pos_neg_sign(map_malus, true);
		}
		displayData.description += " = " + String(attackResult);

		displayData.description += "</b>"

		displayData.description += "</div>";

		if (spellData.name == "Blazing Bolt" && actionData.actionCost > 1) {
			for (var i = 2; i <= actionData.actionCost; i++) {
				displayData.description += "<i>Attack Roll " + String(i) + "</i><br /><div style='font-size:10px'><b>";
				MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
				let additionalDtwenty = Number(MTScript.getVariable("dTwenty"));
				let dTwentyColour = "black";
				if (additionalDtwenty == 1) {
					dTwentyColour = "red";
				} else if (additionalDtwenty == 20) {
					dTwentyColour = "green";
				}
				let additionalAttackResult = additionalDtwenty + attackMod;
				displayData.description += "<span style='color:" + dTwentyColour + "'>" + String(additionalDtwenty) + "</span> ";
				if (attack_bonus != 0) {
					displayData.description += pos_neg_sign(attack_bonus, true);
				}
				if (effect_bonus != 0) {
					displayData.description += " " + pos_neg_sign(effect_bonus, true);
				}
				if (map_malus != 0) {
					displayData.description += " " + pos_neg_sign(map_malus, true);
				}
				displayData.description += " = " + String(additionalAttackResult);
				displayData.description += "</b>"
				displayData.description += "</div>";

				attackIncrease += 1;
			}
		}

		let initiative = get_initiative(actingToken.getId());
		if (!(isNaN(initiative))) {
			actingToken.setProperty("attacksThisRound", String(currentAttackCount + attackIncrease));
		}
	}

	if (spellData.defense != null && "save" in spellData.defense && spellData.defense.save.statistic != "") {
		displayData.description += "<div style='font-size:10px'><b>";
		if (spellData.defense.save.basic == "basic") {
			displayData.description += "Basic "
		}
		displayData.description += capitalise(spellData.defense.save.statistic) + " Save, DC " + castData.spellDC + "</div>";
	}

	//Special case for magic missile
	if (spellData.name == "Magic Missile" || spellData.name == "Force Barrage") {
		let totalDarts = (Math.floor((actionData.castLevel - 1) / 2) + 1) * actionData.actionCost;
		//MapTool.chat.broadcast((Math.floor((actionData.castLevel-1)/2)+1) + " * " + actionData.actionCost + " = " + String(totalDarts));
		for (let i = 1; i < totalDarts; i += 1) {
			spellData.damage["dart" + String(i)] = spellData.damage[0];
		}
		disableCrit = true;
		//MapTool.chat.broadcast(JSON.stringify(spellData.damage));
	}

	if ("damage" in spellData && Object.keys(spellData.damage).length > 0) {
		if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
			displayData.description += "<i>Healing</i><br />";
		} else {
			displayData.description += "<i>Damage</i><br />";
		}
		if ("heightening" in spellData && (spellData.heightening.type == "fixed")) {
			let found = false;
			let heightenVal = null;
			let testIndex = actionData.castLevel
			while (!found) {
				if (testIndex in spellData.heightening.levels) {
					found = true;
					heightenVal = spellData.heightening.levels[testIndex];
				} else if (testIndex <= 0) {
					found = true;
				} else {
					testIndex -= 1;
				}
			}
			if (heightenVal != null) {
				spellData.damage = heightenVal.damage;
			}
		}

		let damage_bonus_raw = calculate_bonus(actingToken, damageScopes, true, spellData);
		//MapTool.chat.broadcast(JSON.stringify(damage_bonus_raw));
		let damage_bonus = damage_bonus_raw.bonuses.circumstance + damage_bonus_raw.bonuses.status + damage_bonus_raw.bonuses.item + damage_bonus_raw.bonuses.none +
			damage_bonus_raw.maluses.circumstance + damage_bonus_raw.maluses.status + damage_bonus_raw.maluses.item + damage_bonus_raw.maluses.none;
		//MapTool.chat.broadcast(String(damage_bonus));
		for (var d in spellData.damage) {
			displayData.description += "<div style='font-size:10px'><b>";
			let damageData = spellData.damage[d];
			if (damage_bonus != 0) {
				damageData.formula += "+" + String(damage_bonus)
			}
			let damageRoll = String(damageData.formula);
			if ("heightening" in spellData && "damage" in spellData.heightening && spellData.heightening.type == "interval" && d in spellData.heightening.damage) {
				for (let i = spellData.level + spellData.heightening.interval; i <= actionData.castLevel; i += spellData.heightening.interval) {
					damageRoll = damageRoll + "+" + spellData.heightening.damage[d];
				}
			}
			if (damageData.applyMod) {
				damageRoll = damageRoll;
				if (spellMod != 0) {
					damageRoll += "+" + String(spellMod);
				}
			}
			damageRoll = group_dice(damageRoll);
			let rolled = roll_dice(damageRoll);
			if (String(rolled) != damageRoll) {
				displayData.description += damageRoll + " = " + String(rolled);
			} else {
				displayData.description += String(rolled);
			}
			if (damageData.category != null) {
				displayData.description += " " + damageData.category;
			}
			if (damageScopes.includes("healing")) {
				displayData.description += " HP" + "</b>";
			} else {
				displayData.description += " " + damageData.type + "</b>";
			}
			if (String(rolled) != damageRoll && !disableCrit) {
				let critDamage = rolled * 2;
				if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
					displayData.description += "<br /><i>Crit Healing</i><br /><b>2x(" + damageRoll + ") = " + String(critDamage);
				} else {
					displayData.description += "<br /><i>Crit Damage</i><br /><b>2x(" + damageRoll + ") = " + String(critDamage);
				}
				if (damageData.category != null) {
					displayData.description += " " + damageData.category;
				}
				if (damageScopes.includes("healing")) {
					displayData.description += " HP" + "</b>";
				} else {
					displayData.description += " " + damageData.type + "</b>";
				}
			}
			displayData.description += "</div>";
		}
	}

	displayData.description += spellData.description;

	displayData.traits = spellData.traits.value;
	displayData.castLevel = actionData.castLevel;
	displayData.level = spellData.level;
	displayData.actionCost = actionData.actionCost;
	displayData.actionType = actionData.actionType;
	if ("cantrip" in spellData.traits.value) {
		displayData.type = "Cantrip";
	}

	chat_display(displayData, true, { "level": actionData.castLevel, "rollDice": true, "item": spellData });
}
