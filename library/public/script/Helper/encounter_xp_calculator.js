"use strict";

function generate_encounter_sizes(level, xpBudget){
    level = Number(level);
    xpBudget = Number(xpBudget);
    let encounterData = calculate_encounters(level, xpBudget);
    let levelVals = [level - 4, level - 3, level - 2, level - 1, level + 0, level + 1, level + 2, level + 3, level + 4];
	let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
    let ouptutHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'><body>";

    for (var d in encounterData){
        let en = encounterData[d];
        let enString = [];
        for (var l in levelVals){
            if (String(levelVals[l]) in en){
                enString.push(en[String(levelVals[l])] +"x CL" + String(levelVals[l]));
            }
        }
        ouptutHTML += enString.join(", ") + "<br />";
    }

    return ouptutHTML;
}

MTScript.registerMacro("ca.pf2e.generate_encounter_sizes", generate_encounter_sizes);

function calculate_encounters(level, targetVal) {
    let xpVals = [10, 15, 20, 30, 40, 60, 80, 120, 160];
    let levelVals = [level - 4, level - 3, level - 2, level - 1, level + 0, level + 1, level + 2, level + 3, level + 4];
    
    xpVals.sort((a, b) => a - b);

    const current = [];
    const combos = [];
    makeCombination(xpVals, targetVal, current, combos, 0);
    let xpCombos = [];

    for (var c in combos) {
        let combo = combos[c];
        let newCombo = {}
        for (var v in combo) {
            let val = combo[v];
            let levelVal = levelVals[xpVals.indexOf(val)];
            if (levelVal in newCombo) {
                newCombo[levelVal] += 1;
            } else {
                newCombo[levelVal] = 1;
            }
        }
        xpCombos.push(newCombo);
    }
    return xpCombos;
}

MTScript.registerMacro("ca.pf2e.calculate_encounters", calculate_encounters);

function makeCombination(options, remainder, current, results, index) {

    if (remainder === 0) {
        results.push([...current]);
        return;
    }

    if (remainder < 0 || index >= options.length)
        return;

    current.push(options[index]);

    makeCombination(options, remainder - options[index], current, results, index);

    current.pop();

    makeCombination(options, remainder, current, results, index + 1);
}