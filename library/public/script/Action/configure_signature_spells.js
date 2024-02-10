"use strict";

function configure_signature_spells(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    let castingData = JSON.parse(token.getProperty("spellRules"));

    let spontanousCasters = ["Bard", "Oracle", "Psychic", "Sorceror"]

    let spontaneousCasting = [];
    for (var cd in castingData) {
        if (castingData[cd].type = "spontaneous" && spontanousCasters.includes(cd)) {
            spontaneousCasting.push(castingData[cd]);
        }
    }

    let inputString = "";
    let varList = [];
    for (var cd in spontaneousCasting) {
        let castData = spontaneousCasting[cd];
        inputString += "\"tab0 | " + castData.name + " || TAB\",";
        let allSpells = {};
        for (var s in castData.spells) {
            if (!((castData.spells[s].level) in allSpells)) {
                allSpells[castData.spells[s].level] = [];
            }
            if (!(castData.spells[s].traits.value.includes("cantrip"))) {
                allSpells[castData.spells[s].level].push(castData.spells[s].name);
            }
        }
        for (var si in castData.castLevels) {
            let spellLevel = castData.castLevels[si];
            varList.push(castData.name + "_level_" + String(spellLevel));
            inputString += "\"" + castData.name + "_level_" + String(spellLevel) + "|" + allSpells[spellLevel].join(",") + "|Level " + String(spellLevel) + " Signature Spell|LIST|VALUE=STRING\",";
        }
    }
    inputString = inputString.substring(0, inputString.length - 1);
    MTScript.evalMacro("[h: input(" + inputString + ")]");

    let vars = {};
    let signatureSpells = [];
    for (var v in varList) {
        vars[varList[v]] = MTScript.getVariable(varList[v]);
        signatureSpells.push(vars[varList[v]]);
    };

    for (var v in vars) {
        let varSections = v.split('_');
        let castType = varSections[0];
        let spellName = vars[v];
        let castData = castingData[castType]
        for (var s in castData.spells) {
            var thisSpell = castData.spells[s];
            if (signatureSpells.includes(spellName)) {
                thisSpell.signature = true;
            } else {
                thisSpell.signature = false;
            }
        }
    }

    token.setProperty("spellRules", JSON.stringify(castingData));
    update_my_tokens(token);

}