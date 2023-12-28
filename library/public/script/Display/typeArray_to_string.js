"use strict";

function typeArray_to_string(arrayList){
	//MapTool.chat.broadcast(JSON.stringify(arrayList));
	let arrayString ="";
	for (var t in arrayList){
		let separator = ", ";
		if ((t+1)%5==0){
			separator = " \n";
		}
		arrayString = arrayString + capitalize(arrayList[t].type) + separator;
	}
	arrayString = arrayString.substring(0,arrayString.length-2);
	return arrayString;
}


MTScript.registerMacro("ca.pf2e.typeArray_to_string", typeArray_to_string);