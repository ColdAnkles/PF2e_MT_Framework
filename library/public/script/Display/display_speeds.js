"use strict";

function display_speeds(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let baseSpeed = Number(token.getProperty("baseSpeed"));
	let otherSpeed = JSON.parse(token.getProperty("otherSpeed"));
	let equipArmor = get_equipped_armor(token);
	let speedPenalty = 0;
	let tokenStr = Number(token.getProperty("str"));

	if (equipArmor != null) {
		if ("strReq" in equipArmor && tokenStr >= equipArmor.strReq && equipArmor.speedPenalty != 0) {
			speedPenalty = equipArmor.speedPenalty + 5; //plus five as penalty is negative
		} else {
			speedPenalty = equipArmor.speedPenalty;
		}
	}

	let speedBonus = calculate_bonus(token, ["speed", "land-speed", "all-speeds"]);
	speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;

	let otherSpeedString = [];

	for (var s in otherSpeed) {
		//MapTool.chat.broadcast(JSON.stringify(otherSpeed[s]));
		speedBonus = calculate_bonus(token, ["speed", otherSpeed[s].type, "all-speeds"]);
		speedBonus = speedBonus.bonuses.circumstance + speedBonus.bonuses.status + speedBonus.bonuses.item + speedBonus.bonuses.none + speedBonus.maluses.circumstance + speedBonus.maluses.status + speedBonus.maluses.item + speedBonus.maluses.none;
		otherSpeedString.push(otherSpeed[s].type + " " + String(Math.max(Number(otherSpeed[s].value) + speedBonus + speedPenalty, 5)) + " ft");
	}

	otherSpeedString = otherSpeedString.join(", ");

	let speedString = "Speed: " + String(Math.max(baseSpeed + speedBonus + speedPenalty, 0)) + " ft"
	if (otherSpeedString.length > 0) {
		speedString = speedString + ", " + otherSpeedString;
	}
	return speedString;
}

MTScript.registerMacro("ca.pf2e.display_speeds", display_speeds);