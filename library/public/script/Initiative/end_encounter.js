"use strict";

function end_encounter() {
    MTScript.evalMacro("[h: sureEnd = 0][h: ans = input(\"sureEnd|1|Are you Sure?|CHECK\")][h: abort(ans)]");
    let sureEnd = (Number(MTScript.getVariable("sureEnd")) == 1);
    if (!sureEnd) {
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
        if (!thisToken.isPC() && get_token_property_type(thisToken) == "PZ2E_Character"){
	        let foundryActor = JSON.parse(thisToken.getProperty("foundryActor"));
			foundryActor.damageTracker.value = 0;
			thisToken.setProperty("foundryActor", JSON.stringify(foundryActor));
        }
    }
    MTScript.evalMacro("[h: removeAllFromInitiative()]");
}

MTScript.registerMacro("ca.pz2e.end_encounter", end_encounter);