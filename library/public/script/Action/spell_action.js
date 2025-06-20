"use strict";

function spell_action(actionData, actingToken) {
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	let spellData = actionData.system.rawSpellData;
	let spellBaseName = spellData.baseName;
	if ("fileURL" in spellData) {
		spellData = rest_call(spellData["fileURL"], "");
	}

	if (typeof (actingToken) == "string") {
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	let damageScopes = ["spell"];
	let attackScopes = ["spell", "attack", "spell-attack"];
	let spellRules = JSON.parse(actingToken.getProperty("spellRules"));
	let tokenSpell = null;
	let castData = null;
	let disableCrit = false;
	let variant = JSON.parse(actingToken.getProperty("foundryActor")).variant;

	try {
		for (var spellcasting in spellRules) {
			let spellCastData = spellRules[spellcasting];
			for (var aSpell in spellCastData.spells) {
				let aSpellData = spellCastData.spells[aSpell];
				if (aSpellData.name == actionData.name || aSpellData.name == actionData.system.remasterFrom) {
					tokenSpell = aSpellData;
					castData = spellCastData;
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during get-spell-rules");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData.system.overlays));

	try {
		if ("overlays" in spellData.system) {
			let overlayChoices = [];
			for (var o in actionData.system.overlays) {
				let overlayData = spellData.system.overlays[actionData.system.overlays[o]];
				if (overlayData.overlayType == "override" && "name" in overlayData && overlayData.name != null) {
					overlayChoices.push(overlayData.name);
				}
			}

			let inputStrings = [];
			for (var o in overlayChoices) {
				inputStrings.push("choice_" + o + "|0|" + overlayChoices[o] + "|CHECK");
			}
			MTScript.setVariable("inputText", inputStrings.join("##"));
			MTScript.evalMacro("[h: input(inputText)]");

			let chosenOverlays = [];
			for (var o in overlayChoices) {
				let choiceVal = String(MTScript.getVariable("choice_" + o)) == "1";
				if (choiceVal) {
					chosenOverlays.push(overlayChoices[o]);
				}
			}

			for (var o in actionData.system.overlays) {
				let overlayData = spellData.system.overlays[actionData.system.overlays[o]];
				let applyOverlay = false;
				if (overlayData.overlayType == "override" && "name" in overlayData && chosenOverlays.includes(overlayData.name)) {
					applyOverlay = true;
				} else if (!("name" in overlayData)) {
					applyOverlay = true;
				}

				if (applyOverlay) {
					for (var key in overlayData.system) {
						if (typeof (overlayData.system[key]) == "object" && overlayData.system[key] != null && "value" in overlayData.system[key] && Object.keys(overlayData.system[key]).length == 1 && key != "traits") {
							spellData.system[key].value = overlayData.system[key].value;
						} else if (key == "damage" || key == "heightening") {
							if (!(key in spellData.system)) {
								spellData.system[key] = {};
							}
							for (var e in overlayData.system[key]) {
								if (!(e in spellData.system[key])) {
									spellData.system[key][e] = overlayData.system[key][e];
								} else {
									for (var k2 in overlayData.system[key][e]) {
										spellData.system[key][e][k2] = overlayData.system[key][e][k2];
									}
								}
							}
						} else {
							spellData.system[key] = overlayData.system[key];
						}
					}
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during overlay-parsing");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var d in spellData.system.damage) {
			if ("kinds" in spellData.system.damage[d]) {
				for (var k in spellData.system.damage[d].kinds) {
					if (!(damageScopes.includes(spellData.system.damage[d].kinds[k]))) {
						damageScopes.push(spellData.system.damage[d].kinds[k]);
					}
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during healing-check");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let spellMod = null;

	try {
		let castingAbility = "int";
		if (castingAbility == null && actionData != null && "castingAbility" in actionData) {
			castingAbility = actionData.castingAbility;
		}
		if (castingAbility == null && tokenSpell != null && "castingAbility" in tokenSpell) {
			castingAbility = tokenSpell.castingAbility;
		}
		if (castingAbility == null && castData != null && "spellAttack" in castData) {
			spellMod = castData.spellAttack;
		} else {
			spellMod = Number(actingToken.getProperty(castingAbility));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during get-cast-ability");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("tokenSpell: " + JSON.stringify(tokenSpell));
		MapTool.chat.broadcast("castData: " + JSON.stringify(castData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//MapTool.chat.broadcast(JSON.stringify(spellData));
	let displayData = null;
	try {
		displayData = { "name": actingToken.getName() + " - " + actionData.name, "type": spellData.system.category, "system": { "actionType": null, "actions": null, "description": { "value": "" }, "level": actionData.system.castLevel } };
		if (spellData.system.area != null) {
			if ("details" in spellData.system.area) {
				displayData.system.description.value += "<b>Area</b> " + spellData.system.area.details;
			} else {
				displayData.system.description.value += "<b>Area</b> " + String(spellData.system.area.value) + " ft. " + spellData.system.area.type;
			}
			if (spellData.system.target.value != null && spellData.system.target.value != "") {
				displayData.system.description.value += "; <b>Targets</b> " + spellData.system.target.value;
			}
			displayData.system.description.value += "<br />";
		} else if (spellData.system.range.value != null && spellData.system.range.value != "") {
			displayData.system.description.value += "<b>Range</b> " + spellData.system.range.value;
			if (spellData.system.target.value != null && spellData.system.target.value != "") {
				displayData.system.description.value += "; <b>Targets</b> " + spellData.system.target.value;
			}
			displayData.system.description.value += "<br />";
		}

		let hasDuration = spellData.system.duration != null && spellData.system.duration != "" && spellData.system.duration.value != "" && spellData.system.duration.value != null;
		if (hasDuration) {
			displayData.system.description.value += "<b>Duration</b> " + spellData.system.duration.value;
			displayData.system.description.value += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during display-data-setup");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let currentAttackCount = 0;
	let attackIncrease = 0;
	if (spellData.system.traits.value.includes("attack")) {

		try {
			displayData.system.description.value += "<i>Attack Roll</i><br /><div style='font-size:10px'><b>";

			currentAttackCount = Number(actingToken.getProperty("attacksThisRound"));
			if (isNaN(currentAttackCount)) {
				currentAttackCount = 0;
			}
			let map_malus = currentAttackCount * -5;
			let attack_bonus = castData.spellAttack;

			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			let dTwenty = Number(MTScript.getVariable("dTwenty"));
			let effect_bonus_raw = calculate_bonus(actingToken, attackScopes, true, spellData);
			let effect_bonus = effect_bonus_raw.bonuses.circumstance + effect_bonus_raw.bonuses.status + effect_bonus_raw.bonuses.item + effect_bonus_raw.bonuses.none +
				effect_bonus_raw.maluses.circumstance + effect_bonus_raw.maluses.status + effect_bonus_raw.maluses.item + effect_bonus_raw.maluses.none;
			displayData.system.appliedEffects = effect_bonus_raw.appliedEffects;

			let dTwentyColour = themeData.colours.standardText;
			if (dTwenty == 1) {
				dTwentyColour = "red";
			} else if (dTwenty == 20) {
				dTwentyColour = "green";
			}

			let attackMod = attack_bonus + effect_bonus - map_malus;
			let attackResult = dTwenty + attackMod;

			displayData.system.description.value += "<span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span> ";
			if (attack_bonus != 0) {
				displayData.system.description.value += pos_neg_sign(attack_bonus, true);
			}
			if (effect_bonus != 0) {
				displayData.system.description.value += " " + pos_neg_sign(effect_bonus, true);
			}
			if (map_malus != 0) {
				displayData.system.description.value += " " + pos_neg_sign(map_malus, true);
			}
			displayData.system.description.value += " = " + String(attackResult);

			displayData.system.description.value += "</b>"

			displayData.system.description.value += "</div>";
		} catch (e) {
			MapTool.chat.broadcast("Error in spell_action during attack-setup");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("actingToken: " + String(actingToken));
			MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
			MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
			MapTool.chat.broadcast("castData: " + JSON.stringify(castData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		try {
			if (spellData.name == "Blazing Bolt" && actionData.actionCost > 1) {
				for (var i = 2; i <= actionData.actionCost; i++) {
					displayData.system.description.value += "<i>Attack Roll " + String(i) + "</i><br /><div style='font-size:10px'><b>";
					MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
					let additionalDtwenty = Number(MTScript.getVariable("dTwenty"));
					let dTwentyColour = "black";
					if (additionalDtwenty == 1) {
						dTwentyColour = "red";
					} else if (additionalDtwenty == 20) {
						dTwentyColour = "green";
					}
					let additionalAttackResult = additionalDtwenty + attackMod;
					displayData.system.description.value += "<span style='color:" + dTwentyColour + "'>" + String(additionalDtwenty) + "</span> ";
					if (attack_bonus != 0) {
						displayData.system.description.value += pos_neg_sign(attack_bonus, true);
					}
					if (effect_bonus != 0) {
						displayData.system.description.value += " " + pos_neg_sign(effect_bonus, true);
					}
					if (map_malus != 0) {
						displayData.system.description.value += " " + pos_neg_sign(map_malus, true);
					}
					displayData.system.description.value += " = " + String(additionalAttackResult);
					displayData.system.description.value += "</b>"
					displayData.system.description.value += "</div>";

					attackIncrease += 1;
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in spell_action during blazing-bolt-special");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("actingToken: " + String(actingToken));
			MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
			MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let initiative = null;
		try {
			get_initiative(actingToken.getId());
		} catch (e) {
			MapTool.chat.broadcast("Error in spell_action during get-initiative");
			MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
			MapTool.chat.broadcast("actingToken: " + String(actingToken));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
		if (!(isNaN(initiative))) {
			actingToken.setProperty("attacksThisRound", String(currentAttackCount + attackIncrease));
		}
	}

	try {
		if (spellData.system.defense != null && "save" in spellData.system.defense && spellData.system.defense.save != null && "statistic" in spellData.system.defense.save && spellData.system.defense.save.statistic != "") {
			displayData.system.description.value += "<div style='font-size:10px'><b>";
			if (spellData.system.defense.save.basic == "basic") {
				displayData.system.description.value += "Basic "
			}
			if (actingToken.isPC()) {
				displayData.system.description.value += capitalise(spellData.system.defense.save.statistic) + " Save, DC " + castData.spellDC + "</div>";
			} else {
				displayData.system.description.value += capitalise(spellData.system.defense.save.statistic) + "@GM[ Save, DC " + castData.spellDC + "]</div>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during spell-save");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		//Special case for magic missile
		if (spellData.name == "Magic Missile" || spellData.name == "Force Barrage") {
			let totalDarts = (Math.floor((actionData.system.castLevel.value - 1) / 2) + 1) * actionData.system.actions.value;
			//MapTool.chat.broadcast((Math.floor((actionData.system.castLevel.value-1)/2)+1) + " * " + actionData.system.actions.value + " = " + String(totalDarts));
			for (let i = 1; i < totalDarts; i += 1) {
				spellData.system.damage["dart" + String(i)] = spellData.system.damage[0];
			}
			disableCrit = true;
			//MapTool.chat.broadcast(JSON.stringify(spellData.damage));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during force-barrage-special");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("damage" in spellData.system && Object.keys(spellData.system.damage).length > 0) {
			if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
				displayData.system.description.value += "<i>Healing</i><br />";
			} else {
				displayData.system.description.value += "<i>Damage</i><br />";
			}
			if ("heightening" in spellData.system && (spellData.system.heightening.type == "fixed")) {
				let found = false;
				let heightenVal = null;
				let testIndex = actionData.system.castLevel.value
				while (!found) {
					if (testIndex in spellData.system.heightening.levels) {
						found = true;
						heightenVal = spellData.system.heightening.levels[testIndex];
					} else if (testIndex <= 0) {
						found = true;
					} else {
						testIndex -= 1;
					}
				}
				if (heightenVal != null) {
					spellData.system.damage = heightenVal.damage;
				}
			} else if ("heightening" in spellData.system && (spellData.system.heightening.type == "interval")) {
				let addTimes = Math.floor((actionData.system.castLevel.value - spellData.system.level.value) / spellData.system.heightening.interval)
				if (addTimes != 0) {
					for (var hd in spellData.system.heightening.damage) {
						if (hd in spellData.system.damage) {
							for (var at = 0; at < addTimes; at++) {
								spellData.system.damage[hd].formula += " + " + spellData.system.heightening.damage[hd]
							}
						}
					}
				}
			}

			let damage_bonus_raw = calculate_bonus(actingToken, damageScopes, true, spellData);
			//MapTool.chat.broadcast(JSON.stringify(damage_bonus_raw));
			let damage_bonus = damage_bonus_raw.bonuses.circumstance + damage_bonus_raw.bonuses.status + damage_bonus_raw.bonuses.item + damage_bonus_raw.bonuses.none +
				damage_bonus_raw.maluses.circumstance + damage_bonus_raw.maluses.status + damage_bonus_raw.maluses.item + damage_bonus_raw.maluses.none;
			if (variant == "elite") {
				damage_bonus += 4;
			} else if (variant == "weak") {
				damage_bonus -= 4;
			}
			//MapTool.chat.broadcast(String(damage_bonus));
			for (var d in spellData.system.damage) {
				displayData.system.description.value += "<div style='font-size:10px'><b>";
				let damageData = spellData.system.damage[d];
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
					displayData.system.description.value += damageRoll + " = " + String(rolled);
				} else {
					displayData.system.description.value += String(rolled);
				}
				if (damageData.category != null) {
					displayData.system.description.value += " " + damageData.category;
				}
				if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
					displayData.system.description.value += " HP" + "</b>";
				} else if (damageScopes.includes("healing") && damageScopes.includes("damage")) {
					displayData.system.description.value += " HP/" + damageData.type + "</b>";
				} else {
					displayData.system.description.value += " " + damageData.type + "</b>";
				}
				if (String(rolled) != damageRoll && !disableCrit) {
					let critDamage = rolled * 2;
					if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
						displayData.system.description.value += "<br /><i>Crit Healing</i><br /><b>2x(" + damageRoll + ") = " + String(critDamage);
					} else if (damageScopes.includes("healing") && damageScopes.includes("damage")) {
						displayData.system.description.value += "<br /><i>Crit Healing/Damage</i><br /><b>2x(" + damageRoll + ") = " + String(critDamage);
					} else {
						displayData.system.description.value += "<br /><i>Crit Damage</i><br /><b>2x(" + damageRoll + ") = " + String(critDamage);
					}
					if (damageData.category != null) {
						displayData.system.description.value += " " + damageData.category;
					}
					if (damageScopes.includes("healing") && !damageScopes.includes("damage")) {
						displayData.system.description.value += " HP" + "</b>";
					} else if (damageScopes.includes("healing") && damageScopes.includes("damage")) {
						displayData.system.description.value += " HP/" + damageData.type + "</b>";
					} else {
						displayData.system.description.value += " " + damageData.type + "</b>";
					}
				}
				displayData.system.description.value += "</div>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during spell-damage");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		displayData.system.description.value += spellData.system.description.value;

		displayData.system.remasterFrom = actionData.system.remasterFrom;
		displayData.system.traits = spellData.system.traits;
		displayData.system.castLevel = actionData.system.castLevel;
		displayData.system.level = spellData.system.level;
		displayData.system.actions = actionData.system.actions;
		displayData.system.actionType = actionData.system.actionType;
		spellData.system.level = actionData.system.castLevel.value;
		if ("cantrip" in spellData.system.traits.value) {
			displayData.type = "Cantrip";
		} else {
			displayData.type = "Spell";
		}

		if ("focus" in spellData.system.traits.value) {
			displayData.type = "Focus " + displayData.type;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during finalise");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		chat_display(displayData, true, { "level": actionData.system.castLevel.value, "rollDice": true, "item": spellData, "action": spellData, "variant": variant, "isPC": actingToken.isPC() });
	} catch (e) {
		MapTool.chat.broadcast("Error in spell_action during chat-display");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("actingToken: " + String(actingToken));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
}
