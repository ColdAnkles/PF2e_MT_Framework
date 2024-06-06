"use strict";

function simple_action(actionName, actingToken) {
	actingToken = MapTool.tokens.getTokenByID(actingToken);
	let property = JSON.parse(read_data("pf2e_action"));
	let actionData = property[actionName];

	if (actionData == null) {
		MapTool.chat.broadcast("Cannot find action: " + actionName);
		return;
	}

	if ("fileURL" in actionData) {
		actionData = rest_call(actionData["fileURL"], "");
	}

	actionData.spendAction = true;

	//MapTool.chat.broadcast(JSON.stringify(actionData));

	core_action(actionData, actingToken)

}

MTScript.registerMacro("ca.pf2e.simple_action", simple_action);