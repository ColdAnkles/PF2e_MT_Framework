"use strict";

function get_token_position(token) {
    if (typeof (token) != "String") {
        token = token.getId();
    }
    MTScript.setVariable("tokenID", token);
    let tokenPosition = { "x": 0, "y": 0 };

    if (MapTool.tokens.getTokenByID(token).isOnCurrentMap()) {
        MTScript.evalMacro("[h: tokenX = getTokenX(0, tokenID)][h: tokenY = getTokenY(0, tokenID)]");
        tokenPosition.x = Number(MTScript.getVariable("tokenX"));
        tokenPosition.y = Number(MTScript.getVariable("tokenY"));
    }

    return tokenPosition;

}