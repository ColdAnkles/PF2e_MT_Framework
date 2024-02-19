"use strict";

function get_equipped_shield(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.type == "shield" && itemData.equipped) {
			return itemData;
		}
		//MapTool.chat.broadcast(JSON.stringify(itemData));
	}
}

MTScript.registerMacro("ca.pf2e.get_equipped_shield", get_equipped_shield);

function get_equipped_armor(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.type == "armor" && itemData.equipped) {
			return itemData;
		}
		//MapTool.chat.broadcast(JSON.stringify(itemData));
	}
}

MTScript.registerMacro("ca.pf2e.get_equipped_armor", get_equipped_armor);