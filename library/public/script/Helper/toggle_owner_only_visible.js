"use strict";

function toggle_owner_only_visible(token) {
	if (typeof (token) != "string") {
		token = token.getId();
	}
	if (token.isPC()) {
		return; //getOwnerOnlyVisible errors since no map argument, therefore ignore for PCs
	}
	MTScript.setVariable("tokenID", token);
	MTScript.evalMacro("[h: currentVisibility = getOwnerOnlyVisible(tokenID)]");
	let currentVisibility = Number(MTScript.getVariable("currentVisibility"));
	if (currentVisibility == 1) {
		MTScript.evalMacro("[h: setOwnerOnlyVisible(0, tokenID)]");
	} else {
		MTScript.evalMacro("[h: setOwnerOnlyVisible(1, tokenID)]");
	}
}
