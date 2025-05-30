"use strict";

function build_hazard_view(itemName, tokenID = null) {
	let itemData = null;
	if (tokenID == null) {
		let itemList = JSON.parse(read_data("pf2e_hazard"));
		if (!(itemName in itemList)) {
			return "<b>Could not find hazard " + itemName + ".</b>";
		}
		itemData = itemList[itemName];
		let itemBaseName = itemData.baseName;
		if ("fileURL" in itemData) {
			itemData = rest_call(itemData["fileURL"], "");
		}
		//itemData = parse_feature(itemBaseName, itemData);
		itemData = parse_hazard(itemData);
	} else {
		itemData = read_hazard_properties(tokenID);
	}

	//MapTool.chat.broadcast(JSON.stringify(itemData));

	let additionalData = { "rollDice": false };
	if (tokenID != null) {
		additionalData.actor = MapTool.tokens.getTokenByID(tokenID);
	}

	additionalData.level = itemData.level;
	//additionalData.variant = itemData.foundryActor.variant;

	let HTMLString = "";

	try {
		HTMLString += "<h1 class='title'><span>" + itemData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(itemData.type) + " " + itemData.level + "</span></h1>";
		if (itemData.rarity != "common") {
			HTMLString += "<span class='trait" + itemData.rarity + "'>" + capitalise(itemData.rarity) + "</span>";
		}
		for (var t in itemData.traits) {
			HTMLString += "<span class='trait'>" + capitalise(itemData.traits[t]) + "</span>";
		}
		HTMLString += "<br />"
		if (itemData.source != "") {
			HTMLString += "<b>Source </b><span class='ext-link'>" + itemData.source + "</span><br />";
		}

		HTMLString += "<b>Complexity</b> " + ((itemData.isComplex) ? "Complex" : "Simple") + "<br />";
		HTMLString += "<b>Stealth</b> DC " + String(itemData.stealth.dc) + " " + clean_description(itemData.stealth.details, true, true, true, additionalData) + "<br />";

		HTMLString += "<b>Description</b> " + clean_description(itemData.description, true, true, true, additionalData) + "<br />";
		HTMLString += "<hr />";

		HTMLString += "<b>Disable</b> " + clean_description(itemData.disable, true, true, true, additionalData) + "<br />";
	} catch (e) {
		MapTool.chat.broadcast("Error in build_hazard_view during basic-step");
		MapTool.chat.broadcast("itemName: " + itemName);
		MapTool.chat.broadcast("tokenID: " + String(tokenID));
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	for (var pSkill in itemData.passiveSkills) {
		let skillData = itemData.passiveSkills[pSkill];
		HTMLString += "<b>" + skillData.mainText + "</b> ";
		if (skillData.traits.length > 0) {
			HTMLString += " (" + skillData.traits.join(", ") + ") ";
		}
		HTMLString += skillData.subText + "<br />";
	}
	if (itemData.maxHP > 0) {
		HTMLString += "<b>AC</b> " + itemData.ac;
	}
	if (itemData.saves.fortitude > 0) {
		HTMLString += ", <b>Fort</b> " + itemData.saves.fortitude;
	} if (itemData.saves.reflex > 0) {
		HTMLString += ", <b>Fort</b> " + itemData.saves.reflex;
	} if (itemData.saves.will > 0) {
		HTMLString += ", <b>Fort</b> " + itemData.saves.will;
	}
	HTMLString += "<br />";

	if (itemData.hardness > 0) {
		HTMLString += "<b>Hardness</b> " + String(itemData.hardness) + ", ";
	}
	if (itemData.maxHP > 0) {
		HTMLString += "<b>HP</b> " + String(itemData.maxHP) + " (BT " + String(itemData.maxHP / 2) + ")";
	}

	if (itemData.immunities.length > 0) {
		itemData.immunities.sort((a, b) => {
			let testA = a.type.toUpperCase();
			let testB = b.type.toUpperCase();
			if (testA < testB) {
				return -1;
			}
			if (testA > testB) {
				return 1;
			}
		});
		HTMLString += "; <b>Immunities</b> ";
		let immunityString = ""
		for (var imm in itemData.immunities) {
			immunityString = immunityString + itemData.immunities[imm].type + ", ";
		}
		HTMLString += immunityString.substring(0, immunityString.length - 2);
	}

	if (itemData.weaknesses.length > 0) {
		if (itemData.immunities.length > 0) {
			HTMLString += ",";
		}
		HTMLString += " <b>Weaknesses</b> ";
		let weaknessStrings = [];
		for (var w in itemData.weaknesses) {
			let weaknessData = itemData.weaknesses[w];
			weaknessStrings.push(weaknessData.type + " " + String(weaknessData.value));
		}
		HTMLString += weaknessStrings.join(", ");
	}
	HTMLString += "<br />";

	try {
		for (var feat in itemData.features) {
			let featData = itemData.features[feat];
			const regex = new RegExp(featData.name.replaceAll("(", "\\(").replaceAll(")", "\\)"), "gmi");
			if (!(regex.test(HTMLString))) {
				//MapTool.chat.broadcast(JSON.stringify(featData));
				let iconLookup = featData.system.actionType.value;
				if (featData.system.actions.value != null) {
					iconLookup = String(featData.system.actions.value) + iconLookup;
				}
				let traitText = "";
				if (featData.system.traits.value.length > 0) {
					traitText = " (" + featData.system.traits.value.join(", ") + ")";
				}
				let featString = "<b>" + featData.name + "</b>" + traitText + " " + icon_img(iconLookup, true) + " " + clean_description(featData.system.description.value);
				//MapTool.chat.broadcast(featString.replace("<","&lt;"));
				HTMLString += featString;
				const testPattern = /<\/ul>$/
				if (!(testPattern.test(featString))) {
					HTMLString += "<br />";
				}
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_hazard_view during features");
		MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	HTMLString += "<hr/>";
	if (itemData.routine != "") {
		HTMLString += "<b>Routine</b> " + clean_description(itemData.routine, true, true, true);
		HTMLString += "<hr />"
	}
	if (itemData.reset != "") {
		HTMLString += "<b>Reset</b> " + clean_description(itemData.reset, true, true, true);
	}



	//MapTool.chat.broadcast(HTMLString.replaceAll("<","&lt;"));
	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_hazard_view", build_hazard_view);