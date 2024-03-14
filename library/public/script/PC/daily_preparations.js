"use strict";

function daily_preparations(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    if (!(token.getName().includes("Lib")) && get_token_type(token) == "PC") {
        daily_preparations(token.getProperty("myID"));
        return;
    }

    //Spell Slots
    let tokenCasting = JSON.parse(token.getProperty("spellRules"));
    for (var s in tokenCasting) {
        let castData = tokenCasting[s];
        if ("currentSlots" in castData && "totalSlots" in castData) {
            castData.currentSlots = castData.totalSlots;
        }
    }
    token.setProperty("spellRules", JSON.stringify(tokenCasting));

    //Focus Points
    let tokenResources = JSON.parse(token.getProperty("resources"));
    if ("focus" in tokenResources) {
        tokenResources.focus.current = tokenResources.focus.max;
    }
    token.setProperty("resources", JSON.stringify(tokenResources));

    //Healing
    let conMod = Number(token.getProperty("con"));
    let maxHP = Number(token.getProperty("MaxHP"));
    let currHP = Number(token.getProperty("HP"));
    currHP = Math.min(currHP + conMod, maxHP);
    token.setProperty("HP", String(currHP));

    if (token.getName().includes("Lib") && get_token_type(token) == "PC") {
        update_my_tokens(token);
    }
}

MTScript.registerMacro("ca.pf2e.daily_preparations", daily_preparations);