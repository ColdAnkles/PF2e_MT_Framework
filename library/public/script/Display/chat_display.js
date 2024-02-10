"use strict";

function chat_display(displayData, broadcast = true, additionalData = { "rollDice": false }) {
	//MapTool.chat.broadcast(JSON.stringify(displayData));

	additionalData.invertImages = false;

	let outputText = "<div style='padding:2px 5px 5px 5px; background-color:black;width:500px'>";
	outputText = outputText + "<table style='width:100%;padding: 4px 0px;'><tr height=20px style='background-color: #522e2c;'><td><h1 style='color: #cbc18f;line-height: 1em;vertical-align: middle;font-variant: small-caps;'>";

	if ("actionCost" in displayData && "actionType" in displayData) {
		let imgString = ""
		if (displayData.actionCost != null) {
			imgString = icon_img(String(displayData.actionCost) + displayData.actionType, true);
		} else {
			imgString = icon_img(displayData.actionType, true);
		}
		if (!imgString.includes("NO IMAGE")) {
			outputText = outputText + imgString + "&nbsp;";
		} else {
			outputText = outputText + "&nbsp;";
		}
	}

	outputText = outputText + displayData.name.replaceAll("Lib:", "") + "</h1></td>";

	if ("level" in displayData) {
		if ("castLevel" in displayData && displayData.castLevel != displayData.level) {
			displayData.level = displayData.level + " (" + displayData.castLevel + ")";
		}
		outputText = outputText + "<td style='text-align:right'><h1 style='color: #cbc18f;line-height: 1em;vertical-align: middle;font-variant: small-caps;'>" + capitalise(displayData.type) + " " + displayData.level + "</h1></td>";
	}

	outputText = outputText + "</tr></table>";

	if ("traits" in displayData) {
		outputText = outputText + "<table border='0', bgcolor='#5a0308', style='font-size:13pt;font-family:Century Gothic;font-weight:bold;border-spacing:0px'>";
		for (var t in displayData.traits) {
			outputText = outputText + "<td style='border:2px solid #d9c484;'><font color='white'>" + all_caps(displayData.traits[t]).replaceAll("-", " ") + "</font></td>";
		}
		outputText = outputText + "</table>"
	}

	let gmOutputText = outputText;
	if (displayData.description != null && displayData.description != "") {
		additionalData.gm = false;
		additionalData.replaceGMRolls = false;
		let normalDesc = clean_description(displayData.description, false, false, false, additionalData);
		additionalData.gm = true;
		let gmDesc = clean_description(normalDesc, false, false, false, additionalData)
		additionalData.gm = false;
		additionalData.replaceGMRolls = true;
		normalDesc = clean_description(normalDesc, false, false, false, additionalData);
		outputText += "<div style='margin:0px;padding:3px; background-color:#ffffff'>" + normalDesc + "</div>";
		gmOutputText += "<div style='margin:0px;padding:3px; background-color:#ffffff'>" + gmDesc + "</div>";
	}

	if (displayData.appliedEffects != null && displayData.appliedEffects.length > 0) {
		outputText += "<div style='margin:0px;padding:3px; background-color:#ffffff'><i>Applied Effects</i><br />" + displayData.appliedEffects.join(", ") + "</div>";
		gmOutputText += "<div style='margin:0px;padding:3px; background-color:#ffffff'><i>Applied Effects</i><br />" + displayData.appliedEffects.join(", ") + "</div>";
	}

	outputText += "</div>";
	gmOutputText += "</div>";

	//MapTool.chat.broadcast(outputText.replaceAll("<","&lt;"));

	if (broadcast) {
		MapTool.chat.broadcastTo(["not-gm"], outputText);
		MapTool.chat.broadcastTo(["gm"], gmOutputText);
	} else {
		return "<html>" + outputText + "</html>";
	}
}

MTScript.registerMacro("ca.pf2e.chat_display", chat_display);