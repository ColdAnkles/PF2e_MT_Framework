"use strict";

function add_persistent_damage(){
    let persistentDamageData = JSON.parse(read_data("pf2e_condition"))["Persistent Damage"];

    let damageSource = getLibProperty("lib:ca.pf2e","lastAction");
    if(String(damageSource)==""){
        damageSource="Source";
    }

    let selectedTokens = MapTool.tokens.getSelectedTokens();
    if(selectedTokens.length==0){
        return;
    }

    MTScript.evalMacro("[h: ans=input(\"damageKey|"+damageSource+"|Persistent Damage Source\",\
    \"damageDice|1d4|Damage\",\
    \"damageType|bludgeoning,piercing,slashing,acid,cold,electricity,fire,sonic,vitality,void,force,spirit,mental,poison,bleed|Damage Type|LIST|VALUE=STRING\")]");
    if(Number(MTScript.getVariable("ans"))==0){
        return;
    }

    let damageKey = MTScript.getVariable("damageKey");
    let damageDice = MTScript.getVariable("damageDice");
    let damageType = MTScript.getVariable("damageType");

    persistentDamageData.type="effect";

    persistentDamageData.name = "Persistent " + capitalise(damageType) + " ("+damageKey+")";

    persistentDamageData.damage={"key":damageKey,"dice":damageDice,"type":damageType};

    //MapTool.chat.broadcast(JSON.stringify(persistentDamageData));
    
    for(var t in selectedTokens){
        let token = selectedTokens[t];
        toggle_action_effect(persistentDamageData, token, true);

    }
}

MTScript.registerMacro("ca.pf2e.add_persistent_damage", add_persistent_damage);