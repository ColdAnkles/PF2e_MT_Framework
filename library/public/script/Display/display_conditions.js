"use strict";

function display_conditions(token){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	let outputString = ""
	
	let tokenConditions = JSON.parse(token.getProperty("conditionDetails"));

	var sorted = [];
	for(var key in tokenConditions) {
	    sorted[sorted.length] = key;
	}
	sorted.sort();

	let counter = 0;
	for (var c in sorted){
		let separator = ", ";
		if ((counter+1)%3==0){
			separator = " \n";
		}
		let conditionData = tokenConditions[sorted[c]];
		outputString = outputString + sorted[c];
		if(conditionData.value.isValued){
			outputString = outputString + " " + conditionData.value.value;
		}
		outputString = outputString + separator;
		counter += 1;
	}

	outputString = outputString.substring(0,outputString.length-2);
	
	return outputString;
}

MTScript.registerMacro("ca.pf2e.display_conditions", display_conditions);