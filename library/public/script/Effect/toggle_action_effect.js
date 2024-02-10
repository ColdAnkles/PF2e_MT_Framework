"use strict";

function toggle_action_effect(effectData, affectedCreature, state = -1) {
	if (typeof (affectedCreature) == "string") {
		affectedCreature = MapTool.tokens.getTokenByID(affectedCreature);
	}
	//MapTool.chat.broadcast(JSON.stringify(effectData));

	let specialEffects = JSON.parse(affectedCreature.getProperty("specialEffects"));
	if (specialEffects == null) {
		specialEffects = {};
	}

	if (effectData.name in specialEffects && (state == -1 || state == 0)) {
		delete specialEffects[effectData.name];
	} else if ((state == -1 || state == 1)) {
		specialEffects[effectData.name] = effectData;
	}
	affectedCreature.setProperty("specialEffects", JSON.stringify(specialEffects));

}

MTScript.registerMacro("ca.pf2e.toggle_action_effect", toggle_action_effect);