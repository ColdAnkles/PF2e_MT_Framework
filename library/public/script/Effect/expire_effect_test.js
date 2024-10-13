"use strict";

function expire_effect_test(initiativeData, cause) {
	let currentInitiative = initiativeData.initiative;
	let currentRound = initiativeData.round;

	let allTokens = MapTool.tokens.getMapTokens();

	//MapTool.chat.broadcast(String(currentInitiative) + ", " + String(currentRound));
	for (var t in allTokens) {
		let effectToken = allTokens[t];

		if (!(get_token_property_type(effectToken) == "PF2E_Character")) {
			continue;
		}

		try {
			if (!effectToken.getName().includes("Lib:")) {
				//gets itself if npc as myID=id
				effectToken = MapTool.tokens.getTokenByID(effectToken.getProperty("myID"));
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in expire_effect_test during get-non-lib-token");
			MapTool.chat.broadcast("effectToken: " + String(effectToken));
			MapTool.chat.broadcast("myID: " + effectToken.getProperty("myID"));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		let activeEffects = JSON.parse(effectToken.getProperty("activeEffects"));

		let turnOffEffects = []
		try {
			for (var e in activeEffects) {
				let effectData = activeEffects[e];
				let effectDuration = effectData.duration;
				//MapTool.chat.broadcast(JSON.stringify(effectData));
				//MapTool.chat.broadcast(String(effectDuration.unit == "rounds"));
				//MapTool.chat.broadcast(String(Number(effectData.applyTime.initiative)>=currentInitiative));
				if (effectDuration.expiry == cause && (effectDuration.unit == "rounds" || effectDuration.unit == "turns")) {
					if (effectDuration.unit == "turns" || (effectDuration.unit == "rounds" && currentRound != Number(effectData.applyTime.round) && Number(effectData.applyTime.initiative) >= currentInitiative)) {
						if (Number(effectDuration.value) == 1) {
							turnOffEffects.push(effectData.name);
						} else {
							effectDuration.value -= 1;
							effectToken.setProperty("activeEffects", JSON.stringify(activeEffects));
						}
					}
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in expire_effect_test during decrement-or-expire");
			MapTool.chat.broadcast("effectToken: " + String(effectToken));
			MapTool.chat.broadcast("activeEffects: " + JSON.stringify(activeEffects));
			MapTool.chat.broadcast("turnOffEffects: " + JSON.stringify(turnOffEffects));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		try {
			for (var o in turnOffEffects) {
				toggle_named_effect(turnOffEffects[o], effectToken, 0);
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in expire_effect_test during toggle_named_effect");
			MapTool.chat.broadcast("effectToken: " + String(effectToken));
			MapTool.chat.broadcast("turnOffEffects: " + JSON.stringify(turnOffEffects));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

		try {
			if (effectToken != allTokens[t]) {
				update_my_tokens(effectToken);
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in expire_effect_test during update_my_tokens");
			MapTool.chat.broadcast("effectToken: " + String(effectToken));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}
}