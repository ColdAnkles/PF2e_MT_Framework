"use strict";

function build_spell_view(spellName) {
	//MapTool.chat.broadcast(spellName);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).PF2E;
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	if (!(spellName in property)) {
		let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
		if (!spellName in remasterChanges) {
			return "<h2>Could not find spell " + spellName + "</h2>";
		} else {
			if (remasterChanges[spellName] in property) {
				spellName = remasterChanges[spellName];
			} else {
				return "<h2>Could not find spell " + remasterChanges[spellName] + "</h2>";
			}
		}
	}

	let spellData = property[spellName];
	let spellBaseName = spellData.baseName;
	if ("fileURL" in spellData) {
		spellData = rest_call(spellData["fileURL"], "");
	}

	//spellData = parse_spell(spellBaseName, spellData);

	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let HTMLString = "";

	let spellCategory = "spell";

	if (spellData.system.traits.value.includes("cantrip")) {
		spellCategory = "cantrip";
	} else if (spellData.system.traits.value.includes("focus")) {
		spellCategory = "focus";
	}

	HTMLString += "<h1 class='title'><span>" + spellData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(spellCategory) + " " + spellData.system.level.value + "</span></h1>";

	try {
		if (spellData.system.traits.rarity != "common") {
			let normalRarity = capitalise(spellData.system.traits.rarity).split('-')[0];
			if ("traitDescription" + normalRarity in traitGlossary && traitGlossary["traitDescription" + normalRarity] != null) {
				HTMLString += "<span class='trait" + spellData.system.traits.rarity + "' title=\"" + traitGlossary["traitDescription" + normalRarity] + "\">" + capitalise(spellData.system.traits.rarity) + "</span>";
			} else {
				HTMLString += "<span class='trait" + spellData.system.traits.rarity + "'>" + capitalise(spellData.system.traits.rarity) + "</span>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during rarity-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	try {
		for (var t in spellData.system.traits.value) {
			let traitName = spellData.system.traits.value[t];
			let traitNormal = capitalise(traitName).split('-')[0];
			if ("traitDescription" + traitNormal in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
				HTMLString += "<span class='trait' title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + capitalise(traitName) + "</span>";
			} else {
				HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during traits-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	HTMLString += "<br />"
	try {
		HTMLString += "<b>Source </b><span class='ext-link'>" + spellData.system.publication.title + "</span><br />";
		if (spellData.system.traits.traditions.length > 0) {
			HTMLString += "<b>Traditions</b> " + capitalise(spellData.system.traits.traditions.join(", "));
			HTMLString += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during traditions-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		HTMLString += "<b>Cast</b> ";
		if (!isNaN(spellData.system.time.value)) {
			HTMLString += icon_img(spellData.system.time.value + "action", themeData.icons == "W");
		} else if (spellData.system.time.value.includes("to")) {
			let first = spellData.system.time.value.split(" to ")[0];
			let second = spellData.system.time.value.split(" to ")[1];
			if (isNaN(second)) {
				HTMLString += icon_img(first + "action", themeData.icons == "W") + " to " + second;
			} else {
				HTMLString += icon_img(first + "action", themeData.icons == "W") + " to " + icon_img(second + "action", themeData.icons == "W") + " ";
			}
		} else if (spellData.system.time.value == "reaction") {
			HTMLString += icon_img("reaction", themeData.icons == "W");
		} else {
			HTMLString += spellData.system.time.value;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during time-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("components" in spellData.system) {
			let components = [];
			for (var k in spellData.system.components) {
				if (spellData.system.components[k]) {
					components.push(k);
				}
			}
			HTMLString += " " + components.join(", ") + "<br />";
		} else {
			HTMLString += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during components-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (spellData.system.area != null) {
			HTMLString += "<b>Area</b> " + spellData.system.area.details + "; <b>Targets</b> " + spellData.system.target.value + "<br />";
		} else if (spellData.system.range.value != null && spellData.system.range.value != "") {
			HTMLString += "<b>Range</b> " + spellData.system.range.value + "; <b>Targets</b> " + spellData.system.target.value + "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during area-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (spellData.system.spellType == "save" && spellData.system.save.statistic != "") {
			HTMLString += "<b>Saving Throw</b> ";
			if (spellData.system.save.basic) {
				HTMLString += "basic ";
			}
			HTMLString += capitalise(spellData.system.save.statistic);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during save-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let hasDuration = spellData.system.duration != null && spellData.system.duration != "" && spellData.system.duration.value != "" && spellData.system.duration.value != null;

	try {
		if (spellData.system.spellType == "save" && spellData.system.save.statistic != "" && hasDuration) {
			HTMLString += "; ";
		} else if (spellData.system.spellType == "save" && spellData.system.save.statistic != "") {
			HTMLString += "<br />";
		}
		if (hasDuration) {
			HTMLString += "<b>Duration</b> " + spellData.system.duration.value;
			HTMLString += "<br />";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in build_spell_view during duration-step");
		MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	HTMLString += "<hr />";

	HTMLString += clean_description(spellData.system.description.value, false, false, false, { "rollDice": false, "level": spellData.system.level.value });


	return HTMLString;

}

MTScript.registerMacro("ca.pf2e.build_spell_view", build_spell_view);