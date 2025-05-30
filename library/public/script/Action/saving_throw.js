"use strict";

function saving_throw(saveToken, saveData = null, additionalData = { "applyEffect": "" }) {
	if (typeof (saveToken) == "string") {
		saveToken = MapTool.tokens.getTokenByID(saveToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(saveData));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	let saves = ["fortitude", "reflex", "will"]
	let saveInfo = JSON.parse(saveToken.getProperty("saves"));

	let specialEffects = JSON.parse(saveToken.getProperty("specialEffects"));
	if (specialEffects === null) {
		specialEffects = {};
	}

	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	if (saveData === null || (saveData != null && saveData.partial)) {

		try {

			let cBonus = 0;
			let sBonus = 0;
			let iBonus = 0;
			let cMalus = 0;
			let sMalus = 0;
			let iMalus = 0;

			if (saveData != null) {
				cBonus = ("cBonus" in saveData) ? saveData.cBonus : 0;
				sBonus = ("sBonus" in saveData) ? saveData.sBonus : 0;
				iBonus = ("iBonus" in saveData) ? saveData.iBonus : 0;
				cMalus = ("cMalus" in saveData) ? saveData.cMalus : 0;
				sMalus = ("sMalus" in saveData) ? saveData.sMalus : 0;
				iMalus = ("iMalus" in saveData) ? saveData.iMalus : 0;
			}

			let queryHTML = "<html>";

			let saveStrings = {};

			for (var s in saves) {
				saveStrings[s] = { "name": saves[s], "string": (capitalise(saves[s]) + " " + pos_neg_sign(saveInfo[saves[s]])) };
				if (saveInfo[saves[s] + "Prof"] != "" && saveInfo[saves[s] + "Prof"] != null) {
					saveStrings[s].string += " (" + saveInfo[saves[s] + "Prof"] + ")";
				}
			}

			queryHTML = queryHTML + "<table width=100% class='staticTable'><link rel=\"stylesheet\" type=\"text/css\" href=\"lib://ca.pf2e/css/" + themeData.css + "\"><form action='macro://Saving_Throw_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
			queryHTML = queryHTML + "<input type='hidden' name='saveTokenID' value='" + saveToken.getId() + "'>";
			queryHTML = queryHTML + "<input type='hidden' name='secretCheck' value='0'>";

			queryHTML += "<tr><th colspan='5' style='text-align:center'><b>Saving Throw</b></th></tr>";
			queryHTML = queryHTML + "<tr><td colspan='1' style='text-align:right'>Save:</td><td colspan='4'><select name='saveName'>";
			for (var s in saveStrings) {
				queryHTML = queryHTML + "<option value='" + saveStrings[s].name + "'>" + saveStrings[s].string + "</option>";
			}
			queryHTML = queryHTML + "</select></td></tr>";

			for (var e in specialEffects) {
				let effectData = specialEffects[e];
				let effectIndex = 0
				//MapTool.chat.broadcast(JSON.stringify(effectData));
				let effectName = effectData.name.replaceAll("Effect: ", "");
				if (specialEffects[e].type == "saving-throw") {
					queryHTML += "<tr><td>Apply " + effectName + "?</td><td><input type='checkbox' name='specialEffect" + String(effectIndex) + "' value='";
					queryHTML += effectData.name + "'" + ((additionalData.applyEffect == effectName) ? "checked" : "") + "></td></tr>";
					effectIndex += 1;
				}
			}

			queryHTML = queryHTML + "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
			<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='"+ String(cBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='cMalus' value='"+ String(cMalus) + "' size='2'></input></td></tr>";

			queryHTML = queryHTML + "<tr><td>Secret Check?</td><td><input type='checkbox' name='secretCheck' value='1'></td>\
			<td>Status:</b></td><td>+<input type='text' name='sBonus' value='"+ String(sBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='sMalus' value='"+ String(sMalus) + "' size='2'></input></td></tr>";

			queryHTML = queryHTML + "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >" + saveToken.getName() + " attempts to save.</textarea></td>\
			<td>Item:</b></td><td>+<input type='text' name='iBonus' value='"+ String(iBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='iMalus' value='"+ String(iMalus) + "' size='2'></input></td></tr>";

			queryHTML += "<tr><td colspan='2' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td>\
			<td>Other:</b></td><td>+<input type='text' name='oBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='oMalus' value='0' size='2'></input></td></tr>";

			queryHTML = queryHTML + "<tr><td colspan='5' style='text-align:center'><input type='submit' name='savingThrowSubmit' value='Submit'></td></tr>";

			queryHTML = queryHTML + "</form></table></html>"

			MTScript.setVariable("queryHTML", queryHTML);
			MTScript.evalMacro("[dialog5('Saving Throw','width=600;height=350;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");
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