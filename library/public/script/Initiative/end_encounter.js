"use strict";

function end_encounter() {
    MTScript.evalMacro("[h: initiativeData = getInitiativeList() ]");
    let initiativeData = JSON.parse(MTScript.getVariable("initiativeData"));
    for (var t in initiativeData.tokens) {
        let thisToken = MapTool.tokens.getTokenByID(initiativeData.tokens[t].tokenId);
        for (var i in [0, 1, 2, 3, 4]) {
            set_state("ActionsLeft_" + String(Number(i) + 1), 0, thisToken.getId());
            set_state("Reaction", 0, thisToken.getId());
        }
    }
    MTScript.evalMacro("[h: removeAllFromInitiative()]");
}

MTScript.registerMacro("ca.pf2e.end_encounter", end_encounter);