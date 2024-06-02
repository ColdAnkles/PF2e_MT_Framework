"use strict";

function get_equipped_shield(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let charFlags = JSON.parse(token.getProperty("creatureFlags"))
	if (charFlags.system.attributes.shield != null) {
		return charFlags.system.attributes.shield;
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.type == "shield" && itemData.equipped) {
			charFlags.system.attributes.shield = itemData;
			token.setProperty("creatureFlags", JSON.stringify(charFlags))
			return itemData;
		}
		//MapTool.chat.broadcast(JSON.stringify(itemData));
	}
	return null;
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
	return null;
}

MTScript.registerMacro("ca.pf2e.get_equipped_armor", get_equipped_armor);

function find_handwraps(token) {
	let bestHandwraps = null;
	let bestHandwrapsLevel = -1;
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.name == "Handwraps of Mighty Blows" && itemData.level > bestHandwrapsLevel) {
			bestHandwraps = itemData;
		}
	}
	return bestHandwraps;
}

MTScript.registerMacro("ca.pf2e.find_handwraps", find_handwraps);

function get_equipped_items(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	let equippedItems = {};

	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.equipped) {
			equippedItems[i] = itemData;
		}
	}
	return equippedItems;
}