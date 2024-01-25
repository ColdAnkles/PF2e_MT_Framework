"use strict";

function display_speeds(token){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}

	let baseSpeed = Number(token.getProperty("baseSpeed"));
	let otherSpeed = JSON.parse(token.getProperty("otherSpeed"));

	let speedBonus = calculate_bonus(token, "speed");
	speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;

	let otherSpeedString = [];

	for (var s in otherSpeed){
		//MapTool.chat.broadcast(JSON.stringify(otherSpeed[s]));
		speedBonus = calculate_bonus(token, ["speed",otherSpeed[s].type]);
		speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;
		otherSpeedString.push(otherSpeed[s].type + " " + String(Math.max(Number(otherSpeed[s].value) + speedBonus,5)) + " ft");
	}

	otherSpeedString = otherSpeedString.join(", ");
	
	let speedString = "Speed: " + String(Math.max(baseSpeed+speedBonus,0))  + " ft"
	if (otherSpeedString.length>0){
		speedString = speedString + ", " + otherSpeedString;
	}
	return speedString;
}

MTScript.registerMacro("ca.pf2e.display_speeds", display_speeds);