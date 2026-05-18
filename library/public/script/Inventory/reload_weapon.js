"use strict";

function reload_weapon(token, weaponID) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let itemData = get_linked_weapon(token, weaponID)

	if (itemData.system.reload.value != null && itemData.system.reload.value > 0 && itemData.system.ammo.value != null && itemData.system.ammo.capacity != null) {
		itemData.system.ammo.value = itemData.system.ammo.capacity;
		set_linked_weapon(token, weaponID, itemData);
	}
}

MTScript.registerMacro("ca.pz2e.reload_weapon", reload_weapon);