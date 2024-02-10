"use strict";

function build_item_view(itemType, itemName) {
	let itemList = JSON.parse(read_data("pf2e_" + itemType));
	if (!(itemName in itemList)) {
		return "<b>Could not find " + itemType + " " + itemName + ".</b>";
	}
	let itemData = itemList[itemName];
	if ("fileURL" in itemData) {
		itemData = rest_call(itemData["fileURL"], "");
	}
	itemData = parse_feature(itemData);

	//MapTool.chat.broadcast(JSON.stringify(itemData));

	let HTMLString = "";

	HTMLString = HTMLString + "<h1 class='title'><span>" + itemData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(itemData.type) + " " + (("level" in itemData) ? itemData.level : "") + "</span></h1>";
	if (itemData.rarity != "common") {
		HTMLString = HTMLString + "<span class='trait" + itemData.rarity + "'>" + capitalise(itemData.rarity) + "</span>";
	}
	if ("traits" in itemData) {
		for (var t in itemData.traits) {
			HTMLString = HTMLString + "<span class='trait'>" + capitalise(itemData.traits[t]) + "</span>";
		}
	}
	HTMLString = HTMLString + "<br />"
	HTMLString = HTMLString + "<b>Source </b><span class='ext-link'>" + itemData.source + "</span><br />";
	HTMLString = HTMLString + clean_description(itemData.description, false, false, false);


	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_item_view", build_item_view);