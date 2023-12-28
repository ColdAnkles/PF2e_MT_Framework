"use strict";

function calculate_ac(tokenID){
	let token = MapTool.tokens.getTokenByID(tokenID);
	let base_ac = Number(token.getProperty("AC"));
	let bonuses = calculate_bonus(tokenID, "ac");
	bonuses = bonuses.bonuses.circumstance + bonuses.bonuses.status + bonuses.bonuses.item + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item;
	let totalAC =  (base_ac + bonuses);
	return totalAC;
}

MTScript.registerMacro("ca.pf2e.calculate_ac", calculate_ac);