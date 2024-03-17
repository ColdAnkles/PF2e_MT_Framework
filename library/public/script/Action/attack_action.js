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

	if (get_token_type(actingToken) == "PC") {
		inventory = JSON.parse(actingToken.getProperty("inventory"));
		itemData = inventory[actionData.linkedWeapon];

		if (itemData == null && !actionData.linkedWeapon == "unarmed") {
			MapTool.chat.broadcast("Linked Weapon Missing!");
			return
		} else if (itemData == null && actionData.linkedWeapon == "unarmed") {
			itemData = find_handwraps(actingToken);
			if (itemData != null) {
				actionData.damage[0].dice = itemData.runes.striking + 1;
				actionData.traits = actionData.traits.concat(itemData.traits);
			}
		}
	}
	if (itemData != null) {
		if (itemData.material.type != null) {
			if (itemData.material.grade != null) {
				actionData.materials = [itemData.material.grade + " " + itemData.material.type];
			} else {
				actionData.materials = [itemData.material.type];
			}
		} else {
			actionData.materials = [];
		}
	} else {
	}

	let attack_bonus = actionData.bonus;
	let initiative = get_initiative(actingToken.getId());

	let attackScopes = ["attack", "attack-roll", "weapon-attack"];
	let damageScopes = ["strike-damage"];
	if (actionData.isMelee) {
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

	let effect_bonus_raw = calculate_bonus(actingToken, attackScopes, true, ((itemData!=null)?itemData:actionData));
	//MapTool.chat.broadcast(JSON.stringify(effect_bonus_raw));

	for (var oE in effect_bonus_raw.otherEffects) {
		let thisEffect = effect_bonus_raw.otherEffects[oE];
		if ("property" in thisEffect) {
			if (thisEffect.property == "materials") {
				if (thisEffect.mode == "add") {
					actionData.materials.push(thisEffect.value);
				}
			} else if (thisEffect.property == "weapon-traits") {
				if (thisEffect.mode == "add") {
					actionData.traits.push(thisEffect.value);
				}
			}
		}
	}

	if ("WeaponPotency" in effect_bonus_raw.otherEffects && itemData != null) {
		let currBonus = effect_bonus_raw.bonuses.item;
		effect_bonus_raw.bonuses.item = Math.max(currBonus, Number(effect_bonus_raw.otherEffects.WeaponPotency));
		itemData.runes.potency = effect_bonus_raw.otherEffects.WeaponPotency;
	}

	if ("Striking" in effect_bonus_raw.otherEffects && itemData != null) {
		actionData.damage[0].dice = Math.max(actionData.damage[0].dice, effect_bonus_raw.otherEffects.Striking + 1);
		itemData.damage.dice = actionData.damage[0].dice;
		itemData.runes.striking = effect_bonus_raw.otherEffects.Striking;
	}

	let damage_bonus_raw = calculate_bonus(actingToken, damageScopes, true, ((itemData!=null)?itemData:actionData));
	//MapTool.chat.broadcast(JSON.stringify(damage_bonus_raw));

	if ("otherEffects" in damage_bonus_raw) {
		if ("ItemAlteration" in damage_bonus_raw.otherEffects) {
			if ("mode" in damage_bonus_raw.otherEffects.ItemAlteration && damage_bonus_raw.otherEffects.ItemAlteration.mode == "upgrade") {
				if ("property" in damage_bonus_raw.otherEffects.ItemAlteration) {
					if (damage_bonus_raw.otherEffects.ItemAlteration.property == "damage-dice-faces") {
						let currentDie = actionData.damage[0].die;
						actionData.damage[0].die = dieUpgrades[currentDie];
					}
				}
			}
		}
	}

	let deadlyDie = "";
	let fatalDie = "";
	let MAP_Penalty = 5;
	let additionalAttackBonuses = [];
	let additionalDamageList = [];
	for (var t in actionData.traits) {
		let traitName = actionData.traits[t];
		if (traitName == "agile") {
			MAP_Penalty = 4;
		} else if (traitName.includes("fatal")) {
			fatalDie = traitName.split("-")[1];

		} else if (traitName.includes("deadly")) {
			deadlyDie = traitName.split("-")[1];

		} else if (traitName == "backstabber") {
			if (itemData != null) {
				if (itemData.runes.potency == 3) {
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
			if (itemData != null && itemData.damage.dice > damage_bonus_raw.bonuses.circumstance) {
				additionalDamageList.push("+" + String(itemData.damage.dice) + " (" + String(Number(2 * itemData.damage.dice)) + ") (Jousting (c))");
			}
			let joustDie = traitName.split("-")[1];
			actionData.damage["joustOneHanded"] = { "damage": String(itemData.damage.dice) + joustDie + "+" + Number(actingToken.getProperty("str")), "damageType": "piercing (one-handed)" };

		} else if (itemData != null && traitName.includes("two-hand")) {
			let twoHandDie = traitName.split("-")[2];
			actionData.damage["twoHanded"] = { "damage": String(itemData.damage.dice) + twoHandDie + "+" + Number(actingToken.getProperty("str")), "damageType": itemData.damage.damageType + " (two-handed)" };

		} else if (traitName == "propulsive" && get_token_type(actingToken) == "PC") {
			MapTool.chat.broadcast("Propulsive Trait not Implemented");

		} else if (traitName == "sweep" && effect_bonus_raw.bonuses.circumstance == 0 && currentAttackCount > 0) {
			additionalAttackBonuses.push("+1 (Sweep (c))");

		} else if (traitName == "twin" && currentAttackCount > 0) {
			if (itemData != null && itemData.damage.dice > damage_bonus_raw.bonuses.circumstance) {
				additionalAttackBonuses.push("+" + String(itemData.damage.dice) + " (Twin (c))");
			}
		}
	}

	let damageDetails = [];
	let critDamageDetails = [];

	let damage_bonus = damage_bonus_raw.bonuses.circumstance + damage_bonus_raw.bonuses.status + damage_bonus_raw.bonuses.item + damage_bonus_raw.bonuses.none +
		damage_bonus_raw.maluses.circumstance + damage_bonus_raw.maluses.status + damage_bonus_raw.maluses.item + damage_bonus_raw.maluses.none;

	if (get_token_type(actingToken) == "PC") {
		actionData.damage[0].damage = String(actionData.damage[0].dice) + actionData.damage[0].die + ((itemData != null && itemData.damageBonus != null && itemData.damageBonus > 0) ? "+" + String(itemData.damageBonus) : "");
		if (actionData.traits.includes("finesse")) {
			attack_bonus += Math.max(Number(actingToken.getProperty("str")), Number(actingToken.getProperty("dex")));
		} else {
			attack_bonus += Number(actingToken.getProperty("str"));
		}
	}

	for (var d in actionData.damage) {
		let damageData = actionData.damage[d];
		if (damage_bonus != 0) {
			damageData.damage += "+" + String(damage_bonus)
		}
		let rolledDamage = roll_dice(damageData.damage);
		damageDetails.push(damageData.damage + " = " + String(rolledDamage) + " " + damageData.damageType);
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

	let effect_bonus = effect_bonus_raw.bonuses.circumstance + effect_bonus_raw.bonuses.status + ((itemData != null && get_token_type(actingToken) == "PC") ? Math.max(effect_bonus_raw.bonuses.item, itemData.runes.potency) : effect_bonus_raw.bonuses.item) + effect_bonus_raw.bonuses.none +
		effect_bonus_raw.maluses.circumstance + effect_bonus_raw.maluses.status + effect_bonus_raw.maluses.item + effect_bonus_raw.maluses.none;

	let map_malus = currentAttackCount * MAP_Penalty;

	if ("useMAP" in actionData && !actionData.useMAP) {
		map_malus = 0;
	}

	let attackMod = attack_bonus + effect_bonus - map_malus;
	let attackResult = dTwenty + attackMod;

	let displayData = { "description": "", "name": actingToken.getName() + " - " + actionData.name + " " + pos_neg_sign(attackMod) };
	displayData.appliedEffects = effect_bonus_raw.appliedEffects;
	displayData.traits = actionData.traits;
	displayData.description = "<i>Attack Roll</i><br /><div style='font-size:10px'><b><span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span> "
	if (attack_bonus != 0) {
		displayData.description += pos_neg_sign(attack_bonus, true);
	}
	if (effect_bonus != 0) {
		displayData.description += " " + pos_neg_sign(effect_bonus, true);
	}
	if (map_malus != 0) {
		displayData.description += " " + pos_neg_sign(-map_malus, true);
	}
	displayData.description += " = " + String(attackResult) + " " + additionalAttackBonuses.join(", ");

	displayData.description = displayData.description + "</div></b><i>Damage</i><br />";
	for (var s in damageDetails) {
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + damageDetails[s] + "</div>";
	}

	displayData.description = displayData.description + "</b><i>Critical Damage</i><br />"

	for (var s in critDamageDetails) {
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + critDamageDetails[s] + "</div>";
	}

	if (additionalDamageList.length > 0) {
		displayData.description = displayData.description + "</b><i>Additional Damage (Crit)</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + additionalDamageList.join(", ") + "</div>";
	}

	if (actionData.effects.length > 1 && typeof (actionData.effects == "object")) {
		displayData.description = displayData.description + "</b><i>Additional Effects</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + capitalise(actionData.effects.join(", ").replaceAll("-", " ")) + "</div>";
	} else if (actionData.effects.length == 1 && typeof (actionData.effects) == "object") {
		displayData.description = displayData.description + "</b><i>Additional Effects</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + capitalise(actionData.effects[0].replaceAll("-", " ")) + "</div>";
	} else if (actionData.effects.length > 0 && (typeof (attackData.effects) == "string")) {
		displayData.description = displayData.description + "</b><i>Additional Effects</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + capitalise(actionData.effects.replaceAll("-", " ")) + "</div>";
	}

	displayData.runes = [];
	if (itemData != null) {
		for (var r in itemData.runes.property) {
			displayData.runes.push(itemData.runes.property[r].name);
		}
	}
	displayData.materials = actionData.materials;

	if (!(isNaN(initiative)) && "increaseMAP" in actionData && actionData.increaseMAP) {
		actingToken.setProperty("attacksThisRound", String(currentAttackCount + 1));
	}

	chat_display(displayData, true, { "level": actingToken.level });

}

MTScript.registerMacro("ca.pf2e.attack_action", attack_action);