"use strict";

function group_saving_throw(tokens) {
    if (tokens == "PCs") {
        tokens = find_pc_libs();
        for (var t in tokens) {
            tokens[t] = tokens[t].getId();
        }
        tokens = tokens.join(",");
    }

    let saveData = {};
    saveData.cBonus = 0;
    saveData.sBonus = 0;
    saveData.iBonus = 0;
    saveData.cMalus = 0;
    saveData.sMalus = 0;
    saveData.iMalus = 0;


    let saveStrings = {};
    let saves = ["fortitude", "reflex", "will"]
    for (var s in saves) {
        saveStrings[s] = { "name": saves[s], "string": (capitalise(saves[s])) };
    }

    saving_throw_dialog("group", "Group", saveData, {}, saveStrings, tokens);
}

MTScript.registerMacro("ca.pf2e.group_saving_throw", group_saving_throw);

function display_group_saving_throw(saveData) {
    //MapTool.chat.broadcast(JSON.stringify(saveData));

    let displayData = { "name": "The group attempts a " + capitalise(saveData.saveName) + " save.", "system": { "description": { "value": "" } } };

    let tokenList = saveData.tokenList.split(",");
    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
    for (var t in tokenList) {
        let saveToken = tokenList[t]
        let tokenSave = saving_throw(saveToken, saveData, {"applyEffect":""}, true);
        let dTwentyColour = themeData.colours.standardText;
        if (tokenSave.dTwenty == 1) {
            dTwentyColour = "red";
        } else if (tokenSave.dTwenty == 20) {
            dTwentyColour = "green";
        }
        displayData.system.description.value += "<i>" + MapTool.tokens.getTokenByID(saveToken).getName() + "</i> <div style='font-size:20px'><b><span style='color:" + dTwentyColour + "'>" + String(tokenSave.dTwenty) + "</span>"
        if (tokenSave.basic_bonus != 0 && tokenSave.basic_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenSave.basic_bonus, true);
        }
        if (tokenSave.effect_bonus != 0 && tokenSave.effect_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenSave.effect_bonus, true);
        }
        if (tokenSave.misc_bonus != 0 && tokenSave.misc_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenSave.misc_bonus, true);
        }
        displayData.system.description.value += " = " + String(tokenSave.saveResult) + "</div></b>";
    }
    displayData.system.gmOnly = saveData.secretCheck;
    chat_display(displayData);
}

MTScript.registerMacro("ca.pf2e.display_group_saving_throw", display_group_saving_throw);