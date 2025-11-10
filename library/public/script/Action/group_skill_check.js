"use strict";

function group_skill_check(tokens) {
    if (tokens == "PCs") {
        tokens = find_pc_libs();
        for (var t in tokens) {
            tokens[t] = tokens[t].getId();
        }
        tokens = tokens.join(",");
    }

    let skills = {
        "Acrobatics": { "name": "Acrobatics", "stat": "dex" },
        "Arcana": { "name": "Arcana", "stat": "int" },
        "Athletics": { "name": "Athletics", "stat": "str" },
        "Crafting": { "name": "Crafting", "stat": "int" },
        "Deception": { "name": "Deception", "stat": "cha" },
        "Diplomacy": { "name": "Diplomacy", "stat": "cha" },
        "Intimidation": { "name": "Intimidation", "stat": "cha" },
        "Medicine": { "name": "Medicine", "stat": "wis" },
        "Nature": { "name": "Nature", "stat": "wis" },
        "Occultism": { "name": "Occultism", "stat": "int" },
        "Perception": { "name": "Perception", "stat": "wis" },
        "Performance": { "name": "Performance", "stat": "cha" },
        "Religion": { "name": "Religion", "stat": "wis" },
        "Society": { "name": "Society", "stat": "int" },
        "Stealth": { "name": "Stealth", "stat": "dex" },
        "Survival": { "name": "Survival", "stat": "wis" },
        "Thievery": { "name": "Thievery", "stat": "dex" }
    };

    let skillStrings = {};

    for (var p in skills) {
        let skillData = skills[p];
        skillStrings[skillData.name] = skillData.name;
    }

    skill_check_dialog("group", "Group", "NPC", 0, [], skillStrings, {}, null, tokens);
}

MTScript.registerMacro("ca.pf2e.group_skill_check", group_skill_check);

function display_group_skill_check(checkData) {
    //MapTool.chat.broadcast(JSON.stringify(checkData));

    let displayData = { "name": "The group attempts a " + checkData.skillName + " skill Check.", "system": { "description": { "value": "" } } };

    let tokenList = checkData.tokenList.split(",");
    for (var t in tokenList) {
        let checkToken = tokenList[t]
        let tokenCheck = skill_check(checkToken, false, checkData, [], true);
        let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
        let dTwentyColour = themeData.colours.standardText;
        if (tokenCheck.dTwenty == 1) {
            dTwentyColour = "red";
        } else if (tokenCheck.dTwenty == 20) {
            dTwentyColour = "green";
        }
        displayData.system.description.value += "<br/><i>" + MapTool.tokens.getTokenByID(checkToken).getName() + "</i> <div style='font-size:20px'><b><span style='color:" + dTwentyColour + "'>" + String(tokenCheck.dTwenty) + "</span>"
        if (tokenCheck.stat_bonus != 0 && tokenCheck.stat_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.stat_bonus, true);
        }
        if (tokenCheck.prof_bonus != 0 && tokenCheck.prof_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.prof_bonus, true);
        }
        if (tokenCheck.overrideBonus != 0 && tokenCheck.overrideBonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.overrideBonus, true);
        }
        if (tokenCheck.effect_bonus != 0 && tokenCheck.effect_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.effect_bonus, true);
        }
        if (tokenCheck.misc_bonus != 0 && tokenCheck.misc_bonus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.misc_bonus, true);
        }
        if (tokenCheck.map_malus != 0 && tokenCheck.map_malus != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.map_malus, true);
        }
        if (tokenCheck.armorPenalty != 0 && tokenCheck.armorPenalty != null) {
            displayData.system.description.value += " " + pos_neg_sign(tokenCheck.armorPenalty, true);
        }
        displayData.system.description.value += " = " + String(tokenCheck.checkResult) + "</div></b>";
    }
    displayData.system.gmOnly = checkData.secretCheck;
    chat_display(displayData);
}

MTScript.registerMacro("ca.pf2e.display_group_skill_check", display_group_skill_check);