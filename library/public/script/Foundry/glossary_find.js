"use strict";

function glossary_find(string) {
    let glossary = JSON.parse(read_data("pf2e_glossary"));
    let splitKeys = string.split(".");
    let foundString = null
    for (var key in splitKeys) {
        if (splitKeys[key] in glossary) {
            glossary = glossary[splitKeys[key]];
            if (typeof (glossary) == "string") {
                foundString = glossary
            }
        }
    }
    return foundString;
}

MTScript.registerMacro("ca.pf2e.glossary_find", glossary_find);