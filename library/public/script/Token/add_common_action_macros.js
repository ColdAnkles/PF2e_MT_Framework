"use strict";

function add_common_action_macros(tokenID) {
	add_action_to_token({ "name": "Stride", "source": "Pathfinder Player Core", "type": "basic", "system": { "group": "1.5 Movement", "description": { "value": "" } } }, tokenID);
	add_action_to_token({ "name": "Climb", "source": "Pathfinder Player Core", "type": "basic", "system": { "group": "1.5 Movement", "description": { "value": "" } } }, tokenID);
	add_action_to_token({ "name": "Stand", "source": "Pathfinder Player Core", "type": "basic", "system": { "group": "1.5 Movement", "description": { "value": "" } } }, tokenID);
	add_action_to_token({ "name": "Tumble Through", "source": "Pathfinder Player Core", "type": "basic", "system": { "group": "1.5 Movement", "description": { "value": "" } } }, tokenID);

}

MTScript.registerMacro("ca.pf2e.add_common_action_macros", add_common_action_macros);