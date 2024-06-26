"use strict";

function addonExists(addonName) {
    MTScript.setVariable("addonName", addonName);
    MTScript.evalMacro("[h: exists = ca.pf2e.isLibraryLoaded(addonName)]")
    return Boolean(String(MTScript.getVariable("exists")) == "1");
}