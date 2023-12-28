"use strict";

function calculate_bonus(token, bonusScopes){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	if (typeof(bonusScopes)=="string"){
		bonusScopes = [bonusScopes];
	}
	//MapTool.chat.broadcast("Calculating bonus for: " + JSON.stringify(bonusScopes));

	let activeEffects = JSON.parse(token.getProperty("activeEffects"));

	let activeConditions = JSON.parse(token.getProperty("conditionDetails"));
	
	let returnData = {"bonuses":{"circumstance":0,"status":0,"item":0,"none":0},"maluses":{"circumstance":0,"status":0,"item":0,"none":0}};

	for (var e in activeEffects){
		let effectData = activeEffects[e];
		let effectBonuses = get_effect_bonus(effectData, bonusScopes);
		//MapTool.chat.broadcast(JSON.stringify(effectBonuses));
		for (var type in effectBonuses){
			let typeDict = effectBonuses[type];
			for (var k in typeDict){
				if (type=="bonuses" && typeDict[k]>returnData[type][k]){
					returnData[type][k] = typeDict[k];
				}else if (type=="maluses" && typeDict[k]<returnData[type][k]){
					returnData[type][k] = typeDict[k];
				}
			}
		}
	}

	for (var c in activeConditions){
		let conditionData = activeConditions[c];
		//MapTool.chat.broadcast(JSON.stringify(conditionData));
		let conditionBonuses = get_effect_bonus(conditionData, bonusScopes);
		//MapTool.chat.broadcast(JSON.stringify(conditionBonuses));
		for (var type in conditionBonuses){
			let typeDict = conditionBonuses[type];
			for (var k in typeDict){
				if (type=="bonuses" && typeDict[k]>returnData[type][k]){
					returnData[type][k] = typeDict[k];
				}else if (type=="maluses" && typeDict[k]<returnData[type][k]){
					returnData[type][k] = typeDict[k];
				}
			}
		}
	}
	
	return returnData;
}

MTScript.registerMacro("ca.pf2e.calculate_bonus", calculate_bonus);