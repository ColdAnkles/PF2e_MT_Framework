"use strict";

function getTokenImage(tokenID, imageSize = 100) {
    MTScript.setVariable("tokenID", tokenID);
    MTScript.setVariable("imageSize", imageSize);

    if (MapTool.tokens.getTokenByID(tokenID).isOnCurrentMap()) {
        MTScript.evalMacro("[h: imageData = getTokenImage(imageSize, tokenID)]");
        return MTScript.getVariable("imageData");
    } else {
        return "";
    }

}