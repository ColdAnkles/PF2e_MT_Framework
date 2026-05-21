"use strict";

function build_item_view(itemType, itemName, itemData = null) {
	if (["consumable", "armor", "weapon"].includes(itemType)) {
		itemType = "item";
	}
	let itemList = JSON.parse(read_data("pz2e_" + itemType));
	let traitGlossary = JSON.parse(read_data("pz2e_glossary")).PF2E;

	try {
		if (itemData == null || itemData == "") {
			if (!(itemName in itemList)) {
				let lookupItem = search_dict(itemList, "name", itemName);
				if (lookupItem.length > 0) {
					itemData = lookupItem[0];
				} else {
					return "<b>Could not find " + itemType + " " + itemName + ".</b>";
				}
			} else {
				itemData = itemList[itemName];
			}
			if ("fileURL" in itemData) {
				itemData = rest_call(itemData["fileURL"], "");
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during basic-step");
		MapTool.chat.broadcast("itemName: " + itemName);
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during basic-step");
	}

	let HTMLString = "<h5>" + create_macroLink("Share", "Share_To_Chat@Lib:ca.pz2e", JSON.stringify({ "data": itemData })) + "</h5>";

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
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during rarity-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during rarity-step");
	}
	var traitName = null;
	var traitNormal = null;
	try {
		if ("traits" in itemData.system) {
			for (var t in itemData.system.traits.value) {
				traitName = itemData.system.traits.value[t];
				traitNormal = capitalise(traitName).split('-')[0];
				if (("traitDescription" + traitNormal) in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
					HTMLString += "<span class='trait' title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + capitalise(traitName) + "</span>";
				} else {
					HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
				}
			}
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during traits-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("traitName: " + String(traitName));
		MapTool.chat.broadcast("traitNormal: " + String(traitNormal));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: build_item_view during traits-step");
	}

	try {
		HTMLString += "<br />"
		HTMLString += "<b>Source </b><span class='ext-link'>" + itemData.system.publication.title + "</span><br />";
		HTMLString += clean_description(itemData.system.description.value, false, false, false);
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during last-step");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during last-step");
	}


	return HTMLString;
}

MTScript.registerMacro("ca.pz2e.build_item_view", build_item_view);