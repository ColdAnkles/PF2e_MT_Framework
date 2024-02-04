"use strict";

function calculate_ac(tokenID){
	let token = MapTool.tokens.getTokenByID(tokenID);
	let base_ac = Number(token.getProperty("AC"));
	let bonuses = calculate_bonus(tokenID, "ac");
	//MapTool.chat.broadcast(JSON.stringify(bonuses));
	bonuses = bonuses.bonuses.circumstance + bonuses.bonuses.status + bonuses.bonuses.item + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item + bonuses.bonuses.proficiency;
	let totalAC =  (base_ac + bonuses);
	return totalAC;
}

MTScript.registerMacro("ca.pf2e.calculate_ac", calculate_ac);