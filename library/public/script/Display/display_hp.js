"use strict";

function display_hp(tokenID) {
    let token = MapTool.tokens.getTokenByID(tokenID);
    let currentHP = token.getProperty("HP");
    let maxHP = token.getProperty("MaxHP");
    let tempHP = token.getProperty("tempHP");

    let HPString = "HP: " + currentHP;

    if (tempHP > 0) {
        HPString += "+" + tempHP;
    }

    HPString += "/" + maxHP;

    let tokenTraits = JSON.parse(token.getProperty("traits"));

    if (tokenTraits.includes("troop")) {
        let troopInterval = Number(maxHP) / 3;
        let segmentCount = 4;
        if ((currentHP <= troopInterval * 2) && (currentHP > troopInterval)) {
            segmentCount = 3;
        } else if (currentHP <= troopInterval) {
            segmentCount = 2;
        }

        HPString += " | " + String(segmentCount) + " Segments"
    }

    return HPString;
}

MTScript.registerMacro("ca.pf2e.display_hp", display_hp);