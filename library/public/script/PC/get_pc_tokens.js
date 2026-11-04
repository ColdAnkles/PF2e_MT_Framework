"use strict";

function get_pc_tokens(playerName = null) {
    let pcList = find_pc_libs(playerName);
    let tokenList = [];
    for (var l in pcList) {
        tokenList.push(pcList[l].getId());
        let ids = pcList[l].getProperty("pcTokens");
        if (ids != "" && ids != null){
            ids = JSON.parse(ids);
            tokenList = tokenList.concat(ids);
        }
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
