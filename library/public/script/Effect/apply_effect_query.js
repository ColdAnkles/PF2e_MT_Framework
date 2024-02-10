"use strict";

function apply_effect_query(inputData) {
    //Get visible tokens
    let effectName = inputData.effectName;
    let tokens = get_tokens({ "visible": true, "unsetStates": ["Dead"], "layer": ["TOKEN"] });
    let tokenNames = [];
    for (var i = 0; i < tokens.length; i++) {
        tokens[i] = MapTool.tokens.getTokenByID(tokens[i]);
        tokenNames.push(tokens[i].getName());
    }

    if (tokenNames.length == 0) {
        return;
    }
    //User chooses a token
    MTScript.evalMacro("[h: ans=input(\"tokenChoice|" + tokenNames.join(",") + "|Apply " + effectName + " to|List\")]");
    let abort = MTScript.getVariable("ans");
    if (Number(abort) == 0) {
        return;
    }
    let tokenChoice = Number(MTScript.getVariable("tokenChoice"));

    //Apply effect to token
    toggle_named_effect(effectName, tokens[tokenChoice], 1, inputData.effectSource);
}

MTScript.registerMacro("ca.pf2e.apply_effect_query", apply_effect_query);