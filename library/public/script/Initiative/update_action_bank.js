"use strict";

function update_action_bank(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let actionCount = Number(token.getProperty("actionsLeft"));
	let reactionCount = Number(token.getProperty("reactionsLeft"));

	for (var i in [0, 1, 2, 3, 4, 5]) {
		if (i == actionCount && i != 0) {
			set_state("ActionsLeft_" + String(i), true, token.getId());
		} else if (i != 0) {
			set_state("ActionsLeft_" + String(i), false, token.getId());
		}
	}

	if (reactionCount >= 1) {
		set_state("Reaction", true, token.getId());
	} else {
		set_state("Reaction", false, token.getId());
	}


	let attacksThisRound = Number(token.getProperty("attacksThisRound"));
	let MAPState = "MAP_" + String((attacksThisRound > 3) ? "3" : attacksThisRound);
	set_state("MAP_1", false, token.getId());
	set_state("MAP_2", false, token.getId());
	set_state("MAP_3", false, token.getId());
	set_state(MAPState, true, token.getId());
}