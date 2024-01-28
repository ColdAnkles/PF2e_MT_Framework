"use strict";

function toggle_named_effect(effectName, token, state=-1){
	let affectedCreature = null;
	if (typeof(token)!="string"){
		affectedCreature = token;
		token = token.getId();
	}else{
		affectedCreature = MapTool.tokens.getTokenByID(token);
	}

	let updateTokens = [token];
	if(get_token_type(token)=="PC"){
		if(affectedCreature.getName().includes("Lib:")){
			let subTokens = JSON.parse(affectedCreature.getProperty("pcTokens"));
			updateTokens = updateTokens.concat(subTokens);
		}else{
			toggle_named_effect(effectName, affectedCreature.getProperty("myID"), state);
			return;
		}
	}

	let property = JSON.parse(read_data("pf2e_effect"));
	let effectData = property[effectName];

	if (effectData == null){
		MapTool.chat.broadcast("Cannot find effect: " + effectName);
		return;
	}
	//MapTool.chat.broadcast(JSON.stringify(effectData));

	//MapTool.chat.broadcast(String(affectedCreature));

	for(var t in updateTokens){
		let thisCreature = MapTool.tokens.getTokenByID(updateTokens[t]);
		let activeEffects = JSON.parse(thisCreature.getProperty("activeEffects"));

		if (activeEffects == null){
			activeEffects = {};
		}

		if (effectName in activeEffects && (state == -1 || state==0) ){
			delete activeEffects[effectName];
		}else if(!(effectName in activeEffects) && (state == -1 || state==1) ) {
			activeEffects[effectName] = effectData;
		}

		//MapTool.chat.broadcast(JSON.stringify(activeEffects));

		thisCreature.setProperty("activeEffects",JSON.stringify(activeEffects));
	}
	
}

MTScript.registerMacro("ca.pf2e.toggle_named_effect", toggle_named_effect);