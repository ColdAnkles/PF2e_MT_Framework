"use strict";

function attack_action(actionData, actingToken){
	if (typeof(actingToken)=="string"){
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	let currentAttackCount = Number(actingToken.getProperty("attacksThisRound"));
	if (isNaN(currentAttackCount)){
		currentAttackCount = 0;
	}

	let inventory = JSON.parse(actingToken.getProperty("inventory"));
	let itemData = inventory[actionData.linkedWeapon];
	
	let attack_bonus = actionData.bonus;
	let initiative = get_initiative(actingToken.getId());

	let attackScopes = ["attack-roll"];
	let damageScopes = ["damage"];
	if(actionData.isMelee){
		attackScopes.push("melee-attack");
		damageScopes.push("melee-damage");
	}else{
		attackScopes.push("ranged-attack");
		damageScopes.push("ranged-damage");
	}

	MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
	let dTwenty = Number(MTScript.getVariable("dTwenty"));

	let dTwentyColour = "black";
	if (dTwenty == 1){
		dTwentyColour = "red";
	}else if (dTwenty == 20){
		dTwentyColour = "green";
	}

	let effect_bonus = calculate_bonus(actingToken, attackScopes);	
	let damage_bonus = calculate_bonus(actingToken, damageScopes);

	let deadlyDie = "";
	let fatalDie = "";
	let MAP_Penalty = 5;
	let additionalAttackBonuses = [];
	let additionalDamageList = [];
	for (var t in actionData.traits){
		let traitName = actionData.traits[t];
		if (traitName == "agile"){
			MAP_Penalty = 4;
		}else if (traitName.includes("fatal")){
			fatalDie = traitName.split("-")[1];
			
		}else if (traitName.includes("deadly")){
			deadlyDie = traitName.split("-")[1];
			
		}else if (traitName == "backstabber"){
			if (itemData != null){
				if (itemData.potentcyRune == 3){
					additionalDamageList.push("+2 (4) precision damage");
				}else{
					additionalDamageList.push("+1 (2) precision damage");
				}
			}
			
		}else if (traitName == "backswing" && effect_bonus.bonuses.circumstance==0 && currentAttackCount>0){
			additionalAttackBonuses.push("+1 (Backswing (c))")
			
		}else if (traitName == "forceful" && itemData!=null && currentAttackCount>0){
			let bonus = 0;
			if (currentAttackCount>1){
				bonus = 2 * itemData.damage.dice;
			}else{
				bonus = itemData.damage.dice;
			}
			if(bonus > damage_bonus.bonuses.circumstance){
				additionalDamageList.push("+"+String(bonus)+" ("+String(Number(2*bonus))+") (Forceful (c))")
			}
			
		}else if (traitName.includes("jousting")){
			if(itemData.damage.dice > damage_bonus.bonuses.circumstance){
				additionalDamageList.push("+"+String(itemData.damage.dice)+" ("+String(Number(2*itemData.damage.dice))+") (Jousting (c))");
			}
			let joustDie = traitName.split("-")[1];
			actionData.damage["joustOneHanded"]={"damage":String(itemData.damage.dice)+joustDie + "+" + Number(actingToken.getProperty("str")),"damageType":"piercing (one-handed)"};
			
		}else if (traitName.includes("two-hand")){
			let twoHandDie = traitName.split("-")[2];
			actionData.damage["twoHanded"]={"damage":String(itemData.damage.dice)+twoHandDie + "+" + Number(actingToken.getProperty("str")),"damageType": itemData.damage.damageType+" (two-handed)"};
			
		}else if (traitName == "propulsive" && get_token_type(actingToken)=="PC"){
			MapTool.chat.broadcast("Propulsive Trait not Implemented");
			
		}else if (traitName == "sweep" && effect_bonus.bonuses.circumstance==0 && currentAttackCount>0){
			additionalAttackBonuses.push("+1 (Sweep (c))");
			
		}else if (traitName == "twin" && currentAttackCount>0){
			if(itemData.damage.dice > damage_bonus.bonuses.circumstance){
				additionalAttackBonuses.push("+"+String(itemData.damage.dice)+" (Twin (c))");
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));
	//MapTool.chat.broadcast(JSON.stringify(itemData));
	//MapTool.chat.broadcast(JSON.stringify(additionalDamageList));
	//MapTool.chat.broadcast(JSON.stringify(additionalAttackBonuses));
	//MapTool.chat.broadcast(String(currentAttackCount));
	//MapTool.chat.broadcast(JSON.stringify(effect_bonus));
	//MapTool.chat.broadcast(JSON.stringify(damage_bonus));

	let damageDetails = [];
	let critDamageDetails = [];
	for (var d in actionData.damage){
		let damageData = actionData.damage[d];
		let rolledDamage = roll_dice(damageData.damage);
		damageDetails.push(damageData.damage + " = " + String(rolledDamage) + " " + damageData.damageType);
		let critDamage = rolledDamage * 2;
		let critDice = "("+damageData.damage+")x2 = " + String(critDamage);
		if (fatalDie != ""){
			let critRoll = damageData.damage.replaceAll(/d[0-9]*/g,fatalDie)
			critDamage = Number(roll_dice(critRoll)) + Number(roll_dice(fatalDie));
			critDice = "("+ critRoll + ")x2 + 1" + fatalDie + " = " + String(critDamage);
		}else if (deadlyDie !=""){
			critDamage += Number(roll_dice(deadlyDie));
			critDice = "("+damageData.damage+")x2 + " + deadlyDie + " = " + String(critDamage);
		}
		critDamageDetails.push(critDice + " " + damageData.damageType);
	}
	
	damage_bonus = damage_bonus.bonuses.circumstance + damage_bonus.bonuses.status + damage_bonus.bonuses.item + damage_bonus.bonuses.none + damage_bonus.maluses.circumstance + damage_bonus.maluses.status + damage_bonus.maluses.item + damage_bonus.maluses.none;
	
	effect_bonus = effect_bonus.bonuses.circumstance + effect_bonus.bonuses.status + effect_bonus.bonuses.item + effect_bonus.bonuses.none + effect_bonus.maluses.circumstance + effect_bonus.maluses.status + effect_bonus.maluses.item + effect_bonus.maluses.none;
	
	let map_malus = currentAttackCount * MAP_Penalty;

	let attackMod = attack_bonus+effect_bonus - map_malus;
	let attackResult = dTwenty + attackMod;
	
	let displayData = {"description":"","name":actingToken.getName() + " - " + actionData.name + " " + pos_neg_sign(attackMod)};
	displayData.traits = actionData.traits;	
	displayData.description = "<i>Attack Roll</i><br /><div style='font-size:10px'><b><span style='color:"+dTwentyColour+"'>" +String(dTwenty)+"</span> "
	if(attack_bonus!=0){
		displayData.description += pos_neg_sign(attack_bonus, true);
	}
	if(effect_bonus!=0){
		displayData.description += " " + pos_neg_sign(effect_bonus, true);
	}
	if(map_malus!=0){
		displayData.description += " " + pos_neg_sign(map_malus, true);
	}
	displayData.description += " = " + String(attackResult) + " " + additionalAttackBonuses.join(", ");

	displayData.description = displayData.description + "</div></b><i>Damage</i><br />";
	for (var s in damageDetails){
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + damageDetails[s] + "</div>";
	}

	displayData.description = displayData.description + "</b><i>Critical Damage</i><br />"

	for (var s in critDamageDetails){
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + critDamageDetails[s] + "</div>";
	}

	if (additionalDamageList.length>0){
		displayData.description = displayData.description + "</b><i>Additional Damage (Crit)</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + additionalDamageList.join(", ") + "</div>";
	}

	if(actionData.effects.length>0){
		displayData.description = displayData.description + "</b><i>Additional Effects</i><br />"
		displayData.description = displayData.description + "<div style='font-size:10px'><b>" + capitalise(actionData.effects.join(", ").replaceAll("-", " ")) + "</div>";
	}

	if (!(isNaN(initiative))){
		actingToken.setProperty("attacksThisRound",String(currentAttackCount+1));
		
	}

	chat_display(displayData, true, {"level":actingToken.level});
	
}

MTScript.registerMacro("ca.pf2e.attack_action", attack_action);