"use strict";

function update_pc_token(sourceTokenID, tokenID) {
	let PCData = read_creature_properties(sourceTokenID);

	let token = MapTool.tokens.getTokenByID(tokenID);

	let tokenName = token.getName();

	write_creature_properties(PCData, tokenID);

	token.setName(tokenName);

}

MTScript.registerMacro("ca.pf2e.update_pc_token", update_pc_token);