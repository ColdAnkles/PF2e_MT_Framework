"use strict";

function delay_undelay(tokenID) {
    let token = MapTool.tokens.getTokenByID(tokenID);
    let initiative = get_initiative(token.getId());
    if (isNaN(initiative)) {
        return;
    } else {
        MTScript.setVariable("tokenRef", tokenID);
        MTScript.evalMacro("[h: tokenHold = getInitiativeHold(tokenRef)]");
        let isHolding = (Number(MTScript.getVariable("tokenHold")) == 1);
        if (isHolding) {
            undelay_token(tokenID);
        } else {
            delay_token(tokenID);
        }
    }
}

MTScript.registerMacro("ca.pf2e.delay_undelay", delay_undelay);

function delay_token(tokenID) {
    MTScript.evalMacro("[h: setInitiativeHold(1, \""+tokenID+"\")]");
    end_turn(tokenID);
}

function undelay_token(tokenID) {
    MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()][h:initiativeTokens=getInitiativeList()]")
	let currentInitiative = Number(MTScript.getVariable("currInit"));
    MTScript.evalMacro("[h: setInitiativeHold(0, \""+tokenID+"\")]");
    let newInit = currentInitiative - 1;
    MTScript.evalMacro("[h: setInitiative(" + String(newInit) + ", \"" + tokenID + "\")][h: sortInitiative()]");
}