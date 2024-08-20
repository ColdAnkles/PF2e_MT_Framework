"use strict";

function build_credits() {
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

	let HTMLString = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'>";

	HTMLString += "<h1 style='padding-bottom:0px;margin-bottom:8px'>Credits</h1>";
	HTMLString += "<body>";

	HTMLString = HTMLString + "<h2>Foundry VTT PF2e</h2><p>The most excellent work done creating all the data used in this framework.<br /><i>https://github.com/foundryvtt/pf2e</i></p>";
	HTMLString = HTMLString + "<h2>Game-Icons.net</h2><p>For the icons used within this framework.<br /><i>https://game-icons.net/about.html#authors</i></p>";
	HTMLString = HTMLString + "<h2>MapTool PF2e Framework</h2><p>And all contributors to this framework.<br /><i>https://github.com/ColdAnkles/PF2e_MT_Framework</i></p>";

	HTMLString += "</body></html>";

	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_credits", build_credits);