"use strict";

function toggle_named_effect(effectName, tokenID){
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_effect"));
	let effectData = property[effectName];

	if (effectData == null){
		MapTool.chat.broadcast("Cannot find action: " + effectName);
		return;
	}
	//MapTool.chat.broadcast(JSON.stringify(effectData));

	let affectedCreature = MapTool.tokens.getTokenByID(tokenID);

	//MapTool.chat.broadcast(String(affectedCreature));

	let activeEffects = JSON.parse(affectedCreature.getProperty("activeEffects"));

	if (activeEffects == null){
		activeEffects = {};
	}

	if (effectName in activeEffects){
		delete activeEffects[effectName];
	}else{
		activeEffects[effectName] = effectData;
	}

	//MapTool.chat.broadcast(JSON.stringify(activeEffects));

	affectedCreature.setProperty("activeEffects",JSON.stringify(activeEffects));
	
}

MTScript.registerMacro("ca.pf2e.toggle_named_effect", toggle_named_effect);