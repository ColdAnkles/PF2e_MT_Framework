"use strict";

function display_spell_slots(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    if (get_token_type(token) == "NPC") {
        return "";
    }

    if (!(token.getName().includes("Lib")) && get_token_type(token) == "PC") {
        return display_spell_slots(token.getProperty("myID"));
    }

    let displaySlots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let hasSlots = false;
    let hasFocus = false;
    let tokenCasting = JSON.parse(token.getProperty("spellRules"));
    for (var s in tokenCasting) {
        let castData = tokenCasting[s];
        if ("currentSlots" in castData) {
            for (var slot in castData.currentSlots) {
                displaySlots[slot] += castData.currentSlots[slot];
                if (slot > 1 && castData.currentSlots[slot] > 0) {
                    hasSlots = true;
                }
            }
        }
        if (castData.name.includes("Focus")) {
            hasFocus = true;
        }
    }

    displaySlots.splice(0, 1); //Remove 'cantrip' slot

    for (var slot in displaySlots) {
        let slotSize = Number(slot) + 1;
        displaySlots[slot] = String(slotSize) + getOrdinal(slotSize) + ": " + String(displaySlots[slot]);
    }
    let returnString = "";

    if (hasSlots && !hasFocus) {
        returnString += displaySlots.join(", ").replace(", 6th:", "\n6th:");
    } else if (hasSlots && hasFocus) {
        returnString += displaySlots.join(", ").replace(", 7th:", "\n7th:");
    }

    if (hasFocus) {
        if (hasSlots) {
            returnString += "; ";
        }
        returnString += "Focus: " + String(JSON.parse(token.getProperty("resources")).focus.current);
    }
    return returnString;
}

MTScript.registerMacro("ca.pf2e.display_spell_slots", display_spell_slots);