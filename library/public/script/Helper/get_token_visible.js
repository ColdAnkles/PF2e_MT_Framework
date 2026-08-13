"use strict";

function get_token_visible(tokenID){
    if (typeof (tokenID) != "String") {
        tokenID = tokenID.getId();
    }
    MTScript.setVariable("tokenID", tokenID);

    if (MapTool.tokens.getTokenByID(tokenID).isOnCurrentMap()) {
        MTScript.evalMacro("[h: isVisible = getVisible(tokenID)]");
        return Boolean(String(MTScript.getVariable("isVisible")) == "1");
    } else {
        return true;
    }
}