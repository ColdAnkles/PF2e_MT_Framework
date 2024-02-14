"use strict";

function add_common_action_macros(tokenID) {
	add_action_to_token({ "name": "Stride", "type": "basic", "group": "Movement" }, tokenID);
	add_action_to_token({ "name": "Climb", "type": "basic", "group": "Movement" }, tokenID);
	add_action_to_token({ "name": "Stand", "type": "basic", "group": "Movement" }, tokenID);
	add_action_to_token({ "name": "Tumble Through", "type": "basic", "group": "Movement" }, tokenID);

}

MTScript.registerMacro("ca.pf2e.add_common_action_macros", add_common_action_macros);