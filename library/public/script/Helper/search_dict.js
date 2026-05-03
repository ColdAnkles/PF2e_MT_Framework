"use strict";

const search_dict = (dict, key, value, asString = false) => {
    var foundItems = []
    Object.keys(dict).forEach(x => {
        if (dict[x][key] == value) {
            foundItems.push(dict[x])
        }
    });
    if (!asString){
        return foundItems;
    }else{
        return JSON.stringify(foundItems);
    }
}

MTScript.registerMacro("ca.pz2e.search_dict", search_dict);