"use strict";

function build_item_view(itemType, itemName, itemData = null) {
	if (["consumable", "armor", "weapon", "equipment"].includes(itemType)) {
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

	//MapTool.chat.broadcast(JSON.stringify(itemData).replaceAll("<", "&lt;"));

	let HTMLString = "<h5>" + create_macroLink("Share", "Share_To_Chat@Lib:ca.pz2e", JSON.stringify({ "data": itemData })) + "</h5>";

	try {
		HTMLString += "<h1 class='title'><span>" + (("display" in itemData && itemData.display != null && itemData.display != "") ? itemData.display : itemData.name) + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(itemData.type) + " " + (("level" in itemData.system) ? itemData.system.level.value : "") + "</span></h1>";
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
		if ("traits" in itemData.system && "value" in itemData.system.traits && itemData.system.traits.value.length > 0) {
			for (var t in itemData.system.traits.value) {
				traitName = itemData.system.traits.value[t];
				traitNormal = capitalise(traitName).split('-')[0];
				if (("traitDescription" + traitNormal) in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
					HTMLString += "<span class='trait' title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + capitalise(traitName) + "</span>";
				} else {
					HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
				}
			}
			HTMLString += "<br />"
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
		HTMLString += "<b>Source </b><span class='ext-link'>" + itemData.system.publication.title + "</span><br />";
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during source");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during source");
	}

	try {
		let lineTwo = [];
		if (itemData.system.price.value != null) {
			let priceString = "";
			if ("gp" in itemData.system.price.value) {
				priceString += String(itemData.system.price.value.gp) + " gp"
			}
			if ("sp" in itemData.system.price.value) {
				priceString += String(itemData.system.price.value.sp) + " sp"
			}
			if ("cp" in itemData.system.price.value) {
				priceString += String(itemData.system.price.value.cp) + " cp"
			}
			lineTwo.push("<b>Price </b> " + priceString);
		}
		if (itemData.system.damage != null) {
			lineTwo.push("<b>Damage </b> " + String(itemData.system.damage.dice) + String(itemData.system.damage.die) + " " + itemData.system.damage.damageType);
		}
		if (itemData.system.bulk.value != null && !itemData.system.description.value.includes("<strong>Bulk</strong>")) {
			let bulkString = String(itemData.system.bulk.value);
			if (itemData.system.bulk.value == 0) {
				bulkString = "&mdash;";
			} else if (itemData.system.bulk.value == 0.1) {
				bulkString = "L";
			}
			lineTwo.push("<b>Bulk </b> " + bulkString);
		}
		if (lineTwo.length > 0) {
			HTMLString += lineTwo.join("; ") + "<br />";
		}
		if (itemData.system.usage != null && itemData.system.usage.value != null) {
			let handCount = 0;
			if (itemData.system.usage.value == "held-in-one-hand") {
				handCount = 1;
			} else if (itemData.system.usage.value == "held-in-two-hands") {
				handCount = 2;
			}
			if (handCount > 0) {
				HTMLString += "<b>Hands </b> " + String(handCount) + "<br />";
			}
		}
		let lineThree = [];
		if (itemData.itemType == "weapon") {
			if (itemData.system.range == "") {
				lineThree.push("<b>Type </b> Melee");
			} else {
				lineThree.push("<b>Type </b> Ranged");
			}
		}
		if (itemData.system.category != null) {
			lineThree.push("<b>Category </b> " + capitalise(itemData.system.category));
		}
		if (itemData.system.group != null) {
			lineThree.push("<b>Group </b> " + capitalise(itemData.system.group));
		}
		if (lineThree.length > 0) {
			HTMLString += lineThree.join("; ") + "<br />";
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during other-info");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during other-info");
	}

	if (!itemData.system.description.value.includes("<hr>") &&
		!itemData.system.description.value.includes("<hr/>") &&
		!itemData.system.description.value.includes("<hr />")) {
		HTMLString += "<hr/>";
	}

	try {
		if (itemData.system.description.value == "") {
			itemData.system.description.value = "<i>No description provided for this item.</i>";
		}
		HTMLString += clean_description(itemData.system.description.value, false, false, false);
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in build_item_view during description");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in build_item_view during description");
	}


	return HTMLString;
}

MTScript.registerMacro("ca.pz2e.build_item_view", build_item_view);