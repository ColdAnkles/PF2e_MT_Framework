"use strict";

function getFrameworkMacros() {
    let basicMacros = ["<b>Compendium</b>", "<b>Creatures</b>", "<b>Hazards</b>", "Spawn PC Party", "End Current Turn", "End Encounter", "Previous Turn", "Add Persistent Damage", "Add Hero Point", "Use Hero Point", "Daily Preparations",]
    return basicMacros.concat(getConditionList());
}

function getConditionList() {
    return ["Blinded", "Broken", "Clumsy", "Confused", "Controlled", "Dazzled", "Deafened", "Doomed", "Drained", "Dying", "Encumbered", "Enfeebled", "Fascinated", "Fatigued", "Fleeing", "Frightened", "Frightened (Time)", "Grabbed", "Immobilized", "Invisible", "Off-Guard", "Paralyzed", "Petrified", "Prone", "Quickened", "Restrained", "Sickened", "Slowed", "Slowed (Time)", "Stunned", "Stunned (Time)", "Stupefied", "Unconscious", "Wounded", "Untethered", "Glitching", "Suppressed"];
}

function createGMMacros() {
    let GMMacros = [{ "label": "<b>Compendium</b>", "playerEditable": 0, "command": "[macro(\"Compendium_Home@lib:ca.pf2e\"): \"\"]", "tooltip": "Open the Compendium", "color": "black", "fontColor": "white", "fontSize": "1.25em" },
    { "label": "<b>Creatures</b>", "playerEditable": 0, "command": "[macro(\"Compendium_Window@lib:ca.pf2e\"): json.set(\"{}\",\"window\",\"creatures\")]", "tooltip": "Creature List", "color": "black", "fontColor": "white", "fontSize": "1.25em" },
    { "label": "<b>Hazards</b>", "playerEditable": 0, "command": "[macro(\"Compendium_Window@lib:ca.pf2e\"): json.set(\"{}\",\"window\",\"hazard\")]", "tooltip": "Hazard List", "color": "black", "fontColor": "white", "fontSize": "1.25em" },
    { "label": "Spawn PC Party", "playerEditable": 0, "command": "[h: pcLibs = js.ca.pf2e.find_pc_libs()][h, foreach(id, pcLibs), code:{[h: ca.pf2e.Spawn_PC_Token(id)]}]", "tooltip": "Spawns the entire PC Party on the current map at the center of the map." },
    { "label": "End Current Turn", "playerEditable": 0, "command": "[h: js.ca.pf2e.end_turn(getInitiativeToken())]", "tooltip": "End turn for current token with initiative.", "group": "1. Encounters" },
    { "label": "End Encounter", "playerEditable": 0, "command": "[h: js.ca.pf2e.end_encounter()]", "tooltip": "End Encounter Mode.", "group": "1. Encounters" },
    { "label": "Previous Turn", "playerEditable": 0, "command": "[h: js.ca.pf2e.end_turn(getInitiativeToken(), False)]", "tooltip": "Go Back to Previous Token's Turn.", "group": "1. Encounters" },
    { "label": "Add Persistent Damage", "playerEditable": 0, "command": "[h: js.ca.pf2e.add_persistent_damage()]", "tooltip": "Add Persistent Damage to Selected Token.", "group": "2. Conditions" },
    { "label": "Add Hero Point", "playerEditable": 0, "command": "[h: tokens = getSelected()][h, foreach(t, tokens, \"\"), code:{[h: js.ca.pf2e.add_hero_point(t)]}]", "tooltip": "Add Hero Point to selected tokens.", "group": "3. Misc" },
    { "label": "Use Hero Point", "playerEditable": 0, "command": "[h: tokens = getSelected()][h, foreach(t, tokens, \"\"), code:{[h: js.ca.pf2e.use_hero_point(t)]}]", "tooltip": "Selected Tokens use Hero Point.", "group": "3. Misc" },
    { "label": "Remove Hero Point", "playerEditable": 0, "command": "[h: tokens = getSelected()][h, foreach(t, tokens, \"\"), code:{[h: js.ca.pf2e.remove_hero_point(t)]}]", "tooltip": "Selected Tokens Lose one Hero Point.", "group": "3. Misc" },
    { "label": "Daily Preparations", "playerEditable": 0, "command": "[h: pcLibs = js.ca.pf2e.find_pc_libs()][h, foreach(id, pcLibs), code:{[h: js.ca.pf2e.daily_preparations(id)]}]", "tooltip": "Perform PC Daily Preparations.", "group": "3. Misc" }];
    for (var m in GMMacros) {
        createMacro(GMMacros[m], "gm");
    }
    let conditionMacroList = getConditionList();
    for (var m in conditionMacroList) {
        let conditionName = conditionMacroList[m];
        let dat = { "label": conditionName, "playerEditable": 0, "command": "[h: ca.pf2e.Condition_Set_Basic(\"" + conditionName + "\")]", "tooltip": "Add " + conditionName + " to Selected Token.", "group": "2. Conditions" };
        createMacro(dat, "gm");
    }
}

MTScript.registerMacro("ca.pf2e.createGMMacros", createGMMacros);

function createCampaignMacros() {
    let campaignMacros = [{ "label": "<b>Compendium</b>", "playerEditable": 0, "command": "[macro(\"Compendium_Home@lib:ca.pf2e\"): \"\"]", "tooltip": "Open the Compendium", "color": "black", "fontColor": "white", "fontSize": "1.25em" }];
    for (var m in campaignMacros) {
        createMacro(campaignMacros[m], "campaign");
    }
}

MTScript.registerMacro("ca.pf2e.createCampaignMacros", createCampaignMacros);

function rebuildMacroPanels() {
    //GET GM and Campaign Macros
    //Delete in loop
    let frameworkMacros = getFrameworkMacros();
    for (var s in ["gm", "campaign"]) {
        s = ["gm", "campaign"][s];
        let macroList = getMacros(s);
        for (var m in macroList) {
            m = macroList[m];
            if (frameworkMacros.includes(m)) {
                removeMacro(m, s);
            }
        }
    }
    createGMMacros();
    createCampaignMacros();
}

MTScript.registerMacro("ca.pf2e.rebuildMacroPanels", rebuildMacroPanels);