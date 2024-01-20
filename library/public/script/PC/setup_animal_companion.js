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
        let queryHTML = "<html><p align=center><form action='macro://Animal_Companion_Setup_To_JS@Lib:ca.pf2e/self/impersonated?'>"
        queryHTML += "<table style='width:100%;align=center'><tr><td colspan=6>Animal Companion</td></tr>"
        queryHTML += "<tr><td colspan=3><b>Name</b></td><td colspan=3><input type='input' name='strVal' value='"+companionData.name+"'></input></td></tr>"
        queryHTML += "<tr><td><b>Str</b></td><td><b>Dex</b></td><td><b>Con</b></td><td><b>Int</b></td><td><b>Wis</b></td><td><b>Cha</b></td></tr>";
        queryHTML += 
        "<tr><td><input type='input' name='strVal' value='"+String(companionData.attributes.str)+"' size=5></input></td>\
        <td><input type='input' name='dexVal' value='"+String(companionData.attributes.dex)+"' size=5></input></td>\
        <td><input type='input' name='conVal' value='"+String(companionData.attributes.con)+"' size=5></input></td>\
        <td><input type='input' name='intVal' value='"+String(companionData.attributes.int)+"' size=5></input></td>\
        <td><input type='input' name='wisVal' value='"+String(companionData.attributes.wis)+"' size=5></input></td>\
        <td><input type='input' name='chaVal' value='"+String(companionData.attributes.cha)+"' size=5></input></td></tr>";
        queryHTML += "<tr><td colspan=2><b>Fortitude</b></td><td colspan=2><b>Reflex</b></td><td colspan=2><b>Will</b></td></tr>";
        queryHTML += "<tr><td colspan=2><input type='input' name='fortitudeVal' value='"+String(companionData.saves.fortitude)+"' size=5></input></td>\
        <td colspan=2><input type='input' name='reflexVal' value='"+String(companionData.saves.reflex)+"' size=5></input><td>\
        <td colspan=2><input type='input' name='willVal' value='"+String(companionData.saves.will)+"' size=5></input></td><tr>";

        queryHTML += "</table><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input>";
        queryHTML += "</form></p></html>";
        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[frame5('"+companionData.name+" Animal Companion', 'width=500; height=500; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
        return;
    }
    delete companionData.Save;

    return companionData;
}

MTScript.registerMacro("ca.pf2e.setup_animal_companion", setup_animal_companion);