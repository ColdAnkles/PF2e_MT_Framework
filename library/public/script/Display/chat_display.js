"use strict";

function chat_display(displayData, broadcast = true, additionalData = { "rollDice": false }) {
	//MapTool.chat.broadcast(JSON.stringify(displayData));

	let traitGlossary = JSON.parse(read_data("pf2e_glossary")).PF2E;
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	additionalData.invertImages = false;

	let outputText = "<div style='padding:2px 5px 5px 5px; background-color:black;width:500px'>";
	outputText = outputText + "<table style='width:100%;padding: 4px 0px;'><tr height=20px style='background-color: " + themeData.colours.titleBackground + ";'><td><h1 style='color: " + themeData.colours.titleText + ";line-height: 1em;vertical-align: middle;font-variant: small-caps;'>";

	try {
		if ("actions" in displayData.system && "actionType" in displayData.system) {
			let imgString = ""
			if (displayData.system.actions.value != null) {
				imgString = icon_img(String(displayData.system.actions.value) + displayData.system.actionType.value, themeData.icons == "W");
			} else {
				imgString = icon_img(displayData.system.actionType.value, themeData.icons == "W");
			}
			if (!imgString.includes("NO IMAGE")) {
				outputText = outputText + imgString + "&nbsp;";
			} else {
				outputText = outputText + "&nbsp;";
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during action icon setup");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	outputText = outputText + displayData.name.replaceAll("Lib:", "") + "</h1></td>";

	try {
		if ("level" in displayData.system) {
			if ("castLevel" in displayData.system && displayData.system.castLevel.value != displayData.system.level.value) {
				displayData.system.level.value = displayData.system.level.value + " (" + displayData.system.castLevel.value + ")";
			}
			outputText = outputText + "<td style='text-align:right'><h1 style='color: " + themeData.colours.titleText + ";line-height: 1em;vertical-align: middle;font-variant: small-caps;'>" + capitalise(displayData.type) + " " + displayData.system.level.value + "</h1></td>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during level display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	outputText = outputText + "</tr></table>";

	try {
		if ("traits" in displayData.system && "value" in displayData.system.traits && displayData.system.traits.value.length > 0) {
			outputText = outputText + "<table border='0', bgcolor='" + themeData.colours.traitOuter + "', style='font-size:13pt;font-family:Century Gothic;font-weight:bold;border-spacing:0px'>";
			for (var t in displayData.system.traits.value) {
				let traitName = displayData.system.traits.value[t];
				let traitNormal = capitalise(traitName).split('-')[0];
				if ("traitDescription" + traitNormal in traitGlossary && traitGlossary["traitDescription" + traitNormal] != null) {
					outputText = outputText + "<td style='border:2px solid " + themeData.colours.traitInner + ";'><font color='" + themeData.colours.traitText + "'><span title=\"" + traitGlossary["traitDescription" + traitNormal] + "\">" + all_caps(traitName).replaceAll("-", " ") + "</span></font></td>";
				} else {
					outputText = outputText + "<td style='border:2px solid " + themeData.colours.traitInner + ";'><font color='" + themeData.colours.traitText + "'>" + all_caps(traitName).replaceAll("-", " ") + "</font></td>";
				}
			}
			outputText = outputText + "</table>"
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during trait display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	let gmOutputText = outputText;

	try {
		if (displayData.system.description.value != null && displayData.system.description.value != "") {
			additionalData.gm = false;
			additionalData.replaceGMRolls = false;
			let normalDesc = clean_description(displayData.system.description.value, false, false, false, additionalData);
			additionalData.gm = true;
			let gmDesc = clean_description(normalDesc, false, false, false, additionalData)
			additionalData.gm = false;
			additionalData.replaceGMRolls = true;
			normalDesc = clean_description(normalDesc, false, false, false, additionalData);
			outputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'>" + normalDesc + "</div>";
			gmOutputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'>" + gmDesc + "</div>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during description display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("appliedEffects" in displayData.system && displayData.system.appliedEffects != null && displayData.system.appliedEffects.length > 0) {
			outputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Applied Effects</i><br />" + displayData.system.appliedEffects.join(", ") + "</div>";
			gmOutputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Applied Effects</i><br />" + displayData.system.appliedEffects.join(", ") + "</div>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during applied effect display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("runes" in displayData.system && displayData.system.runes != null && displayData.system.runes.length > 0) {
			let runeStrings = [];
			for (var r in displayData.system.runes) {
				runeStrings.push(
					create_macroLink(displayData.system.runes[r], "Item_View_Frame@Lib:ca.pf2e", { "itemType": "item", "itemName": displayData.system.runes[r] }));
			}
			outputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Item Runes</i><br />" + runeStrings.join(", ") + "</div>";
			gmOutputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Item Runes</i><br />" + runeStrings.join(", ") + "</div>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during rune display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("materials" in displayData.system && displayData.system.materials != null && displayData.system.materials.length > 0) {
			let materialStrings = [];
			for (var r in displayData.system.materials) {
				materialStrings.push(capitalise(displayData.system.materials[r]));
			}
			outputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Material</i><br />" + materialStrings.join(", ") + "</div>";
			gmOutputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Material</i><br />" + materialStrings.join(", ") + "</div>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during material display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if ("remasterFrom" in displayData.system && displayData.system.remasterFrom != null && displayData.system.remasterFrom != "") {
			outputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Remastered From</i><br />" + displayData.system.remasterFrom + "</div>";
			gmOutputText += "<div style='margin:0px;padding:3px; background-color:" + themeData.colours.standardBackground + "; color:" + themeData.colours.standardText + "'><i>Remastered From</i><br />" + displayData.system.remasterFrom + "</div>";
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in chat_display during remaster-from display");
		MapTool.chat.broadcast("displayData: " + JSON.stringify(displayData));
		MapTool.chat.broadcast("broadcast: " + String(broadcast));
		MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData) + ")");
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	outputText += "</div>";
	gmOutputText += "</div>";

	//MapTool.chat.broadcast(outputText.replaceAll("<","&lt;"));

	if (!("gmOnly" in displayData.system)) {
		displayData.system.gmOnly = false;
	}

	if (broadcast) {
		if (!(displayData.system.gmOnly)) {
			MapTool.chat.broadcastTo(["not-gm"], outputText);
		}
		MapTool.chat.broadcastTo(["gm"], gmOutputText);
	} else {
		return "<html>" + outputText + "</html>";
	}
}

MTScript.registerMacro("ca.pf2e.chat_display", chat_display);