"use strict";

function set_condition(conditionName, token, conditionValue = null, silent = false){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_condition"));
	let conditionData = property[conditionName];

	let oldValue = conditionData.value.value;
	conditionData.value.value = Number(conditionValue);

	if (conditionValue != null){
		conditionValue = Number(conditionValue);
	}

	let tokenConditions = JSON.parse(token.getProperty("conditionDetails"));

	if (tokenConditions == null){
		tokenConditions = {};
	}
	
	//MapTool.chat.broadcast(conditionName);
	//MapTool.chat.broadcast(String(token));
	//MapTool.chat.broadcast(JSON.stringify(tokenConditions));
	//MapTool.chat.broadcast(JSON.stringify(conditionData));
	//MapTool.chat.broadcast(String(conditionValue) + " (" + typeof(conditionValue)+")");

	//MTScript.setVariable("tokenID", token.getId());
	//MTScript.setVariable("stateName", conditionName);

	let conditionApplication = 0;
	
	if (conditionName in tokenConditions && (conditionValue == null || conditionValue == 0)){
		delete tokenConditions[conditionName];
		//MapTool.chat.broadcast("Removing condition: " + conditionName);
		//MTScript.evalMacro("[h: setState(stateName, 0, tokenID)]");
		set_state(conditionName, 0, token.getId());
	}else if ((conditionValue == null && !(conditionName in tokenConditions)) || Number(conditionValue) > 0){
		if (!silent){
			chat_display(conditionData);
		}
		tokenConditions[conditionName]=conditionData;
		set_state(conditionName, 1, token.getId());
		conditionApplication = 1;
	}

	token.setProperty("conditionDetails",JSON.stringify(tokenConditions))

	conditionData.value.value = oldValue;

	//Special Case for invisibility.
	if (conditionData.name=="Invisible"){
		toggle_owner_only_visible(token);
	}
	
	//MapTool.chat.broadcast("conditionApplication: " + String(conditionApplication));
	for (var r in conditionData.rules){
		let ruleData = conditionData.rules[r];
		if(conditionData.value.isValued){
			ruleData.value = foundry_calc_value(ruleData.value, token, conditionData);
		}
		//MapTool.chat.broadcast(JSON.stringify(ruleData));
		if (ruleData.key=="GrantItem"){
			let uuidSplit = ruleData.uuid.split(".");
			if(ruleData.uuid.includes("conditionitems")){
				let applyCondition = uuidSplit[uuidSplit.length -1];
				set_condition(applyCondition, token, conditionApplication);
			}
		}else if(ruleData.key=="LoseHitPoints"&& conditionApplication==1){
			let currentHP = Number(token.getProperty("HP"));
			currentHP -= Number(ruleData.value);
			token.setProperty("HP",String(currentHP));
		}else if(ruleData.key=="FlatModifier" && "selector" in ruleData && ruleData.selector=="hp"){
			let currentMaxHP = Number(token.getProperty("MaxHP"));
			if (conditionApplication==1){
				currentMaxHP += Number(ruleData.value);
			}else{
				currentMaxHP -= Number(ruleData.value);
			}
			token.setProperty("MaxHP",String(currentMaxHP));
		}
		
	}
	tokenConditions = JSON.parse(token.getProperty("conditionDetails"));
	for(var c in tokenConditions){
		//MapTool.chat.broadcast(JSON.stringify(tokenConditions[c]));
		for (var r in tokenConditions[c].rules){
			let ruleData = tokenConditions[c].rules[r];
			//MapTool.chat.broadcast(JSON.stringify(ruleData));
			if (ruleData.key=="GrantItem"){
				let uuidSplit = ruleData.uuid.split(".");
				if(ruleData.uuid.includes("conditionitems")){
					let applyCondition = uuidSplit[uuidSplit.length -1];
					if(!(applyCondition in tokenConditions)){
						set_condition(applyCondition, token, 1, true);
					}
				}
			}
		}
	}
	
	
	//MapTool.chat.broadcast(JSON.stringify(tokenConditions));

	if(is_pc(token)){
		update_my_tokens(token);
	}
	
}

MTScript.registerMacro("ca.pf2e.set_condition", set_condition);