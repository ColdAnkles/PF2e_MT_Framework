"use strict";

function is_pc(tokenID) {

	if (typeof (tokenID) != "string") {
		tokenID = tokenID.getId();
	}

	MTScript.setVariable("tokenID", tokenID);
	MTScript.evalMacro("[h: ans=isPC(tokenID)]");
	let response = Number(MTScript.getVariable("ans"));
	response = (response == 1)
	return response;
}
