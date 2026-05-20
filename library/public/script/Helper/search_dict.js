"use strict";

const search_dict = (dict, key, value, asString = false) => {
    var foundItems = []
    Object.keys(dict).forEach(x => {
        if (dict[x][key] == value) {
            foundItems.push(dict[x])
        }
    });
    if (!asString) {
        return foundItems;
    } else {
        return JSON.stringify(foundItems);
    }
}

function MTScript_search_dict(dict, key, value){
    return search_dict(dict, key, value, true);
}

MTScript.registerMacro("ca.pz2e.search_dict", MTScript_search_dict);