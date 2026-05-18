"use strict";

function increase_map(token) {
    let attacksThisRound = null;
    try {
        if (typeof (token) == "string") {
            token = MapTool.tokens.getTokenByID(token);
        }

        if (!(token.getName().includes("Lib")) && token.isPC()) {
            increase_map(token.getProperty("myID"));
            return;
        }

        attacksThisRound = Number(token.getProperty("attacksThisRound"));
        if (isNaN(attacksThisRound)) {
            attacksThisRound = 0;
        }
        attacksThisRound += 1;
        token.setProperty("attacksThisRound", String(attacksThisRound));

        if (token.getName().includes("Lib")) {
            update_my_tokens(token);
        }
    } catch (e) {
        if (String(e).startsWith("PZ2E")) {
            throw e;
        }
        MapTool.chat.broadcast("Error in increase_map");
        MapTool.chat.broadcast("token: " + String(token));
        MapTool.chat.broadcast("attacksThisRound: " + String(attacksThisRound));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        throw new Error("PZ2E: Error in increase_map");
    }
}

MTScript.registerMacro("ca.pz2e.increase_map", increase_map);