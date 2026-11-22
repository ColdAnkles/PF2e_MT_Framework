"use strict";

function clean_calculations(calculationString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true }) {
	//MapTool.chat.broadcast(calculationString);
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
	if (calculationString.includes("@level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@level", String(additionalData.level));
	} else if (calculationString.includes("@item.level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@item.level", String(additionalData.level));
	} else if (calculationString.includes("@item.rank") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@item.rank", String(additionalData.level));
	} else if (calculationString.includes("@actor.level") && "level" in additionalData) {
		calculationString = calculationString.replaceAll("@actor.level", String(additionalData.level));
	}
	let completedCalculation = eval(calculationString)
	return String(completedCalculation);
}