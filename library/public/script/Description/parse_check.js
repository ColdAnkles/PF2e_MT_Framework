"use strict";

function parse_check(checkString, additionalData = { "variant": "normal" }) {
	let skillList = ["acrobatics", "arcana", "athletics", "crafting", "deception", "diplomacy", "intimidation", "medicine", "nature", "occultism", "performance", "religion", "society", "stealth", "survival", "thievery"]
	let parsed = parse_foundry_strings(checkString);
	let data = parsed.bracketContents.split("|");
	let dcMod = 0;
	if (additionalData.variant == "elite") {
		dcMod = 2;
	} else if (additionalData.variant == "weak") {
		dcMod = -2;
	}

	if (!("gm" in additionalData)) {
		additionalData.gm = false;
	}

	if (!("isPC" in additionalData)) {
		additionalData.isPC = true;
	}

	//MapTool.chat.broadcast(JSON.stringify(parsed));
	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	checkString = "";

	if (data.length == 1) {
		return data[0];
	}

	let checkDC = ""
	let checkSkill = ""

	for (var i in data) {
		i = data[i];
		if (i.includes("dc")) {
			if (additionalData.gm && !additionalData.isPC) {
				checkDC = "DC " + String(Number(i.split(":")[1]) + dcMod) + " ";
			} else if (!additionalData.gm && !additionalData.isPC) {
				checkDC = "";
			} else {
				checkDC = "DC " + String(Number(i.split(":")[1]) + dcMod) + " ";
			}
		} else if (skillList.includes(i)) {
			checkSkill = i.charAt(0).toUpperCase() + i.slice(1) + " ";
		}
	}

	checkString = checkDC + checkSkill;

	if (data.includes("basic")) {
		checkString += "basic "
	}

	if (data.includes("will")) {
		checkString += "Will"
	} else if (data.includes("reflex")) {
		checkString += "Reflex"
	} else if (data.includes("fortitude") || data.includes("fort")) {
		checkString += "Fortitude"
	}

	return checkString;
}