"use strict";

function get_effect_bonus(effectData, bonusScopes, actor = null, item = null) {
	//if (!(bonusScopes.includes("all"))) {
	//	bonusScopes.push("all");
	//}
	//MapTool.chat.broadcast(effectData.name)
	//MapTool.chat.broadcast(JSON.stringify(bonusScopes));
	//MapTool.chat.broadcast(JSON.stringify(effectData));
	//MapTool.chat.broadcast(JSON.stringify(effectData.system.rules));
	let returnData = { "bonuses": { "circumstance": { "value": 0 }, "status": { "value": 0 }, "item": { "value": 0 }, "none": { "value": 0 }, "proficiency": { "value": 0 } }, "maluses": { "circumstance": { "value": 0 }, "status": { "value": 0 }, "item": { "value": 0 }, "none": { "value": 0 }, "proficiency": { "value": 0 } }, "query": false, "otherEffects": {}, "upgrades": {} };
	for (var r in effectData.system.rules) {
		let ruleData = effectData.system.rules[r];
		if ("choices" in ruleData) {
			continue; //Skip choice entries as they should already be resolved?
		}
		returnData.query = ("removeAfterRoll" in ruleData && ruleData.removeAfterRoll == "if-enabled") || ("choices" in ruleData) || returnData.query;
		try {
			if ("selector" in ruleData) {
				//MapTool.chat.broadcast(JSON.stringify(ruleData.selector));
				//let selector = selector_inheritance(foundry_calc_value(ruleData.selector, actor, item));
				//Note to self - doing the foundry calc value tends to turn strings like AC into the acutal actor ac or similar
				if (ruleData.selector.includes("|")) {
					ruleData.selector = foundry_calc_value(ruleData.selector, actor, item)
				}
				let selector = selector_inheritance(ruleData.selector);
				//MapTool.chat.broadcast(JSON.stringify(selector));
				let intersect = selector.filter(value => bonusScopes.includes(value));
				//MapTool.chat.broadcast(JSON.stringify(intersect));
				if (intersect.length == 0) {
					continue;
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in get_effect_bonus during selector filter");
			MapTool.chat.broadcast("effectData: " + JSON.stringify(effectData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
		if ("key" in ruleData && ["GrantItem", "Resistance", "Weakness"].includes(ruleData.key) && !(bonusScopes.includes(ruleData.key))) {
			continue;
		}
		if ("key" in ruleData && ["CriticalSpecialization"].includes(ruleData.key) && !bonusScopes.includes("attack")) {
			continue;
		}
		if ("key" in ruleData && ruleData.key.includes("Proficiency") && !bonusScopes.includes("proficiency")) {
			continue;
		}
		if ("definition" in ruleData) {
			continue
		}
		if ("key" in ruleData && ["FastHealing"].includes(ruleData.key) && !bonusScopes.includes("regen")) {
			continue;
		}
		try {
			if ("predicate" in ruleData) {
				if (!predicate_check(ruleData.predicate, bonusScopes, actor, item)) {
					continue;
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in get_effect_bonus during predicate check");
			MapTool.chat.broadcast("effectData: " + JSON.stringify(effectData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
		//MapTool.chat.broadcast(JSON.stringify(ruleData));
		if ("mode" in ruleData && ruleData.mode == "override") {
			try {
				if (ruleData.path == "system.attributes.shield" && bonusScopes.includes("ac")) {
					//MapTool.chat.broadcast(JSON.stringify(ruleData));
					let shieldData = null;
					if ("name" in ruleData.value && ruleData.value.name == "PF2E.ShieldLabel") {
						shieldData = ruleData.value;
					} else if (actor != null) {
						shieldData = get_equipped_shield(actor);
					}
					//MapTool.chat.broadcast(JSON.stringify(shieldData));
					if (("acBonus" in shieldData && shieldData.acBonus > returnData.bonuses.circumstance)) {
						returnData.bonuses.circumstance = { "value": shieldData.acBonus };
					} else if (("ac" in shieldData && shieldData.acBonus > returnData.bonuses.circumstance)) {
						returnData.bonuses.circumstance = { "value": shieldData.ac };
					}
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in get_effect_bonus during overrides");
				MapTool.chat.broadcast("effectData: " + JSON.stringify(effectData));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
			//MapTool.chat.broadcast(JSON.stringify(ruleData));
		} else if ("mode" in ruleData && ruleData.mode == "upgrade" && "slug" in ruleData) {
			ruleData.value = foundry_calc_value(ruleData.value, actor, effectData);
			returnData.upgrades[ruleData.slug] = ruleData;
		} else {
			if (ruleData.key == "FlatModifier") {
				try {
					ruleData.value = foundry_calc_value(ruleData.value, actor, effectData);
					if (ruleData.value < 0) {
						if (!("type" in ruleData)) {
							returnData.maluses.none.value += ruleData.value;
						} else if (ruleData.value < returnData.maluses[ruleData.type].value) {
							returnData.maluses[ruleData.type] = ruleData;
						}
					} else {
						if (!("type" in ruleData)) {
							if ("selector" in ruleData) {
								returnData.otherEffects[ruleData.selector] = { "slug": ruleData.slug, "value": ruleData.value };
								if ("slug" in ruleData) {
									returnData.otherEffects[ruleData.selector].slug = ruleData.slug;
								}
							} else {
								returnData.bonuses.none.value += ruleData.value;
							}
						} else if (ruleData.value > returnData.bonuses[ruleData.type].value) {
							returnData.bonuses[ruleData.type] = ruleData;
						}
					}
				} catch (e) {
					MapTool.chat.broadcast("Error in get_effect_bonus during flat modifiers");
					MapTool.chat.broadcast("effectData: " + JSON.stringify(effectData));
					MapTool.chat.broadcast("" + e + "\n" + e.stack);
					return;
				}
			} else if ((ruleData.key == "WeaponPotency" || ruleData.key == "Striking") && (bonusScopes.includes("weapon-attack") || bonusScopes.includes("all"))) {
				returnData.otherEffects[ruleData.key] = foundry_calc_value(ruleData.value, actor, effectData.sourceItem);
			} else if (ruleData.key == "SubstituteRoll") {
				returnData.otherEffects[ruleData.key] = ruleData.value;
				returnData.otherEffects["adjustCause"] = ruleData.slug;
			} else if (ruleData.key == "DexterityModifierCap") {
				returnData.otherEffects[ruleData.key] = ruleData.value;
			} else if (ruleData.key == "AdjustModifier") {
				returnData.otherEffects[ruleData.selector] = { "mode": ruleData.mode, "value": ruleData.value };
				if ("slug" in ruleData) {
					returnData.otherEffects[ruleData.selector].slug = ruleData.slug;
				}
			} else if (ruleData.key == "ItemAlteration") {
				if ("itemId" in ruleData && item != null && (ruleData.itemId.includes(item.name.toUpperCase()) || (item.name.toUpperCase() == "HANDWRAPS OF MIGHTY BLOWS") && ruleData.itemId.includes("FIST"))) {
					returnData.otherEffects[ruleData.key] = { "mode": ruleData.mode, "property": ruleData.property };
				} else if (!("itemId" in ruleData)) {
					returnData.otherEffects[ruleData.key] = { "mode": ruleData.mode, "property": ruleData.property };
				}
			} else if (ruleData.key == "AdjustStrike" && bonusScopes.includes("attack")) {
				returnData.otherEffects[ruleData.key + "_" + ruleData.value] = { "mode": ruleData.mode, "value": ruleData.value, "property": ruleData.property };
			} else if (ruleData.key == "CriticalSpecialization" && bonusScopes.includes("attack")) {
				returnData.otherEffects["Critical Specialization"] = true;
			} else if (ruleData.key == "MartialProficiency") {
				returnData.otherEffects["AdjustProficiency"] = { "profName": "Martial", "value": ruleData.value };
			} else if (ruleData.key == "Weakness") {
				if (!("additionalWeakness" in returnData.otherEffects)) {
					returnData.otherEffects.additionalWeakness = [];
				}
				returnData.otherEffects.additionalWeakness.push({ "type": ruleData.type, "value": foundry_calc_value(ruleData.value, actor, effectData.sourceItem) });
			} else if (ruleData.key == "FastHealing") {
				returnData.otherEffects["FastHealing"] = { "key": "FastHealing", "type": ruleData.type, "value": ruleData.value, "deactivations": ruleData.deactivatedBy };
			}
		}
	}
	return returnData;
}

MTScript.registerMacro("ca.pf2e.get_effect_bonus", get_effect_bonus);