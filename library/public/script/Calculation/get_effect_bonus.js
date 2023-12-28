"use strict";

function get_effect_bonus(effectData, bonusScopes){
	bonusScopes.push("all");
	//MapTool.chat.broadcast(JSON.stringify(bonusScopes));
	//MapTool.chat.broadcast(JSON.stringify(effectData));
	let returnData = {"bonuses":{"circumstance":0,"status":0,"item":0,"none":0},"maluses":{"circumstance":0,"status":0,"item":0,"none":0}};
	for (var r in effectData.rules){
		let ruleData = effectData.rules[r];
		if ("selector" in ruleData){
			let selector = selector_inheritance(ruleData.selector);
			//MapTool.chat.broadcast(JSON.stringify(selector));
			let intersect = selector.filter(value => bonusScopes.includes(value));
			//MapTool.chat.broadcast(JSON.stringify(intersect));
			if(intersect.length==0){
				continue;
			}
		}
		//MapTool.chat.broadcast(JSON.stringify(ruleData));
		if ("mode" in ruleData && ruleData.mode == "override"){
			if (ruleData.path.includes("shield") && bonusScope == "ac"){
				let shieldData = get_equipped_shield(tokenID);
				if (shieldData.acBonus > bonuses.circumstance){
					returnData.bonuses.circumstance = shieldData.acBonus;
				}
			}
			//MapTool.chat.broadcast(JSON.stringify(ruleData));
		}else{
			if (ruleData.key == "FlatModifier"){
				ruleData.value = foundry_calc_value(ruleData.value, null, effectData);
				if (ruleData.value <0){
					if (!("type" in ruleData)){
						returnData.maluses.none = returnData.maluses.none + ruleData.value;
					}else if (ruleData.value < returnData.maluses[ruleData.type]){
						returnData.maluses[ruleData.type] = ruleData.value;
					}
				}else{
					if (!("type" in ruleData)){
						returnData.bonuses.none = returnData.bonuses.none + ruleData.value;
					}else if (ruleData.value > returnData.bonuses[ruleData.type]){
						returnData.bonuses[ruleData.type] = ruleData.value;
					}
				}
			}
		}
	}
	return returnData;
}

MTScript.registerMacro("ca.pf2e.get_effect_bonus", get_effect_bonus);