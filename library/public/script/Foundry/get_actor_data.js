"use strict";

function get_actor_data(actor, varName) {
    if (typeof (actor) == "string") {
        actor = MapTool.tokens.getTokenByID(actor);
    }
    let actorData = JSON.parse(actor.getProperty("foundryActor"));
    let result = null;
    //MapTool.chat.broadcast(JSON.stringify(actorData));
    //MapTool.chat.broadcast(varName);
    try {
        result = eval("actorData." + varName);
    } catch {
        result = null;
    }

    let activeEffects = Object.assign({}, JSON.parse(actor.getProperty("activeEffects")), JSON.parse(actor.getProperty("specialEffects")), get_equipped_items(actor));
    let arrayEntries = JSON.parse(actor.getProperty("passiveSkills")).concat(JSON.parse(actor.getProperty("otherDefenses")));

    for (var i in arrayEntries) {
        activeEffects[String(i) + "_arrayEntry"] = arrayEntries[i];
    }

    for (var e in activeEffects) {
        for (var r in activeEffects[e].rules) {
            let ruleData = activeEffects[e].rules[r]
            //MapTool.chat.broadcast(JSON.stringify(ruleData))
            if ("path" in ruleData && ruleData.path == varName) {
                if (("predicate" in ruleData && predicate_check(ruleData.predicate, [], actor, null))) {
                    result = ruleData.value;
                } else if ("key" in ruleData && "mode" in ruleData && ruleData.key == "ActiveEffectLike" && ruleData.mode == "upgrade"){
                    result = ruleData.value;
                } else {
                    result = ruleData.value;
                }
            }
        }
    }

    return result;
}

function get_actor_data_mtscript(actor, varName) {
    return JSON.stringify(get_actor_data(actor, varName));
}

MTScript.registerMacro("ca.pf2e.get_actor_data_mtscript", get_actor_data_mtscript);