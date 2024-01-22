"use strict";

function setup_animal_companion(baseData){
    let companionData = {}
    MTScript.evalMacro();
    if("nameVal" in baseData){
        companionData.name = baseData.nameVal;
        companionData.level = Number(baseData.levelVal);
        companionData.maxHP = Number(baseData.hpVal);
        companionData.ac = Number(baseData.acVal)
        companionData.attributes = {"str":Number(baseData.strVal),"dex":Number(baseData.dexVal),"con":Number(baseData.conVal),"int":Number(baseData.intVal),"wis":Number(baseData.wisVal),"cha":Number(baseData.chaVal)};
        companionData.saves = {"fortitude":Number(baseData.fortitudeVal),"reflex":Number(baseData.reflexVal),"will":Number(baseData.willVal)};
        companionData.perception = Number(baseData.perceptionVal);
        companionData.speed = Number(baseData.speedVal);
        companionData.senses = baseData.sensesVal;
        companionData.size = baseData.sizeVal.toLowerCase()
        companionData.traits = baseData.traitsVal.replaceAll(", ", ",").split(",");
        companionData.supportBenefit = baseData.benefitVal;

        if(!("skillList" in companionData)){companionData.skillList = [];}
        if(!("itemList" in companionData)){companionData.itemList = {};}
        if(!("passiveSkills" in companionData)){companionData.passiveSkills = [];}
        if(!("passiveDefenses" in companionData)){companionData.passiveDefenses = [];}
        if(!("otherDefenses" in companionData)){companionData.otherDefenses = [];}
        if(!("basicAttacks" in companionData)){companionData.basicAttacks = [];}
        if(!("spellRules" in companionData)){companionData.spellRules = {};}	
        if(!("offensiveActions" in companionData)){companionData.offensiveActions = [];}
        var counter = 0;
        while(counter<baseData.totalAttacks){
            if("removeAttack_"+String(counter) in baseData){
                continue;
            }
            let newAttackData = {"actionCost":1,"actionType":"action",
            "bonus":Number(baseData["actionRoll_"+String(counter)]),
            "damage":[{"damage":baseData["actionDamage_"+String(counter)],"damageType":"piercing"}],
            "isMelee":true,"name":baseData["actionName_"+String(counter)],"traits":baseData["actionTraits_"+String(counter)].replaceAll(", ", ",").split(",")};
            companionData.basicAttacks.push(newAttackData);
        }
        
        if("addAttack" in baseData){
            let newAttackData = {"actionCost":1,"actionType":"action","bonus":0,"damage":[{"damage":"1d6+0","damageType":"piercing"}],"isMelee":true,"name":"New Attack","traits":[]};
            companionData.basicAttacks.push(newAttackData);
        }
    }else{
        companionData = baseData;
        if(!("level" in companionData)){companionData.level = 1;};
        if(!("attributes"  in companionData)){companionData.attributes = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};}
        if(!("ac" in companionData)){companionData.ac = 0;}
        if(!("maxHP" in companionData)){companionData.maxHP = 0;}
        if(!("saves" in companionData)){companionData.saves = {"fortitude":0,"reflex":0,"will":0};}
        if(!("perception" in companionData)){companionData.perception = 0;}
        if(!("speed" in companionData)){companionData.speed = 0;}
        if(!("size" in companionData)){companionData.size = "medium";}
        if(!("senses" in companionData)){companionData.senses = "";}
        if(!("traits" in companionData)){companionData.traits = ["minion","animal"];}
        if(!("supportBenefit" in companionData)){companionData.supportBenefit = "";}
        if(!("skillList" in companionData)){companionData.skillList = [];}
        if(!("itemList" in companionData)){companionData.itemList = {};}
        if(!("passiveSkills" in companionData)){companionData.passiveSkills = [];}
        if(!("passiveDefenses" in companionData)){companionData.passiveDefenses = [];}
        if(!("otherDefenses" in companionData)){companionData.otherDefenses = [];}
        if(!("basicAttacks" in companionData)){companionData.basicAttacks = [];}
        if(!("spellRules" in companionData)){companionData.spellRules = {};}	
        if(!("offensiveActions" in companionData)){companionData.offensiveActions = [];}
    }

    //MapTool.chat.broadcast(JSON.stringify(baseData));
    if(!("Save" in companionData)){
        let queryHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><p><form action='macro://Animal_Companion_Setup_To_JS@Lib:ca.pf2e/self/impersonated?'><h1 class='feel-title'>Animal Companion</h1>"
        queryHTML += "<table style='width:100%'>"
        queryHTML += "<tr><td colspan=1 style='text-align:right'><b>Name</b></td><td colspan=2><input type='input' name='nameVal' value='"+companionData.name+"'></input></td>\
        <td colspan=1><b>Level</b></td><td colspan=2><input type='input' name='levelVal' value='"+String(companionData.level)+"'></input></td></tr>"

        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>HP</b></td><td colspan=1><input type='input' name='hpVal' value='"+String(companionData.maxHP)+"' size=5></input></td>\
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
        <td colspan=2 style='text-align:right'><b>Reflex</b></td><td colspan=1><input type='input' name='reflexVal' value='"+String(companionData.saves.reflex)+"' size=5></input></td></tr>";
        
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Will</b></td><td colspan=1><input type='input' name='willVal' value='"+String(companionData.saves.will)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Perception</b></td><td colspan=1><input type='input' name='perceptionVal' value='"+String(companionData.perception)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td style='text-align:right'><b>Speed</b></td><td colspan=2><input type='input' name='speedVal' value='"+String(companionData.speed)+"' size=5></input> feet</td>\
        <td colspan=1 style='text-align:right'><b>Size</b></td><td colspan=2><select name='sizeVal'>";
        var sizeList = ["tiny","small","medium","huge","large","gargantuan"]
        for (var s in sizeList){
            queryHTML += "<option "+((sizeList[s]==companionData.size) ? "selected":"")+">"+capitalise(sizeList[s]) + "</option>";
        }
        queryHTML +="</select></td></tr>";
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Traits</b></td><td colspan=4><input type='input' name='traitsVal' value='"+companionData.traits.join(", ")+"' size=50></input></td></tr>"

        //SENSES
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Senses</b></td><td colspan=4><input type='input' name='sensesVal' value='"+companionData.senses+"' size=50></input></td></tr>"

        //SUPPORT BENEFIT
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Support Benefit</b></td><td colspan=4><textarea name='benefitVal' cols=50 rows=5>"+companionData.supportBenefit+"</textarea></td></tr>"

        //ATTACKS
        queryHTML += "<tr><td><b>Action</b></td><td><b>Name</b></td><td><b>Attack Roll</b></td><td colspan=2><b>Traits</b></td><td><b>Remove</b></td></tr>\
        <tr><td colspan=3><b>Damage</b></td><td colspan=3><b>Damage Type</b></td></tr>";

        var counter = 0;
        for(var a in companionData.basicAttacks){
            let attackData = companionData.basicAttacks[a];
            queryHTML += "<tr><td>actionSelect</td>\
            <td><input type='input' name='actionName_"+String(counter)+"' value='"+attackData.name+"' size=10></input></td>\
            <td><input type='input' name='actionRoll_"+String(counter)+"' value='"+String(attackData.bonus)+"' size=3></input></td>\
            <td colspan=2><input type='input' name='actionTraits_"+String(counter)+"' value='"+attackData.traits.join(", ")+"'></input></td>\
            <td><input type='submit' name='removeAttack_"+String(counter)+"' value='-'></input></td></tr>";

            queryHTML += "<tr><td colspan=3><input type='input' name='actionDamage_"+String(counter)+"' value='"+attackData.damage[0].damage+"'></td>\
            <td colspan=3><input type='input' name='actionDType_"+String(counter)+"' value='"+attackData.damage[0].damageType+"'></td></tr>"
        }
        queryHTML += "<input type='hidden' name='totalAttacks' value='"+String(companionData.basicAttacks.length)+"'>";

        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='addAttack' value='Add Attack'></input></td></tr>";

        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input></td></tr></table>";
        queryHTML += "</form></p></html>";
        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[dialog5('"+companionData.name+" Animal Companion', 'width=600; height=700; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
        return;
    }
    delete companionData.Save;

    return companionData;
}

MTScript.registerMacro("ca.pf2e.setup_animal_companion", setup_animal_companion);