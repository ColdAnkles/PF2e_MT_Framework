"use strict";

function create_pc_token(newPCTokenID, pcLibID) {

	let pcData = read_creature_properties(pcLibID);
	let pcToken = MapTool.tokens.getTokenByID(pcLibID);

	if ("simple" in pcData.foundryActor && pcData.foundryActor.simple) {
		add_common_macros(newPCTokenID, true);
	} else {

		//__ADDING_STANDARD_MACROS
		add_common_macros(newPCTokenID);

		//__ADDING_ACTION_MACROS__
		add_common_action_macros(newPCTokenID);

		//__ADD MACROS SPECIFIC TO THIS PC__
		add_pc_macros(newPCTokenID, pcLibID);
	}

	update_my_tokens(pcLibID);

	let pcStates = pcToken.getActiveStates();
	for (var s in pcStates) {
		set_state(pcStates[s], true, newPCTokenID);
	}
}

MTScript.registerMacro("ca.pf2e.create_pc_token", create_pc_token);
