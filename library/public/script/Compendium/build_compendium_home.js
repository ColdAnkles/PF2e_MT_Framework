"use strict";

function build_compendium_home() {
	MTScript.evalMacro("[h: playerData=player.getInfo()]");
	let isGM = JSON.parse(MTScript.getVariable("playerData")).role == "GM";
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	let HTMLString = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/"+themeData.css+"'>";

	HTMLString += "<h1 style='padding-bottom:0px;margin-bottom:8px'>";
	HTMLString += "<img src="+icon_img("compendium", themeData.icons=="W", true)+" style='width:40;height:40;'/>&nbsp";
	HTMLString += create_macroLink("<font size=6>Compendium</font>","Compendium_Home@Lib:ca.pf2e","") + "</h1>";

	HTMLString += "</p><h3>Characters</h2><p>";

	HTMLString += "<body>";

	let pcList = find_pc_libs();
	for (var pc in pcList) {
		let pcName = pcList[pc].getName().replace("Lib:", "");
		let isPet = JSON.stringify(pcList[pc].getProperty("traits")).includes("minion");
		HTMLString += "<b>" + create_macroLink(pcName, "Creature_View_Frame@Lib:ca.pf2e", JSON.stringify({ "name": pcName, "tokenID": pcList[pc].getId() })) + "</b>" + ((isPet) ? "" : " <span style='font-size:10px'>" + create_macroLink("Reimport", "Import_Pathbuilder_PC@Lib:ca.pf2e", pcList[pc].getId()) + "</span>") + "<br />";
	}
	HTMLString += "<u>" + create_macroLink("Import from Pathbuilder", "Import_Pathbuilder_PC@Lib:ca.pf2e", "") + "</u><br />";
	HTMLString += "<u>" + create_macroLink("Create Simple Token", "Create_Simple_PC@Lib:ca.pf2e", "") + "</u><br />";

	HTMLString += "<h3>" + create_macroLink("Items", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "item" })) + "</h2>";
	HTMLString += "<h3>" + create_macroLink("Spells", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells" })) + "</h2>";
	HTMLString += "<h3>" + create_macroLink("Feats", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "feat" })) + "</h2>";
	HTMLString += "<h3>" + create_macroLink("Actions", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "action" })) + "</h2>";

	if (isGM == 1 || isGM || isGM == "1") {
		HTMLString += "<h2>GM Tools</h2>";
		HTMLString += "<h3>" + create_macroLink("Effects", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "effect" })) + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Hazards", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "hazard" })) + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Creature List", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures" })) + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Source Management", "Enabled_Sources_Window@Lib:ca.pf2e", "") + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Custom Content", "Custom_Content_Window@Lib:ca.pf2e", "") + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Source Importing", "Source_Management_Window@Lib:ca.pf2e", "") + "</h2>";
		HTMLString += "<h3>" + create_macroLink("Change Theme", "Change_Theme@Lib:ca.pf2e", "") + "</h2>";
	}

	HTMLString += "<h3>" + create_macroLink("Credits", "Credits@Lib:ca.pf2e", "") + "</h2>";

	HTMLString+= "</body></html>";

	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_compendium_home", build_compendium_home);