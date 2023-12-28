"use strict";

function array_to_string(arrayList){
	//MapTool.chat.broadcast(JSON.stringify(arrayList));
	let arrayString ="";
	for (var t in arrayList){
		arrayString = arrayString + capitalize(arrayList[t]) + ", ";
	}
	arrayString = arrayString.substring(0,arrayString.length-2);
	return arrayString;
}


MTScript.registerMacro("ca.pf2e.array_to_string", array_to_string);