"use strict";

function end_encounter() {
    MTScript.evalMacro("[h: input(\"sureEnd|1|Are you Sure?|CHECK\")]");
    let sureEnd = (Number(MTScript.getVariable("sureEnd")) == 1);
    if (!sureEnd){
        return;
    }
    MTScript.evalMacro("[h: initiativeData = getInitiativeList() ]");
    let initiativeData = JSON.parse(MTScript.getVariable("initiativeData"));
    for (var t in initiativeData.tokens) {
        let thisToken = MapTool.tokens.getTokenByID(initiativeData.tokens[t].tokenId);
        for (var i in [0, 1, 2, 3, 4]) {
            set_state("ActionsLeft_" + String(Number(i) + 1), false, thisToken.getId());
            set_state("Reaction", false, thisToken.getId());
        }
        thisToken.setProperty("attacksThisRound", 0);
        thisToken.setProperty("actionsLeft", 0);
        thisToken.setProperty("reactionsLeft", 0);
    }
    MTScript.evalMacro("[h: removeAllFromInitiative()]");
}

MTScript.registerMacro("ca.pf2e.end_encounter", end_encounter);