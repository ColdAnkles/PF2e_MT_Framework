"use strict";

function setup_animal_companion(baseData){
    let companionData = {}
    if("nameVal" in baseData){
        companionData.ownerID = baseData.ownerID;
        companionData.name = baseData.nameVal;
        companionData.level = parseInt(baseData.levelVal);
        companionData.hp = {"max":parseInt(baseData.hpVal)};
        companionData.ac = {"value":parseInt(baseData.acVal)}
        companionData.abilities = {"str":parseInt(baseData.strVal),"dex":parseInt(baseData.dexVal),"con":parseInt(baseData.conVal),"int":parseInt(baseData.intVal),"wis":parseInt(baseData.wisVal),"cha":parseInt(baseData.chaVal)};
        companionData.saves = {"fortitude":parseInt(baseData.fortitudeVal),"reflex":parseInt(baseData.reflexVal),"will":parseInt(baseData.willVal)};
        companionData.perception = parseInt(baseData.perceptionVal);
        companionData.speeds = {"base":parseInt(baseData.speedVal),"other":[]};
        companionData.senses = baseData.sensesVal.replaceAll(" vision","");
        companionData.size = baseData.sizeVal.toLowerCase()
        companionData.traits = baseData.traitsVal.replaceAll(", ", ",").split(",");
        companionData.supportBenefit = baseData.benefitVal;
        companionData.skills = {"acrobatics":baseData["acrobatics_val"],
        "arcana":baseData["arcana_val"],
        "athletics":baseData["athletics_val"],
        "crafting":baseData["crafting_val"],
        "deception":baseData["deception_val"],
        "diplomacy":baseData["diplomacy_val"],
        "intimidation":baseData["intimidation_val"],
        "medicine":baseData["medicine_val"],
        "nature":baseData["nature_val"],
        "occultism":baseData["occultism_val"],
        "performance":baseData["performance_val"],
        "religion":baseData["religion_val"],
        "society":baseData["society_val"],
        "stealth":baseData["stealth_val"],
        "survival":baseData["survival_val"],
        "thievery":baseData["thievery_val"]}
        
        companionData.immunities = [];
	    companionData.resistances = [];
	    companionData.weaknesses = [];
        companionData.alignment = "";
        companionData.rarity = "";
        companionData.skillList = [];
        companionData.itemList = {};
        companionData.passiveSkills = [];
        companionData.passiveDefenses = [];
        companionData.otherDefenses = [];
        companionData.basicAttacks = [];
        companionData.spellRules = {};
        companionData.offensiveActions = [];
        companionData.languages = [];
        companionData.resources = {};
        companionData.itemList = {};

        var counter = 0;
        while(counter<baseData.totalAttacks){
            if("removeAttack_"+String(counter) in baseData){
                continue;
            }
            let newAttackData = {"bonus":parseInt(baseData["actionRoll_"+String(counter)]),
            "damage":[{"damage":baseData["actionDamage_"+String(counter)],
            "damageType":"piercing"}],
            "isMelee":("actionMelee_"+String(counter) in baseData),
            "name":baseData["actionName_"+String(counter)],
            "traits":baseData["actionTraits_"+String(counter)].replaceAll(", ", ",").split(","),
            "effects":[],
            "description":""};

            let newAttackAction = baseData["actionType_"+String(counter)]
            if(newAttackAction == "reaction"){
                newAttackData.actionType = "reaction";
                newAttackData.actionCost = 1;
            }else if(newAttackAction == "passive"){
                newAttackData.actionType = "passive";
                newAttackData.actionCost = 0;
            }else if(newAttackAction == "freeAction"){
                newAttackData.actionType = "freeAction";
                newAttackData.actionCost = 0;
            }else if(newAttackAction == "1action"){
                newAttackData.actionType = "action";
                newAttackData.actionCost = 1;
            }else if(newAttackAction == "2action"){
                newAttackData.actionType = "action";
                newAttackData.actionCost = 2;
            }else if(newAttackAction == "2action"){
                newAttackData.actionType = "action";
                newAttackData.actionCost = 2;
            }

            companionData.basicAttacks.push(newAttackData);
            counter += 1;
        }
        
        if("addAttack" in baseData){
            let newAttackData = {"actionCost":1,"actionType":"action","bonus":0,"damage":[{"damage":"1d6+0","damageType":"piercing"}],"isMelee":true,"name":"New Attack","traits":[],"effects":[],"description":""};
            companionData.basicAttacks.push(newAttackData);
        }
    }else{
        companionData = baseData;
        if(!("level" in companionData)){companionData.level = 1;};
        if(!("abilities"  in companionData)){companionData.abilities = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};}
        if(!("ac" in companionData)){companionData.ac = {"value":13};}
        if(!("hp" in companionData)){companionData.hp = {"max":10};}
        if(!("saves" in companionData)){companionData.saves = {"fortitude":0,"reflex":0,"will":0};}
        if(!("skills" in companionData)){companionData.skills = {"acrobatics":0,"arcana":0,"athletics":0,"crafting":0,"deception":0,"diplomacy":0,"intimidation":0,"medicine":0,"nature":0,"occultism":0,"performance":0,"religion":0,"society":0,"stealth":0,"survival":0,"thievery":0}};
        if(!("perception" in companionData)){companionData.perception = 3;}
        if(!("speeds" in companionData)){companionData.speeds = {"base":30,"other":[]};}
        if(!("size" in companionData)){companionData.size = "medium";}
        if(!("senses" in companionData)){companionData.senses = "low-light vision, scent (imprecise, 30 feet)";}
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
        if(!("immunities" in companionData)){companionData.immunities = [];}
        if(!("resistances" in companionData)){companionData.resistances = [];}
        if(!("weaknesses" in companionData)){companionData.weaknesses = [];}
        if(!("alignment" in companionData)){companionData.alignment = "";}
        if(!("rarity" in companionData)){companionData.rarity = "";}
        if(!("languages" in companionData)){companionData.languages = [];}
        if(!("resources" in companionData)){companionData.resources = {};}
        if(!("itemList" in companionData)){companionData.itemList = {};}
    }

    //MapTool.chat.broadcast(JSON.stringify(baseData));
    if(!("save" in baseData)){
        let queryHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><p><form action='macro://Animal_Companion_Setup_To_JS@Lib:ca.pf2e/self/impersonated?'><h1 class='feel-title'>Animal Companion</h1>"
        queryHTML += "<input type='hidden' name='ownerID' value='"+String(companionData.ownerID)+"'>";
        queryHTML += "<table style='width:100%'>"
        queryHTML += "<tr><td colspan=1 style='text-align:right'><b>Name</b></td><td colspan=2><input type='input' name='nameVal' value='"+companionData.name+"'></input></td>\
        <td colspan=1><b>Level</b></td><td colspan=2><input type='input' name='levelVal' value='"+String(companionData.level)+"'></input></td></tr>"

        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>HP</b></td><td colspan=1><input type='input' name='hpVal' value='"+String(companionData.hp.max)+"' size=5></input></td>\
        <td colspan=1 style='text-align:right'><b>AC</b></td><td colspan=2><input type='input' name='acVal' value='"+String(companionData.ac.value)+"' size=5></input></td>\
        <td rowspan=8><table width=100%>";

        let skillNames = ["acrobatics","arcana","athletics","crafting","deception","diplomacy","intimidation","medicine","nature","occultism","performance","religion","society","stealth","survival","thievery"];
        for (var i=0; i<skillNames.length; i+=2){
            let skillOne = skillNames[i];
            queryHTML += "<tr><td><b>"+capitalise(skillOne)+"</b><input type='input' name='"+skillOne+"_val' value='"+String(companionData.skills[skillOne])+"' size=5></input></td>";
            if(i+1<skillNames.length){
                let skillTwo = skillNames[i+1];
                queryHTML += "<td><b>"+capitalise(skillTwo)+"</b><input type='input' name='"+skillTwo+"_val' value='"+String(companionData.skills[skillTwo])+"' size=5></input></td>";
            }
            queryHTML += "</tr>"
        }

        queryHTML += "</td></tr></table>"

        queryHTML += "<tr><td style='text-align:center'><b>Str</b></td><td style='text-align:center'><b>Dex</b></td><td style='text-align:center'><b>Con</b></td>\
        <td style='text-align:center'><b>Int</b></td><td style='text-align:center'><b>Wis</b></td><td style='text-align:center'><b>Cha</b></td></tr>";

        queryHTML += 
        "<tr><td><input type='input' name='strVal' value='"+String(companionData.abilities.str)+"' size=5></input></td>\
        <td><input type='input' name='dexVal' value='"+String(companionData.abilities.dex)+"' size=5></input></td>\
        <td><input type='input' name='conVal' value='"+String(companionData.abilities.con)+"' size=5></input></td>\
        <td><input type='input' name='intVal' value='"+String(companionData.abilities.int)+"' size=5></input></td>\
        <td><input type='input' name='wisVal' value='"+String(companionData.abilities.wis)+"' size=5></input></td>\
        <td><input type='input' name='chaVal' value='"+String(companionData.abilities.cha)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Fortitude</b></td><td colspan=1><input type='input' name='fortitudeVal' value='"+String(companionData.saves.fortitude)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Reflex</b></td><td colspan=1><input type='input' name='reflexVal' value='"+String(companionData.saves.reflex)+"' size=5></input></td></tr>";
        
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Will</b></td><td colspan=1><input type='input' name='willVal' value='"+String(companionData.saves.will)+"' size=5></input></td>\
        <td colspan=2 style='text-align:right'><b>Perception</b></td><td colspan=1><input type='input' name='perceptionVal' value='"+String(companionData.perception)+"' size=5></input></td></tr>";

        queryHTML += "<tr><td style='text-align:right'><b>Speed</b></td><td colspan=2><input type='input' name='speedVal' value='"+String(companionData.speeds.base)+"' size=5></input> feet</td>\
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
        queryHTML += "<tr><td colspan=6><table style='width:100%'>";
        queryHTML += "<tr><td><b>Action</b></td><td><b>Name</b></td><td><b>Attack Roll</b></td><td colspan=2><b>Traits</b></td><td><b>Remove</b></td></tr>\
        <tr><td colspan=2><b>Damage</b></td><td><b>Is Melee</b></td><td colspan=3><b>Damage Type</b></td></tr>";

        var counter = 0;
        for(var a in companionData.basicAttacks){
            let attackData = companionData.basicAttacks[a];
            //MapTool.chat.broadcast(JSON.stringify(attackData));
            queryHTML += "<tr><td><select name='actionType_"+String(counter)+"'>";
            for (var i=1;i<4;i++){
                queryHTML += "<option "+((attackData.actionType=="action" && attackData.actionCost==i) ? "selected":"")+" value='"+String(i)+"action')>"+String(i)+" Action</option>";
            }
            queryHTML += "<option "+((attackData.actionType=="reaction") ? "selected":"")+" value='reaction'>Reaction</option>";
            queryHTML += "<option "+((attackData.actionType=="freeAction") ? "selected":"")+" value='freeAction'>Free Action</option>";
            queryHTML += "<option "+((attackData.actionType=="passive") ? "selected":"")+" value='passive'>Passive</option>";
            
            queryHTML += "</select></td>\
            <td><input type='input' name='actionName_"+String(counter)+"' value='"+attackData.name+"' size=10></input></td>\
            <td><input type='input' name='actionRoll_"+String(counter)+"' value='"+String(attackData.bonus)+"' size=3></input></td>\
            <td colspan=2><input type='input' name='actionTraits_"+String(counter)+"' value='"+attackData.traits.join(", ")+"'></input></td>\
            <td><input type='submit' name='removeAttack_"+String(counter)+"' value='-'></input></td></tr>";

            queryHTML += "<tr><td colspan=2><input type='input' name='actionDamage_"+String(counter)+"' value='"+attackData.damage[0].damage+"'></td>\
            <td><input type='checkbox' name='actionMelee_"+String(counter)+"' value='isMelee' "+((attackData.isMelee)? "checked" : "" )+"></td>\
            <td colspan=3><input type='input' name='actionDType_"+String(counter)+"' value='"+attackData.damage[0].damageType+"'></td></tr>"
        }

        queryHTML += "<input type='hidden' name='totalAttacks' value='"+String(companionData.basicAttacks.length)+"'>";
        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='addAttack' value='Add Attack'></input></td></tr>";
        queryHTML += "</td></tr></table>";

        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input></td></tr></table>";
        queryHTML += "</form></p></html>";
        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[dialog5('"+companionData.name+" Animal Companion', 'width=1000; height=" + String(710 + (15*companionData.basicAttacks.length)) + "; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
        return;
    }else if ("save" in baseData){
        delete companionData.save;
        companionData.senses = companionData.senses.split(/,(?![^(]*\)) /);
        companionData.offensiveActions.push({"actionCost":0,"actionType":"passive","bonus":0,"damage":[],"isMelee":false,"name":"Support Benefit","traits":[],"effects":[],"description":companionData.supportBenefit});
        delete companionData.supportBenefit;
        companionData.rarity="common";
        let ownerID = companionData.ownerID;
        let ownerToken = MapTool.tokens.getTokenByID(ownerID);
        let ownerPetList = ownerToken.getProperty("pets");
        if (ownerPetList=="" || ownerPetList==null || ownerPetList==[]){
            ownerPetList={};
        }else{
            ownerPetList = JSON.parse(ownerPetList);
        }
        if(companionData.name in ownerPetList){
            write_creature_properties(companionData, ownerPetList[companionData.name])
        }else{
            MTScript.setVariable("petData", JSON.stringify(companionData));
            MTScript.evalMacro("[h: newPetID = ca.pf2e.Spawn_Pet_Lib(petData)]")
            let newPetID = MTScript.getVariable("newPetID");
            ownerPetList[companionData.name] = newPetID;
            ownerToken.setProperty("pets", JSON.stringify(ownerPetList));
        }
    }

}

MTScript.registerMacro("ca.pf2e.setup_animal_companion", setup_animal_companion);