"use strict";

function find_pc_libs() {
	let pcList = [];
	let mapTokens = MapTool.tokens.getMapTokens("Player Characters");

	for (var t in mapTokens) {
		let testToken = mapTokens[t];
		//MapTool.chat.broadcast(String(testToken));
		MTScript.setVariable("tokenID", testToken.getId());
		MTScript.evalMacro("[h: ans = isPC(tokenID, \"Player Characters\")]");
		let ans = Number(MTScript.getVariable("ans"));
		//MapTool.chat.broadcast(String(ans));
		if ((ans == 1 || ans == true) && testToken.getName().includes("Lib:")) {
			pcList.push(testToken);
		}
	}

	return pcList;
}

MTScript.registerMacro("ca.pf2e.find_pc_libs", find_pc_libs);
