"use strict";

function build_item_view(itemType, itemName) {
	let itemList = JSON.parse(read_data("pf2e_" + itemType));
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).traitDescriptions;
	if (!(itemName in itemList)) {
		return "<b>Could not find " + itemType + " " + itemName + ".</b>";
	}
	let itemData = itemList[itemName];
	if ("fileURL" in itemData) {
		itemData = rest_call(itemData["fileURL"], "");
	}
	itemData = parse_feature(itemData);

	//MapTool.chat.broadcast(JSON.stringify(itemData));

	let HTMLString = "<h5>" + create_macroLink("Share", "Share_To_Chat@Lib:ca.pf2e", JSON.stringify({ "data": itemData })) + "</h5>";

	HTMLString += "<h1 class='title'><span>" + itemData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(itemData.type) + " " + (("level" in itemData) ? itemData.level : "") + "</span></h1>";
	if (itemData.rarity != "common") {
		let normalRarity = capitalise(itemData.rarity).split('-')[0];
		if (normalRarity in traitGlossary && traitGlossary[normalRarity] != null) {
			HTMLString += "<span class='trait" + itemData.rarity + "' title=\"" + traitGlossary[normalRarity] + "\">" + capitalise(itemData.rarity) + "</span>";
		} else {
			HTMLString += "<span class='trait" + itemData.rarity + "'>" + capitalise(itemData.rarity) + "</span>";
		}
	}
	if ("traits" in itemData) {
		for (var t in itemData.traits) {
			let traitName = itemData.traits[t];
			let traitNormal = capitalise(traitName).split('-')[0];
			if (traitNormal in traitGlossary && traitGlossary[traitNormal] != null) {
				HTMLString += "<span class='trait' title=\"" + traitGlossary[traitNormal] + "\">" + capitalise(traitName) + "</span>";
			} else {
				HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
			}
		}
	}
	HTMLString += "<br />"
	HTMLString += "<b>Source </b><span class='ext-link'>" + itemData.source + "</span><br />";
	HTMLString += clean_description(itemData.description, false, false, false);


	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_item_view", build_item_view);