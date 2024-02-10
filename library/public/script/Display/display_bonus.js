"use strict";

function display_bonus(tokenID, scope) {
	let effect_bonus = calculate_bonus(tokenID, [scope]);
	//MapTool.chat.broadcast(JSON.stringify(effect_bonus));
	effect_bonus = effect_bonus.bonuses.circumstance + effect_bonus.bonuses.status + effect_bonus.bonuses.item + effect_bonus.maluses.circumstance + effect_bonus.maluses.status + effect_bonus.maluses.item + effect_bonus.bonuses.proficiency;
	//MapTool.chat.broadcast(JSON.stringify(effect_bonus));
	return effect_bonus;
}

MTScript.registerMacro("ca.pf2e.display_bonus", display_bonus);