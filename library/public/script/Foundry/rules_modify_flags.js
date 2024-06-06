"use strict";

function rules_modify_actor(rules, apply = True, actor, item) {

    let charFlags = JSON.parse(actor.getProperty("foundryActor"))
    //MapTool.chat.broadcast(JSON.stringify(charFlags));

    for (var r in rules) {
        let ruleData = rules[r];
        if ("key" in ruleData && ruleData.key == "ActiveEffectLike") {
            if ("predicate" in ruleData) {
                if (!predicate_check(ruleData.predicate, [], actor, item)) {
                    continue;
                }
            }
            if (apply) {
                //MapTool.chat.broadcast(JSON.stringify(ruleData.value))
                if ("brackets" in ruleData.value) {
                    ruleData.value = foundry_calc_value(ruleData.value, actor, item);
                }
                //MapTool.chat.broadcast(JSON.stringify(ruleData.value))
                eval("charFlags." + ruleData.path + "=ruleData.value");
            } else {
                try {
                    eval("charFlags." + ruleData.path + "=null");
                } catch {

                }
            }
            //MapTool.chat.broadcast(JSON.stringify(ruleData))
        }
    }
    //MapTool.chat.broadcast(JSON.stringify(charFlags));

    actor.setProperty("foundryActor", JSON.stringify(charFlags));
}