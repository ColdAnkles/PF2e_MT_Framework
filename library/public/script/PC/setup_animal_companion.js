"use strict";

function setup_animal_companion(baseData){
    let companionData = baseData;
    if("update" in baseData){
        
    }

    if(!("attributes"  in companionData)){
        companionData.attributes = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};
    }
    if(!("ac" in companionData)){
        companionData.ac = 0;
    }
    if(!("maxHP" in companionData)){
        companionData.maxHP = 0;
    }
    if(!("saves" in companionData)){
        companionData.saves = {"fortitude":0,"reflex":0,"will":0};
    }
    if(!("perception" in companionData)){
        companionData.perception = 0;
    }
    if(!("speed" in companionData)){
        companionData.speed = 0;
    }
    if(!("size" in companionData)){
        companionData.size = "medium";
    }
    if(!("senses" in companionData)){
        companionData.senses = "";
    }
    if(!("supportBenefit" in companionData)){
        companionData.supportBenefit = "";
    }

    MapTool.chat.broadcast(JSON.stringify(baseData));
    if(!("Save" in companionData)){
        let queryHTML = "<html><p><form action='macro://Animal_Companion_Setup_To_JS@Lib:ca.pf2e/self/impersonated?'>"
        queryHTML += "<table style='width:100%'><tr><td colspan=6 style='text-align:center'><b>Animal Companion</b></td></tr>"
        queryHTML += "<tr><td colspan=3 style='text-align:right'><b>Name</b></td><td colspan=3><input type='input' name='strVal' value='"+companionData.name+"'></input></td></tr>"

        queryHTML += "<tr><td colspan=1 style='text-align:right'><b>HP</b></td><td colspan=2><input type='input' name='hpVal' value='"+String(companionData.maxHP)+"' size=5></input></td>\
        <td colspan=1 style='text-align:right'><b>AC</b></td><td colspan=2><input type='input' name='acVal' value='"+String(companionData.ac)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td style='text-align:center'><b>Str</b></td><td style='text-align:center'><b>Dex</b></td><td style='text-align:center'><b>Con</b></td>\
        <td style='text-align:center'><b>Int</b></td><td style='text-align:center'><b>Wis</b></td><td style='text-align:center'><b>Cha</b></td></tr>";

        queryHTML += 
        "<tr><td><input type='input' name='strVal' value='"+String(companionData.attributes.str)+"' size=5></input></td>\
        <td><input type='input' name='dexVal' value='"+String(companionData.attributes.dex)+"' size=5></input></td>\
        <td><input type='input' name='conVal' value='"+String(companionData.attributes.con)+"' size=5></input></td>\
        <td><input type='input' name='intVal' value='"+String(companionData.attributes.int)+"' size=5></input></td>\
        <td><input type='input' name='wisVal' value='"+String(companionData.attributes.wis)+"' size=5></input></td>\
        <td><input type='input' name='chaVal' value='"+String(companionData.attributes.cha)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Fortitude</b></td><td colspan=1><input type='input' name='fortitudeVal' value='"+String(companionData.saves.fortitude)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Reflex</b></td><td colspan=1><input type='input' name='reflexVal' value='"+String(companionData.saves.reflex)+"' size=5></input><td></tr>";
        
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Will</b></td><td colspan=1><input type='input' name='willVal' value='"+String(companionData.saves.will)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Perception</b></td><td colspan=1><input type='input' name='perceptionVal' value='"+String(companionData.perception)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td style='text-align:right'><b>Speed</b></td><td><input type='input' name='speedVal' value='"+String(companionData.speed)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Size</b></td><td colspan=2><select name='sizeVal'>";
        var sizeList = ["tiny","small","medium","huge","large","gargantuan"]
        for (var s in sizeList){
            queryHTML += "<option "+((sizeList[s]==companionData.size) ? "selected":"")+">"+capitalise(sizeList[s]) + "</option>";
        }
        queryHTML +="</select></td></tr>";

        //SENSES

        //SUPPORT BENEFIT

        //ATTACKS

        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input></td></tr></table>";
        queryHTML += "</form></p></html>";
        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[frame5('"+companionData.name+" Animal Companion', 'width=500; height=500; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
        return;
    }
    delete companionData.Save;

    return companionData;
}

MTScript.registerMacro("ca.pf2e.setup_animal_companion", setup_animal_companion);