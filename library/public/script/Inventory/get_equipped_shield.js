"use strict";

function get_equipped_shield(tokenID){
	let token = MapTool.tokens.getTokenByID(tokenID);
	let inventory = JSON.parse(token.getProperty("inventory"));
	for (var i in inventory){
		let itemData = inventory[i];
		if ("armorType" in itemData && itemData.armorType == "shield"){
			return itemData;
		}
		//MapTool.chat.broadcast(JSON.stringify(itemData));
	}
}

MTScript.registerMacro("ca.pf2e.get_equipped_shield", get_equipped_shield);