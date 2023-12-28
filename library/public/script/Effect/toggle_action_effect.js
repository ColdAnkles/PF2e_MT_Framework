"use strict";

function toggle_action_effect(effectData, affectedCreature, forceSetting = null){
	if (typeof(affectedCreature)=="String"){
		affectedCreature = MapTool.tokens.getTokenByID(affectedCreature);
	}
	//MapTool.chat.broadcast(JSON.stringify(effectData));

	let specialEffects = JSON.parse(affectedCreature.getProperty("specialEffects"));
	if (specialEffects == null){
		specialEffects = {};
	}

	if (effectData.name in specialEffects && forceSetting != true){
		delete specialEffects[effectData.name];
	}else if(forceSetting != false){
		specialEffects[effectData.name] = effectData;
	}
	affectedCreature.setProperty("specialEffects",JSON.stringify(specialEffects));
	
}

MTScript.registerMacro("ca.pf2e.toggle_action_effect", toggle_action_effect);