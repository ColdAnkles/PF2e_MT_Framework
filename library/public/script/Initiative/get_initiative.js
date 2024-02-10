"use strict";

function get_initiative(tokenID) {
	MTScript.setVariable("tokenID", tokenID);
	MTScript.evalMacro("[h: init = getInitiative(tokenID)]");
	return Number(MTScript.getVariable("init"));
}