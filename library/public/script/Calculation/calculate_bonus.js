"use strict";

function calculate_bonus(token, bonusScopes, consume = false, causeItem = null) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	if (typeof (bonusScopes) == "string") {
		bonusScopes = [bonusScopes];
	}
	//MapTool.chat.broadcast("Calculating bonus for: " + JSON.stringify(bonusScopes));

	let activeEffects = Object.assign({}, JSON.parse(token.getProperty("activeEffects")), JSON.parse(token.getProperty("specialEffects")), get_equipped_items(token));
	let arrayEntries = JSON.parse(token.getProperty("passiveSkills")).concat(JSON.parse(token.getProperty("otherDefenses")));

	for (var i in arrayEntries) {
		activeEffects[String(i) + "_arrayEntry"] = arrayEntries[i];
	}

	let activeConditions = JSON.parse(token.getProperty("conditionDetails"));

	let upgrades = {};

	let selectedModifiers = { "bonuses": { "circumstance": null, "status": null, "item": null, "none": null, "proficiency": null }, "maluses": { "circumstance": null, "status": null, "item": null, "none": null, "proficiency": null }, "other": [] };
	let returnData = { "bonuses": { "circumstance": { "value": 0 }, "status": { "value": 0 }, "item": { "value": 0 }, "none": { "value": 0 }, "proficiency": { "value": 0 } }, "maluses": { "circumstance": { "value": 0 }, "status": { "value": 0 }, "item": { "value": 0 }, "none": { "value": 0 }, "proficiency": { "value": 0 } }, "otherEffects": {}, "appliedEffects": [] };

	for (var e in activeEffects) {
		let effectData = JSON.parse(JSON.stringify(activeEffects[e]));
		//MapTool.chat.broadcast(JSON.stringify(effectData));
		//MapTool.chat.broadcast(JSON.stringify(effectData.name));
		let effectBonuses = get_effect_bonus(effectData, bonusScopes, token, causeItem);
		//MapTool.chat.broadcast(JSON.stringify(effectBonuses));
		let hasAsked = false;
		let askResponse = true;
		for (var type in effectBonuses) {
			if (type == "query") {
				continue;
			} else if (type == "otherEffects" && Object.keys(effectBonuses.otherEffects).length > 0) {
				if (!hasAsked && effectBonuses.query && consume) {
					MTScript.evalMacro("[h: ans=input(\"junkVar|Apply " + effectData.name + "?|blah|LABEL|SPAN=TRUE\")]");
					askResponse = (Number(MTScript.getVariable("ans")) == 1);
					hasAsked = true;
				}
				if (askResponse || !consume) {
					returnData.otherEffects = Object.assign({}, returnData.otherEffects, effectBonuses.otherEffects);
					selectedModifiers.other.push(effectData);
				}
			} else if (type == "upgrades" && Object.keys(effectBonuses.upgrades).length > 0) {
				for (var u in effectBonuses.upgrades) {
					let upgradeData = effectBonuses.upgrades[u];
					upgradeData.effectName = effectData.name;
					upgrades[upgradeData.slug] = upgradeData;

					if (upgradeData.key == "AdjustModifier") {
						for (var k in returnData.bonuses) {
							if (returnData.bonuses[k].slug == upgradeData.slug) {
								returnData.bonuses[k].value = upgradeData.value;
								selectedModifiers.other.push(effectData);
							}
						}

						for (var k in returnData.maluses) {
							if (returnData.maluses[k].slug == upgradeData.slug) {
								returnData.maluses[k].value = upgradeData.value;
								selectedModifiers.other.push(effectData);
							}
						}
					}
				}
			}
			let typeDict = effectBonuses[type];
			for (var k in typeDict) {
				if (type == "bonuses" && typeDict[k].value > returnData[type][k].value) {
					if (!hasAsked && effectBonuses.query && consume) {
						MTScript.evalMacro("[h: ans=input(\"junkVar|Apply " + effectData.name + "?|blah|LABEL|SPAN=TRUE\")]");
						askResponse = (Number(MTScript.getVariable("ans")) == 1);
						hasAsked = true;
					}
					if (askResponse || !consume) {
						if ("slug" in typeDict[k] && typeDict[k].slug in upgrades && "value" in upgrades[typeDict[k].slug]) {
							typeDict[k].value = upgrades[typeDict[k].slug].value;
							selectedModifiers.other.push({ "name": upgrades[typeDict[k].slug].effectName });
						}
						returnData[type][k] = typeDict[k];
						selectedModifiers[type][k] = effectData;
					}
				} else if (type == "maluses" && typeDict[k].value < returnData[type][k].value) {
					if (!hasAsked && effectBonuses.query && consume) {
						MTScript.evalMacro("[h: ans=input(\"junkVar|Apply " + effectData.name + "?|blah|LABEL|SPAN=TRUE\")]");
						askResponse = (MTScript.getVariable("ans") == 1);
						hasAsked = true;
					}
					if (askResponse || !consume) {
						if ("slug" in typeDict[k] && typeDict[k].slug in upgrades && "value" in upgrades[typeDict[k].slug]) {
							typeDict[k].value = upgrades[typeDict[k].slug].value;
							selectedModifiers.other.push({ "name": upgrades[typeDict[k].slug].effectName });
						}
						selectedModifiers[type][k] = effectData;
						returnData[type][k] = typeDict[k];
					}
				}
			}
		}
	}

	for (var c in activeConditions) {
		let conditionData = JSON.parse(JSON.stringify(activeConditions[c]));
		//MapTool.chat.broadcast(JSON.stringify(conditionData));
		//MapTool.chat.broadcast(JSON.stringify(conditionData.name));
		let conditionBonuses = get_effect_bonus(conditionData, bonusScopes, token);
		conditionData.bonus = conditionBonuses;
		//MapTool.chat.broadcast(JSON.stringify(conditionBonuses));
		for (var type in conditionBonuses) {
			if (type == "query") {
				continue;
			}
			let typeDict = conditionBonuses[type];
			for (var k in typeDict) {
				if (type == "bonuses" && typeDict[k].value > returnData[type][k].value) {
					returnData[type][k] = typeDict[k];
					selectedModifiers[type][k] = conditionData;
				} else if (type == "maluses" && typeDict[k].value < returnData[type][k].value) {
					returnData[type][k] = typeDict[k];
					selectedModifiers[type][k] = conditionData;
				}
			}
		}
	}

	if (consume) {
		for (var t in selectedModifiers) {
			//bonus or malus
			let modDict = selectedModifiers[t];
			for (var m in modDict) {
				//each type of bonus/malus
				let modData = modDict[m];
				if (modData != null && modData.type == "effect") {
					returnData.appliedEffects.push({ "name": modData.name, "slug": modData.slug });
					//MapTool.chat.broadcast(JSON.stringify(modData));
					for (var r in modData.rules) {
						let removeAfter = modData.rules[r].removeAfterRoll;
						if (removeAfter == "if-enabled" || removeAfter == "yes") {
							toggle_named_effect(modData.name, token, 0);
						}
					}
				} else if (modData != null) {
					returnData.appliedEffects.push({ "name": modData.name, "slug": modData.slug });
				}
			}
		}
	} else {
		for (var t in selectedModifiers) {
			//bonus or malus
			let modDict = selectedModifiers[t];
			for (var m in modDict) {
				//each type of bonus/malus
				let modData = modDict[m];
				if (modData != null) {
					returnData.appliedEffects.push({ "name": modData.name, "slug": modData.slug });
				}
			}
		}
	}

	//MapTool.chat.broadcast("ReturnData:" + JSON.stringify(returnData));

	for (var k in returnData.bonuses) {
		returnData.bonuses[k] = Number(returnData.bonuses[k].value);
	}

	for (var k in returnData.maluses) {
		returnData.maluses[k] = Number(returnData.maluses[k].value);
	}

	//MapTool.chat.broadcast("ReturnData:" + JSON.stringify(returnData));
	//MapTool.chat.broadcast(JSON.stringify(selectedModifiers));

	return returnData;
}

MTScript.registerMacro("ca.pf2e.calculate_bonus", calculate_bonus);