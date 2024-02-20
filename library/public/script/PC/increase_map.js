"use strict";

function increase_map(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    if (!(token.getName().includes("Lib")) && get_token_type(token) == "PC") {
        increase_map(token.getProperty("myID"));
        return;
    }

    let attacksThisRound = Number(token.getProperty("attacksThisRound"));
    if (isNaN(attacksThisRound)) {
        attacksThisRound = 0;
    }
    attacksThisRound += 1;
    token.setProperty("attacksThisRound", String(attacksThisRound));

    if (token.getName().includes("Lib")) {
        update_my_tokens(token);
    }
}

MTScript.registerMacro("ca.pf2e.increase_map", increase_map);