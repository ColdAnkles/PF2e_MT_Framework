"use strict";

function encode(string) {
    MTScript.setVariable("str", string);
    MTScript.evalMacro("[h: encoded = encode(str)]")
    return MTScript.getVariable("encoded");
}

function decode(string) {
    MTScript.setVariable("str", string);
    MTScript.evalMacro("[h: decoded = decode(str)]")
    return MTScript.getVariable("decoded");
}