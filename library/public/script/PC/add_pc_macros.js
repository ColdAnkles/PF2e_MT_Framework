"use strict";

function add_pc_macros(tokenID, pcLibID) {

    let pcToken = MapTool.tokens.getTokenByID(pcLibID);
    let pcData = read_creature_properties(pcLibID);

    for (var s in pcData.speeds.other) {
        let speedData = pcData.speeds.other[s];
        if (speedData.type == "fly") {
            add_action_to_token({ "name": "Fly", "type": "basic", "system": { "actionType": "action", "actionCount": 1, "type": "basic", "group": "Movement", "description": { "value": "" } } }, tokenID, pcToken);
        } else if (speedData.type == "burrow") {
            add_action_to_token({ "name": "Burrow", "type": "basic", "system": { "actionType": "action", "actionCount": 1, "group": "Movement", "description": { "value": "" } } }, tokenID, pcToken);
        }
    }

    let actionData = null;
    try {
        for (var a in pcData.basicAttacks) {
            actionData = pcData.basicAttacks[a];
            actionData.group = "";
            actionData.system.group = "";
            add_action_to_token(actionData, tokenID);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during attacks-step");
        MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    actionData = null;
    try {
        for (var a in pcData.offensiveActions) {
            actionData = pcData.offensiveActions[a];
            actionData.group = "4. Abilities";
            add_action_to_token(actionData, tokenID);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during actions-step");
        MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    actionData = null;
    try {
        for (var a in pcData.otherDefenses) {
            actionData = pcData.otherDefenses[a];
            actionData.group = "4. Abilities";
            add_action_to_token(actionData, tokenID);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during otherDef-step");
        MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    actionData = null;
    try {
        for (var a in pcData.passiveDefenses) {
            actionData = pcData.passiveDefenses[a];
            actionData.group = "4. Abilities";
            add_action_to_token(actionData, tokenID);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during passiveDef-step");
        MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    actionData = null;
    try {
        for (var a in pcData.passiveSkills) {
            actionData = pcData.passiveSkills[a];
            actionData.group = "4. Abilities";
            add_action_to_token(actionData, tokenID);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during passiveSkills-step");
        MapTool.chat.broadcast("actionData: " + JSON.stringify(actionData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    let spellSource = null;
    let spellData = null;
    try {
        let addedRefocus = false;
        for (var s in pcData.spellRules) {
            spellSource = pcData.spellRules[s];
            for (var sp in spellSource.spells) {
                spellData = spellSource.spells[sp];
                add_action_to_token(spellData, tokenID, pcToken);
            }
            if (spellSource.name.includes("Focus") && !addedRefocus) {
                //add_action_to_token({ "name": "Refocus", "type": "basic", "group": "1. Common" }, tokenID);
                createMacro({ "label": "Add Focus Point", "playerEditable": 0, "command": "[h: js.ca.pf2e.add_focus_point(myID)]", "tooltip": "Add 1 Focus Point", "sortBy": "", "group": "1. Common" }, tokenID);
                createMacro({ "label": "Use Focus Point", "playerEditable": 0, "command": "[h: js.ca.pf2e.use_focus_point(myID)]", "tooltip": "Use 1 Focus Point", "sortBy": "", "group": "1. Common" }, tokenID);
                addedRefocus = true;
            }
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in add_pc_macros during spells-step");
        MapTool.chat.broadcast("spellSource: " + JSON.stringify(spellSource));
        MapTool.chat.broadcast("spellData: " + JSON.stringify(spellData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

}