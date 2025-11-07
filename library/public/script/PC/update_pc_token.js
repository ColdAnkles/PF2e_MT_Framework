"use strict";

function update_pc_token(sourceTokenID, tokenID) {
	let PCData = read_creature_properties(sourceTokenID);

	let token = MapTool.tokens.getTokenByID(tokenID);

	let tokenName = token.getName();

	write_creature_properties(PCData, tokenID);

	MTScript.setVariable("token", sourceTokenID);
	MTScript.evalMacro("[h: tokenLights = getLights(\"Auras\",\"json\",token,\"Player Characters\")]")
	let sourceTokenLights = JSON.parse(MTScript.getVariable("tokenLights"));

	MTScript.setVariable("token", tokenID);
	for (var l in sourceTokenLights){
		MTScript.setVariable("lightName", sourceTokenLights[l]);
		MTScript.evalMacro("[h: setLight(\"Auras\", lightName, 1, token)]")
	}

	token.setName(tokenName);

}

MTScript.registerMacro("ca.pf2e.update_pc_token", update_pc_token);