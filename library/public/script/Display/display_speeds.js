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

	if (equipArmor != null && get_token_type(token) == "PC") { //NPC Speed Precalculated with Armor Penalties
		if ("strReq" in equipArmor.system && tokenStr >= equipArmor.system.strReq && equipArmor.system.speedPenalty != 0) {
			speedPenalty = equipArmor.system.speedPenalty + 5; //plus five as penalty is negative
		} else {
			speedPenalty = equipArmor.system.speedPenalty;
		}
	}

	let speedBonusRaw = null;
	let speedBonus = 0
	try {
		speedBonusRaw = calculate_bonus(token, ["speed", "land-speed", "all-speeds"]);
		speedBonus = speedBonus + speedBonusRaw.bonuses.circumstance + speedBonusRaw.bonuses.status + speedBonusRaw.bonuses.item + speedBonusRaw.bonuses.none + speedBonusRaw.maluses.circumstance + speedBonusRaw.maluses.status + speedBonusRaw.maluses.item + speedBonusRaw.maluses.none;

		if ("otherEffects" in speedBonusRaw && "land-speed" in speedBonusRaw.otherEffects) {
			if ("value" in speedBonusRaw.otherEffects["land-speed"]) {
				speedBonus += speedBonusRaw.otherEffects["land-speed"].value;
			} else {
				speedBonus += speedBonusRaw.otherEffects["land-speed"];
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in display_speeds during land-speed-calc");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("speedBonus: " + String(speedBonus));
		MapTool.chat.broadcast("speedBonusRaw: " + JSON.stringify(speedBonusRaw));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let otherSpeedString = [];

	try {
		for (var s in otherSpeed) {
			//MapTool.chat.broadcast(JSON.stringify(otherSpeed[s]));
			speedBonusRaw = calculate_bonus(token, ["speed", otherSpeed[s].type, "all-speeds"]);
			let otherSpeedBonus = speedBonusRaw.bonuses.circumstance + speedBonusRaw.bonuses.status + speedBonusRaw.bonuses.item + speedBonusRaw.bonuses.none + speedBonusRaw.maluses.circumstance + speedBonusRaw.maluses.status + speedBonusRaw.maluses.item + speedBonusRaw.maluses.none;

			if ("otherEffects" in speedBonusRaw && otherSpeed[s].type in speedBonusRaw.otherEffects) {
				if ("value" in speedBonusRaw.otherEffects[otherSpeed[s].type]) {
					otherSpeedBonus += speedBonusRaw.otherEffects[otherSpeed[s].type].value;
				} else {
					otherSpeedBonus += speedBonusRaw.otherEffects[otherSpeed[s].type];
				}
			}

			otherSpeedString.push(otherSpeed[s].type + " " + String(Math.max(Number(otherSpeed[s].value) + otherSpeedBonus + speedPenalty, 5)) + " ft");
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in display_speeds during other-speed-calc");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("speedBonus: " + String(speedBonus));
		MapTool.chat.broadcast("speedBonusRaw: " + JSON.stringify(speedBonusRaw));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	otherSpeedString = otherSpeedString.join(", ");

	let speedString = "Speed: " + String(Math.max(baseSpeed + speedBonus + speedPenalty, 0)) + " ft"
	if (otherSpeedString.length > 0) {
		speedString = speedString + ", " + otherSpeedString;
	}
	return speedString;
}

MTScript.registerMacro("ca.pf2e.display_speeds", display_speeds);