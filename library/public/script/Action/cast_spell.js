"use strict";

function cast_spell(spellName, castLevel, castGroup, casterToken, additionalData = null) {
	//MapTool.chat.broadcast(spellName);
	//MapTool.chat.broadcast(String(castLevel));
	//MapTool.chat.broadcast(casterToken);
	//MapTool.chat.broadcast(String(additionalData));
	if (typeof (casterToken) == "string") {
		casterToken = MapTool.tokens.getTokenByID(casterToken);
	}

	let actionData = null;

	let spellCasting = JSON.parse(casterToken.getProperty("spellRules"))
	let castingData = spellCasting[castGroup];
	let spellData = null;
	let remasterName = null;

	try {

		castLevel = Number(castLevel);

		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
		let property = JSON.parse(read_data("pf2e_spell"));

		if (!(spellName in property)) {
			let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
			if (!spellName in remasterChanges) {
				return "<h2>Could not find spell " + spellName + "</h2>";
			} else {
				if (remasterChanges[spellName] in property) {
					remasterName = spellName;
					spellName = remasterChanges[spellName];
				} else {
					return "<h2>Could not find spell " + remasterChanges[spellName] + "</h2>";
				}
			}
		}

		spellData = property[spellName];

		let spellBaseName = spellData.baseName;
		if ("fileURL" in spellData) {
			spellData = rest_call(spellData["fileURL"], "");
		}
		//spellData = parse_spell(spellBaseName, spellData);
		//MapTool.chat.broadcast(JSON.stringify(spellData));

		actionData = { "name": spellData.name, "system": { "remasterFrom": remasterName, "description": { "value": "" }, "actions": { "value": null }, "actionType": { "value": null }, "isSpell": true, "castLevel": { "value": castLevel }, "spendAction": true, "castingAbility": castingData.castingAbility, "overlays": [], "traits": { "value": [] } } };
		actionData.system.rawSpellData = spellData;

	} catch (e) {
		MapTool.chat.broadcast("Error cast_spell during pre-setup");
		MapTool.chat.broadcast("spellName: " + spellName);
		MapTool.chat.broadcast("castLevel: " + String(castLevel));
		MapTool.chat.broadcast("castGroup: " + castGroup);
		MapTool.chat.broadcast("casterToken: " + String(casterToken));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		for (var s in castingData.spells) {
			let thisSpell = castingData.spells[s];
			if (thisSpell.name == spellData.name) {
				if ("signature" in thisSpell) {
					actionData.system.signature = thisSpell.system.signature
				}
			}
		}

		if (!("signature" in actionData.system)) {
			actionData.system.signature = false;
		}

		if (actionData.system.signature) {// && !(spellData.time.includes("to") && additionalData == null)) {
			MTScript.evalMacro("[h: signatureUpcast=" + String(castLevel) + "][h: input(\"signatureUpcast|" + castingData.upcastLevels.join(',') + "|Select Upcast Level|LIST|VALUE=STRING\")]");
			actionData.system.castLevel = MTScript.getVariable("signatureUpcast");
			castLevel = actionData.castLevel;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in cast_spell during signature-setup");
		MapTool.chat.broadcast("spellName: " + spellName);
		MapTool.chat.broadcast("castLevel: " + String(castLevel));
		MapTool.chat.broadcast("castGroup: " + castGroup);
		MapTool.chat.broadcast("casterToken: " + String(casterToken));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (!(isNaN(spellData.system.time.value))) {
			actionData.system.actionType.value = "action";
			actionData.system.actions.value = spellData.system.time.value;
			for (var overlay in spellData.system.overlays) {
				if (!("time" in spellData.system.overlays[overlay].system)) {
					actionData.system.overlays.push(overlay);
				}
			}
		} else if (spellData.system.time.value.includes("to") && additionalData == null) {
			//Ask actions spent
			let first = Number(spellData.system.time.value.split(" to ")[0]);
			let second = Number(spellData.system.time.value.split(" to ")[1]);
			if (isNaN(second)) {
				second = 3;
			}
			let inputText = "additionalData|";
			for (let i = first; i <= second; i++) {
				inputText = inputText + String(i) + " " + icon_img(String(i) + "action", false, true) + ",";
			}
			inputText = inputText.substring(0, inputText.length - 1) + "|Actions to use|LIST|ICON=TRUE ICONSIZE=30";

			let transferData = { "spellName": spellName, "castLevel": String(castLevel), "casterToken": casterToken.getId(), "inputText": inputText, "first": first, "castGroup": castGroup };
			MTScript.setVariable("transferData", JSON.stringify(transferData));
			MTScript.evalMacro("[h: ca.pf2e.Spell_Actions_Form_To_JS(transferData)]");
			return;
		} else if (spellData.system.time.value.includes("to") && additionalData != null) {
			actionData.system.actionType.value = "action";
			actionData.system.actions.value = Number(additionalData);

			for (var overlay in spellData.system.overlays) {
				if (!("time" in spellData.system.overlays[overlay].system)) {
					actionData.system.overlays.push(overlay);
				} else if ("time" in spellData.system.overlays[overlay].system && spellData.system.overlays[overlay].system.time.value.includes(String(additionalData))) {
					actionData.system.overlays.push(overlay);
				}
			}

		} else if (spellData.system.time.value == "reaction") {
			actionData.system.actionType.value = "reaction";
			actionData.system.actions.value = 1;
			for (var overlay in spellData.system.overlays) {
				if (!("time" in spellData.system.overlays[overlay].system)) {
					actionData.system.overlays.push(overlay);
				}
			}
		} else {
			//Non-encounter mode spells
			actionData.system.actionType.value = "action";
			actionData.system.actions.value = 100;
			for (var overlay in spellData.system.overlays) {
				if (!("time" in spellData.system.overlays[overlay].system)) {
					actionData.system.overlays.push(overlay);
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in cast_spell during time setup");
		MapTool.chat.broadcast("spellName: " + spellName);
		MapTool.chat.broadcast("castLevel: " + String(castLevel));
		MapTool.chat.broadcast("castGroup: " + castGroup);
		MapTool.chat.broadcast("casterToken: " + String(casterToken));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (get_token_type(casterToken) == "PC") {
			let resources = JSON.parse(casterToken.getProperty("resources"));
			if (!(spellData.system.traits.value.includes("focus")) && !(castingData.currentSlots[castLevel] > 0) && !(spellData.system.traits.value.includes("cantrip"))) {
				message_window("No Spell Slot!", "You've expended all the spell slots for this rank of spell!");
				return;
			} else if (!(spellData.system.traits.value.includes("focus")) && castingData.currentSlots[castLevel] > 0 && !(spellData.system.traits.value.includes("cantrip"))) {
				castingData.currentSlots[castLevel] -= 1;
				casterToken.setProperty("spellRules", JSON.stringify(spellCasting));
				if (!(casterToken.getName().includes("Lib"))) {
					let libToken = MapTool.tokens.getTokenByID(casterToken.getProperty("myID"));
					libToken.setProperty("spellRules", JSON.stringify(spellCasting));
				}
			} else if (spellData.system.traits.value.includes("focus") && (!("focus" in resources) || resources.focus.current <= 0)) {
				message_window("No Focus Point!", "You've expended all your focus points!");
				return;
			} else if (spellData.system.traits.value.includes("focus") && ("focus" in resources) && resources.focus.current > 0) {
				resources.focus.current -= 1;
				casterToken.setProperty("resources", JSON.stringify(resources));
				if (!(casterToken.getName().includes("Lib"))) {
					let libToken = MapTool.tokens.getTokenByID(casterToken.getProperty("myID"));
					libToken.setProperty("resources", JSON.stringify(resources));
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in cast_spell during spell-slot-subtraction");
		MapTool.chat.broadcast("spellName: " + spellName);
		MapTool.chat.broadcast("castLevel: " + String(castLevel));
		MapTool.chat.broadcast("castGroup: " + castGroup);
		MapTool.chat.broadcast("casterToken: " + String(casterToken));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("castingData: " + JSON.stringify(castingData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		actionData.system.castLevel.value = castLevel;
		core_action(actionData, casterToken);
	} catch (e) {
		MapTool.chat.broadcast("Error in cast_spell during call-core-action");
		MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
		MapTool.chat.broadcast("casterToken: " + String(casterToken));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

}

MTScript.registerMacro("ca.pf2e.cast_spell", cast_spell);