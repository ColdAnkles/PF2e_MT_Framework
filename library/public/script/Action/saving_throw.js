"use strict";

function saving_throw(saveToken, saveData = null, additionalData = {"applyEffect":""}){
	if (typeof(saveToken)=="string"){
		saveToken = MapTool.tokens.getTokenByID(saveToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(saveData));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
		
	let saves = ["fortitude","reflex","will"]

	let specialEffects = JSON.parse(saveToken.getProperty("specialEffects"));
	if (specialEffects === null){
		specialEffects = {};
	}
	
	if (saveData === null){

		let queryHTML = "<html>";

		let saveStrings = {};

		for (var s in saves){
			saveStrings[s] = {"name":saves[s],"string":(capitalise(saves[s]) + " "+pos_neg_sign(saveToken.getProperty(saves[s])))};
		}

		queryHTML = queryHTML + "<table><form action='macro://Saving_Throw_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
		queryHTML = queryHTML + "<input type='hidden' name='saveTokenID' value='"+saveToken.getId()+"'>";
		queryHTML = queryHTML + "<input type='hidden' name='secretCheck' value='0'>";

		queryHTML = queryHTML + "<tr><td>Save:</td><td><select name='saveName'>";
		for (var s in saveStrings){
			queryHTML = queryHTML + "<option value='"+saveStrings[s].name+"'>"+saveStrings[s].string+"</option>";
		}
		queryHTML = queryHTML + "</select></td></tr>";

		for(var e in specialEffects){
			let effectData = specialEffects[e];
			let effectIndex = 0
			//MapTool.chat.broadcast(JSON.stringify(effectData));
			let effectName = effectData.name.replaceAll("Effect: ","");
			if (specialEffects[e].type=="saving-throw"){
				queryHTML += "<tr><td>Apply " + effectName+"?</td><td><input type='checkbox' name='specialEffect"+String(effectIndex)+"' value='";
				queryHTML += effectData.name+"'"+((additionalData.applyEffect==effectName) ? "checked" : "" ) + "></td></tr>";
				effectIndex += 1;
			}
		}

		queryHTML = queryHTML + "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
		<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='cMalus' value='0' size='2'></input></td></tr>";

		queryHTML = queryHTML + "<tr><td>Secret Check?</td><td><input type='checkbox' name='secretCheck' value='1'></td>\
		<td>Status:</b></td><td>+<input type='text' name='sBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='sMalus' value='0' size='2'></input></td></tr>";

		queryHTML = queryHTML + "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >"+saveToken.getName()+" attempts to save.</textarea></td>\
		<td>Item:</b></td><td>+<input type='text' name='iBonus' value='0' size='2'></input></td>\
		<td>-<input type='text' name='iMalus' value='0' size='2'></input></td></tr>";

		queryHTML += "<tr><td colspan='3' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan='3' style='text-align:center'><input type='submit' name='savingThrowSubmit' value='Submit'></td></tr>";

		queryHTML = queryHTML + "</form></table></html>"

		MTScript.setVariable("queryHTML",queryHTML);
		MTScript.evalMacro("[dialog5('Saving Throw','width=510;height=290;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");
	
	}else{
		//MapTool.chat.broadcast("Submitted :" + JSON.stringify(saveData));
		
		if(!("cBonus" in saveData)){
			saveData.cBonus = 0;
		}
		if(!("sBonus" in saveData)){
			saveData.sBonus = 0;
		}
		if(!("iBonus" in saveData)){
			saveData.iBonus = 0;
		}
		if(!("cMalus" in saveData)){
			saveData.cMalus = 0;
		}
		if(!("sMalus" in saveData)){
			saveData.sMalus = 0;
		}
		if(!("iMalus" in saveData)){
			saveData.iMalus = 0;
		}
		if(!("fortuneSelect" in saveData)){
			saveData.fortuneSelect = "normal";
		}

		MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
		let dTwenty = Number(MTScript.getVariable("dTwenty"));
		if(saveData.fortuneSelect=="fortune"){
			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			dTwenty = Math.max(dTwenty, Number(MTScript.getVariable("dTwenty")));
		}else if(saveData.fortuneSelect=="misfortune"){
			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			dTwenty = Math.min(dTwenty, Number(MTScript.getVariable("dTwenty")));
		}

		let dTwentyColour = "black";
		if (dTwenty == 1){
			dTwentyColour = "red";
		}else if (dTwenty == 20){
			dTwentyColour = "green";
		}

		let basic_bonus = Number(saveToken.getProperty(saveData.saveName));
		let misc_bonus = Number(saveData.miscBonus);
		let effect_bonus_raw = calculate_bonus(saveToken.getId(), saveData.saveName, true);

		for (var k in saveData){
			if (k.includes("specialEffect")){
				let effectData = specialEffects[saveData[k]];
				let tempBonus = get_effect_bonus(effectData,["saving-throw",saveData.saveName]);
				for (var type in tempBonus){
					let typeDict = tempBonus[type];
					for (var k in typeDict){
						if (type=="bonuses" && typeDict[k]>effect_bonus_raw[type][k]){
							effect_bonus_raw[type][k] = typeDict[k];
						}else if (type=="maluses" && typeDict[k]<effect_bonus_raw[type][k]){
							effect_bonus_raw[type][k] = typeDict[k];
						}
					}
				}
				toggle_action_effect(effectData,saveToken,false);
			}
		}

		//MapTool.chat.broadcast(JSON.stringify(effect_bonus));



		let effect_bonus = effect_bonus_raw.bonuses.circumstance + effect_bonus_raw.bonuses.status + effect_bonus_raw.bonuses.item + effect_bonus_raw.bonuses.none +
		 effect_bonus_raw.maluses.circumstance + effect_bonus_raw.maluses.status + effect_bonus_raw.maluses.item + effect_bonus_raw.maluses.none;
		
		//MapTool.chat.broadcast(JSON.stringify(effect_bonus));

		let saveMod = basic_bonus+misc_bonus+effect_bonus;
		let saveResult = dTwenty + saveMod;

		let displayData = {"description":"","name":saveToken.getName() + " - " + capitalise(saveData.saveName) + " " + pos_neg_sign(saveMod)};
		displayData.appliedEffects = effect_bonus_raw.appliedEffects;
		displayData.description = saveData.flavourText+"<br/><div style='font-size:20px'><b><span style='color:"+dTwentyColour+"'>" +String(dTwenty)+"</span>"
		if(basic_bonus!=0){
			displayData.description += " " + pos_neg_sign(basic_bonus, true);
		}
		if(effect_bonus!=0){
			displayData.description += " " + pos_neg_sign(effect_bonus, true);
		}
		if(misc_bonus!=0){
			displayData.description += " " + pos_neg_sign(misc_bonus, true);
		}
		displayData.description += " = " + String(saveResult) + "</div></b>";

		chat_display(displayData);
		
	}
}

MTScript.registerMacro("ca.pf2e.saving_throw", saving_throw);