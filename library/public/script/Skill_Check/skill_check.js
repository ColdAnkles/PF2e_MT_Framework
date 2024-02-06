"use strict";

function skill_check(checkToken, altStat = false, checkData = null, extraScopes = []){
	//MapTool.chat.broadcast(JSON.stringify(extraScopes));
	altStat = Boolean(altStat);
	if (typeof(checkToken)=="string"){
		checkToken = MapTool.tokens.getTokenByID(checkToken);
	}	
	
	let skills = {"Acrobatics":{"name":"Acrobatics","stat":"dex"},
	"Arcana":{"name":"Arcana","stat":"int"},
	"Athletics":{"name":"Athletics","stat":"str"},
	"Crafting":{"name":"Crafting","stat":"int"},
	"Deception":{"name":"Deception","stat":"cha"},
	"Diplomacy":{"name":"Diplomacy","stat":"cha"},
	"Intimidation":{"name":"Intimidation","stat":"cha"},
	"Medicine":{"name":"Medicine","stat":"wis"},
	"Nature":{"name":"Nature","stat":"wis"},
	"Occultism":{"name":"Occultism","stat":"int"},
	"Perception":{"name":"Perception","stat":"wis"},
	"Performance":{"name":"Performance","stat":"cha"},
	"Religion":{"name":"Religion","stat":"wis"},
	"Society":{"name":"Society","stat":"int"},
	"Stealth":{"name":"Stealth","stat":"dex"},
	"Survival":{"name":"Survival","stat":"wis"},
	"Thievery":{"name":"Thievery","stat":"dex"}};

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

		if (tokenType=="NPC" || tokenType == "PC"){

			for (var p in skills){
				let skillData = skills[p];
				let abilityMod = checkToken.getProperty(skillData.stat);
				skillStrings[skillData.name] = skillData.name + " " + pos_neg_sign(abilityMod);
			}
			
			let profList = JSON.parse(checkToken.getProperty("proficiencies"));

			for (var p in profList){
				let profData = profList[p];
				if(!(p in skills) && !(profData.name.includes("Lore"))){
					continue
				}
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
		queryHTML += "<table><form action='macro://Skill_Check_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
		queryHTML += "<input type='hidden' name='checkTokenID' value='"+checkToken.getId()+"'>";
		queryHTML += "<input type='hidden' name='tokenType' value='"+tokenType+"'>";
		queryHTML += "<input type='hidden' name='secretCheck' value='0'>";
		queryHTML += "<input type='hidden' name='altStat' value='"+Number(altStat)+"'>";

		queryHTML += "<tr><td>Skill:</td><td><select name='skillName'>";
		for (var s in skillStrings){
			queryHTML += "<option value='"+s+"'>"+skillStrings[s]+"</option>";
		}
		queryHTML += "</select></td>";

		if(altStat){
			queryHTML += "<td>Attribute:</td><td><select name='statName'>";
			for (var s in statStrings){
				queryHTML += "<option value='"+statStrings[s].name+"'>"+statStrings[s].string+"</option>";
			}
			queryHTML += "</select></td>";
		}
		queryHTML += "</tr>";

		queryHTML += "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
		<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='cMalus' value='0' size='2'></input></td></tr>";

		queryHTML += "<tr><td>Secret Check?</td><td><input type='checkbox' name='secretCheck' value='1'></td>\
		<td>Status:</b></td><td>+<input type='text' name='sBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='sMalus' value='0' size='2'></input></td></tr>";

		queryHTML += "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >"+checkToken.getName()+" tries to be skillful.</textarea></td>\
		<td>Item:</b></td><td>+<input type='text' name='iBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='iMalus' value='0' size='2'></input></td></tr>";

		queryHTML += "<tr><td colspan='3' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td></tr>";

		queryHTML += "<tr><td colspan='3' style='text-align:center'><input type='submit' name='skillCheckSubmit' value='Submit'></td></tr>";

		queryHTML += "</form></table></html>"

		MTScript.setVariable("queryHTML",queryHTML);
		MTScript.evalMacro("[dialog5('Skill Check','width=510;height=300;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");
	
	}else{
		MapTool.chat.broadcast("Submitted :" + JSON.stringify(checkData));

		if(!("cBonus" in checkData)){
			checkData.cBonus = 0;
		}
		if(!("sBonus" in checkData)){
			checkData.sBonus = 0;
		}
		if(!("iBonus" in checkData)){
			checkData.iBonus = 0;
		}
		if(!("cMalus" in checkData)){
			checkData.cMalus = 0;
		}
		if(!("sMalus" in checkData)){
			checkData.sMalus = 0;
		}
		if(!("iMalus" in checkData)){
			checkData.iMalus = 0;
		}
		if(!("fortuneSelect" in checkData)){
			checkData.fortuneSelect = "normal";
		}

		MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
		let dTwenty = Number(MTScript.getVariable("dTwenty"));
		if(checkData.fortuneSelect=="fortune"){
			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			dTwenty = Math.max(dTwenty, Number(MTScript.getVariable("dTwenty")));
		}else if(checkData.fortuneSelect=="misfortune"){
			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			dTwenty = Math.min(dTwenty, Number(MTScript.getVariable("dTwenty")));
		}

		let dTwentyColour = "black";
		if (dTwenty == 1){
			dTwentyColour = "red";
		}else if (dTwenty == 20){
			dTwentyColour = "green";
		}

		let stat_bonus = Number(checkToken.getProperty(checkData.statName));
		if(checkData.skillName in skills && !("statName" in checkData)){
			stat_bonus = Number(checkToken.getProperty(skills[checkData.skillName].stat));
		}else if(checkData.skillName.includes("Lore")){
			stat_bonus = Number(checkToken.getProperty("int"));
		}

		if (!("statName" in checkData) && checkData.skillName in skills){
			checkData.statName = skills[checkData.skillName].stat;
		}
		
		//MapTool.chat.broadcast("Submitted :" + JSON.stringify(checkData));
		let prof_bonus = 0;
		let misc_bonus = Number(checkData.miscBonus);
		let effect_bonus_raw = calculate_bonus(checkToken, [lowercase(checkData.skillName),checkData.statName+"-based","skill-check"].concat(extraScopes), true);
		let effect_bonus = Math.max(effect_bonus_raw.bonuses.circumstance,checkData.cBonus) + Math.max(effect_bonus_raw.bonuses.status,checkData.sBonus) + Math.max(effect_bonus_raw.bonuses.item,checkData.iBonus) + effect_bonus_raw.bonuses.none
		 + Math.max(effect_bonus_raw.maluses.circumstance,checkData.cMalus) + Math.max(effect_bonus_raw.maluses.status,checkData.sMalus) + Math.max(effect_bonus_raw.maluses.item,checkData.iMalus) + effect_bonus_raw.maluses.none;

		//MapTool.chat.broadcast(JSON.stringify(effect_bonus_raw));

		if (checkData.tokenType == "NPC" || checkData.tokenType == "PC"){
			let profList = JSON.parse(checkToken.getProperty("proficiencies"));
			for (var p in profList){
				let profData = profList[p];
				if (checkData.skillName == profData.name && checkData.tokenType == "NPC"){
					prof_bonus = Number(profData.bonus - stat_bonus);
				}else if(checkData.skillName == profData.name && checkData.tokenType == "PC"){
					prof_bonus = Number(profData.bonus);
				}
			}
		}

		if (effect_bonus_raw.bonuses.proficiency>0 && effect_bonus_raw.bonuses.proficiency>prof_bonus){
			prof_bonus = effect_bonus_raw.bonuses.proficiency;
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