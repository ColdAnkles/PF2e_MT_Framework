"use strict";

function get_pc_tokens(playerName = null) {
    let pcList = find_pc_libs(playerName);
    let tokenList = [];
    for (var l in pcList) {
        tokenList = tokenList.concat(JSON.parse(pcList[l].getProperty("pcTokens")));
        tokenList.push(pcList[l].getId());
    }
    tokenList.sort();
    tokenList = tokenList.filter((value, index, array) => array.indexOf(value) === index);
    for (var t in tokenList) {
        let nT = MapTool.tokens.getTokenByID(tokenList[t]);
        if (nT != null) {
            tokenList[t] = nT;
        }
    }
    return tokenList;
}

MTScript.registerMacro("ca.pz2e.get_pc_tokens", get_pc_tokens);
