'use strict';

function npc_editor(inputData) {
    let npcData = null;
    let foundrySizes = ["tiny", "sm", "med", "huge", "lg", "grg"];
    let sizeList = ["tiny", "small", "medium", "huge", "large", "gargantuan"];
    let rarityList = ["common", "uncommon", "rare", "legendary", "unique"];
    let castingTypes = ["focus", "innate", "prepared"];
    let castingTraditions = ["arcane", "divine", "occult", "primal"];
    let page = "General";
    let weaponNames = {};
    let weaponIDs = {};
    let spellCastingNames = {};
    let spellCastingIDs = {};
    let spellNames = {};
    let spellIDs = {};
    let spellCastLevels = {};
    let castTypeMap = {};

    if ("untouchedData" in inputData) {

        if ("currentPage" in inputData) {
            page = inputData.currentPage;
        }
        if ("setPage" in inputData) {
            page = inputData.setPage;
        }

        npcData = JSON.parse(decode(inputData.untouchedData));
        inputData.untouchedData = "";
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (itemData.type == "weapon") {
                weaponNames[itemData._id] = itemData.name;
                weaponIDs[itemData.name] = itemData._id;
            } else if (itemData.type == "spellcastingEntry") {
                spellCastingNames[itemData._id] = itemData.name;
                spellCastingIDs[itemData.name] = itemData._id;
                castTypeMap[itemData._id] = itemData.system.prepared.value;
            } else if (itemData.type == "spell") {
                spellNames[itemData._id] = itemData.name;
                spellIDs[itemData.name] = itemData._id;
                let parentCasting = null;
                try {
                    parentCasting = itemData.system.location.value;
                    if (itemData.system.traits.value.includes("cantrip") && !(itemData.system.traits.value.includes("focus")) && page == "Spells") {
                        for (var p in npcData.items) {
                            if (npcData.items[p]._id == parentCasting) {
                                parentCasting = npcData.items[p];
                                break;
                            }
                        }
                        let found = false;
                        for (var c in parentCasting.system.slots.slot0.prepared) {
                            if (parentCasting.system.slots.slot0.prepared[c].id == itemData._id) {
                                found = true;
                            }
                        }
                        if (!found) {
                            parentCasting.system.slots.slot0.max++;
                            parentCasting.system.slots.slot0.prepared.push({ "id": itemData._id });
                        }
                    }
                } catch (e) {
                    MapTool.chat.broadcast("Error in spell_cantrip_apply");
                    MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
                    MapTool.chat.broadcast("parentCasting: " + JSON.stringify(parentCasting));
                    MapTool.chat.broadcast("" + e + "\n" + e.stack);
                    return;
                }
            }
        }

        //MapTool.chat.broadcast(JSON.stringify(inputData));

        if ("nameVal" in inputData) {
            npcData.name = inputData.nameVal;
        }
        if ("rarityVal" in inputData) {
            npcData.system.traits.rarity = inputData.rarityVal.toLowerCase();
        }
        if ("levelVal" in inputData) {
            npcData.system.details.level.value = Number(inputData.levelVal);
        }
        if ("strModVal" in inputData) {
            npcData.system.abilities.str.mod = Number(inputData.strModVal);
        }
        if ("dexModVal" in inputData) {
            npcData.system.abilities.dex.mod = Number(inputData.dexModVal);
        }
        if ("conModVal" in inputData) {
            npcData.system.abilities.con.mod = Number(inputData.conModVal);
        }
        if ("intModVal" in inputData) {
            npcData.system.abilities.int.mod = Number(inputData.intModVal);
        }
        if ("wisModVal" in inputData) {
            npcData.system.abilities.wis.mod = Number(inputData.wisModVal);
        }
        if ("chaModVal" in inputData) {
            npcData.system.abilities.cha.mod = Number(inputData.chaModVal);
        }
        if ("acVal" in inputData) {
            npcData.system.attributes.ac.value = Number(inputData.acVal);
        }
        if ("hpMaxVal" in inputData) {
            npcData.system.attributes.hp.max = Number(inputData.hpMaxVal);
            npcData.system.attributes.hp.value = Number(inputData.hpMaxVal);
        }
        if ("baseSpeedVal" in inputData) {
            npcData.system.attributes.speed.value = Number(inputData.baseSpeedVal);
        }
        if ("perceptionVal" in inputData) {
            npcData.system.perception.mod = Number(inputData.perceptionVal);
        }
        if ("sizeVal" in inputData) {
            npcData.system.traits.size.value = foundrySizes[sizeList.indexOf(inputData.sizeVal.toLowerCase())];
        }
        if ("fortVal" in inputData) {
            npcData.system.saves.fortitude.value = Number(inputData.fortVal);
        }
        if ("refVal" in inputData) {
            npcData.system.saves.reflex.value = Number(inputData.refVal);
        }
        if ("willVal" in inputData) {
            npcData.system.saves.will.value = Number(inputData.willVal);
        }
        if ("traitVal" in inputData) {
            npcData.system.traits.value = inputData.traitVal.split(", ");
        }
        if ("sourceVal" in inputData) {
            npcData.system.details.publication.title = inputData.sourceVal;
        }
        if ("skillCount" in inputData) {
            for (let i = 0; i < inputData.skillCount; i++) {
                let updateSkillName = inputData["skillName_" + String(i)].toLowerCase();
                if (("delSkill_" + i) in inputData) {
                    delete npcData.system.skills[updateSkillName]
                } else {
                    let updateSkillBonus = inputData["skillVal_" + String(i)];
                    if (updateSkillName in npcData.system.skills) {
                        npcData.system.skills[updateSkillName].base = Number(updateSkillBonus);
                    } else {
                        npcData.system.skills[updateSkillName] = { "base": Number(updateSkillBonus) };
                    }
                }
            }
        }
        if ("addSkill" in inputData && "newSkill" in inputData && inputData.newSkill != "New Skill") {
            npcData.system.skills[inputData.newSkill.toLowerCase()] = { "base": Number(inputData.newSkillVal) };
        }
        if ("itemCount" in inputData) {
            let delItem = null;
            for (let i = 0; i < inputData.itemCount; i++) {
                if (("delItem_" + i) in inputData) {
                    delItem = i;
                }
                let itemData = npcData.items[i];
                if (("itemNameVal_" + i) in inputData) {
                    itemData.name = inputData["itemNameVal_" + i];
                }
                if (("itemAttackBonus_" + i) in inputData) {
                    itemData.system.bonus.value = Number(inputData["itemAttackBonus_" + i]);
                }
                if (("itemDamageCount_" + i) in inputData) {
                    for (let d = 0; d < inputData["itemDamageCount_" + i]; d++) {
                        let damageID = inputData["itemDamageID_" + i + "_" + d];
                        if (("itemAttackDamageDamage_" + i + "_" + damageID) in inputData) {
                            itemData.system.damageRolls[damageID].damage = inputData["itemAttackDamageDamage_" + i + "_" + damageID];
                        }
                        if (("itemAttackDamageType_" + i + "_" + damageID) in inputData) {
                            itemData.system.damageRolls[damageID].damageType = inputData["itemAttackDamageType_" + i + "_" + damageID];
                        }
                    }
                }
                if (("itemTraitVal_" + i) in inputData && inputData["itemTraitVal_" + i] != "") {
                    itemData.system.traits.value = inputData["itemTraitVal_" + i].split(", ");
                } else if (("itemTraitVal_" + i) in inputData) {
                    itemData.system.traits.value = [];
                }
                if (("itemWeaponLink_" + i) in inputData) {
                    if (!("flags" in itemData)) {
                        itemData.flags = { "pf2e": { "linkedWeapon": null } }
                    } else if (!("pf2e" in itemData.flags)) {
                        itemData.flags.pf2e = { "linkedWeapon": null }
                    }
                    itemData.flags.pf2e.linkedWeapon = weaponIDs[inputData["itemWeaponLink_" + i]];
                }
                if (("itemCastBonusVal_" + i) in inputData) {
                    itemData.system.spelldc.value = inputData["itemCastBonusVal_" + i];
                }
                if (("itemCastDCVal_" + i) in inputData) {
                    itemData.system.spelldc.dc = inputData["itemCastDCVal_" + i];
                }
                if (("itemCastingTradition_" + i) in inputData) {
                    itemData.system.tradition.value = inputData["itemCastingTradition_" + i].toLowerCase();
                }
                if (("itemCastingType_" + i) in inputData) {
                    itemData.system.prepared.value = inputData["itemCastingType_" + i].toLowerCase();
                }
                if (itemData.type == "spell") {
                    for (var rank = 1; rank <= 9; rank++) {
                        let parentCasting = itemData.system.location.value;
                        try {
                            if (("spellCastCount_" + i + "_rank_" + rank) in inputData) {
                                for (var p in npcData.items) {
                                    if (npcData.items[p]._id == parentCasting) {
                                        parentCasting = npcData.items[p];
                                        break;
                                    }
                                }
                                let foundIndexes = [];
                                if (!(String("slot" + rank) in parentCasting.system.slots)) {
                                    parentCasting.system.slots[String("slot" + rank)] = { "max": 0, "prepared": [] };
                                }
                                for (var c = 0; c < parentCasting.system.slots["slot" + rank].prepared.length; c++) {
                                    if (parentCasting.system.slots["slot" + rank].prepared[c].id == itemData._id) {
                                        foundIndexes.push(c);
                                    }
                                }
                                parentCasting.system.slots["slot" + rank].max -= foundIndexes.length;
                                for (var delIdx = foundIndexes.length - 1; delIdx >= 0; delIdx--) {
                                    parentCasting.system.slots["slot" + rank].prepared.splice(foundIndexes[delIdx], 1);
                                }

                                for (var c = 0; c < inputData["spellCastCount_" + i + "_rank_" + rank]; c++) {
                                    parentCasting.system.slots["slot" + rank].prepared.push({ "id": itemData._id });
                                    parentCasting.system.slots["slot" + rank].max++;
                                }
                            }
                        } catch (e) {
                            MapTool.chat.broadcast("Error in spell_cast_count_update");
                            MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
                            MapTool.chat.broadcast("parentCasting: " + JSON.stringify(parentCasting));
                            MapTool.chat.broadcast("i: " + String(i));
                            MapTool.chat.broadcast("rank: " + String(rank));
                            MapTool.chat.broadcast("" + e + "\n" + e.stack);
                            return;
                        }
                    }
                }
            }
            if (delItem != null) {
                npcData.items.splice(delItem, 1);
            }
        }
        if ("addAttack" in inputData) {
            npcData.items.push({ "_id": generate_uid(20), "flags": { "pf2e": { "linkedWeapon": null } }, "img": "systems/pf2e/icons/default-icons/melee.svg", "name": "New Attack", "sort": 99999999, "system": { "attack": { "value": "" }, "attackEffects": { "custom": "", "value": [] }, "bonus": { "value": 15 }, "damageRolls": { "mjadst6lj09xzqchu9ct": { "damage": "1d10", "damageType": "slashing" } }, "description": { "value": "" }, "publication": { "license": "OGL", "remaster": false, "title": "" }, "rules": [], "slug": null, "traits": { "rarity": "common", "value": [] }, "weaponType": { "value": "melee" } }, "type": "melee" })
        }
        if ("addItem" in inputData) {
            let allItems = JSON.parse(read_data("pf2e_item"));
            if (inputData.newItemName in allItems) {
                let newItemData = allItems[inputData.newItemName];
                if ("fileURL" in newItemData) {
                    newItemData = rest_call(newItemData["fileURL"], "");
                }
                npcData.items.push(newItemData);
                if (newItemData.type == "weapon") {
                    weaponNames[newItemData._id] = newItemData.name;
                    weaponIDs[newItemData.name] = newItemData._id;
                }
            } else if (inputData.newItemName in customContent.items) {
                let newItemData = customContent.items[inputData.newItemName];
                npcData.items.push(newItemData);
                if (newItemData.type == "weapon") {
                    weaponNames[newItemData._id] = newItemData.name;
                    weaponIDs[newItemData.name] = newItemData._id;
                }
            }
        }
        if ("addSpell" in inputData) {
            let allSpells = JSON.parse(read_data("pf2e_spell"));
            for (var s in spellCastingNames) {
                if (("addSpellName_" + s) in inputData) {
                    let newSpellName = inputData["addSpellName_" + s];
                    if (newSpellName != "New Spell") {
                        if (newSpellName in allSpells) {
                            let newSpell = allSpells[newSpellName];
                            if (newSpell != null && "fileURL" in newSpell) {
                                newSpell = rest_call(newSpell["fileURL"], "");
                            }
                            newSpell.system.location = { "value": s };
                            npcData.items.push(newSpell);
                            spellIDs[newSpell.name] = newSpell._id;
                            spellNames[newSpell._id] = newSpell.name;
                        }
                    }
                }
            }
        }

        //Recalculate after alterations
        spellCastLevels = {};
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (itemData.type == "weapon") {
                weaponNames[itemData._id] = itemData.name;
                weaponIDs[itemData.name] = itemData._id;
            } else if (itemData.type == "spellcastingEntry") {
                spellCastingNames[itemData._id] = itemData.name;
                spellCastingIDs[itemData.name] = itemData._id;
                castTypeMap[itemData._id] = itemData.system.prepared.value;
                if (itemData.system.prepared.value == "prepared") {
                    var rankCounter = 1;
                    while (("slot" + rankCounter) in itemData.system.slots) {
                        let slotData = itemData.system.slots[("slot" + rankCounter)];
                        for (var spell in slotData.prepared) {
                            spell = slotData.prepared[spell];
                            if (!(spell.id in spellCastLevels)) {
                                spellCastLevels[spell.id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            }
                            spellCastLevels[spell.id][rankCounter]++;
                        }
                        rankCounter++;
                    }
                }
            } else if (itemData.type == "spell") {
                spellNames[itemData._id] = itemData.name;
                spellIDs[itemData.name] = itemData._id;
                if (!(itemData._id in spellCastLevels)) {
                    spellCastLevels[itemData._id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
        }
    } else {
        npcData = inputData;
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (itemData.type == "weapon") {
                weaponNames[itemData._id] = itemData.name;
                weaponIDs[itemData.name] = itemData._id;
            } else if (itemData.type == "spellcastingEntry") {
                spellCastingNames[itemData._id] = itemData.name;
                spellCastingIDs[itemData.name] = itemData._id;
                castTypeMap[itemData._id] = itemData.system.prepared.value;
                if (itemData.system.prepared.value == "prepared") {
                    var rankCounter = 1;
                    while (("slot" + rankCounter) in itemData.system.slots) {
                        let slotData = itemData.system.slots[("slot" + rankCounter)];
                        for (var spell in slotData.prepared) {
                            spell = slotData.prepared[spell];
                            if (!(spell.id in spellCastLevels)) {
                                spellCastLevels[spell.id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            }
                            spellCastLevels[spell.id][rankCounter]++;
                        }
                        rankCounter++;
                    }
                }
            } else if (itemData.type == "spell") {
                spellNames[itemData._id] = itemData.name;
                spellIDs[itemData.name] = itemData._id;
                if (!(itemData._id in spellCastLevels)) {
                    spellCastLevels[itemData._id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
        }
    }
    npcData.system.attributes.ac.details = "";

    if ("save" in inputData) {
        //Set Filtering Data for Creature List
        npcData.baseName = npcData.name.toLowerCase().replaceAll(" ", "-");
        npcData.level = npcData.system.details.level.value;
        npcData.rarity = npcData.system.traits.rarity;
        npcData.size = npcData.system.traits.size.value;
        npcData.source = npcData.system.details.publication.title;
        npcData.traits = npcData.system.traits.value;

        let customContent = JSON.parse(read_data("customContent"));
        customContent.npc[npcData.name + "|" + npcData.source] = npcData;
        if (!customContent.source.includes(npcData.system.details.publication.title)) {
            customContent.source.push(npcData.system.details.publication.title);
        }
        write_data("customContent", JSON.stringify(customContent));
        MTScript.evalMacro("[h: closeFrame(\"Edit NPC\")]");
        return;
    }

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

    //workaround for weirdness
    npcData.system.traits.value = JSON.parse(JSON.stringify(npcData.system.traits.value));

    let outputHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'>";
    outputHTML += "<form action='macro://NPC_Editor@Lib:ca.pf2e/self/impersonated?'>";
    outputHTML += "<input type='hidden' name='untouchedData' value='" + encode(JSON.stringify(npcData)) + "'></input>"
    outputHTML += "<input type='hidden' name='currentPage' value='" + page + "'></input>"

    if (page == "General") {
        outputHTML += "<table class='center'><thead><tr><th>Name:</th><th colspan='5'><input type='input' name='nameVal' value='" + npcData.name + "'></input></th></tr></thead><tbody>";
        outputHTML += "<tr><td>Level</td><td><input type='input' name='levelVal' value='" + npcData.system.details.level.value + "' size=3></input></td>\
        <td colspan='4'><select name='rarityVal'>";
        for (var s in rarityList) {
            outputHTML += "<option " + ((rarityList[s] == npcData.system.traits.rarity) ? "selected" : "") + ">" + capitalise(rarityList[s]) + "</option>";
        }
        outputHTML += "</select></td></tr><tr><td>STR</td><td>DEX</td><td>CON</td><td>INT</td><td>WIS<br></td><td>CHA<br></td></tr><tr>";
        outputHTML += "<td><input type='input' name='strModVal' value='" + npcData.system.abilities.str.mod + "' size=3></input></td>";
        outputHTML += "<td><input type='input' name='dexModVal' value='" + npcData.system.abilities.dex.mod + "' size=3></input></td>";
        outputHTML += "<td><input type='input' name='conModVal' value='" + npcData.system.abilities.con.mod + "' size=3></input></td>";
        outputHTML += "<td><input type='input' name='intModVal' value='" + npcData.system.abilities.int.mod + "' size=3></input></td>";
        outputHTML += "<td><input type='input' name='wisModVal' value='" + npcData.system.abilities.wis.mod + "' size=3></input></td>";
        outputHTML += "<td><input type='input' name='chaModVal' value='" + npcData.system.abilities.cha.mod + "' size=3></input></td>";
        outputHTML += "</tr>";
        outputHTML += "<tr><td>AC:</td><td><input type='input' name='acVal' value='" + npcData.system.attributes.ac.value + "' size=3></input></td>";
        outputHTML += "<td>HP:</td><td><input type='input' name='hpMaxVal' value='" + npcData.system.attributes.hp.max + "' size=5></input></td>";
        outputHTML += "<td>Speed:</td><td><input type='input' name='baseSpeedVal' value='" + npcData.system.attributes.speed.value + "' size=3></input></td></tr>";
        outputHTML += "<tr><td colspan='2'>Perception:</td><td><input type='input' name='perceptionVal' value='" + npcData.system.perception.mod + "' size=3></input></td>";

        outputHTML += "<td colspan='1'>Size:</td><td colspan='2'><select name='sizeVal'>";
        for (var s in sizeList) {
            outputHTML += "<option " + ((s == foundrySizes.indexOf(npcData.system.traits.size.value)) ? "selected" : "") + ">" + capitalise(sizeList[s]) + "</option>";
        }
        outputHTML += "</select></td></tr>";

        outputHTML += "<tr><td colspan='2'>Fortitude</td><td colspan='2'>Reflex</td><td colspan='2'>Will</td></tr>";
        outputHTML += "<tr><td colspan='2'><input type='input' name='fortVal' value='" + npcData.system.saves.fortitude.value + "' size=3></input></td>";
        outputHTML += "<td colspan='2'><input type='input' name='refVal' value='" + npcData.system.saves.reflex.value + "' size=3></input></td>";
        outputHTML += "<td colspan='2'><input type='input' name='willVal' value='" + npcData.system.saves.will.value + "' size=3></input></td>";
        outputHTML += "</tr>";
        outputHTML += "<tr><td colspan='6' style='text-align:center'>Traits</td></tr>";
        outputHTML += "<tr><td colspan='6'><input type='input' name='traitVal' value='" + npcData.system.traits.value.join(", ") + "' size=50></input></td></tr>";
        outputHTML += "<tr><td>Source :</td><td colspan='5'><input type='input' name='sourceVal' value='" + npcData.system.details.publication.title + "' size=40></input></td></tr>";
    } else if (page == "Skills") {

        outputHTML += "<table class='center'><thead><tr><th colspan='3' style='text-align:center'>" + npcData.name + "</th></tr></thead><tbody>";
        outputHTML += "<tr><td colspan='3' style='text-align:center'>Skills</td></tr>";
        let skillCounter = 0;
        for (var s in npcData.system.skills) {
            outputHTML += "<tr><td><input type='input' name='skillName_" + skillCounter + "' value='" + capitalise(s) + "' size=10></input></td>\
            <td><input type='input' name='skillVal_"+ skillCounter + "' value='" + npcData.system.skills[s].base + "' size=3></input></td>\
            <td><input type='submit' name='delSkill_"+ skillCounter + "' value='Remove Skill'></td></tr>";
            skillCounter++;
        }
        outputHTML += "<tr><td><input type='input' name='newSkill' value='New Skill' size=10></input></td>\
            <td><input type='input' name='newSkillVal' value='1' size=3></input></td><td><input type='submit' name='addSkill' value='Add'></input></td></tr>";
        outputHTML += "<input type='hidden' name='skillCount' value='" + skillCounter + "'></input>"
    } else if (page == "Items") {

        outputHTML += "<table class='center'><thead><tr><th colspan='3' style='text-align:center'>" + npcData.name + "</th></tr></thead><tbody>";
        outputHTML += "<tr><td colspan='3' style='text-align:center'>Items</td></tr>";
        let itemCounter = 0;
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            let itemTypes = ["weapon", "armor", "shield", "item", "consumable"];
            if (itemTypes.includes(itemData.type)) {
                outputHTML += "<tr><td>" + itemData.name + "</td><td>" + capitalise(itemData.type) + "</td><td><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>"
                //IF WEAPON, ADD RUNES SETTINGS
            }
            itemCounter++;
        }
        outputHTML += "<tr><td colspan='2'><input type='input' name='newItemName' value='New Item' size=10></input></td>\
        <td><input type='submit' name='addItem' value='Add Item'></input></td></tr>";
        outputHTML += "<input type='hidden' name='itemCount' value='" + itemCounter + "'></input>"

    } else if (page == "Attacks") {

        outputHTML += "<table class='center'><thead><tr><th colspan='6' style='text-align:center'>" + npcData.name + "</th></tr></thead><tbody>";
        outputHTML += "<tr><td colspan='6' style='text-align:center'>Attacks</td></tr>";
        outputHTML += "<tr><td colspan='6' style='background-color:" + themeData.colours.titleBackground + "'></td></tr>"
        let itemCounter = 0;
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (["melee", "ranged"].includes(itemData.type)) {
                outputHTML += "<tr><td colspan='4'><input type='input' name='itemNameVal_" + itemCounter + "' value='" + itemData.name + "' size=10></input></td><td colspan='2'><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>"
                outputHTML += "<td colspan='3'>" + capitalise(itemData.type) + "</td><td colspan='3'>Bonus: <input type='input' name='itemAttackBonus_" + itemCounter + "' value='" + itemData.system.bonus.value + "' size=4></input></td></tr>"
                outputHTML += "<tr><td colspan=6 style='text-align:center'>Damage</td></tr>";
                let damageCounter = 0;
                for (var d in itemData.system.damageRolls) {
                    outputHTML += "<tr><td colspan='3'><input type='input' name='itemAttackDamageDamage_" + itemCounter + "_" + d + "' value='" + itemData.system.damageRolls[d].damage + "' size=10></input></td>\
                    <td colspan='3'><input type='input' name='itemAttackDamageType_"+ itemCounter + "_" + d + "' value='" + itemData.system.damageRolls[d].damageType + "'></input></td></tr>"
                    outputHTML += "<input type='hidden' name='itemDamageID_" + itemCounter + "_" + damageCounter + "' value='" + d + "'></input>"
                    damageCounter++;
                }
                outputHTML += "<td>Traits: </td><td colspan='5'><input type='input' name='itemTraitVal_" + itemCounter + "' value='" + itemData.system.traits.value.join(", ") + "'></input></td></tr>"
                outputHTML += "<tr><td>Linked Weapon</td><td colspan='5'><select name='itemWeaponLink_" + itemCounter + "'><option>None</option>";

                var linkedWeapon = null;
                if ("flags" in itemData && "pf2e" in itemData.flags && "linkedWeapon" in itemData.flags.pf2e) {
                    linkedWeapon = itemData.flags.pf2e.linkedWeapon;
                }
                for (var w in weaponNames) {
                    outputHTML += "<option " + ((w == linkedWeapon) ? "selected" : "") + ">" + weaponNames[w] + "</option>";
                }
                outputHTML += "</select></td></tr>";

                outputHTML += "<tr><td colspan='6' style='background-color:" + themeData.colours.titleBackground + "'></td></tr>";
                outputHTML += "<input type='hidden' name='itemDamageCount_" + itemCounter + "' value='" + damageCounter + "'></input>"
            }
            itemCounter++;
        }
        outputHTML += "<input type='hidden' name='itemCount' value='" + itemCounter + "'></input>"
        outputHTML += "<tr><td colspan='6' style='text-align:center'><input type='submit' name='addAttack' value='Add Attack'></input></td></tr>";

    } else if (page == "Spells") {

        outputHTML += "<table class='center'><thead><tr><th colspan='4' style='text-align:center'>" + npcData.name + "</th></tr></thead><tbody>";
        outputHTML += "<tr><td colspan='4' style='text-align:center'>Spellcasting</td></tr>";
        let castingHTML = {};
        let spellHTML = {};
        let itemCounter = 0;
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (itemData.type == "spellcastingEntry") {
                let castID = itemData._id;
                castingHTML[castID] = "<tr><td colspan='2'><input type='input' name='itemNameVal_" + itemCounter + "' value='" + itemData.name + "' size=30></input></td><td><select name='itemCastingType_" + itemCounter + "'>";
                for (var c in castingTypes) {
                    castingHTML[castID] += "<option  " + ((castingTypes[c] == itemData.system.prepared.value) ? "selected" : "") + ">" + capitalise(castingTypes[c]) + "</option>";
                }
                castingHTML[castID] += "</select></td><td><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>";
                castingHTML[castID] += "<tr><td colspan='4' style='text-align:center'>Tradition: <select name='itemCastingTradition_" + itemCounter + "'>";
                for (var c in castingTraditions) {
                    castingHTML[castID] += "<option  " + ((castingTraditions[c] == itemData.system.tradition.value) ? "selected" : "") + ">" + capitalise(castingTraditions[c]) + "</option>";
                }
                castingHTML[castID] += "<tr><td>Bonus:</td><td><input type='input' name='itemCastBonusVal_" + itemCounter + "' value='" + itemData.system.spelldc.value + "' size=5></input></td>\
                <td>DC: </td><td><input type='input' name='itemCastDCVal_" + itemCounter + "' value='" + itemData.system.spelldc.dc + "' size=5></input></td></tr>";
                castingHTML[castID] += "</select></td></tr>";
            } else if (itemData.type == "spell") {
                let parentCasting = itemData.system.location.value;
                let isCantrip = itemData.system.traits.value.includes("cantrip");
                let isFocus = itemData.system.traits.value.includes("focus");
                let spellType = "Spell";
                if (isCantrip) {
                    spellType = "Cantrip";
                } else if (isFocus && !isCantrip) {
                    spellType = "Focus";
                }
                if (!(parentCasting in spellHTML)) {
                    spellHTML[parentCasting] = "";
                }
                spellHTML[parentCasting] += "<tr><td colspan='2'>" + itemData.name + "</td><td>" + spellType + " " + String(itemData.system.level.value) + "</td><td><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>"
                if (castTypeMap[parentCasting] == "prepared" && !isCantrip) {
                    spellHTML[parentCasting] += "<tr><td colspan='4'><table width='100%'><tr>";
                    spellHTML[parentCasting] += "<td>1st</td><td>2nd</td><td>3rd</td><td>4th</td><td>5th</td><td>6th</td><td>7th</td><td>8th</td><td>9th</td></tr><tr>"
                    for (var rank in spellCastLevels[itemData._id]) {
                        if (rank == 0) {
                            continue;
                        }
                        spellHTML[parentCasting] += "<td><input type='input' name='spellCastCount_" + itemCounter + "_rank_" + rank + "' value='" + spellCastLevels[itemData._id][rank] + "' size=1 ></input></td>"
                    }
                    spellHTML[parentCasting] += "</tr></table></td></tr>";
                }
            }
            itemCounter++;
        }
        for (var s in castingHTML) {
            outputHTML += castingHTML[s];
            if (s in spellHTML) {
                outputHTML += spellHTML[s];
            }
            outputHTML += "<tr><td colspan='3'><input type='input' name='addSpellName_" + s + "' value='New Spell' size=30></input></td><td colspan='3'><input type='submit' name='addSpell' value='Add Spell'></td></tr>";
            outputHTML += "<tr><td colspan='6' style='background-color:" + themeData.colours.titleBackground + "'></td></tr>";
        }
        outputHTML += "<input type='hidden' name='itemCount' value='" + itemCounter + "'></input>";

    } else if (page == "Features") {

        outputHTML += "<table class='center'><thead><tr><th colspan='3' style='text-align:center'>" + npcData.name + "</th></tr></thead><tbody>";
        outputHTML += "<tr><td colspan='6' style='text-align:center'>Features</td></tr>";
        outputHTML += "<tr><td colspan='6'><table class='center'>";
        let itemCounter = 0;
        for (var s in npcData.items) {
            let itemData = npcData.items[s]
            if (["action"].includes(itemData.type)) {
                outputHTML += "<tr><td>" + itemData.name + "</td><td>" + capitalise(itemData.type) + "</td><td><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>";
            }
            itemCounter++;
        }
        outputHTML += "</table></td></tr>";
        outputHTML += "<input type='hidden' name='itemCount' value='" + itemCounter + "'></input>"
        //TODO ADD FEATURE

    }

    let nextPage = "General";
    let prevPage = "General";
    let colspan = 6;
    if (page == "General") {
        nextPage = "Skills";
        prevPage = "Features";
        colspan = 6;
    } else if (page == "Skills") {
        nextPage = "Items";
        prevPage = "General";
        colspan = 3;
    } else if (page == "Items") {
        nextPage = "Attacks";
        prevPage = "Skills";
        colspan = 6;
    } else if (page == "Attacks") {
        nextPage = "Spells";
        prevPage = "Items";
        colspan = 6;
    } else if (page == "Spells") {
        nextPage = "Features";
        prevPage = "Attacks";
        colspan = 6;
    } else if (page == "Features") {
        nextPage = "General";
        prevPage = "Spells";
        colspan = 6;
    }

    outputHTML += "<tr>\
    <td colspan='"+ String(colspan) + "' style='text-align:center'>\
    <input type='submit' name='setPage' value='" + prevPage + "'></input>\
    <input type='submit' name='update' value='Update'></input>\
    <input type='submit' name='save' value='Save'></input>\
    <input type='submit' name='setPage' value='"+ nextPage + "'></input></td></tr>";
    outputHTML += "</tbody></table></form>";

    MTScript.setVariable("outputHTML", outputHTML);
    MTScript.evalMacro("[frame5(\"Edit NPC\", \"width=500; height=700; temporary=1; noframe=0; input=1\"):{[r: outputHTML]}]");
}

MTScript.registerMacro('ca.pf2e.npc_editor', npc_editor);