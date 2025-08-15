"use strict";

function flat_check(token, extraVars = { "dc": null, "failMsg": null, "successMsg": null, "altTitle": null }) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
	let dTwenty = String(MTScript.getVariable("dTwenty"));

	let description = "Flat Check Result: " + dTwenty;

	if ("dc" in extraVars && extraVars.dc != null && !isNaN(extraVars.dc)) {
		if (dTwenty >= extraVars.dc) {
			if (("successMsg" in extraVars && extraVars.successMsg == null) || !("successMsg" in extraVars)) {
				description += "<br /> Success";
			} else {
				description += "<br /> " + extraVars.successMsg;
			}
		} else {
			if (("failMsg" in extraVars && extraVars.failMsg == null) || !("failMsg" in extraVars)) {
				description += "<br /> Failure";
			} else {
				description += "<br /> " + extraVars.failMsg;
			}
		}
	}

	let title = token.getName() + " attempts a flat check!";

	if ("altTitle" in extraVars && extraVars.altTitle != null) {
		title = extraVars.altTitle;
	}

	chat_display({ "name": title, "system": { "description": { "value": description } } }, true);

	if ("dc" in extraVars && extraVars.dc != null && !isNaN(extraVars.dc)) {
		return dTwenty >= extraVars.dc;
	}

}

MTScript.registerMacro("ca.pf2e.flat_check", flat_check);