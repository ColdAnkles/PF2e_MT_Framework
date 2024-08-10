"use strict";

function is_pc(tokenID) {
	var tokenMap = null
	if (typeof (tokenID) != "string") {
		tokenMap = tokenID.getMapName();
		tokenID = tokenID.getId();
	}else{
		tokenMap = MapTool.tokens.getTokenByID(tokenID).getMapName();
	}

	MTScript.setVariable("tokenID", tokenID);
	MTScript.setVariable("tokenMap", tokenMap);
	MTScript.evalMacro("[h: ans=isPC(tokenID, tokenMap)]");
	let response = Number(MTScript.getVariable("ans"));
	response = (response == 1)
	return response;
}
