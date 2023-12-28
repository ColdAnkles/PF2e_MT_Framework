"use strict";

function roll_dice(diceString){
	MTScript.setVariable("diceString",diceString);
	MTScript.evalMacro("[h: diceResult=eval(diceString)]");
	let result = MTScript.getVariable("diceResult");
	return result;
}

MTScript.registerMacro("ca.pf2e.roll_dice", roll_dice);