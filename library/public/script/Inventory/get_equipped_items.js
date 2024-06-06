"use strict";

function get_equipped_shield(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let testShield = get_actor_data(token, "system.attributes.shield");
	if (testShield != null) {
		return testShield;
	}
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory) {
		let itemData = inventory[i];
		if (itemData.type == "shield" && itemData.system.equipped) {
			let actorData = JSON.parse(token.getProperty("foundryActor"));
			actorData.system.attributes.shield = itemData;
			token.setProperty("foundryActor", JSON.stringify(actorData))
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
		if (itemData.type == "armor" && itemData.system.equipped) {
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
		if (itemData.name == "Handwraps of Mighty Blows" && itemData.system.level.value > bestHandwrapsLevel) {
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
		if (itemData.system.equipped) {
			equippedItems[i] = itemData;
		}
	}
	return equippedItems;
}