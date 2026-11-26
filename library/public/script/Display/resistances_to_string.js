"use strict";

function resistances_to_string(resistancesList) {
	//MapTool.chat.broadcast(JSON.stringify(resistancesList));
	let resistancesStringList = [];
	for (var t in resistancesList) {
		resistancesStringList.push(capitalise(resistancesList[t].type) + " " + resistancesList[t].value + (("exceptions" in resistancesList[t] && resistancesList[t].exceptions.length > 0) ? " (Except " + capitalise(resistancesList[t].exceptions.join(", ")) + ")" : ""));
	}
	return resistancesStringList.join(", ");
}


MTScript.registerMacro("ca.pz2e.resistances_to_string", resistances_to_string);