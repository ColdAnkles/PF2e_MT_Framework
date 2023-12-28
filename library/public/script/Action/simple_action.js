"use strict";

function simple_action(actionName, actingToken){
	actingToken = MapTool.tokens.getTokenByID(actingToken);
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_action"));
	let actionData = property[actionName];

	if (actionData == null){
		MapTool.chat.broadcast("Cannot find action: " + actionName);
		return;
	}

	core_action(actionData, actingToken)

}

MTScript.registerMacro("ca.pf2e.simple_action", simple_action);