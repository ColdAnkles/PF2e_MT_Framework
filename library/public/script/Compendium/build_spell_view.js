"use strict";

function build_spell_view(spellName) {
	//MapTool.chat.broadcast(spellName);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));
	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).traitDescriptions;

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
	if ("fileURL" in spellData) {
		spellData = rest_call(spellData["fileURL"], "");
	}

	spellData = parse_spell(spellData);

	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let HTMLString = "";

	HTMLString += "<h1 class='title'><span>" + spellData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(spellData.category) + " " + spellData.level + "</span></h1>";

	if (spellData.traits.rarity != "common") {
		let normalRarity = capitalise(spellData.traits.rarity).split('-')[0];
		if (normalRarity in traitGlossary && traitGlossary[normalRarity] != null) {
			HTMLString += "<span class='trait" + spellData.traits.rarity + "' title=\"" + traitGlossary[normalRarity] + "\">" + capitalise(spellData.traits.rarity) + "</span>";
		} else {
			HTMLString += "<span class='trait" + spellData.traits.rarity + "'>" + capitalise(spellData.traits.rarity) + "</span>";
		}
	}
	for (var t in spellData.traits.value) {
		let traitName = spellData.traits.value[t];
		let traitNormal = capitalise(traitName).split('-')[0];
		if (traitNormal in traitGlossary && traitGlossary[traitNormal] != null) {
			HTMLString += "<span class='trait' title=\"" + traitGlossary[traitNormal] + "\">" + capitalise(traitName) + "</span>";
		} else {
			HTMLString += "<span class='trait'>" + capitalise(traitName) + "</span>";
		}
	}
	HTMLString += "<br />"
	HTMLString += "<b>Source </b><span class='ext-link'>" + spellData.publication.title + "</span><br />";
	if (spellData.traits.traditions.length > 0) {
		HTMLString += "<b>Traditions</b> " + capitalise(spellData.traits.traditions.join(", "));
		HTMLString += "<br />";
	}

	HTMLString += "<b>Cast</b> ";
	if (!isNaN(spellData.time)) {
		HTMLString += icon_img(spellData.time + "action", true);
	} else if (spellData.time.includes("to")) {
		let first = spellData.time.split(" to ")[0];
		let second = spellData.time.split(" to ")[1];
		if (isNaN(second)) {
			HTMLString += icon_img(first + "action", true) + " to " + second;
		} else {
			HTMLString += icon_img(first + "action", true) + " to " + icon_img(second + "action");
		}
	} else if (spellData.time == "reaction") {
		HTMLString += icon_img("reaction", true);
	} else {
		HTMLString += spellData.time;
	}

	let components = [];
	for (var k in spellData.components) {
		if (spellData.components[k]) {
			components.push(k);
		}
	}
	HTMLString += " " + components.join(", ") + "<br />";

	if (spellData.area != null) {
		HTMLString += "<b>Area</b> " + spellData.area.details + "; <b>Targets</b> " + spellData.target + "<br />";
	} else if (spellData.range != null && spellData.range != "") {
		HTMLString += "<b>Range</b> " + spellData.range + "; <b>Targets</b> " + spellData.target + "<br />";
	}

	if (spellData.spellType == "save" && spellData.save.value != "") {
		HTMLString += "<b>Saving Throw</b> ";
		if (spellData.save.basic) {
			HTMLString += "basic ";
		}
		HTMLString += capitalise(spellData.save.statistic);
	}
	let hasDuration = spellData.duration != null && spellData.duration != "" && spellData.duration.value != "" && spellData.duration.value != null;
	if (spellData.spellType == "save" && spellData.save.statistic != "" && hasDuration) {
		HTMLString += "; ";
	} else if (spellData.spellType == "save" && spellData.save.statistic != "") {
		HTMLString += "<br />";
	}
	if (hasDuration) {
		HTMLString += "<b>Duration</b> " + spellData.duration.value;
		HTMLString += "<br />";
	}

	HTMLString += "<hr />";

	HTMLString += clean_description(spellData.description, false, false, false, { "rollDice": false, "level": spellData.level });


	return HTMLString;

}

MTScript.registerMacro("ca.pf2e.build_spell_view", build_spell_view);