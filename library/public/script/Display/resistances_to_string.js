"use strict";

function resistances_to_string(resistancesList){
	//MapTool.chat.broadcast(JSON.stringify(resistancesList));
	let resistancesString ="";
	for (var t in resistancesList){
		resistancesString = resistancesString + capitalise(resistancesList[t].type)+ " " + resistancesList[t].value + ", ";
	}
	resistancesString = resistancesString.substring(0,resistancesString.length-2);
	return resistancesString;
}


MTScript.registerMacro("ca.pf2e.resistances_to_string", resistances_to_string);