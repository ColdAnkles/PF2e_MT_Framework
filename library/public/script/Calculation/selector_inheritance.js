"use strict";

function selector_inheritance(selector){
	let finalSelector = [].concat(selector);
	if(typeof(selector)=="string"){
		selector = [selector];
	}

	for (var e in selector){
		//MapTool.chat.broadcast(selector[e]);
		if(selector[e]=="str-based"){
			finalSelector = finalSelector.concat(["melee-attack"]);
		}
		if(selector[e]=="dex-based"){
			finalSelector = finalSelector.concat(["ac","reflex","ranged-attack"]);
		}
		if(selector[e]=="con-based"){
			finalSelector = finalSelector.concat(["fortitude"]);
		}
		if(selector[e]=="int-based"){
			finalSelector = finalSelector.concat([]);
		}
		if(selector[e]=="wis-based"){
			finalSelector = finalSelector.concat(["will"]);
		}
		if(selector[e]=="cha-based"){
			finalSelector = finalSelector.concat([]);
		}
		if(selector[e]=="perception-initiative"){
			finalSelector = finalSelector.concat(["perception","initiative"]);
		}
		if(selector[e]=="{item|flags.pf2e.rulesSelections.weapon}-damage"){
			finalSelector = finalSelector.concat(["weapon-attack"]);
		}
		if(selector[e]=="{item|flags.pf2e.rulesSelections.weapon}-attack"){
			finalSelector = finalSelector.concat(["weapon-attack"]);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(finalSelector));

	return finalSelector;
}

MTScript.registerMacro("ca.pf2e.selector_inheritance", selector_inheritance);