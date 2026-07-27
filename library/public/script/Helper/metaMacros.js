"use strict";

function createMacro(props, tokenID) {
    MTScript.setVariable("props", props);
    MTScript.setVariable("tokenID", tokenID);
    MTScript.evalMacro("[h: createMacro(props,tokenID)]");
}

function getMacros(tokenID){
    MTScript.setVariable("tokenID", tokenID);
    MTScript.evalMacro("[h: allMacros = getMacros(\"json\", tokenID)]")
    let allMacroNames = JSON.parse(MTScript.getVariable("allMacros"));
    let allMacros = [];
    for ( var idx in allMacroNames){
        MTScript.setVariable("MN", allMacroNames[idx]);
        MTScript.evalMacro("[h: macroIndex = getMacroIndexes(MN, \"json\", tokenID)][h: macroIndex = json.get(macroIndex,0)][h: macroProps = getMacroProps(macroIndex, \"json\", tokenID)]");
        let thisMacroData = JSON.parse(MTScript.getVariable("macroProps"));
        allMacros.push(thisMacroData);
    }
    return allMacros;
}

function setMacroProps(props, tokenID) {
    MTScript.setVariable("index", props.index);
    MTScript.setVariable("props", props);
    MTScript.setVariable("tokenID", tokenID);
    MTScript.evalMacro("[h: setMacroProps(index, props, \"json\", tokenID)]");
}

function removeMacro(macroName, tokenID) {
    if (typeof (tokenID) != "string") {
        tokenID = tokenID.getId();
    }

    MTScript.setVariable("tokenID", tokenID);
    MTScript.evalMacro("[h: allMacros = getMacros(\"json\", tokenID)]")
    let allMacros = JSON.parse(MTScript.getVariable("allMacros"));
    let removeIndicies = [];

    for (var a in allMacros) {
        MTScript.setVariable("label", allMacros[a]);
        MTScript.evalMacro("[h: indicies = getMacroIndexes(label, \"json\", tokenID)]");
        let indexList = JSON.parse(MTScript.getVariable("indicies"));
        let macroLabel = allMacros[a].replaceAll("&#9670;", "").replaceAll(/<img.*<\/img>/g, "").replace(/^ /, "").replace(/ $/, "");
        if (macroLabel == macroName) {
            for (var i in indexList) {
                if (!(removeIndicies.includes(indexList[i]))) {
                    removeIndicies.push(indexList[i]);
                }
            }
        }
    }

    for (var ri in removeIndicies) {
        MTScript.setVariable("index", removeIndicies[ri]);
        MTScript.evalMacro("[h: removeMacro(index, tokenID)]");
    }
}