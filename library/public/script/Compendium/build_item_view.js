"use strict";

function build_item_view(itemType, itemName, itemData = null) {
	if (["consumable","armor","weapon"].includes(itemType)){
		itemType = "item";
	}
	let itemList = JSON.parse(read_data("pf2e_" + itemType));
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).PF2E;

	try {
		if (itemData == null || itemData == "") {
			if (!(itemName in itemList)) {
				return "<b>Could not find " + itemType + " " + itemName + ".</b>";
			}
			itemData = itemList[itemName];
			if ("fileURL" in itemData) {
				itemData = rest_call(itemData["fileURL"], "");
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_item_view during basic-step");
		MapTool.chat.broadcast("itemName: " + itemName);
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let HTMLString = "<h5>" + create_macroLink("Share", "Share_To_Chat@Lib:ca.pf2e", JSON.stringify({ "data": itemData })) + "</h5>";

	try {
		HTMLString += "<h1 class='title'><span>" + itemData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(itemData.type) + " " + (("level" in itemData.system) ? itemData.system.level.value : "") + "</span></h1>";
		if ("traits" in itemData.system && "rarity" in itemData.system.traits && itemData.system.traits.rarity != "common") {
			let normalRarity = capitalise(itemData.system.traits.rarity).split('-')[0];
			if ("traitDescription" + normalRarity in traitGlossary && traitGlossary["traitDescription" + normalRarity] != null) {
				HTMLString += "<span class='trait" + itemData.system.traits.rarity + "' title=\"" + traitGlossary["traitDescription" + normalRarity] + "\">" + capitalise(itemData.system.traits.rarity) + "</span>";
			} else {
				HTMLString += "<span class='trait" + itemData.system.traits.rarity + "'>" + capitalise(itemData.system.traits.rarity) + "</span>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_item_view during rarity-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	try {
		if ("traits" in itemData.system) {
			for (var t in itemData.system.traits.value) {
				let traitName = itemData.system.traits.value[t];
				let traitNormal = capitalise(traitName).split('-')[0];
				if ("traitDescription" + traitNormal in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
					HTMLString += "<span class='trait' title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + capitalise(traitName) + "</span>";
				} else {
					HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_item_view during traits-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		HTMLString += "<br />"
		HTMLString += "<b>Source </b><span class='ext-link'>" + itemData.system.publication.title + "</span><br />";
		HTMLString += clean_description(itemData.system.description.value, false, false, false);
	} catch (e) {
		MapTool.chat.broadcast("Error in build_item_view during last-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}


	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_item_view", build_item_view);