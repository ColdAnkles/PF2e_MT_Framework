"use strict";

function createMacro(props, tokenID) {
    MTScript.setVariable("props", props);
    MTScript.setVariable("tokenID", tokenID);
    MTScript.evalMacro("[h: createMacro(props,tokenID)]");
}
