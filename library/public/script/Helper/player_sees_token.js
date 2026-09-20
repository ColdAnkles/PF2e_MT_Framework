"use strict";

function player_sees_token(playerName, tokenID) {
    let pcTokens = get_pc_tokens(playerName);

    MTScript.setVariable("target", tokenID);
    var targetToken = MapTool.tokens.getTokenByID(tokenID);
    var results = [];
    for (var s in pcTokens) {
        MTScript.setVariable("source", pcTokens[s].getId());
        MTScript.setVariable("mapRef", pcTokens[s].getMapName());
        if (targetToken.getMapName() == pcTokens[s].getMapName()) {
            MTScript.evalMacro("[h: result = canSeeToken(target, source, mapRef)]");
            results = JSON.parse(MTScript.getVariable("result"));
            if (results.length > 0) {
                return true;
            }
        }
    }
    return false;
}