"use strict";

function saving_throw(saveToken, saveData = null, additionalData = { "applyEffect": "" }, silent = false) {
	if (typeof (saveToken) == "string") {
		saveToken = MapTool.tokens.getTokenByID(saveToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(saveData));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
	let saveInfo = JSON.parse(saveToken.getProperty("saves"));

	let specialEffects = JSON.parse(saveToken.getProperty("specialEffects"));
	if (specialEffects === null) {
		specialEffects = {};
	}

	if (saveData === null || (saveData != null && saveData.partial)) {

		try {

			if (saveData != null) {
				saveData.cBonus = ("cBonus" in saveData) ? saveData.cBonus : 0;
				saveData.sBonus = ("sBonus" in saveData) ? saveData.sBonus : 0;
				saveData.iBonus = ("iBonus" in saveData) ? saveData.iBonus : 0;
				saveData.cMalus = ("cMalus" in saveData) ? saveData.cMalus : 0;
				saveData.sMalus = ("sMalus" in saveData) ? saveData.sMalus : 0;
				saveData.iMalus = ("iMalus" in saveData) ? saveData.iMalus : 0;
			} else {
				saveData = {};
				saveData.cBonus = 0;
				saveData.sBonus = 0;
				saveData.iBonus = 0;
				saveData.cMalus = 0;
				saveData.sMalus = 0;
				saveData.iMalus = 0;
			}

			let saveStrings = {};

			let saves = ["fortitude", "reflex", "will"];
			for (var s in saves) {
				saveStrings[s] = { "name": saves[s], "string": (capitalise(saves[s]) + " " + pos_neg_sign(saveInfo[saves[s]])) };
				if (saveInfo[saves[s] + "Prof"] != "" && saveInfo[saves[s] + "Prof"] != null) {
					saveStrings[s].string += " (" + saveInfo[saves[s] + "Prof"] + ")";
				}
			}

			saving_throw_dialog(saveToken.getId(), saveToken.getName(), saveData, specialEffects, saveStrings)

		} catch (e) {
			MapTool.chat.broadcast("Error in saveData-NULL during saving_throw");
			MapTool.chat.broadcast("saveToken: " + String(saveToken));
			MapTool.chat.broadcast("saveData: " + JSON.stringify(saveData));
			MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	} else {
		try {

			if (!("cBonus" in saveData)) {
				saveData.cBonus = 0;
			} else {
				saveData.cBonus = Math.abs(saveData.cBonus);
			}
			if (!("sBonus" in saveData)) {
				saveData.sBonus = 0;
			} else {
				saveData.sBonus = Math.abs(saveData.sBonus);
			}
			if (!("iBonus" in saveData)) {
				saveData.iBonus = 0;
			} else {
				saveData.iBonus = Math.abs(saveData.iBonus);
			}
			if (!("oBonus" in saveData)) {
				saveData.oBonus = 0;
			} else {
				saveData.oBonus = Math.abs(saveData.oBonus);
			}
			if (!("cMalus" in saveData)) {
				saveData.cMalus = 0;
			} else {
				saveData.cMalus = Math.abs(saveData.cMalus) * -1;
			}
			if (!("sMalus" in saveData)) {
				saveData.sMalus = 0;
			} else {
				saveData.sMalus = Math.abs(saveData.sMalus) * -1;
			}
			if (!("iMalus" in saveData)) {
				saveData.iMalus = 0;
			} else {
				saveData.iMalus = Math.abs(saveData.iMalus) * -1;
			}
			if (!("oMalus" in saveData)) {
				saveData.oMalus = 0;
			} else {
				saveData.oMalus = Math.abs(saveData.oMalus) * -1;
			}
			if (!("fortuneSelect" in saveData)) {
				saveData.fortuneSelect = "normal";
			}

			MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
			let dTwenty = Number(MTScript.getVariable("dTwenty"));
			if (saveData.fortuneSelect == "fortune") {
				MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
				dTwenty = Math.max(dTwenty, Number(MTScript.getVariable("dTwenty")));
			} else if (saveData.fortuneSelect == "misfortune") {
				MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
				dTwenty = Math.min(dTwenty, Number(MTScript.getVariable("dTwenty")));
			}

			let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

			let dTwentyColour = themeData.colours.standardText;
			if (dTwenty == 1) {
				dTwentyColour = "red";
			} else if (dTwenty == 20) {
				dTwentyColour = "green";
			}

			let basic_bonus = Number(saveInfo[saveData.saveName]);
			let misc_bonus = Number(saveData.miscBonus);
			let effect_bonus_raw = calculate_bonus(saveToken.getId(), [saveData.saveName, "saving-throw"], true);

			for (var k in saveData) {
				if (k.includes("specialEffect")) {
					let effectData = specialEffects[saveData[k]];
					let tempBonus = get_effect_bonus(effectData, ["saving-throw", saveData.saveName]);
					for (var type in tempBonus) {
						let typeDict = tempBonus[type];
						for (var k in typeDict) {
							if (type == "bonuses" && typeDict[k] > effect_bonus_raw[type][k]) {
								effect_bonus_raw[type][k] = typeDict[k];
							} else if (type == "maluses" && typeDict[k] < effect_bonus_raw[type][k]) {
								effect_bonus_raw[type][k] = typeDict[k];
							}
						}
					}
					toggle_action_effect(effectData, saveToken, false);
				}
			}

			//MapTool.chat.broadcast(JSON.stringify(effect_bonus));

			let effect_bonus = Math.max(effect_bonus_raw.bonuses.circumstance, saveData.cBonus) + Math.max(effect_bonus_raw.bonuses.status, saveData.sBonus) + Math.max(effect_bonus_raw.bonuses.item, saveData.iBonus) + Math.max(effect_bonus_raw.bonuses.none, saveData.oBonus)
				+ Math.min(effect_bonus_raw.maluses.circumstance, saveData.cMalus) + Math.min(effect_bonus_raw.maluses.status, saveData.sMalus) + Math.min(effect_bonus_raw.maluses.item, saveData.iMalus) + Math.min(effect_bonus_raw.maluses.none, saveData.oMalus);

			//MapTool.chat.broadcast(JSON.stringify(effect_bonus));

			let saveMod = basic_bonus + misc_bonus + effect_bonus;
			let saveResult = dTwenty + saveMod;

			if (!silent) {
				let displayData = { "name": saveToken.getName() + " - " + capitalise(saveData.saveName) + " " + pos_neg_sign(saveMod), "system": { "description": { "value": "" } } };
				displayData.system.appliedEffects = effect_bonus_raw.appliedEffects;
				displayData.system.description.value = saveData.flavourText + "<br/><div style='font-size:20px'><b><span style='color:" + dTwentyColour + "'>" + String(dTwenty) + "</span>"
				if (basic_bonus != 0) {
					displayData.system.description.value += " " + pos_neg_sign(basic_bonus, true);
				}
				if (effect_bonus != 0) {
					displayData.system.description.value += " " + pos_neg_sign(effect_bonus, true);
				}
				if (misc_bonus != 0) {
					displayData.system.description.value += " " + pos_neg_sign(misc_bonus, true);
				}
				displayData.system.description.value += " = " + String(saveResult) + "</div></b>";

				chat_display(displayData);
			}
			return {"saveResult":saveResult,"dTwenty":dTwenty,"basic_bonus":basic_bonus,"effect_bonus":effect_bonus,"misc_bonus":misc_bonus};
		} catch (e) {
			MapTool.chat.broadcast("Error in saveData-else during saving_throw");
			MapTool.chat.broadcast("saveToken: " + String(saveToken));
			MapTool.chat.broadcast("saveData: " + JSON.stringify(saveData));
			MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}

	}
}

MTScript.registerMacro("ca.pf2e.saving_throw", saving_throw);