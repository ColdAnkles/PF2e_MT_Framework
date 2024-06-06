"use strict";

function feature_cause_definition(feature, PCdata) {
    let rules = feature.system.rules;
    for (var r in rules) {
        let newRule = rules[r];
        if ("definition" in newRule) {
            //MapTool.chat.broadcast(JSON.stringify(newRule));
            if (newRule.key == "MartialProficiency") {
                let profBonus = (2 * newRule.value) + PCdata.level
                let newProf = { "name": "Martial", "predicate": newRule.definition, "bonus": profBonus, "string": "Martial +" + String(profBonus) + " (" + newRule.slug + ")" }
                //MapTool.chat.broadcast(JSON.stringify(newProf));
                PCdata.skillList.push(newProf);
            }
        }
    }
}