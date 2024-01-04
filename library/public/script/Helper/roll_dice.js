"use strict";

function roll_dice(diceString){
	if(diceString=="" || diceString==null){
		return "";
	}
	MTScript.setVariable("diceString",diceString);
	MTScript.evalMacro("[h: diceResult=eval(string(diceString))]");
	let result = MTScript.getVariable("diceResult");
	return result;
}

MTScript.registerMacro("ca.pf2e.roll_dice", roll_dice);