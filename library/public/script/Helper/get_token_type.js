"use strict";

function get_token_type(inputToken){

	let tokenID = inputToken;
	let token = inputToken;

	if (typeof(inputToken) == "object"){
		tokenID = inputToken.getId();
	}else{
		token = MapTool.tokens.getTokenByID(tokenID);
	}

	MTScript.setVariable("tokenID",tokenID)
	if(token.getName().includes("Lib:")){
		MTScript.evalMacro("[h: tokenType = isNPC(tokenID,\"Player Characters\")]")
	}else{
		MTScript.evalMacro("[h: tokenType = isNPC(tokenID)]")
	}
	let tokenType = Number(MTScript.getVariable("tokenType"));

	if (tokenType == 0 || tokenType == "0"){
		return "PC";
	}else{
		return "NPC";
	}
	
}

MTScript.registerMacro("ca.pf2e.get_token_type", get_token_type);