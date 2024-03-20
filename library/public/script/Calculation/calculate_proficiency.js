"use strict";

// Returns level of proficiency: U,T,E,M,L -> 0,1,2,3,4
function calculate_proficiency(proficiencyName, actor, item) {
    //MapTool.chat.broadcast(proficiencyName);
    let findProf = proficiencyName;
    let foundProf = null;
    let tokenProfs = JSON.parse(actor.getProperty("proficiencies"));
    for (var p in tokenProfs) {
        let profData = tokenProfs[p];
        if ("predicate" in profData) {
            if (!predicate_check(profData.predicate, ["proficiency"], actor, item)) {
                continue;
            }
        }
        if (findProf.toUpperCase() == profData.name.toUpperCase()) {
            foundProf = (profData.bonus - actor.getProperty("level")) / 2;
        }
    }
    if (foundProf == null) {
        foundProf = 0;
    }
    //MapTool.chat.broadcast("ProfBonus")
    //MapTool.chat.broadcast(String(foundProf));
    return foundProf;
}