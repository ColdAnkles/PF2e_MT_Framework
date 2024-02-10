"use strict";

function speed_to_string(speedList) {
	let result = [];
	for (var s in speedList) {
		//MapTool.chat.broadcast(JSON.stringify(speedList[s]));
		result.push(speedList[s].type + " " + speedList[s].value + " ft");
	}
	//MapTool.chat.broadcast(JSON.stringify(result));
	let newString = "";
	if (result.length > 0) {
		newString = ", ";
	}
	newString = newString + result.join(", ");
	return newString;
}


MTScript.registerMacro("ca.pf2e.speed_to_string", speed_to_string);