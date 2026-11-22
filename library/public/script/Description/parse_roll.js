"use strict";

function parse_roll(rollString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true }) {
	//MapTool.chat.broadcast(rollString);
	//MapTool.chat.broadcast(JSON.stringify(additionalData));
	if (rollString.includes("/br") || rollString.includes("/gmr") || (!(rollString.substring(1, 4).includes("(")) || !(rollString.includes(")")))) {
		//MapTool.chat.broadcast("Case One");
		let parsed = parse_foundry_strings(rollString, true);
		//MapTool.chat.broadcast(JSON.stringify(parsed));
		if (parsed.braceContents != null) {
			try {
				if (additionalData.rollDice) {
					let diceMatch = parsed.braceContents.match(/([0-9+ d-]*)/g);
					//MapTool.chat.broadcast(JSON.stringify(diceMatch));
					if (diceMatch.length > 0) {
						diceMatch = diceMatch[0].replaceAll("/r ", "").replaceAll("/r", "");
						let rolledDice = roll_dice(diceMatch);
						let replaceString = "";
						if (diceMatch.includes("d") && rollString.includes("/r")) {
							replaceString = diceMatch + " (" + String(rolledDice) + ") ";
						} else if (diceMatch.includes("d") && (rollString.includes("/br") || rollString.includes("/gmr")) && !additionalData.gm) {
							if (additionalData.replaceGMRolls) {
								replaceString = diceMatch;
							} else {
								return rollString;
							}
						} else if (diceMatch.includes("d") && (rollString.includes("/br") || rollString.includes("/gmr")) && additionalData.gm) {
							replaceString = diceMatch + " (" + String(rolledDice) + ") ";
						} else {
							replaceString = diceMatch;
						}
						return parsed.braceContents.replace(diceMatch, replaceString);
					} else {
						return parsed.braceContents;
					}
				} else {
					return parsed.braceContents;
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in parse_roll during case one - brace contents");
				MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
				MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		} else {
			let diceMatch = null
			try {
				if (additionalData.rollDice) {
					diceMatch = parsed.bracketContents.matchAll(/\/r ([0-9+ d-]*)[^\[\]]*/g);
					diceMatch = diceMatch.next().value
					//MapTool.chat.broadcast(JSON.stringify(diceMatch));
					if (diceMatch.length == 2) {
						diceMatch = [diceMatch[1]]
					}
					if (diceMatch.length > 0) {
						diceMatch = diceMatch[0];
						let dice = diceMatch.replaceAll("/r ", "").replaceAll("/r", "");
						let replaceString = "";
						if (dice.includes("d") && additionalData.rollDice) {
							replaceString = String(roll_dice(dice));
						} else {
							replaceString = dice;
						}
						if (rollString.includes("#")) {
							return replaceString;
						}
						return parsed.bracketContents.replace(diceMatch, replaceString);
					} else {
						return parsed.bracketContents;
					}
				} else {
					return parsed.bracketContents.replace(/\/r ([0-9+ d-]*).*/g, "$1");
				}
			} catch (e) {
				MapTool.chat.broadcast("Error in parse_roll during case one - null brace contents");
				MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
				MapTool.chat.broadcast("diceMatch: " + diceMatch);
				MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		}
	} else {
		try {
			const rollRegexp = /\(([^[\]]*)\)/g;
			const infoRegexp = /\[([^[\]]*)\]/g;
			let rollMatch = [...rollString.matchAll(rollRegexp)];
			let infoMatch = [...rollString.matchAll(infoRegexp)];
			//MapTool.chat.broadcast("Case Two");
			//MapTool.chat.broadcast(rollString);
			//MapTool.chat.broadcast(JSON.stringify(rollMatch));
			//MapTool.chat.broadcast(JSON.stringify(infoMatch));
			if (rollMatch != null && rollMatch.length > 0) {
				rollMatch = rollMatch[rollMatch.length - 1];
			}
			if (infoMatch != null && infoMatch.length > 0) {
				infoMatch = infoMatch[infoMatch.length - 1];
			}
			if (rollMatch != null && rollMatch.length > 0) {
				rollMatch = rollMatch[rollMatch.length - 1];
			}
			if (infoMatch != null && infoMatch.length > 0) {
				infoMatch = infoMatch[infoMatch.length - 1];
			}

			if ((additionalData.rollDice && !(rollMatch.includes("d"))) || !(rollMatch.includes("d"))) {
				rollMatch = String(eval(rollMatch));
			} else if (additionalData.rollDice) {
				rollMatch = String(roll_dice(rollMatch));
			}

			//MapTool.chat.broadcast(rollMatch);
			//MapTool.chat.broadcast(infoMatch);

			return rollMatch + " " + infoMatch.replaceAll(",", " ");
		} catch (e) {
			MapTool.chat.broadcast("Error in parse_roll during case two");
			MapTool.chat.broadcast("additionalData: " + JSON.stringify(additionalData));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
	}

	return rollString;
}