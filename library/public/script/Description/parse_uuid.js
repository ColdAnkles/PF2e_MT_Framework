"use strict";

function parse_uuid(uuidString, additionalData = { "rollDice": false }) {
	let parsed = parse_foundry_strings(uuidString);

	//MapTool.chat.broadcast(JSON.stringify(parsed));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	if (parsed.braceContents != null) {
		uuidString = parsed.braceContents;
	} else if (parsed.bracketContents.includes("Compendium.pf2e.bestiary-ability-glossary-srd.Item")) {
		let tempArray = parsed.bracketContents.split(".");
		let itemName = tempArray[tempArray.length - 1];
		uuidString = "<b>" + itemName + "</b>";
	} else if ("Compendium.pf2e.bestiary-effects.Item.Effect" in parsed.bracketDetail) {
		uuidString = "";
	} else if (parsed.bracketContents.includes("spell-effects") && !additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(/[^(Vs)]\./);
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(effectName), "Item_View_Frame@Lib:ca.pz2e", { "itemType": "effect", "itemName": effectName });
	} else if (parsed.bracketContents.includes("spell-effects") && additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(/[^(Vs)]\./);
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink("Apply " + effectName, "Apply_Effect_Query@Lib:ca.pz2e", { "effectName": effectName, "effectSource": additionalData.item });
	} else if (parsed.bracketContents.includes("Effect") && !additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(".");
		let effectName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(effectName), "Item_View_Frame@Lib:ca.pz2e", { "itemType": "effect", "itemName": effectName });
	} else if (parsed.bracketContents.includes("Effect") && additionalData.rollDice) {
		let tempArray = parsed.bracketContents.split(".");
		let effectName = tempArray[tempArray.length - 1];
		tempArray = tempArray[tempArray.length - 1].split(":");
		uuidString = create_macroLink("Apply " + effectName, "Apply_Effect_Query@Lib:ca.pz2e", { "effectName": effectName, "effectSource": additionalData.item });
	} else if (parsed.bracketContents.includes("spells-srd")) {
		let tempArray = parsed.bracketContents.split(".");
		let spellName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(spellName), "Spell_View_Frame@Lib:ca.pz2e", spellName);
	} else if (parsed.bracketContents.includes("conditionitems")) {
		let tempArray = parsed.bracketContents.split(".");
		let conditionName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(conditionName), "Item_View_Frame@Lib:ca.pz2e", { "itemType": "condition", "itemName": conditionName });
	} else if (parsed.bracketContents.includes("actionspf2e")) {
		let tempArray = parsed.bracketContents.split(".");
		let actionName = tempArray[tempArray.length - 1];
		uuidString = actionName;
	} else if (parsed.bracketContents.includes("feats-srd")) {
		let tempArray = parsed.bracketContents.split(".");
		let featName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(featName), "Item_View_Frame@Lib:ca.pz2e", { "itemType": "feat", "itemName": featName });
	} else if (parsed.bracketContents.includes("classfeatures")) {
		let tempArray = parsed.bracketContents.split(".");
		let featName = tempArray[tempArray.length - 1];
		uuidString = featName;
	} else if (parsed.bracketContents.includes("equipment-srd.Item")) {
		let tempArray = parsed.bracketContents.split(".");
		let itemName = tempArray[tempArray.length - 1];
		uuidString = create_macroLink(capitalise(itemName), "Item_View_Frame@Lib:ca.pz2e", { "itemType": "item", "itemName": itemName });
	} else if (parsed.bracketContents.includes("pf2e-macros")) {
		uuidString = "";
	}
	//MapTool.chat.broadcast(uuidString);
	return uuidString;
}