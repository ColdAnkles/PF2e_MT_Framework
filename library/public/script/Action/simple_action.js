"use strict";

function simple_action(actionName, actingToken){
	actingToken = MapTool.tokens.getTokenByID(actingToken);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_action"));
	let property = JSON.parse(read_data("pf2e_action"));
	let actionData = property[actionName];

	if (actionData == null){
		MapTool.chat.broadcast("Cannot find action: " + actionName);
		return;
	}

	if ("fileURL" in actionData){
		actionData = parse_feature(rest_call(actionData["fileURL"],""));
	}

	core_action(actionData, actingToken)

}

MTScript.registerMacro("ca.pf2e.simple_action", simple_action);