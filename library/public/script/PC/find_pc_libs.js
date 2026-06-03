"use strict";

function find_pc_libs() {
	let pcList = [];
	let mapTokens = MapTool.tokens.getMapTokens("Player Characters");

	for (var t in mapTokens) {
		let testToken = mapTokens[t];
		if (testToken.isPC() && testToken.getName().includes("Lib:")) {
			pcList.push(testToken);
		}
	}

	return pcList;
}

MTScript.registerMacro("ca.pz2e.find_pc_libs", find_pc_libs);
