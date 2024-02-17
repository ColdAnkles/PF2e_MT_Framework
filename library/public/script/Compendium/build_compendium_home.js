"use strict";

function build_compendium_home() {
	MTScript.evalMacro("[h: playerData=player.getInfo()]");
	let isGM = JSON.parse(MTScript.getVariable("playerData")).role == "GM";

	let HTMLString = "";

	HTMLString = HTMLString + "</p><h2>Characters</h2><p>";

	let pcList = find_pc_libs();
	for (var pc in pcList) {
		let pcName = pcList[pc].getName().replace("Lib:", "");
		let isPet = JSON.stringify(pcList[pc].getProperty("traits")).includes("minion");
		HTMLString = HTMLString + "<b>" + create_macroLink(pcName, "Creature_View_Frame@Lib:ca.pf2e", JSON.stringify({ "name": pcName, "tokenID": pcList[pc].getId() })) + ((isPet)?"":"</b> <span style='font-size:10px'>" + create_macroLink("Reimport", "Import_Pathbuilder_PC@Lib:ca.pf2e", pcList[pc].getId()) + "</span>") + "<br />";
	}
	HTMLString = HTMLString + create_macroLink("Import from Pathbuilder", "Import_Pathbuilder_PC@Lib:ca.pf2e", "") + "<br />";

	HTMLString = HTMLString + "<h2>" + create_macroLink("Items", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "item" })) + "</h2>";
	HTMLString = HTMLString + "<h2>" + create_macroLink("Spells", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells" })) + "</h2>";
	HTMLString = HTMLString + "<h2>" + create_macroLink("Feats", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "feat" })) + "</h2>";
	HTMLString = HTMLString + "<h2>" + create_macroLink("Actions", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "action" })) + "</h2>";

	if (isGM == 1 || isGM || isGM == "1") {
		HTMLString = HTMLString + "<h2>" + create_macroLink("Effects", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "effect" })) + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Hazards", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "hazard" })) + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Creature List", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures" })) + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Source Management", "Enabled_Sources_Window@Lib:ca.pf2e", "") + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Source Importing", "Source_Management_Window@Lib:ca.pf2e", "") + "</h2>";
	}


	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_compendium_home", build_compendium_home);