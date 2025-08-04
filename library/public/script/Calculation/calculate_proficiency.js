"use strict";

// Returns level of proficiency: U,T,E,M,L -> 0,1,2,3,4
function calculate_proficiency(proficiencyName, actor, item) {
    //MapTool.chat.broadcast(proficiencyName);
    let findProf = proficiencyName;
    let foundProf = null;
    let tokenProfs = JSON.parse(actor.getProperty("proficiencies"));
    let profData = null;
    try {
        for (var p in tokenProfs) {
            profData = tokenProfs[p];
            if ("predicate" in profData) {
                if (!predicate_check(profData.predicate, ["proficiency"], actor, item)) {
                    continue;
                }
            }
            if ("name" in profData && profData.name != null && findProf.toUpperCase() == profData.name.toUpperCase()) {
                foundProf = (profData.bonus - actor.getProperty("level")) / 2;
            }
        }
        if (foundProf == null) {
            foundProf = 0;
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in calculate_proficiency");
        MapTool.chat.broadcast("proficiencyName: " + JSON.stringify(proficiencyName));
        MapTool.chat.broadcast("findProf: " + String(findProf));
        MapTool.chat.broadcast("actor: " + String(actor));
        MapTool.chat.broadcast("item: " + JSON.stringify(item));
        MapTool.chat.broadcast("profData: " + JSON.stringify(profData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
    //MapTool.chat.broadcast("ProfBonus")
    //MapTool.chat.broadcast(String(foundProf));
    return foundProf;
}