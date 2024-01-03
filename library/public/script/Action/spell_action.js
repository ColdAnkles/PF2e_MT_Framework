"use strict";

function spell_action(actionData, actingToken){
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));
	
	if (!(actionData.name in property)){
		MapTool.chat.broadcast("<h2>Could not find spell " + actionData.name + "</h2>");
		return;
	}
	
	let spellData = property[actionData.name];
	if ("fileURL" in spellData){
		spellData = rest_call(spellData["fileURL"],"");
	}
	spellData = parse_spell(spellData);
	
	if (typeof(actingToken)=="string"){
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	let spellRules = JSON.parse(actingToken.getProperty("spellRules"));
	let tokenSpell = null;
	let castData = null;

	for (var spellcasting in spellRules){
		let spellCastData = spellRules[spellcasting];
		for (var aSpell in spellCastData.spells){
			let aSpellData = spellCastData.spells[aSpell];
			if (aSpellData.name == actionData.name){
				tokenSpell = aSpellData;
				castData = spellCastData;
			}
		}
	}	

	let spellMod = Math.max(Number(actingToken.getProperty("int")),Number(actingToken.getProperty("wis")),Number(actingToken.getProperty("cha")));

	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let attackScopes = ["spell"];
	let damageScopes = ["damage","spell-damage"];	
	let damage_bonus = calculate_bonus(actingToken, damageScopes);
	
	let displayData = {"description":"","name":actingToken.getName() + " - " + actionData.name,"level":actionData.castLevel,"type":spellData.category};

	if(spellData.traits.value.includes("attack")){
		displayData.description = displayData.description + "<i>Attack Roll</i><br /><div style='font-size:10px'><b>";

		let currentAttackCount = Number(actingToken.getProperty("attacksThisRound"));
		if (isNaN(currentAttackCount)){
			currentAttackCount = 0;
		}
		let map_malus = currentAttackCount * -5;
		let attack_bonus = castData.spellAttack;
		
		MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
		let dTwenty = Number(MTScript.getVariable("dTwenty"));

		attackScopes.push("attack");
		attackScopes.push("spell-attack");
		let effect_bonus = calculate_bonus(actingToken, attackScopes);
		effect_bonus = effect_bonus.bonuses.circumstance + effect_bonus.bonuses.status + effect_bonus.bonuses.item + effect_bonus.bonuses.none + effect_bonus.maluses.circumstance + effect_bonus.maluses.status + effect_bonus.maluses.item + effect_bonus.maluses.none;

		let dTwentyColour = "black";
		if (dTwenty == 1){
			dTwentyColour = "red";
		}else if (dTwenty == 20){
			dTwentyColour = "green";
		}

		let attackMod = attack_bonus+effect_bonus - map_malus;
		let attackResult = dTwenty + attackMod;

		displayData.description = displayData.description + "<span style='color:"+dTwentyColour+"'>" +String(dTwenty)+"</span> ";
		if(attack_bonus!=0){
			displayData.description += pos_neg_sign(attack_bonus, true);
		}
		if(effect_bonus!=0){
			displayData.description += " " + pos_neg_sign(effect_bonus, true);
		}
		if(map_malus!=0){
			displayData.description += " " + pos_neg_sign(map_malus, true);
		}
		displayData.description += " = " + String(attackResult);

		displayData.description = displayData.description + "</b>"
		
		displayData.description = displayData.description + "</div>";
	}
	
	if (spellData.defense!=null && "save" in spellData.defense && spellData.defense.save.statistic != ""){
		displayData.description = displayData.description + "<div style='font-size:10px'><b>";
		if (spellData.defense.save.basic == "basic"){
			displayData.description = displayData.description + "Basic "
		}
		displayData.description = displayData.description + capitalise(spellData.defense.save.statistic) + " Save, DC " + castData.spellDC + "</div>";
	}
	
	//Special case for magic missile
	if(spellData.name == "Magic Missile"){
		let totalDarts = (Math.floor((actionData.castLevel-1)/2)+1) * actionData.actionCost;
		//MapTool.chat.broadcast((Math.floor((actionData.castLevel-1)/2)+1) + " * " + actionData.actionCost + " = " + String(totalDarts));
		for (let i = 1; i< totalDarts; i+= 1){
			spellData.damage["dart"+String(i)]=spellData.damage[0];
		}
		//MapTool.chat.broadcast(JSON.stringify(spellData.damage));
	}

	if ("damage" in spellData && Object.keys(spellData.damage).length>0){
		displayData.description = displayData.description + "<i>Damage</i><br />";
		if("heightening" in spellData && spellData.heightening.type == "fixed"){
			let found = false;
			let heightenVal = null;
			let testIndex = actionData.castLevel
			while(!found){
				if(testIndex in spellData.heightening.levels){
					found = true;
					heightenVal = spellData.heightening.levels[testIndex];
				}else if(testIndex<=0){
					found = true;
				}else{
					testIndex -= 1;
				}
			}
			if(heightenVal!=null){
				spellData.damage = heightenVal.damage;
			}
		}
		for (var d in spellData.damage){
			displayData.description = displayData.description + "<div style='font-size:10px'><b>";
			let damageData = spellData.damage[d];
			let damageRoll = String(damageData.formula);
			if("heightening" in spellData && "damage" in spellData.heightening && spellData.heightening.type == "interval" && d in spellData.heightening.damage){
				for (let i = spellData.level+1; i<=actionData.castLevel; i += spellData.heightening.interval){
					damageRoll = damageRoll + "+" + spellData.heightening.damage[d];
				}
			}
			if (damageData.applyMod){
				damageRoll = damageRoll;
				if(spellMod!=0){
					damageRoll+="+"+String(spellMod);
				}
			}
			damageRoll = group_dice(damageRoll);
			let rolled = roll_dice(damageRoll);
			if(String(rolled)!=damageRoll){
				displayData.description = displayData.description + damageRoll + " = " + String(rolled);
			}else{
				displayData.description = displayData.description + String(rolled);
			}
			if(damageData.category!=null){
				displayData.description += " " + damageData.category;
			}
			displayData.description += " " + damageData.type;
			displayData.description = displayData.description + "</div>";
		}
	}

	displayData.description = displayData.description + spellData.description;

	displayData.traits = spellData.traits.value;
	displayData.castLevel = actionData.castLevel;
	displayData.level = spellData.level;
	displayData.actionCost = actionData.actionCost;
	displayData.actionType = actionData.actionType;
	if ("cantrip" in spellData.traits.value){
		displayData.type = "Cantrip";
	}

	chat_display(displayData, true, {"level":actionData.castLevel});
}
