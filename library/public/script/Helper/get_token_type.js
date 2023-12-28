"use strict";

function get_token_type(inputToken){

	let tokenID = inputToken;

	if (typeof(inputToken) == "object"){
		tokenID = inputToken.getId();
	}

	MTScript.setVariable("tokenID",tokenID)
	MTScript.evalMacro("[h: tokenType = isNPC(tokenID)]")
	let tokenType = MTScript.getVariable("tokenType");

	if (tokenType == 0){
		return "PC";
	}else{
		return "NPC";
	}
	
}

MTScript.registerMacro("ca.pf2e.get_token_type", get_token_type);