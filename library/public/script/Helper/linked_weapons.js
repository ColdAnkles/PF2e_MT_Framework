"use strict";

function get_linked_weapon(actor, weaponID) {
	let itemData = null;
	let inventory = null;
	try {
		if (typeof (actor) == "string") {
			actor = MapTool.tokens.getTokenByID(actor);
		}
		inventory = JSON.parse(actor.getProperty("inventory"));
		if (weaponID in inventory) {
			itemData = inventory[weaponID];
		}

		return itemData;
	} catch (e) {
		MapTool.chat.broadcast("Error in get_linked_weapon");
		MapTool.chat.broadcast("weaponID: " + String(weaponID));
		MapTool.chat.broadcast("actor: " + String(actor));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("inventory: " + JSON.stringify(inventory));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

}

function set_linked_weapon(actor, weaponID, itemData) {
	let inventory = null;
	try {
		if (typeof (actor) == "string") {
			actor = MapTool.tokens.getTokenByID(actor);
		}
		inventory = JSON.parse(actor.getProperty("inventory"));
		if (weaponID in inventory) {
			inventory[weaponID] = itemData;
		}
		actor.setProperty("inventory", JSON.stringify(inventory));
	} catch (e) {
		MapTool.chat.broadcast("Error in set_linked_weapon");
		MapTool.chat.broadcast("weaponID: " + String(weaponID));
		MapTool.chat.broadcast("actor: " + String(actor));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("inventory: " + JSON.stringify(inventory));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

}