"use strict";

function getTokenWeaknesses(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    let tokenWeaknesses = JSON.parse(token.getProperty("weaknesses"));
    let trueWeaknesses = {};

    for (var w in tokenWeaknesses) {
        let weakData = tokenWeaknesses[w];
        if (weakData.type == "physical") {
            trueWeaknesses["bludgeoning"] = weakData.value;
            trueWeaknesses["piercing"] = weakData.value;
            trueWeaknesses["slashing"] = weakData.value;
            trueWeaknesses["bleed"] = weakData.value;
        } else if (weakData.type == "energy") {
            trueWeaknesses["acid"] = weakData.value;
            trueWeaknesses["cold"] = weakData.value;
            trueWeaknesses["electricity"] = weakData.value;
            trueWeaknesses["fire"] = weakData.value;
            trueWeaknesses["sonic"] = weakData.value;
            trueWeaknesses["vitality"] = weakData.value;
            trueWeaknesses["void"] = weakData.value;
            trueWeaknesses["force"] = weakData.value;
        } else {
            trueWeaknesses[weakData.type] = weakData.value;
        }
    }

    return trueWeaknesses;
}

MTScript.registerMacro("ca.pf2e.getTokenWeaknesses", getTokenWeaknesses);

function getTokenResistances(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    let tokenResistances = JSON.parse(token.getProperty("resistances"));
    let trueResistances = {};

    for (var r in tokenResistances) {
        let resData = tokenResistances[r];
        if (resData.type == "physical") {
            trueResistances["bludgeoning"] = resData.value;
            trueResistances["piercing"] = resData.value;
            trueResistances["slashing"] = resData.value;
            trueResistances["bleed"] = resData.value;
        } else if (resData.type == "energy") {
            trueResistances["acid"] = resData.value;
            trueResistances["cold"] = resData.value;
            trueResistances["electricity"] = resData.value;
            trueResistances["fire"] = resData.value;
            trueResistances["sonic"] = resData.value;
            trueResistances["vitality"] = resData.value;
            trueResistances["void"] = resData.value;
            trueResistances["force"] = resData.value;
        } else {
            trueResistances[resData.type] = resData.value;
        }
    }

    return trueResistances;
}

MTScript.registerMacro("ca.pf2e.getTokenResistances", getTokenResistances);

function getTokenImmunities(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    let tokenImmunities = JSON.parse(token.getProperty("immunities"));
    let trueTokenImmunities = [];
    for (var i in tokenImmunities) {
        trueTokenImmunities.push(tokenImmunities[i].type);
    }
    if (trueTokenImmunities.includes("physical")) {
        trueTokenImmunities.push("bludgeoning");
        trueTokenImmunities.push("slashing");
        trueTokenImmunities.push("piercing");
        trueTokenImmunities.push("bleed");
    } else if (trueTokenImmunities.includes("energy")) {
        trueTokenImmunities.push("acid");
        trueTokenImmunities.push("cold");
        trueTokenImmunities.push("electricity");
        trueTokenImmunities.push("fire");
        trueTokenImmunities.push("sonic");
        trueTokenImmunities.push("vitality");
        trueTokenImmunities.push("void");
        trueTokenImmunities.push("force");
    }

    return trueTokenImmunities;
}

MTScript.registerMacro("ca.pf2e.getTokenImmunities", getTokenImmunities);