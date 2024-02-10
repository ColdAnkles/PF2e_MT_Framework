"use strict";

function flat_check(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
	let dTwenty = String(MTScript.getVariable("dTwenty"));

	chat_display({ "name": token.getName() + " attempts a flat check!", "description": "Flat Check Result: " + dTwenty }, true);

}

MTScript.registerMacro("ca.pf2e.flat_check", flat_check);