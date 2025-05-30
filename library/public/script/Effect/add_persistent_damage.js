"use strict";

function add_persistent_damage() {
    let persistentDamageData = JSON.parse(read_data("pf2e_condition"))["Persistent Damage"];

    let damageSource = getLibProperty("lib:ca.pf2e", "lastAction");
    if (String(damageSource) == "") {
        damageSource = "Source";
    }

    let selectedTokens = MapTool.tokens.getSelectedTokens();
    if (selectedTokens.length == 0) {
        return;
    }

    MTScript.evalMacro("[h: ans=input(\"damageKey|" + damageSource + "|Damage Source\",\
    \"damageDice|1d4|Damage\",\
    \"damageType|bludgeoning,piercing,slashing,acid,cold,electricity,fire,sonic,vitality,void,force,spirit,mental,poison,bleed,holy,unholy|Damage Type|LIST|VALUE=STRING\",\
    \"damageDC|15|Recovery DC\",\
    \"ignoreResImm|0|Ignore Immunity/Resistance etc.|CHECK\")]");
    if (Number(MTScript.getVariable("ans")) == 0) {
        return;
    }

    let damageKey = MTScript.getVariable("damageKey");
    let damageDice = MTScript.getVariable("damageDice");
    let damageType = MTScript.getVariable("damageType");
    let damageDC = MTScript.getVariable("damageDC");
    let ignoreResImm = (Number(MTScript.getVariable("ignoreResImm")) == 1);

    persistentDamageData.type = "effect";

    persistentDamageData.name = "Persistent " + capitalise(damageType) + " (" + damageKey + ")";

    persistentDamageData.damage = { "key": damageKey, "dice": damageDice, "type": damageType };

    persistentDamageData.ignoreResImm = ignoreResImm;

    persistentDamageData.dc = Number(damageDC);

    //MapTool.chat.broadcast(JSON.stringify(persistentDamageData));

    for (var t in selectedTokens) {
        let token = selectedTokens[t];
        if (token.isPC() && !token.getName().includes("Lib:")) {
            token = MapTool.tokens.getTokenByID(token.getProperty("myID"));
        }
        let tokenImmunities = getTokenImmunities(token);
        if (!tokenImmunities.includes(persistentDamageData.damage.type) || (tokenImmunities.includes(persistentDamageData.damage.type) && ignoreResImm)) {
            toggle_action_effect(persistentDamageData, token, true);
        }

    }
}

MTScript.registerMacro("ca.pf2e.add_persistent_damage", add_persistent_damage);