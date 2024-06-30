"use strict";

function parse_item(itemData, parentObject) {
    if (itemData.type == "lore") {
        let newSkill = { "string": itemData.name + " +" + itemData.system.mod.value, "name": itemData.name, "bonus": itemData.system.mod.value };
        parentObject.skillList.push(newSkill);
    } else if (itemData.type == "item" || itemData.type == "shield" || itemData.type == "weapon" || itemData.type == "armor" || itemData.type == "consumable") {
        parentObject.itemList[itemData._id] = itemData;
        if (itemData.type == "shield" && (!("shield" in parentObject.foundryActor.system.attributes) || parentObject.foundryActor.system.attributes.shield == null)) {
            itemData.system.equipped = true;
            parentObject.foundryActor.system.attributes.shield = itemData;
        }
    } else if (itemData.type == "melee" || itemData.type == "ranged") {
        parentObject.basicAttacks.push(itemData);
    } else if (itemData.type == "spellcastingEntry") {
        let newSpellEntry = { "name": itemData.name, "spells": [], "spellDC": itemData.system.spelldc.dc, "spellAttack": itemData.system.spelldc.value, "type": itemData.system.prepared.value }
        if ("autoHeightenLevel" in itemData.system && "value" in itemData.system.autoHeightenLevel && itemData.system.autoHeightenLevel.value != null) {
            newSpellEntry["autoHeighten"] = itemData.system.autoHeightenLevel.value
        } else {
            newSpellEntry["autoHeighten"] = Math.ceil(parentObject.level / 2);
        }
        parentObject.spellRules[itemData._id] = newSpellEntry;
    } else if (itemData.type == "spell") {
        if (itemData.system.traits.value.includes("cantrip") || itemData.system.traits.value.includes("focus")) {
            itemData.system.castLevel = { "value": parentObject.spellRules[itemData.system.location.value].autoHeighten };
        } else {
            itemData.system.castLevel = itemData.system.level;
        }
        itemData.system.actionType = { "value": "spell" };
        itemData.system.creatureLevel = { "value": parentObject.level };
        if (itemData.system.location.value != null) {
            itemData.system.group = { "value": parentObject.spellRules[itemData.system.location.value].name };
            parentObject.spellRules[itemData.system.location.value].spells.push(itemData);
        } else if ("ritual" in itemData.system) {
            itemData.system.group = { "value": parentObject.spellRules["rituals"].name };
            parentObject.spellRules["rituals"].spells.push(itemData);
        }
    } else {
        parentObject.features[itemData.name] = itemData;
    }
}