"use strict";

const search_dict = (dict, key, value) => {
    var foundItems = []
    Object.keys(dict).forEach(x => {
        if (dict[x][key] == value) {
            foundItems.push(dict[x])
        }
    });
    return foundItems;
}