"use strict";

function parse_foundry_strings(foundryString, altBracketRegexp = false) {
	//bracketRegexp Changed Multiple times - Treat Wounds good example to test with
	let bracketRegexp = /\[+(.*?\]?)\]+/;
	if (altBracketRegexp) {
		bracketRegexp = /\[\[+(.*?)\]\]+/;
	}
	const braceRegexp = /\]\{(.*?)\}/;

	//MapTool.chat.broadcast(foundryString);

	let bracketContents = foundryString.match(bracketRegexp);
	let braceContents = foundryString.match(braceRegexp);

	if (bracketContents != null && bracketContents.length > 1) {
		bracketContents = bracketContents[1]
	}
	if (braceContents != null && braceContents.length > 1) {
		braceContents = braceContents[1]
	}
	let returnData = { "bracketContents": bracketContents, "braceContents": braceContents, "bracketDetail": {} }
	//MapTool.chat.broadcast(JSON.stringify(returnData));
	for (var d in bracketContents.split("|")) {
		let tempString = bracketContents.split("|")[d];
		let splitString = tempString.split(":")
		let key = splitString[0];
		let value = "";
		if (splitString.length > 1) {
			value = splitString.slice(1).join(":").split(',');
		} else {

		}
		returnData.bracketDetail[key] = value;
	}
	//MapTool.chat.broadcast(JSON.stringify(returnData));
	return returnData
}