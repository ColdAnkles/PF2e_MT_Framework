"use strict";

function pz2e_statsheet(tokenID, action, shiftState, controlState) {
    let overlayHTML = null;

    if (action == "exit") {
        overlayHTML = "";
    } else {
        let token = MapTool.tokens.getTokenByID(tokenID);
        let tokenPropType = get_token_property_type(token);
        let tokenImage = get_token_image(token.getId(), 200);
        if (!(token.getName().includes("Lib")) && token.isPC()) {
            tokenID = token.getProperty("myID");
            token = MapTool.tokens.getTokenByID(tokenID);
        }
        MTScript.evalMacro("[h: playerData = player.getInfo()]");
        let playerData = JSON.parse(MTScript.getVariable("playerData"));
        let isGM = playerData.role == "GM";
        let playerName = playerData.name;
        MTScript.setVariable("tokenID", tokenID);
        if (token.getName().includes("Lib") && token.isPC()) {
            MTScript.evalMacro("[h: owners = getOwners(\"json\", tokenID, \"Player Characters\")]");
        } else {
            MTScript.evalMacro("[h: owners = getOwners(\"json\", tokenID)]");
        }
        let tokenOwners = JSON.parse(MTScript.getVariable("owners"));
        let themeData = JSON.parse(read_data("pz2e_themes"))[read_data("selectedTheme")];
        overlayHTML = "<html><head><link rel='stylesheet' type='text/css' href='lib://ca.pz2e/css/" + themeData.css + "'/></head>";

        overlayHTML += "<div class='statsheet'>";
        overlayHTML += "<div class='statsheet_title'><img src='" + tokenImage + "' height=150 width=150></img>";
        overlayHTML += "<div><b>" + token.getName().replace("Lib:", "") + "</b></div>";

        let statEntries = [];

        if (isGM || tokenOwners.includes(playerName)) {
            overlayHTML += "</div>";
            try {
                if (tokenPropType == "PZ2E_Character") {
                    statEntries = [
                        { "text": capitalise(token.getProperty("size")) + " | " + array_to_string(JSON.parse(token.getProperty("traits"))) + " | " + token.getProperty("level"), "label": "Creature" },
                        { "text": display_hp(tokenID) + " | " + display_speeds(tokenID), "label": "" },
                        { "text": "AC: " + calculate_ac(tokenID) + " | " + display_save_bonuses(tokenID), "label": "Defenses" },
                        { "text": JSON.parse(token.getProperty("immunities")).join(", "), "label": "Immunities" },
                        { "text": resistances_to_string(JSON.parse(token.getProperty("resistances"))), "label": "Resistances" },
                        { "text": display_weaknesses(tokenID), "label": "Weaknesses" },
                        { "text": "+" + token.getProperty("perception") + display_bonus(tokenID, "perception") + " | " + array_to_string(JSON.parse(token.getProperty("senses"))), "label": "Perception" },
                        { "text": array_to_string(JSON.parse(token.getProperty("languages"))), "label": "Languages" },
                        { "text": display_conditions(tokenID), "label": "Conditions" },
                        { "text": display_spell_slots(tokenID), "label": "Spell Slots" },
                        { "text": display_active_effects(tokenID), "label": "Effects" }];
                } else if (tokenPropType == "PZ2E_Hazard") {
                    statEntries = [
                        { "text": array_to_string(JSON.parse(token.getProperty("traits"))) + " | " + token.getProperty("level"), "label": "Hazard" },
                        { "text": display_hp(tokenID) + " | " + "Hardness: " + token.getProperty("hardness"), "label": "HP" },
                        { "text": "AC: " + calculate_ac(tokenID) + " | " + display_save_bonuses(tokenID), "label": "Defense" },
                        { "text": display_hazard_stealth(tokenID), "label": "Stealth" },
                        { "text": JSON.parse(token.getProperty("immunities")).join(", "), "label": "Immunities" },
                        { "text": resistances_to_string(JSON.parse(token.getProperty("resistances"))), "label": "Resistances" },
                        { "text": display_weaknesses(tokenID), "label": "Weaknesses" }
                    ];
                }
            } catch (e) {
                if (String(e).startsWith("Error: PZ2E")) {
                    throw e;
                }
                MapTool.chat.broadcast("Error in pz2e_statsheet - setup stats");
                MapTool.chat.broadcast("token.getName(): " + token.getName());
                MapTool.chat.broadcast("isGM: " + String(isGM));
                MapTool.chat.broadcast("tokenOwners: " + JSON.stringify(tokenOwners));
                MapTool.chat.broadcast("" + e + "\n" + e.stack);
                throw new Error("PZ2E: pz2e_statsheet - setup stats");
            }

            if (statEntries.length > 0) {
                MTScript.setVariable("tokenID", tokenID);
                overlayHTML += "<div class='statsheet_content'><table>";
                for (var s in statEntries) {
                    let statData = statEntries[s];
                    if (statData.text != "") {
                        overlayHTML += "<tr><th><b>" + statData.label + "</b></th><td>" + statData.text + "</td></tr>";
                    }
                }
                overlayHTML += "</table></div>";
            }
        } else {
            if (!token.isPC() && tokenPropType == "PZ2E_Character" && Number(token.getProperty("HP")) != 0) {
                let foundryActor = JSON.parse(token.getProperty("foundryActor"));
                let damageTracker = foundryActor.damageTracker;
                if (damageTracker.value > 0) {
                    overlayHTML += "<div>" + String(damageTracker.value) + " Damage Taken</div>";
                }
            }
            overlayHTML += "</div>";
        }

        overlayHTML += "</html>";
    }

    //MapTool.chat.broadcast(overlayHTML.replaceAll("<", "&lt;"))

    MTScript.setVariable("overlayHTML", overlayHTML);
    MTScript.evalMacro("[overlay(\"PZ2E_Statsheet\"):{[r: overlayHTML]}]");
};

MTScript.registerMacro("ca.pz2e.pz2e_statsheet", pz2e_statsheet);

