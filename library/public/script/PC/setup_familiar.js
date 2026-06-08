"use strict";

function setup_familiar(baseData) {
    let PCData = baseData.PCData;
    let familiarDataRaw = baseData.familiarData;

    //MapTool.chat.broadcast(JSON.stringify(familiarDataRaw));

    let newFamiliarData = {};
    newFamiliarData.name = familiarDataRaw.name;
    newFamiliarData.level = PCData.level;
    newFamiliarData.hp = { "max": PCData.level * 5 };
    newFamiliarData.ac = { "value": PCData.ac.value }
    newFamiliarData.abilities = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 };
    newFamiliarData.saves = {
        "fortitude": PCData.saves.fortitude,
        "reflex": PCData.saves.reflex,
        "will": PCData.saves.will
    };
    newFamiliarData.speeds = { "base": 0, "other": [] };
    newFamiliarData.senses = ["low-light"];
    newFamiliarData.size = "tiny";
    newFamiliarData.traits = ["minion", "familiar"];
    newFamiliarData.immunities = [];
    newFamiliarData.resistances = [];
    newFamiliarData.weaknesses = [];
    newFamiliarData.alignment = "";
    newFamiliarData.rarity = "common";
    newFamiliarData.proficiencies = [];
    newFamiliarData.inventory = {};
    newFamiliarData.passiveSkills = [];
    newFamiliarData.passiveDefenses = [];
    newFamiliarData.otherDefenses = [];
    newFamiliarData.basicAttacks = [];
    newFamiliarData.spellRules = {};
    newFamiliarData.offensiveActions = [];
    newFamiliarData.languages = [];
    newFamiliarData.resources = {};
    newFamiliarData.proficiencies = [];
    newFamiliarData.perception = PCData.level + 3;

    if (familiarDataRaw.abilities.includes("Darkvision")) {
        newFamiliarData.senses.push("darkvision");
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
        "Performance": { "name": "Performance", "stat": "cha" },
        "Religion": { "name": "Religion", "stat": "wis" },
        "Society": { "name": "Society", "stat": "int" },
        "Stealth": { "name": "Stealth", "stat": "dex" },
        "Survival": { "name": "Survival", "stat": "wis" },
        "Thievery": { "name": "Thievery", "stat": "dex" },
        "Perception": { "name": "Perception", "stat": "wis" }
    };

    let bestSpellAbility = 0;
    try {
        for (var a in PCData.spellRules) {
            let castingData = PCData.spellRules[a];
            let spellAbility = PCData.abilities[castingData.castingAbility];
            if (spellAbility > bestSpellAbility) {
                bestSpellAbility = spellAbility;
            }
        }
    } catch (e) {
        if (String(e).startsWith("Error: PZ2E")) {
            throw e;
        }
        MapTool.chat.broadcast("Error in setup_familiar - spellcasting");
        MapTool.chat.broadcast("PCData.spellRules: " + JSON.stringify(PCData.spellRules));
        MapTool.chat.broadcast("bestSpellAbility: " + String(bestSpellAbility));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        throw new Error("PZ2E: setup_familiar - spellcasting");
    }

    try {
        for (var s in skills) {
            if (s != "Perception" && s != "Acrobatics" && s != "Stealth") {
                newFamiliarData.proficiencies.push({ "name": s, "bonus": PCData.level, "string": (s + " +" + String(PCData.level)) });
            } else {
                let skillBonus = Number(PCData.level + Math.max(3, bestSpellAbility));
                newFamiliarData.proficiencies.push({ "name": s, "bonus": skillBonus, "string": (s + " +" + String(skillBonus)) });
                if (s == "Perception") {
                    newFamiliarData.perception = skillBonus;
                }
            }
        }
    } catch (e) {
        if (String(e).startsWith("Error: PZ2E")) {
            throw e;
        }
        MapTool.chat.broadcast("Error in setup_familiar - skills");
        MapTool.chat.broadcast("newFamiliarData.proficiencies: " + JSON.stringify(newFamiliarData.proficiencies));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        throw new Error("PZ2E: setup_familiar - skills");
    }

    try {
        MTScript.evalMacro("[h: input(\"speedData|Normal,Aquatic|Movement Type|List\")]");
        let familiarSpeed = String(MTScript.getVariable("speedData"));
        if (familiarSpeed == "0" || familiarSpeed == 0) {
            newFamiliarData.speeds.base = 25;
        } else {
            newFamiliarData.speeds.other.push({ "type": "swim", "value": 25 });
        }
    } catch (e) {
        if (String(e).startsWith("Error: PZ2E")) {
            throw e;
        }
        MapTool.chat.broadcast("Error in setup_familiar - speeds");
        MapTool.chat.broadcast("newFamiliarData.speeds: " + JSON.stringify(newFamiliarData.proficiencies));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        throw new Error("PZ2E: setup_familiar - speeds");
    }

    let featureData = null;
    try {
        for (var f in familiarDataRaw.familiarAbilities) {
            featureData = familiarDataRaw.familiarAbilities[f];
            if (!(["Climber", "Tough", "Scent", "Tremorsense", "Resistance"].includes(featureData.name))) {
                if ("fileURL" in featureData) {
                    MapTool.chat.broadcast(JSON.stringify(featureData));
                    featureData = import_and_parse(featureData.name, featureData.type, false);
                    MapTool.chat.broadcast(JSON.stringify(featureData));
                    //parse_item(featureData.baseName, rest_call(featureData.fileURL), newFamiliarData);
                } else {
                    if (featureData.type == "action") {
                        newFamiliarData.offensiveActions.push(featureData);
                    }
                }
            } else if (featureData.name == "Tough") {
                newFamiliarData.hp.max += 2 * PCData.level;
            } else if (featureData.name == "Climber") {
                newFamiliarData.speeds.other.push({ "type": "climb", "value": 25 });
            } else if (featureData.name == "Scent") {
                newFamiliarData.senses.push("scent (imprescise, 30 feet)");
            } else if (featureData.name == "Tremorsense") {
                newFamiliarData.senses.push("tremorsense (imprescise, 30 feet)");
            } else if (featureData.name == "Resistance") {
                MTScript.evalMacro("[h: input(\"resistOne|acid,cold,electricity,fire,poison,sonic|First Resistance|List|VALUE=STRING\",\"resistTwo|acid,cold,electricity,fire,poison,sonic|Second Resistance|List|VALUE=STRING\")]");
                newFamiliarData.resistances.push({ "type": MTScript.getVariable("resistOne"), "value": (PCData.level / 2) });
                newFamiliarData.resistances.push({ "type": MTScript.getVariable("resistTwo"), "value": (PCData.level / 2) });
            }
        }
    } catch (e) {
        if (String(e).startsWith("Error: PZ2E")) {
            throw e;
        }
        MapTool.chat.broadcast("Error in setup_familiar - features");
        MapTool.chat.broadcast("featureData: " + JSON.stringify(featureData));
        MapTool.chat.broadcast("newFamiliarData: " + JSON.stringify(newFamiliarData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        throw new Error("PZ2E: setup_familiar - features");
    }

    let ownerID = baseData.ownerID;
    let ownerToken = MapTool.tokens.getTokenByID(ownerID);
    let ownerPetList = ownerToken.getProperty("pets");
    if (ownerPetList == "" || ownerPetList == null || ownerPetList == []) {
        ownerPetList = {};
    } else {
        ownerPetList = JSON.parse(ownerPetList);
    }
    if (newFamiliarData.name in ownerPetList) {
        write_creature_properties(newFamiliarData, ownerPetList[newFamiliarData.name])
    } else {
        MTScript.setVariable("petData", JSON.stringify(newFamiliarData));
        MTScript.evalMacro("[h: newPetID = ca.pz2e.Spawn_Pet_Lib(petData)]")
        let newPetID = MTScript.getVariable("newPetID");
        ownerPetList[newFamiliarData.name] = newPetID;
        ownerToken.setProperty("pets", JSON.stringify(ownerPetList));
    }
}

MTScript.registerMacro("ca.pz2e.setup_familiar", setup_familiar);