"use strict";

function wipe_pc_macros(tokenID) {
    let macroList = getMacros(tokenID);
    for (var m in macroList) {
        removeMacro(macroList[m], tokenID);
    }
}