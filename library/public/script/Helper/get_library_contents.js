"use strict";

function getLibraryContents(subdir = "") {
    MTScript.evalMacro("[h: response = libContents = library.getContents('ca.pf2e')]");
    let allData = MTScript.getVariable("response");

    let matchData = [];
    for (var f in allData) {
        if (allData[f].includes(subdir)) {
            matchData.push(allData[f])
        }
    }
    return matchData;
}