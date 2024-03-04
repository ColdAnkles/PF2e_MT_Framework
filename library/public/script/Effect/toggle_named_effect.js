"use strict";

function toggle_named_effect(effectName, token, state = -1, effectSource = null) {
	let affectedCreature = null;
	if (typeof (token) != "string") {
		affectedCreature = token;
		token = token.getId();
	} else {
		affectedCreature = MapTool.tokens.getTokenByID(token);
	}

	let updateTokens = [token];
	if (get_token_type(token) == "PC") {
		if (affectedCreature.getName().includes("Lib:")) {
			let subTokens = JSON.parse(affectedCreature.getProperty("pcTokens"));
			updateTokens = updateTokens.concat(subTokens);
		} else {
			toggle_named_effect(effectName, affectedCreature.getProperty("myID"), state, effectSource);
			return;
		}
	}

	MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
	let currentInitiative = Number(MTScript.getVariable("currInit"));
	let currentRound = Number(MTScript.getVariable("currRound"));
	if (currentInitiative == -1) {
		currentInitiative = 0;
	}
	if (currentRound == -1) {
		currentRound = 0;
	}

	let property = JSON.parse(read_data("pf2e_effect"));
	if (!(effectName in property)) {
		MapTool.chat.broadcast("Cannot find effect: " + effectName);
		return;
	}
	let effectData = JSON.parse(JSON.stringify(property[effectName]));

	if (effectData == null) {
		MapTool.chat.broadcast("Cannot find effect: " + effectName);
		return;
	}

	effectData.applyTime = { "round": currentRound, "initiative": currentInitiative };

	effectData.sourceItem = effectSource;
	//MapTool.chat.broadcast(JSON.stringify(effectData.rules));

	let newAttacks = rules_grant_attack(effectData.rules);

	//MapTool.chat.broadcast(JSON.stringify(newAttacks));
	//MapTool.chat.broadcast(String(affectedCreature));

	for (var t in updateTokens) {
		let thisCreature = MapTool.tokens.getTokenByID(updateTokens[t]);
		if (thisCreature == null) {
			continue;
		}
		let activeEffects = JSON.parse(thisCreature.getProperty("activeEffects"));
		let attacks = JSON.parse(thisCreature.getProperty("basicAttacks"));
		let tokenProfs = JSON.parse(thisCreature.getProperty("proficiencies"));

		if (activeEffects == null) {
			activeEffects = {};
		}

		if (effectName in activeEffects && (state == -1 || state == 0)) {
			delete activeEffects[effectName];
			let delAttacks = [];
			for (var a in newAttacks) {
				for (var oa in attacks) {
					if (attacks[oa].name = newAttacks[a].name) {
						delAttacks.push(oa);
					}
				}
				removeMacro(newAttacks[a].name, thisCreature);
			}
			for (var da in delAttacks) {
				attacks.splice(da, 1);
			}
		} else if (!(effectName in activeEffects) && (state == -1 || state == 1)) {
			activeEffects[effectName] = effectData;
			for (var a in newAttacks) {
				let newAttack = newAttacks[a];
				let foundProf = 0;
				for (var p in tokenProfs) {
					if (tokenProfs[p].name.toUpperCase() == newAttack.category.toUpperCase()) {
						newAttack.bonus = tokenProfs[p].bonus;
						break;
					}
				}
				if ("finesse" in newAttack.traits) {
					newAttack.bonus += Math.max(Number(thisCreature.getProperty("dex")), Number(thisCreature.getProperty("str")));
				} else {
					newAttack.bonus += Number(thisCreature.getProperty("str"));
				}
				newAttack.damage[0].damage = String(newAttack.damage[0].dice) + String(newAttack.damage[0].die) + ((Number(thisCreature.getProperty("str") != 0)) ? "+" + Number(thisCreature.getProperty("str")) : "");
				attacks.push(newAttack);
				if (!thisCreature.getName().includes("Lib:")) {
					add_action_to_token(newAttack, thisCreature.getId(), thisCreature);
				}
			}
		}

		//MapTool.chat.broadcast(JSON.stringify(activeEffects));

		thisCreature.setProperty("activeEffects", JSON.stringify(activeEffects));
		thisCreature.setProperty("basicAttacks", JSON.stringify(attacks));
	}

}

MTScript.registerMacro("ca.pf2e.toggle_named_effect", toggle_named_effect);