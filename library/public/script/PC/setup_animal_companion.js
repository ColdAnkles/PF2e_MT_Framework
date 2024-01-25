"use strict";

function setup_animal_companion(baseData){
    let companionData = {}
    if("tokenID" in baseData){
        companionData = read_creature_properties(baseData.tokenID);
    }else if("nameVal" in baseData){
        //MapTool.chat.broadcast(JSON.stringify(baseData));
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
        companionData.traits = baseData.traitsVal.split(/,(?![^(]*\)) /);
        companionData.supportBenefit = baseData.benefitVal;
        if(baseData.otherSpeedVal!=""){
            companionData.speeds.other = baseData.otherSpeedVal.split(/,(?![^(]*\)) /);
        }

        let profBonus = {"U":0,"T":2,"E":4,"M":6,"L":8};

        companionData.skills = {"acrobatics":parseInt(profBonus[baseData["acrobatics_val"]]),
        "arcana":parseInt(profBonus[baseData["arcana_val"]]),
        "athletics":parseInt(profBonus[baseData["athletics_val"]]),
        "crafting":parseInt(profBonus[baseData["crafting_val"]]),
        "deception":parseInt(profBonus[baseData["deception_val"]]),
        "diplomacy":parseInt(profBonus[baseData["diplomacy_val"]]),
        "intimidation":parseInt(profBonus[baseData["intimidation_val"]]),
        "medicine":parseInt(profBonus[baseData["medicine_val"]]),
        "nature":parseInt(profBonus[baseData["nature_val"]]),
        "occultism":parseInt(profBonus[baseData["occultism_val"]]),
        "performance":parseInt(profBonus[baseData["performance_val"]]),
        "religion":parseInt(profBonus[baseData["religion_val"]]),
        "society":parseInt(profBonus[baseData["society_val"]]),
        "stealth":parseInt(profBonus[baseData["stealth_val"]]),
        "survival":parseInt(profBonus[baseData["survival_val"]]),
        "thievery":parseInt(profBonus[baseData["thievery_val"]]),
        "unarmed":parseInt(baseData.unarmed_val),
        "perception":parseInt(baseData.perceptionVal),
        "unarmored":parseInt(baseData.unarmored_val),
        "barding":parseInt(baseData.barding_val)}

        companionData.skillList=[{"bonus":parseInt(baseData.perceptionVal),"name":"Perception","string":""},
        {"bonus":parseInt(baseData.unarmored_val),"name":"Unarmored","string":""},
        {"bonus":parseInt(baseData.barding_val),"name":"Barding","string":""},
        {"bonus":parseInt(baseData.unarmed_val),"name":"Unarmed","string":""}]

        for(var s in companionData.skills){
            if(companionData.skills[s]>0){
                let newProf = {};
                newProf.bonus = parseInt(companionData.skills[s]);
                newProf.name = capitalise(s);
                newProf.string = newProf.name + " +" + String(newProf.bonus);
                companionData.skillList.push(newProf);
            }
        }

        if("manouverEffect" in baseData){
            companionData.advancedManouver = {"effect":baseData.manouverEffect,
            "bonus":baseData.manouverBonus,
            "name":baseData.manouverName,
            "requirements":baseData.manouverRequirements,
            "traits":baseData.manouverTraits.split(/,(?![^(]*\)) /)};

            let manouverAction = baseData["manouverActionType"];
            if(manouverAction == "reaction"){
                companionData.advancedManouver.actionType = "reaction";
                companionData.advancedManouver.actionCost = 1;
            }else if(manouverAction == "passive"){
                companionData.advancedManouver.actionType = "passive";
                companionData.advancedManouver.actionCost = 0;
            }else if(manouverAction == "freeAction"){
                companionData.advancedManouver.actionType = "freeAction";
                companionData.advancedManouver.actionCost = 0;
            }else if(manouverAction == "1action"){
                companionData.advancedManouver.actionType = "action";
                companionData.advancedManouver.actionCost = 1;
            }else if(manouverAction == "2action"){
                companionData.advancedManouver.actionType = "action";
                companionData.advancedManouver.actionCost = 2;
            }else if(manouverAction == "2action"){
                companionData.advancedManouver.actionType = "action";
                companionData.advancedManouver.actionCost = 2;
            }
        }
        
        if("specializationVal" in baseData){
            companionData.specialization = baseData.specializationVal;
        }
        
        companionData.immunities = [];
	    companionData.resistances = [];
	    companionData.weaknesses = [];
        companionData.alignment = "";
        companionData.rarity = "common";
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
            let newAttackData = {"actionCost":1,
            "actionType":"action",
            "bonus":companionData.skills.unarmed+companionData.level+Math.max(companionData.abilities.str,companionData.abilities.dex),
            "damage":[{"damage":"1d6+0","damageType":"piercing"}],
            "isMelee":true,
            "name":"New Attack",
            "traits":[],
            "effects":[],
            "description":""};
            companionData.basicAttacks.push(newAttackData);
        }
    }else{
        companionData = baseData;
        if(!("level" in companionData)){companionData.level = 1;};
        if(!("abilities"  in companionData)){companionData.abilities = {"str":2,"dex":2,"con":2,"int":-4,"wis":2,"cha":0};}
        if(!("ac" in companionData)){companionData.ac = {"value":10+companionData.level+2+companionData.abilities.dex};}
        if(!("hp" in companionData)){companionData.hp = {"max":(6+companionData.abilities.con)*companionData.level};}
        if(!("saves" in companionData)){companionData.saves = {"fortitude":2+companionData.level,"reflex":2+companionData.level,"will":2+companionData.level};}

        if(!("proficiencies" in companionData)){
            companionData.skillList=[{"bonus":2,"name":"Perception","string":""},
            {"bonus":2,"name":"Unarmored","string":""},
            {"bonus":2,"name":"Barding","string":""},
            {"bonus":2,"name":"Unarmed","string":""}]
        }

        if(!("skills" in companionData)){
            companionData.skills = {"acrobatics":2,
            "arcana":0,
            "athletics":2,
            "crafting":0,
            "deception":0,
            "diplomacy":0,
            "intimidation":0,
            "medicine":0,
            "nature":0,
            "occultism":0,
            "performance":0,
            "religion":0,
            "society":0,
            "stealth":0,
            "survival":0,
            "thievery":0,
            "unarmed":2,
            "unarmored":2,
            "barding":2}
        };

        for(var s in companionData.skills){
            if(companionData.skills[s]>0){
                let newProf = {};
                newProf.bonus = companionData.skills[s];
                newProf.name = capitalise(s);
                newProf.string = newProf.name + " +" + String(newProf.bonus);
            }
        }
        
        if(!("perception" in companionData)){companionData.perception = 2+companionData.level;}
        if(!("speeds" in companionData)){companionData.speeds = {"base":30,"other":[]};}
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
        if(!("immunities" in companionData)){companionData.immunities = [];}
        if(!("resistances" in companionData)){companionData.resistances = [];}
        if(!("weaknesses" in companionData)){companionData.weaknesses = [];}
        if(!("alignment" in companionData)){companionData.alignment = "";}
        if(!("rarity" in companionData)){companionData.rarity = "";}
        if(!("languages" in companionData)){companionData.languages = [];}
        if(!("resources" in companionData)){companionData.resources = {};}
        if(!("itemList" in companionData)){companionData.itemList = {};}

        if(companionData.mature){
            companionData.abilities.str += 1;
            companionData.abilities.dex += 1;
            companionData.abilities.con += 1;
            companionData.abilities.wis += 1;
            companionData.saves = {"fortitude":4+companionData.level+companionData.abilities.con,"reflex":4+companionData.level + companionData.abilities.dex,"will":4+companionData.level + companionData.abilities.wis};
            companionData.skills.intimidation = 2;
            companionData.skills.stealth = 2;
            companionData.skills.survival = 2;
            companionData.perception = 4+companionData.level + companionData.abilities.wis;
        }

        if(companionData.incredible){
            companionData.advancedManouver = {"effect":"","actionCost":1,"actionType":"action","requirements":"","name":"","bonus":"","traits":[]};
            if(companionData.incredibleType=="Nimble"){
                companionData.abilities.str += 1;
                companionData.abilities.dex += 2;
                companionData.abilities.con += 1;
                companionData.abilities.wis += 1;
                companionData.skills.acrobatics = 4;
                companionData.ac = {"value":10+companionData.level+2+companionData.abilities.dex};
            }else if(companionData.incredibleType=="Savage"){
                companionData.abilities.str += 2;
                companionData.abilities.dex += 1;
                companionData.abilities.con += 1;
                companionData.abilities.wis += 1;
                companionData.skills.athletics = 4;
                companionData.ac = {"value":10+companionData.level+2+companionData.abilities.dex};
            }
            companionData.saves = {"fortitude":4+companionData.level+companionData.abilities.con,"reflex":4+companionData.level + companionData.abilities.dex,"will":4+companionData.level + companionData.abilities.wis};
        }

        if(companionData.specializations.length>0){
            companionData.specialization = "";
            companionData.abilities.dex += 1;
            companionData.abilities.int += 2;
            companionData.perception = 6+companionData.level + companionData.abilities.wis;
            companionData.saves = {"fortitude":6+companionData.level+companionData.abilities.con,"reflex":6+companionData.level+companionData.abilities.dex,"will":6+companionData.level+companionData.abilities.wis};
            companionData.skills.unarmed = 4;
            companionData.ac = {"value":10+companionData.level+2+companionData.abilities.dex};
        }
    }

    //MapTool.chat.broadcast(JSON.stringify(baseData));
    if(!("save" in baseData)){
        let queryHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><p><form action='macro://Animal_Companion_Setup_To_JS@Lib:ca.pf2e/self/impersonated?'><h1 class='feel-title'>Animal Companion</h1>"
        queryHTML += "<input type='hidden' name='ownerID' value='"+String(companionData.ownerID)+"'>";
        queryHTML += "<table style='width:100%'><tbody>"
        queryHTML += "<tr><td colspan=1 style='text-align:right'><b>Name</b></td><td colspan=2><input type='input' name='nameVal' value='"+companionData.name+"'></input></td>\
        <td colspan=1><b>Level</b></td><td colspan=2><input type='input' name='levelVal' value='"+String(companionData.level)+"'></input></td>\
        <td rowspan=9 colspan=2><table width=100%>";

        let skills = {"Acrobatics":{"name":"Acrobatics","stat":"dex"},
        "Arcana":{"name":"Arcana","stat":"int"},
        "Athletics":{"name":"Athletics","stat":"str"},
        "Crafting":{"name":"Crafting","stat":"int"},
        "Deception":{"name":"Deception","stat":"cha"},
        "Diplomacy":{"name":"Diplomacy","stat":"cha"},
        "Intimidation":{"name":"Intimidation","stat":"cha"},
        "Medicine":{"name":"Medicine","stat":"wis"},
        "Nature":{"name":"Nature","stat":"wis"},
        "Occultism":{"name":"Occultism","stat":"int"},
        "Performance":{"name":"Performance","stat":"cha"},
        "Religion":{"name":"Religion","stat":"wis"},
        "Society":{"name":"Society","stat":"int"},
        "Stealth":{"name":"Stealth","stat":"dex"},
        "Survival":{"name":"Survival","stat":"wis"},
        "Thievery":{"name":"Thievery","stat":"dex"}};
        let twoPerRow = false;
        for (var s in companionData.skills){
            if(capitalise(s) in skills){
                var profLabels = ["U","T","E","M","L"];
                if(!twoPerRow){
                    queryHTML += "<tr><td><b>"+capitalise(s)+"</b> +"+String(companionData.skills[s]+companionData.abilities[skills[capitalise(s)].stat]+companionData.level)+" <div style='float:right'>";
                    for(var i=0; i<5;i++){
                        queryHTML += " " + profLabels[i]+"<input type='radio' name='"+s+"_val' value='"+profLabels[i]+"' "+((companionData.skills[s]==2*i)?"checked":"")+"></input>";
                    }
                    queryHTML += "</div></td>";
                    twoPerRow = true;
                }else{
                    queryHTML += "<td><b>"+capitalise(s)+"</b> +"+String(companionData.skills[s]+companionData.abilities[skills[capitalise(s)].stat]+companionData.level)+" <div style='float:right'>";
                    for(var i=0; i<5;i++){
                        queryHTML += " " + profLabels[i]+"<input type='radio' name='"+s+"_val' value='"+profLabels[i]+"' "+((companionData.skills[s]==2*i)?"checked":"")+"></input>";
                    }
                    queryHTML += "</div></td></tr>"
                    twoPerRow = false;
                }
            }else{
                queryHTML += "<input type='hidden' name='"+s+"_val' value='"+String(companionData.skills[s])+"'></input>";
            }
        }

        queryHTML += "</td></tr></table>"

        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>HP</b></td><td colspan=1><input type='input' name='hpVal' value='"+String(companionData.hp.max)+"' size=5></input></td>\
        <td colspan=1 style='text-align:right'><b>AC</b></td><td colspan=2><input type='input' name='acVal' value='"+String(companionData.ac.value)+"' size=5></input></td></tr>";

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

        //SUPPORT BENEFIT
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Support Benefit</b></td><td colspan=4><textarea name='benefitVal' cols=50 rows=5>"+companionData.supportBenefit+"</textarea></td></tr>"

        //SENSES
        queryHTML += "<tr><td colspan=2 style='text-align:right'><b>Senses</b></td><td colspan=4><input type='input' name='sensesVal' placeholder='low-light vision, scent (imprecise, 30 feet)' value='"+companionData.senses+"' size=50></input></td>"

        queryHTML += "<td colspan=1 style='text-align:right'><b>Other Speeds</b></td><td colspan=1><input type='input' placeholder='fly 50ft, swim 30ft' name='otherSpeedVal' value='"+companionData.speeds.other+"' size=50></input></td></tr>"

        queryHTML+= "<tr>";
        //ADVANCED MANOUVER
        if("advancedManouver" in companionData){
            queryHTML += "<td colspan=6><table style='width:100%'>";
            queryHTML += "<tr><td><b>Advanced Manouver</b></td><td rowspan=3><textarea name='manouverEffect' cols=50 rows=5>"+companionData.advancedManouver.effect+"</textarea></td></tr>";
            queryHTML += "<tr><td><input type='input' name='manouverName' value='"+companionData.advancedManouver.name+"' size=20 placeholder='Manouver Name'></input></td></tr>";
            queryHTML += "<tr><td><select name='manouverActionType'>";
            for (var i=1;i<4;i++){
                queryHTML += "<option "+((companionData.advancedManouver.actionType=="action" && companionData.advancedManouver.actionCost==i) ? "selected":"")+" value='"+String(i)+"action')>"+String(i)+" Action</option>";
            }
            queryHTML += "<option "+((companionData.advancedManouver.actionType=="reaction") ? "selected":"")+" value='reaction'>Reaction</option>";
            queryHTML += "<option "+((companionData.advancedManouver.actionType=="freeAction") ? "selected":"")+" value='freeAction'>Free Action</option>";
            queryHTML += "<option "+((companionData.advancedManouver.actionType=="passive") ? "selected":"")+" value='passive'>Passive</option>";
            queryHTML += "</select></td></tr>\
            <tr><td><b>Bonus</b> <input type='input' name='manouverBonus' value='"+String(companionData.advancedManouver.bonus)+"' size=3></input></td>\
            <td><b>Traits</b> <input type='input' name='manouverTraits' value='"+companionData.advancedManouver.traits.join(", ")+"' placeholder='attack, finesse, move' size=30></input></td></tr>\
            <tr><td colspan=2><input type='input' name='manouverRequirements' value='"+companionData.advancedManouver.requirements+"' placeholder='requirements if any' size=50></input></td></tr>"
                        
            queryHTML += "</table></td>"
        }

        //Specialization
        if("specialization" in companionData){
            queryHTML += "<td colspan=1 style='text-align:right'><b>Specialization</b></td><td colspan=1><textarea name='specializationVal' cols=50 rows=5>"+companionData.specialization+"</textarea></td>"
        }
        queryHTML += "</tr>";

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

        queryHTML += "<tr><td colspan=6 style='text-align:center'><input type='submit' name='update' value='Update'></input><input type='submit' name='save' value='Save'></input></td></tr></tbody></table>";
        queryHTML += "</form></p></html>";
        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[dialog5('"+companionData.name+" Animal Companion', 'width=1300; height=" + String(900 + (15*companionData.basicAttacks.length)) + "; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
        return;
    }else if ("save" in baseData){
        //MapTool.chat.broadcast(JSON.stringify(companionData));
        delete companionData.save;
        companionData.senses = companionData.senses.split(/,(?![^(]*\)) /);
        companionData.offensiveActions.push({"actionCost":0,"actionType":"passive","bonus":0,"damage":[],"name":"Support Benefit","traits":[],"effects":[],"description":companionData.supportBenefit, "type":"personal"});
        delete companionData.supportBenefit;
        for(var s in companionData.skillList){
            companionData.skillList[s].bonus+=companionData.level;
        }
        delete companionData.skills;
        companionData.rarity="common";
        companionData.offensiveActions.push({"actionCost":companionData.advancedManouver.actionCost,
        "actionType":companionData.advancedManouver.actionType,
        "bonus":0,
        "damage":[],
        "name":companionData.advancedManouver.name,
        "traits":[],
        "effects":[],
        "description":companionData.advancedManouver.effect,
        "type":"personal"});
        delete companionData.advancedManouver;

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