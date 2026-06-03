"use strict";

function get_token_image(tokenID, imageSize = 100, map = null) {
    MTScript.setVariable("tokenID", tokenID);
    MTScript.setVariable("imageSize", imageSize);

    if (MapTool.tokens.getTokenByID(tokenID).isOnCurrentMap() && map == null) {
        MTScript.evalMacro("[h: imageData = getTokenImage(imageSize, tokenID)]");
        return MTScript.getVariable("imageData");
    } else if (map != null) {
        MTScript.setVariable("tokenMap", map);
        MTScript.evalMacro("[h: imageData = getTokenImage(imageSize, tokenID, tokenMap)]");
        return MTScript.getVariable("imageData");
    } else {
        return "";
    }

}