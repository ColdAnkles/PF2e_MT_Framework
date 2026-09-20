"use strict";

function get_pc_tokens(playerName = null) {
    let pcList = find_pc_libs(playerName);
    let tokenList = [];
    for (var l in pcList) {
        tokenList = tokenList.concat(JSON.parse(pcList[l].getProperty("pcTokens")));
    }
    tokenList.sort();
    tokenList.filter((value, index, array) => array.indexOf(value) === index);

    for (var t in tokenList) {
        tokenList[t] = MapTool.tokens.getTokenByID(tokenList[t]);
    }
    return tokenList;
}

MTScript.registerMacro("ca.pz2e.find_pc_libs", find_pc_libs);
