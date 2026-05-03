"use strict";

function disable_regeneration(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let actorData = JSON.parse(token.getProperty("foundryActor"));
	actorData.regen = false;
	token.setProperty("foundryActor", JSON.stringify(actorData));

}

MTScript.registerMacro("ca.pz2e.disable_regeneration", disable_regeneration);

function enable_regeneration(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let actorData = JSON.parse(token.getProperty("foundryActor"));
	actorData.regen = true;
	token.setProperty("foundryActor", JSON.stringify(actorData));

}

MTScript.registerMacro("ca.pz2e.enable_regeneration", enable_regeneration);