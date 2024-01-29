"use strict";

function expire_effect_test(initiativeData, cause){
	let currentInitiative = initiativeData.initiative;
	let currentRound = initiativeData.round;

	let allTokens = MapTool.tokens.getMapTokens();

	MapTool.chat.broadcast(String(currentInitiative) + ", " + String(currentRound));
	for (var t in allTokens){
		let effectToken = allTokens[t];
		if(turnToken.getName().includes("Lib:")){
			effectToken = MapTool.getTokenByID(turnToken.getProperty("myID"));
		}
		let activeEffects = JSON.parse(effectToken.getProperty("activeEffects"));

		let turnOffEffects = []
		for(var e in activeEffects){
			let effectData = activeEffects[e];
			let effectDuration = effectData.duration;
			MapTool.chat.broadcast(JSON.stringify(effectData));
			MapTool.chat.broadcast(String(effectDuration.unit == "rounds"));
			MapTool.chat.broadcast(String(Number(effectData.applyTime.initiative)>=currentInitiative));
			if(effectDuration.expiry==cause && (effectDuration.unit == "rounds" || effectDuration.unit == "turns")){
				if(effectDuration.unit == "turns" || (effectDuration.unit == "rounds" && currentRound!=Number(effectData.applyTime.round) && Number(effectData.applyTime.initiative)>=currentInitiative)){
					if(Number(effectDuration.value)==1){
						turnOffEffects.push(effectData.name);
					}else{
						effectDuration.value -= 1;
						effectToken.setProperty("activeEffects", JSON.stringify(activeEffects));
					}
				}
			}
		}
		for(var o in turnOffEffects){
			toggle_named_effect(turnOffEffects[o], effectToken, 0);
		}

		if(effectToken!=allTokens[t]){
			update_my_tokens(effectToken);
		}
	}
}