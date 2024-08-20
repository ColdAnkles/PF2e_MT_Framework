"use strict";

function attack_action(actionData, actingToken) {
	if (typeof (actingToken) == "string") {
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));

	let currentAttackCount = Number(actingToken.getProperty("attacksThisRound"));
	if (isNaN(currentAttackCount)) {
		currentAttackCount = 0;
	}

	let activeConditions = JSON.parse(actingToken.getProperty("conditionDetails"));
	if (activeConditions == null) {
		activeConditions = {};
	}

	if ("Dazzled" in activeConditions) {
		flat_check(actingToken);
	}

	let dieUpgrades = { "d4": "d6", "d6": "d8", "d8": "d10", "d10": "d12" };

	let inventory = null;
	let itemData = null;

	try {
		inventory = JSON.parse(actingToken.getProperty("inventory"));
		if ("flags" in actionData && "pf2e" in actionData.flags && "linkedWeapon" in actionData.flags.pf2e) {
			itemData = inventory[actionData.flags.pf2e.linkedWeapon];
		}
		if (get_token_type(actingToken) == "PC") {
			if (itemData == null && !actionData.flags.pf2e.linkedWeapon == "unarmed") {
				MapTool.chat.broadcast("Linked Weapon Missing!");
				return
			} else if (itemData == null && actionData.flags.pf2e.linkedWeapon == "unarmed") {
				itemData = find_handwraps(actingToken);
				if (itemData != null) {
					actionData.system.damageRolls[0].dice = itemData.system.runes.striking + 1;
					actionData.system.traits.value = actionData.system.traits.value.concat(itemData.system.traits.value);
					itemData.system.category = "unarmed";
					itemData.system.group = "brawling";
				}
			}
			if (itemData != null) {
				if (itemData.system.material.type != null) {
					if (itemData.system.material.grade != null) {
						actionData.system.materials = [itemData.system.material.grade + " " + itemData.system.material.type];
					} else {
						actionData.system.materials = [itemData.system.material.type];
					}
				} else {
					actionData.system.materials = [];
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during item-getting");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));
	//MapTool.chat.broadcast(JSON.stringify(itemData));

	let tokLevel = Number(actingToken.getProperty("level"));
	let profBon = null;
	if (((itemData != null) ? itemData.system.category : actionData.system.category) != undefined) {
		profBon = (calculate_proficiency(((itemData != null) ? itemData.system.category : actionData.system.category), actingToken, ((itemData != null) ? itemData : actionData)) * 2);
	} else {
		profBon = actionData.system.bonus.value - tokLevel;
	}
	let attack_bonus = tokLevel + profBon;
	//MapTool.chat.broadcast("Token Level: " + String(tokLevel))
	//MapTool.chat.broadcast("profBon: " + String(profBon))
	//MapTool.chat.broadcast("attack_bonus: " + String(attack_bonus))
	let initiative = get_initiative(actingToken.getId());

	let attackScopes = ["attack", "attack-roll", "weapon-attack"];
	let damageScopes = ["strike-damage", "damage"];
	if (actionData.system.isMelee || actionData.type == "melee") {
		attackScopes.push("melee-attack");
		damageScopes.push("melee-damage");
	} else {
		attackScopes.push("ranged-attack");
		damageScopes.push("ranged-damage");
	}
	if (actionData.name == "Fist") {
		damageScopes.push("fist-base-damage");
	}

	MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
	let dTwenty = Number(MTScript.getVariable("dTwenty"));

	let dTwentyColour = "black";
	if (dTwenty == 1) {
		dTwentyColour = "red";
	} else if (dTwenty == 20) {
		dTwentyColour = "green";
	}

	let effect_bonus_raw = calculate_bonus(actingToken, attackScopes, true, ((itemData != null) ? itemData : actionData));
	//MapTool.chat.broadcast(JSON.stringify(effect_bonus_raw));

	for (var oE in effect_bonus_raw.otherEffects) {
		let thisEffect = effect_bonus_raw.otherEffects[oE];
		if (typeof (thisEffect) == "object") {
			if ("property" in thisEffect) {
				if (thisEffect.property == "materials") {
					if (thisEffect.mode == "add") {
						if (!("materials" in actionData.system)) {
							actionData.system.materials = [];
						}
						actionData.system.materials.push(thisEffect.value);
					}
				} else if (thisEffect.property == "weapon-traits") {
					if (thisEffect.mode == "add") {
						actionData.system.traits.value.push(thisEffect.value);
					}
				}
			}
		} else if (typeof (thisEffect) == "boolean" && thisEffect) {
			effect_bonus_raw.appliedEffects.push(oE);
		}
	}

	let damage_bonus_raw = null;

	try {
		if ("WeaponPotency" in effect_bonus_raw.otherEffects && itemData != null) {
			let currBonus = effect_bonus_raw.bonuses.item;
			effect_bonus_raw.bonuses.item = Math.max(currBonus, Number(effect_bonus_raw.otherEffects.WeaponPotency));
			itemData.system.runes.potency = effect_bonus_raw.otherEffects.WeaponPotency;
		}

		if ("Striking" in effect_bonus_raw.otherEffects && itemData != null) {
			actionData.system.damageRolls[0].dice = Math.max(actionData.system.damageRolls[0].dice, effect_bonus_raw.otherEffects.Striking + 1);
			itemData.system.damage.dice = actionData.system.damageRolls[0].dice;
			itemData.system.runes.striking = effect_bonus_raw.otherEffects.Striking;
		}

		damage_bonus_raw = calculate_bonus(actingToken, damageScopes, true, ((itemData != null) ? itemData : actionData));
		//MapTool.chat.broadcast(JSON.stringify(damage_bonus_raw));

		if ("otherEffects" in damage_bonus_raw) {
			if ("ItemAlteration" in damage_bonus_raw.otherEffects) {
				if ("mode" in damage_bonus_raw.otherEffects.ItemAlteration && damage_bonus_raw.otherEffects.ItemAlteration.mode == "upgrade") {
					if ("property" in damage_bonus_raw.otherEffects.ItemAlteration) {
						if (damage_bonus_raw.otherEffects.ItemAlteration.property == "damage-dice-faces") {
							let currentDie = actionData.system.damageRolls[0].die;
							actionData.system.damageRolls[0].die = dieUpgrades[currentDie];
						}
					}
				}
			} else if ("strike-damage" in damage_bonus_raw.otherEffects) {
				damage_bonus_raw.bonuses.none += damage_bonus_raw.otherEffects["strike-damage"].value;
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during damage-step");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let deadlyDie = "";
	let fatalDie = "";
	let MAP_Penalty = 5;
	let additionalAttackBonuses = [];
	let additionalDamageList = [];
	try {
		for (var t in actionData.system.traits.value) {
			let traitName = actionData.system.traits.value[t];
			if (traitName == "agile") {
				MAP_Penalty = 4;
			} else if (traitName.includes("fatal")) {
				fatalDie = traitName.split("-")[1];

			} else if (traitName.includes("deadly")) {
				deadlyDie = traitName.split("-")[1];

			} else if (traitName == "backstabber") {
				if (itemData != null) {
					if (itemData.system.runes.potency == 3) {
						additionalDamageList.push("+2 (4) precision damage");
					} else {
						additionalDamageList.push("+1 (2) precision damage");
					}
				}

			} else if (traitName == "backswing" && effect_bonus_raw.bonuses.circumstance == 0 && currentAttackCount > 0) {
				additionalAttackBonuses.push("+1 (Backswing (c))")

			} else if (traitName == "forceful" && itemData != null && currentAttackCount > 0) {
				let bonus = 0;
				if (currentAttackCount > 1) {
					bonus = 2 * itemData.damage.dice;
				} else {
					bonus = itemData.damage.dice;
				}
				if (bonus > damage_bonus_raw.bonuses.circumstance) {
					additionalDamageList.push("+" + String(bonus) + " (" + String(Number(2 * bonus)) + ") (Forceful (c))")
				}

			} else if (traitName.includes("jousting")) {
				if (itemData != null && itemData.system.damage.dice > damage_bonus_raw.bonuses.circumstance) {
					additionalDamageList.push("+" + String(itemData.system.damage.dice) + " (" + String(Number(2 * itemData.system.damage.dice)) + ") (Jousting (c))");
				}
				let joustDie = traitName.split("-")[1];
				actionData.system.damageRolls["joustOneHanded"] = { "damage": String(itemData.system.damage.dice) + joustDie + "+" + Number(actingToken.getProperty("str")), "damageType": "piercing (one-handed)" };

			} else if (itemData != null && traitName.includes("two-hand")) {
				let twoHandDie = traitName.split("-")[2];
				actionData.system.damageRolls["twoHanded"] = { "damage": String(itemData.system.damage.dice) + twoHandDie + ((Number(actingToken.getProperty("str")) != 0) ? "+" + Number(actingToken.getProperty("str")) : ""), "damageType": itemData.system.damage.damageType + " (two-handed)" };

			} else if (traitName == "propulsive" && get_token_type(actingToken) == "PC") {
				MapTool.chat.broadcast("Propulsive Trait not Implemented");

			} else if (traitName == "sweep" && effect_bonus_raw.bonuses.circumstance == 0 && currentAttackCount > 0) {
				additionalAttackBonuses.push("+1 (Sweep (c))");

			} else if (traitName == "twin" && currentAttackCount > 0) {
				if (itemData != null && itemData.system.damage.dice > damage_bonus_raw.bonuses.circumstance) {
					additionalAttackBonuses.push("+" + String(itemData.system.damage.dice) + " (Twin (c))");
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during trait-setup");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}


	let damageDetails = [];
	let critDamageDetails = [];

	let damage_bonus = damage_bonus_raw.bonuses.circumstance + damage_bonus_raw.bonuses.status + damage_bonus_raw.bonuses.item + damage_bonus_raw.bonuses.none +
		damage_bonus_raw.maluses.circumstance + damage_bonus_raw.maluses.status + damage_bonus_raw.maluses.item + damage_bonus_raw.maluses.none;

	let strBon = Number(actingToken.getProperty("str"));
	let dexBon = Number(actingToken.getProperty("dex"));
	try {
		if (get_token_type(actingToken) == "PC") {
			if (actionData.isMelee || actionData.type == "melee" || (actionData.system.traits.value.includes("thrown") && !actionData.isMelee)) {
				damage_bonus += strBon;
			} else if (actionData.system.traits.value.includes("propulsive") && !actionData.isMelee) {
				if (strBon >= 0) {
					damage_bonus += floor(strBon / 2);
				} else {
					damage_bonus += strBon;
				}
			}
			actionData.system.damageRolls[0].damage = String(actionData.system.damageRolls[0].dice) + actionData.system.damageRolls[0].die + ((itemData != null && itemData.system.damageBonus != null && itemData.system.damageBonus > 0) ? "+" + String(itemData.system.damageBonus) : "");
			if (actionData.system.traits.value.includes("finesse")) {
				attack_bonus += Math.max(strBon, dexBon);
			} else if (actionData.isMelee || actionData.type == "melee") {
				attack_bonus += strBon;
			} else if (!actionData.isMelee || actionData.type == "ranged") {
				attack_bonus += dexBon;
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during bonus-setup");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var d in actionData.system.damageRolls) {
			let damageData = actionData.system.damageRolls[d];
			if (damage_bonus != 0) {
				damageData.damage += "+" + String(damage_bonus)
			}
			let rolledDamage = roll_dice(damageData.damage);
			damageDetails.push(damageData.damage + " = " + String(rolledDamage) + (("category" in damageData) ? " " + damageData.category + " " : " ") + damageData.damageType);
			let critDamage = rolledDamage * 2;
			let critDice = "(" + damageData.damage + ")x2 = " + String(critDamage);
			if (fatalDie != "") {
				let critRoll = damageData.damage.replaceAll(/d[0-9]*/g, fatalDie)
				critDamage = Number(roll_dice(critRoll)) + Number(roll_dice(fatalDie));
				critDice = "(" + critRoll + ")x2 + 1" + fatalDie + " = " + String(critDamage);
			} else if (deadlyDie != "") {
				critDamage += Number(roll_dice(deadlyDie));
				critDice = "(" + damageData.damage + ")x2 + " + deadlyDie + " = " + String(critDamage);
			}
			critDamageDetails.push(critDice + " " + damageData.damageType);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during damage-rolls");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let effect_bonus = effect_bonus_raw.bonuses.circumstance + effect_bonus_raw.bonuses.status + ((itemData != null && get_token_type(actingToken) == "PC") ? Math.max(effect_bonus_raw.bonuses.item, itemData.system.runes.potency) : effect_bonus_raw.bonuses.item) + effect_bonus_raw.bonuses.none +
		effect_bonus_raw.maluses.circumstance + effect_bonus_raw.maluses.status + effect_bonus_raw.maluses.item + effect_bonus_raw.maluses.none;

	let map_malus = currentAttackCount * MAP_Penalty;

	if ("useMAP" in actionData && !actionData.useMAP) {
		map_malus = 0;
	}

	let attackMod = attack_bonus + effect_bonus - map_malus;
	let attackResult = dTwenty + attackMod;
	let displayData = { "name": actingToken.getName() + " - " + actionData.name + " " + pos_neg_sign(attackMod), "system": { "actionType": { "value": "action" }, "actions": { "value": 1 }, "description": { "value": "" } } };
	try {
		displayData.system.appliedEffects = effect_bonus_raw.appliedEffects;
		displayData.system.traits = actionData.system.traits;
		displayData.system.description.value = "<i>Attack Roll</i><br /><div style='font-size:10px'><b><span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span> "
		if (attack_bonus != 0) {
			displayData.system.description.value += pos_neg_sign(attack_bonus, true);
		}
		if (effect_bonus != 0) {
			displayData.system.description.value += " " + pos_neg_sign(effect_bonus, true);
		}
		if (map_malus != 0) {
			displayData.system.description.value += " " + pos_neg_sign(-map_malus, true);
		}
		displayData.system.description.value += " = " + String(attackResult) + " " + additionalAttackBonuses.join(", ");

		displayData.system.description.value = displayData.system.description.value + "</div></b><i>Damage</i><br />";
		for (var s in damageDetails) {
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + damageDetails[s] + "</div>";
		}

		displayData.system.description.value = displayData.system.description.value + "</b><i>Critical Damage</i><br />"

		for (var s in critDamageDetails) {
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + critDamageDetails[s] + "</div>";
		}

		if (additionalDamageList.length > 0) {
			displayData.system.description.value = displayData.system.description.value + "</b><i>Additional Damage (Crit)</i><br />"
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + additionalDamageList.join(", ") + "</div>";
		}

		if (actionData.system.attackEffects.value.length > 1 && typeof (actionData.system.attackEffects.value == "object")) {
			displayData.system.description.value = displayData.system.description.value + "</b><i>Additional Effects</i><br />"
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + capitalise(actionData.system.attackEffects.value.join(", ").replaceAll("-", " ")) + "</div>";
		} else if (actionData.system.attackEffects.value.length == 1 && typeof (actionData.system.attackEffects.value) == "object") {
			displayData.system.description.value = displayData.system.description.value + "</b><i>Additional Effects</i><br />"
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + capitalise(actionData.system.attackEffects.value[0].replaceAll("-", " ")) + "</div>";
		} else if (actionData.system.attackEffects.value.length > 0 && (typeof (attackData.system.attackEffects.value) == "string")) {
			displayData.system.description.value = displayData.system.description.value + "</b><i>Additional Effects</i><br />"
			displayData.system.description.value = displayData.system.description.value + "<div style='font-size:10px'><b>" + capitalise(actionData.system.attackEffects.value.replaceAll("-", " ")) + "</div>";
		}

		displayData.system.runes = [];
		if (itemData != null) {
			for (var r in itemData.system.runes.property) {
				displayData.system.runes.push(itemData.system.runes.property[r].name);
			}
		}
		displayData.system.materials = actionData.system.materials;

		if (!(isNaN(initiative)) && "increaseMAP" in actionData && actionData.increaseMAP) {
			actingToken.setProperty("attacksThisRound", String((currentAttackCount + 1)));
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in attack_action during description-setup");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("casterToken: " + String(actingToken));
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("damageDetails: " + JSON.stringify(damageDetails));
		MapTool.chat.broadcast("critDamageDetails: " + JSON.stringify(critDamageDetails));
		MapTool.chat.broadcast("additionalDamageList: " + JSON.stringify(additionalDamageList));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	chat_display(displayData, true, { "level": actingToken.level });

}

MTScript.registerMacro("ca.pf2e.attack_action", attack_action);