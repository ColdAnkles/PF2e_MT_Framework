"use strict";

function calculate_bonus(token, bonusScopes, consume=false){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	if (typeof(bonusScopes)=="string"){
		bonusScopes = [bonusScopes];
	}
	//MapTool.chat.broadcast("Calculating bonus for: " + JSON.stringify(bonusScopes));

	let activeEffects = Object.assign({},JSON.parse(token.getProperty("activeEffects")),JSON.parse(token.getProperty("specialEffects")),JSON.parse(token.getProperty("passiveSkills")));

	let activeConditions = JSON.parse(token.getProperty("conditionDetails"));
	
	let selectedModifiers = {"bonuses":{"circumstance":null,"status":null,"item":null,"none":null,"proficiency":null},"maluses":{"circumstance":null,"status":null,"item":null,"none":null,"proficiency":null}};
	let returnData = {"bonuses":{"circumstance":0,"status":0,"item":0,"none":0,"proficiency":0},"maluses":{"circumstance":0,"status":0,"item":0,"none":0,"proficiency":0},"otherEffects":{}};

	for (var e in activeEffects){
		let effectData = JSON.parse(JSON.stringify(activeEffects[e]));
		//MapTool.chat.broadcast(JSON.stringify(effectData));
		let effectBonuses = get_effect_bonus(effectData, bonusScopes, token);
		//MapTool.chat.broadcast(JSON.stringify(effectBonuses));
		effectData.bonus = effectBonuses;
		let hasAsked = false;
		let askResponse = true;
		for (var type in effectBonuses){
			if(type=="query"){
				continue;
			}else if(type=="otherEffects"){
				returnData.otherEffects = Object.assign({},returnData.otherEffects,effectBonuses.otherEffects);
			}
			let typeDict = effectBonuses[type];
			for (var k in typeDict){
				if (type=="bonuses" && typeDict[k]>returnData[type][k]){
					if(!hasAsked && effectBonuses.query && consume){
						MTScript.evalMacro("[h: ans=input(\"junkVar|Apply "+effectData.name+"?|blah|LABEL|SPAN=TRUE\")]");
						askResponse = (Number(MTScript.getVariable("ans"))==1);
						hasAsked=true;
					}
					if(askResponse || !consume){
						returnData[type][k] = typeDict[k];
						selectedModifiers[type][k]=effectData;
					}
				}else if (type=="maluses" && typeDict[k]<returnData[type][k]){
					if(!hasAsked && effectBonuses.query && consume){
						MTScript.evalMacro("[h: ans=input(\"junkVar|Apply "+effectData.name+"?|blah|LABEL|SPAN=TRUE\")]");
						askResponse = (MTScript.getVariable("ans")==1);
						hasAsked=true;
					}
					if(askResponse || !consume){
					returnData[type][k] = typeDict[k];
					selectedModifiers[type][k]=effectData;
					}
				}
			}
		}
	}

	for (var c in activeConditions){
		let conditionData = JSON.parse(JSON.stringify(activeConditions[c]));
		//MapTool.chat.broadcast(JSON.stringify(conditionData));
		let conditionBonuses = get_effect_bonus(conditionData, bonusScopes, token);
		conditionData.bonus = conditionBonuses;
		//MapTool.chat.broadcast(JSON.stringify(conditionBonuses));
		for (var type in conditionBonuses){
			if(type=="query"){
				continue;
			}
			let typeDict = conditionBonuses[type];
			for (var k in typeDict){
				if (type=="bonuses" && typeDict[k]>returnData[type][k]){
					returnData[type][k] = typeDict[k];
					selectedModifiers[type][k]=conditionData;
				}else if (type=="maluses" && typeDict[k]<returnData[type][k]){
					returnData[type][k] = typeDict[k];
					selectedModifiers[type][k]=conditionData;
				}
			}
		}
	}

	if(consume){
		for(var t in selectedModifiers){
			let modDict = selectedModifiers[t];
			for(var m in modDict){
				let modData = modDict[m];
				if(modData!=null && modData.type=="effect"){
					//MapTool.chat.broadcast(JSON.stringify(modData));
					for(var r in modData.rules){
						let removeAfter = modData.rules[r].removeAfterRoll;
						if(removeAfter == "if-enabled" || removeAfter == "yes"){
							toggle_named_effect(modData.name, token, 0);
						}
					}
				}
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(returnData));
	//MapTool.chat.broadcast(JSON.stringify(selectedModifiers));
	
	return returnData;
}

MTScript.registerMacro("ca.pf2e.calculate_bonus", calculate_bonus);