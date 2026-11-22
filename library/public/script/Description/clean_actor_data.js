"use strict";

function clean_actor_data(actorString, actor) {
	let splitString = actorString.split(".")
	//MapTool.chat.broadcast(JSON.stringify(splitString));
	let returnValue = actorString;

	if (splitString[1] == "level") {
		returnValue = String(actor.getProperty("level"));
	} else if (splitString[1] == "abilities") {
		if (splitString[3] != null && splitString[3] == "mod") {
			returnValue = String(actor.getProperty(splitString[2]));
		}
	} else if (splitString[1] == "skills") {
		let prof = calculate_proficiency(splitString[2], actor, null);
		if (splitString[3] != null && splitString[3] == "rank") {
			returnValue = String(prof);
		}
	}
	//MapTool.chat.broadcast(returnValue);
	return returnValue;
}