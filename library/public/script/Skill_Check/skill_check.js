"use strict";

function skill_check(checkToken, altStat = false, checkData = null, extraScopes = []){
	//MapTool.chat.broadcast(JSON.stringify(extraScopes));
	altStat = Boolean(altStat);
	if (typeof(checkToken)=="string"){
		checkToken = MapTool.tokens.getTokenByID(checkToken);
	}	
	
	let skills = {"Acrobatics":{"name":"Acrobatics","stat":"dex"},"Arcana":{"name":"Arcana","stat":"int"},"Athletics":{"name":"Athletics","stat":"str"},"Crafting":{"name":"Crafting","stat":"int"},"Deception":{"name":"Deception","stat":"cha"},"Diplomacy":{"name":"Diplomacy","stat":"cha"},"Intimidation":{"name":"Intimidation","stat":"cha"},"Medicine":{"name":"Medicine","stat":"wis"},"Nature":{"name":"Nature","stat":"wis"},"Occultism":{"name":"Occultism","stat":"int"},"Perception":{"name":"Perception","stat":"wis"},"Performance":{"name":"Performance","stat":"cha"},"Religion":{"name":"Religion","stat":"wis"},"Society":{"name":"Society","stat":"int"},"Stealth":{"name":"Stealth","stat":"dex"},"Survival":{"name":"Survival","stat":"wis"},"Thievery":{"name":"Thievery","stat":"dex"}}

	let stats = ["str","dex","con","int","wis","cha"];
	
	if (checkData === null){

		let queryHTML = "<html>";

		let skillStrings = {};

		let statStrings = {};

		if(altStat){
			for (var s in stats){
				statStrings[s] = {"name":stats[s],"string":(capitalise(stats[s]) + " +"+checkToken.getProperty(stats[s]))};
			}
		}

		let tokenType = get_token_type(checkToken);

		if (tokenType=="NPC"){

			for (var p in skills){
				let skillData = skills[p];
				let abilityMod = checkToken.getProperty(skillData.stat);
				skillStrings[skillData.name] = skillData.name + " " + pos_neg_sign(abilityMod);
			}
			
			let profList = JSON.parse(checkToken.getProperty("proficiencies"));

			for (var p in profList){
				let profData = profList[p];
				let attMod = profData.bonus;
				if(profData.name in skills){
					attMod = Number(checkToken.getProperty(skills[profData.name].stat));
				}else if(profData.name.includes("Lore")){
					attMod = Number(checkToken.getProperty("int"));
				}else{
					attMod = 0;
				}
				let displayNumber = profData.bonus - attMod;
				if(!altStat){
					displayNumber = profData.bonus;
				}
				skillStrings[profData.name] = profData.name + " " + pos_neg_sign(displayNumber);
			}
			
		}

		queryHTML = queryHTML + "<table><form action='macro://Skill_Check_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
		queryHTML = queryHTML + "<input type='hidden' name='checkTokenID' value='"+checkToken.getId()+"'>";
		queryHTML = queryHTML + "<input type='hidden' name='tokenType' value='"+tokenType+"'>";
		queryHTML = queryHTML + "<input type='hidden' name='secretCheck' value='0'>";
		queryHTML = queryHTML + "<input type='hidden' name='altStat' value='"+Number(altStat)+"'>";

		queryHTML = queryHTML + "<tr><td>Skill:</td><td><select name='skillName'>";
		for (var s in skillStrings){
			queryHTML = queryHTML + "<option value='"+s+"'>"+skillStrings[s]+"</option>";
		}
		queryHTML = queryHTML + "</select></td></tr>";

		if(altStat){
			queryHTML = queryHTML + "<tr><td>Attribute:</td><td><select name='statName'>";
			for (var s in statStrings){
				queryHTML = queryHTML + "<option value='"+statStrings[s].name+"'>"+statStrings[s].string+"</option>";
			}
			queryHTML = queryHTML + "</select></td></tr>";
		}

		queryHTML = queryHTML + "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td></tr>";

		queryHTML = queryHTML + "<tr><td>Secret Check?</td><td><input type='checkbox' name='secretCheck' value='1'></td></tr>";

		queryHTML = queryHTML + "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >"+checkToken.getName()+" tries to be skillful.</textarea></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan='2'><input type='submit' name='skillCheckSubmit' value='Submit'></td></tr>";

		queryHTML = queryHTML + "</form></table></html>"

		MTScript.setVariable("queryHTML",queryHTML);
		MTScript.evalMacro("[dialog5('Skill Check','width=300;height=300;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");
	
	}else{

		MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
		let dTwenty = Number(MTScript.getVariable("dTwenty"));

		let dTwentyColour = "black";
		if (dTwenty == 1){
			dTwentyColour = "red";
		}else if (dTwenty == 20){
			dTwentyColour = "green";
		}


		if (!("statName" in checkData) && checkData.skillName in skills){
			checkData.statName = skills[checkData.skillName].stat;
		}

		let stat_bonus = Number(checkToken.getProperty(checkData.statName));
		if(checkData.skillName in skills){
			stat_bonus = Number(checkToken.getProperty(skills[checkData.skillName].stat));
		}else if(checkData.skillName.includes("Lore")){
			stat_bonus = Number(checkToken.getProperty("int"));
		}
		
		//MapTool.chat.broadcast("Submitted :" + JSON.stringify(checkData));
		let prof_bonus = 0;
		let misc_bonus = Number(checkData.miscBonus);
		let effect_bonus = calculate_bonus(checkToken.getId(), [lowercase(checkData.skillName),checkData.statName+"-based"].concat(extraScopes));
		effect_bonus = effect_bonus.bonuses.circumstance + effect_bonus.bonuses.status + effect_bonus.bonuses.item + effect_bonus.bonuses.none + effect_bonus.maluses.circumstance + effect_bonus.maluses.status + effect_bonus.maluses.item + effect_bonus.maluses.none;

		if (checkData.tokenType == "NPC"){
			let profList = JSON.parse(checkToken.getProperty("proficiencies"));
			for (var p in profList){
				let profData = profList[p];
				if (checkData.skillName == profData.name){
					prof_bonus = Number(profData.bonus - stat_bonus);
				}
			}
		}

		let checkMod = stat_bonus+prof_bonus+misc_bonus+effect_bonus;
		let checkResult = dTwenty + checkMod;

		let displayData = {"description":"","name":checkToken.getName() + " - " + checkData.skillName + " " +pos_neg_sign(checkMod)};
		displayData.description = checkData.flavourText+"<br/><div style='font-size:20px'><b><span style='color:"+dTwentyColour+"'>" +String(dTwenty)+"</span>"
		if(stat_bonus!=0){
			displayData.description += " " + pos_neg_sign(stat_bonus, true);
		}
		if(prof_bonus!=0){
			displayData.description += " " + pos_neg_sign(prof_bonus, true);
		}
		if(effect_bonus!=0){
			displayData.description += " " + pos_neg_sign(effect_bonus, true);
		}
		if(misc_bonus!=0){
			displayData.description += " " + pos_neg_sign(misc_bonus, true);
		}
		displayData.description += " = " + String(checkResult) + "</div></b>";

		chat_display(displayData);

		return checkResult;
	}
}

MTScript.registerMacro("ca.pf2e.skill_check", skill_check);