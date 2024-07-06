"use strict";

function get_token_property_type(token) {
    if (typeof (token) != "String") {
        token = token.getId();
    }
    MTScript.setVariable("tokenID", token);

    if (MapTool.tokens.getTokenByID(token).isOnCurrentMap()) {
        MTScript.evalMacro("[h: tokenPType = getPropertyType(tokenID)]");
        return MTScript.getVariable("tokenPType");
    } else {
        return "";
    }

}