"use strict";

function get_tokens(conditions) {
    MTScript.setVariable("cond", JSON.stringify(conditions));
    MTScript.evalMacro("[h: tokenResults = getTokens(\"json\",cond)]")
    return JSON.parse(MTScript.getVariable("tokenResults"));
}