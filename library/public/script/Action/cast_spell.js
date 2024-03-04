"use strict";

function cast_spell(spellName, castLevel, castGroup, casterToken, additionalData = null) {
	//MapTool.chat.broadcast(spellName);
	//MapTool.chat.broadcast(String(castLevel));
	//MapTool.chat.broadcast(casterToken);
	//MapTool.chat.broadcast(String(additionalData));
	if (typeof (casterToken) == "string") {
		casterToken = MapTool.tokens.getTokenByID(casterToken);
	}

	castLevel = Number(castLevel);

	let spellCasting = JSON.parse(casterToken.getProperty("spellRules"))
	let castingData = spellCasting[castGroup];

	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));

	if (!(spellName in property)) {
		let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
		if (!spellName in remasterChanges) {
			return "<h2>Could not find spell " + spellName + "</h2>";
		} else {
			if (remasterChanges[spellName] in property) {
				spellName = remasterChanges[spellName];
			} else {
				return "<h2>Could not find spell " + remasterChanges[spellName] + "</h2>";
			}
		}
	}

	let spellData = property[spellName];
	let spellBaseName = spellData.baseName;
	if ("fileURL" in spellData) {
		spellData = rest_call(spellData["fileURL"], "");
	}
	spellData = parse_spell(spellBaseName, spellData);
	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let actionData = { "name": spellData.name, "isSpell": true, "castLevel": castLevel, "spendAction": true, "castingAbility": castingData.castingAbility, "overlays": [] };

	for (var s in castingData.spells) {
		let thisSpell = castingData.spells[s];
		if (thisSpell.name == spellData.name) {
			if ("signature" in thisSpell) {
				actionData.signature = thisSpell.signature
			}
		}
	}

	if (!("signature" in actionData)) {
		actionData.signature = false;
	}

	if (actionData.signature) {// && !(spellData.time.includes("to") && additionalData == null)) {
		MTScript.evalMacro("[h: signatureUpcast=" + String(castLevel) + "][h: input(\"signatureUpcast|" + castingData.castLevels.join(',') + "|Select Upcast Level|LIST|VALUE=STRING\")]");
		actionData.castLevel = MTScript.getVariable("signatureUpcast");
		castLevel = actionData.castLevel;
	}

	if (!(isNaN(spellData.time))) {
		actionData.actionType = "action";
		actionData.actionCost = spellData.time;
		for (var overlay in spellData.overlays) {
			if (!("time" in spellData.overlays[overlay].system)) {
				actionData.overlays.push(overlay);
			}
		}
	} else if (spellData.time.includes("to") && additionalData == null) {
		//Ask actions spent
		let first = Number(spellData.time.split(" to ")[0]);
		let second = Number(spellData.time.split(" to ")[1]);
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
	} else if (spellData.time.includes("to") && additionalData != null) {
		actionData.actionType = "action";
		actionData.actionCost = Number(additionalData);

		for (var overlay in spellData.overlays) {
			if (!("time" in spellData.overlays[overlay].system)) {
				actionData.overlays.push(overlay);
			} else if ("time" in spellData.overlays[overlay].system && spellData.overlays[overlay].system.time.value.includes(String(additionalData))) {
				actionData.overlays.push(overlay);
			}
		}

	} else if (spellData.time == "reaction") {
		actionData.actionType = "reaction";
		actionData.actionCost = 1;
		for (var overlay in spellData.overlays) {
			if (!("time" in spellData.overlays[overlay].system)) {
				actionData.overlays.push(overlay);
			}
		}
	} else {
		//Non-encounter mode spells
		actionData.actionType = "action";
		actionData.actionCost = 100;
		for (var overlay in spellData.overlays) {
			if (!("time" in spellData.overlays[overlay].system)) {
				actionData.overlays.push(overlay);
			}
		}
	}

	if (get_token_type(casterToken) == "PC") {
		let resources = JSON.parse(casterToken.getProperty("resources"));
		if (!(spellData.traits.value.includes("focus")) && !(castingData.currentSlots[castLevel] > 0) && !(spellData.traits.value.includes("cantrip"))) {
			message_window("No Spell Slot!", "You've expended all the spell slots for this rank of spell!");
			return;
		} else if (!(spellData.traits.value.includes("focus")) && castingData.currentSlots[castLevel] > 0 && !(spellData.traits.value.includes("cantrip"))) {
			castingData.currentSlots[castLevel] -= 1;
			casterToken.setProperty("spellRules", JSON.stringify(spellCasting));
			if (!(casterToken.getName().includes("Lib"))) {
				let libToken = MapTool.tokens.getTokenByID(casterToken.getProperty("myID"));
				libToken.setProperty("spellRules", JSON.stringify(spellCasting));
			}
		} else if (spellData.traits.value.includes("focus") && (!("focus" in resources) || resources.focus.current <= 0)) {
			message_window("No Focus Point!", "You've expended all your focus points!");
			return;
		} else if (spellData.traits.value.includes("focus") && ("focus" in resources) && resources.focus.current > 0) {
			resources.focus.current -= 1;
			casterToken.setProperty("resources", JSON.stringify(resources));
			if (!(casterToken.getName().includes("Lib"))) {
				let libToken = MapTool.tokens.getTokenByID(casterToken.getProperty("myID"));
				libToken.setProperty("resources", JSON.stringify(resources));
			}
		}
	}

	core_action(actionData, casterToken);

}

MTScript.registerMacro("ca.pf2e.cast_spell", cast_spell);