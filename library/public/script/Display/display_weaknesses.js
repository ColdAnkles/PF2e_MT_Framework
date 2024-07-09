"use strict";

function display_weaknesses(token){
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

    let weaknessList = JSON.parse(token.getProperty("weaknesses"));

    let extraWeaknesses = calculate_bonus(token, "Weakness", false).otherEffects.additionalWeakness;

    let weaknessString = "";

    for (var w in weaknessList){
        weaknessString += ", " + capitalise(weaknessList[w].type) + " " + String(weaknessList[w].value)
    }

    for (var w in extraWeaknesses){
        weaknessString += ", " + capitalise(extraWeaknesses[w].type) + " " + String(extraWeaknesses[w].value)
    }

    if (weaknessString.length > 0){
        weaknessString = weaknessString.substring(2);
    }

    return weaknessString;
}

MTScript.registerMacro("ca.pf2e.display_weaknesses", display_weaknesses);