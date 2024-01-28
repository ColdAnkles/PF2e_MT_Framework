"use strict";

function display_active_effects(token){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	let outputString = ""
	
	let tokenEffects = JSON.parse(token.getProperty("activeEffects"));

	var sorted = [];
	for(var key in tokenEffects) {
	    sorted[sorted.length] = key;
	}
	sorted.sort();

	let counter = 0;
	for (var c in sorted){
		let separator = ", ";
		if ((counter+1)%3==0){
			separator = " \n";
		}
		outputString += sorted[c].replaceAll("Spell Effect: ","").replaceAll("Effect: ","");
		outputString += separator;
		counter += 1;
	}

	outputString = outputString.substring(0,outputString.length-2);
	
	return outputString;
}

MTScript.registerMacro("ca.pf2e.display_active_effects", display_active_effects);