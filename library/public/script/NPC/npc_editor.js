'use strict';

function npc_editor(inputData) {
    let npcData = null;
    let foundrySizes = ["tiny", "sm", "med", "huge", "lg", "grg"];
    var sizeList = ["tiny", "small", "medium", "huge", "large", "gargantuan"];

    if ("untouchedData" in inputData) {

        npcData = JSON.parse(decode(inputData.untouchedData));
        inputData.untouchedData = "";

        //MapTool.chat.broadcast(JSON.stringify(inputData));

        if ("nameVal" in inputData) {
            npcData.name = inputData.nameVal;
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
                } else {
                    //Update Item?
                }
            }
            if (delItem != null) {
                npcData.items.splice(delItem, 1);
            }
        }
    } else {
        npcData = inputData;
    }

    if ("save" in inputData) {
        let customContent = JSON.parse(read_data("customContent"));
        customContent.npc[npcData.name] = npcData;
        write_data("customContent", JSON.stringify(customContent));
        MTScript.evalMacro("[h: closeFrame(\"Edit NPC\")]");
        //TODO INSERT CUSTOM CONTENT INTO DATA
        return;
    }

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

    //workaround for weirdness
    npcData.system.traits.value = JSON.parse(JSON.stringify(npcData.system.traits.value));

    let outputHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'>";
    outputHTML += "<form action='macro://NPC_Editor@Lib:ca.pf2e/self/impersonated?'>";
    outputHTML += "<input type='hidden' name='untouchedData' value='" + encode(JSON.stringify(npcData)) + "'></input>"

    outputHTML += "<table class='center'><thead><tr><th>Name:</th><th colspan='5'><input type='input' name='nameVal' value='" + npcData.name + "'></input></th></tr></thead>";
    outputHTML += "<tbody><tr><td>Level</td><td colspan='5'><input type='input' name='levelVal' value='" + npcData.system.details.level.value + "' size=3></input></td>";
    outputHTML += "</tr><tr><td>STR</td><td>DEX</td><td>CON</td><td>INT</td><td>WIS<br></td><td>CHA<br></td></tr><tr>";
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

    outputHTML += "<td colspan='2'>Size:</td><td><select name='sizeVal'>";
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

    outputHTML += "<tr><td colspan='6' style='text-align:center'>Skills</td></tr>";
    outputHTML += "<tr><td colspan='6'><table class='center'>";
    let skillCounter = 0;
    for (var s in npcData.system.skills) {
        outputHTML += "<tr><td><input type='input' name='skillName_" + skillCounter + "' value='" + capitalise(s) + "' size=10></input></td>\
        <td><input type='input' name='skillVal_"+ skillCounter + "' value='" + npcData.system.skills[s].base + "' size=3></input></td>\
        <td><input type='submit' name='delSkill_"+ skillCounter + "' value='Remove Skill'></td></tr>";
        skillCounter++;
    }
    outputHTML += "<tr><td><input type='input' name='newSkill' value='New Skill' size=10></input></td>\
        <td><input type='input' name='newSkillVal' value='1' size=3></input></td><td><input type='submit' name='addSkill' value='Add'></input></td></tr>";
    outputHTML += "</table></td></tr>";
    outputHTML += "<input type='hidden' name='skillCount' value='" + skillCounter + "'></input>"

    outputHTML += "<tr><td colspan='6' style='text-align:center'>Items, Features, and Spells</td></tr>";
    outputHTML += "<tr><td colspan='6'><table class='center'>";
    let itemCounter = 0;
    for (var s in npcData.items) {
        let itemData = npcData.items[s]
        outputHTML += "<tr><td>" + itemData.name + "</td><td>" + capitalise(itemData.type) + "</td><td><input type='submit' name='delItem_" + itemCounter + "' value='Remove'></td></tr>"
        itemCounter++;
    }
    outputHTML += "</table></td></tr>";
    outputHTML += "<input type='hidden' name='itemCount' value='" + itemCounter + "'></input>"

    outputHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input></td></tr>";
    outputHTML += "</tbody></table></form>";

    MTScript.setVariable("outputHTML", outputHTML);
    MTScript.evalMacro("[frame5(\"Edit NPC\", \"width=450; height=700; temporary=1; noframe=0; input=1\"):{[r: outputHTML]}]");
}

MTScript.registerMacro('ca.pf2e.npc_editor', npc_editor);