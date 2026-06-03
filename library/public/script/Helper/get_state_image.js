"use strict";

function get_state_image(stateName, imageSize = 100) {
    MTScript.setVariable("stateName", stateName);
    MTScript.setVariable("imageSize", imageSize);

    MTScript.evalMacro("[h: imageData = getStateImage(stateName, imageSize)]");
    return MTScript.getVariable("imageData");

}