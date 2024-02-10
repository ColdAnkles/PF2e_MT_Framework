"use strict";

function active_effect_view(token) {

    let affectedCreature = null;
    if (typeof (token) != "string") {
        affectedCreature = token;
        token = token.getId();
    } else {
        affectedCreature = MapTool.tokens.getTokenByID(token);
    }

    let tokenEffects = Object.assign({}, JSON.parse(affectedCreature.getProperty("activeEffects")), JSON.parse(affectedCreature.getProperty("specialEffects")));

    let outputHTML = "<table width=100%><form action='macro://View_Active_Effects@Lib:ca.pf2e/self/impersonated?'><input type='hidden' name='tokenID' value='" + token + "'>";
    outputHTML += "<tr><th>Effect Name</th><th>Remove</th></tr>";

    for (var e in tokenEffects) {
        if (e.includes("Persistent")) {
            outputHTML += "<tr><td>" + create_macroLink(capitalise(e), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "condition", "itemName": "Persistent Damage" })
                + "</td><td style='text-align:center'><input type='submit' name='remove_" + e + "' value='-'></input></td></tr>";
        } else {
            outputHTML += "<tr><td>" + create_macroLink(capitalise(e.replaceAll("Spell Effect: ", "").replaceAll("Effect: ", "")), "Item_View_Frame@Lib:ca.pf2e", { "itemType": "effect", "itemName": e })
                + "</td><td style='text-align:center'><input type='submit' name='remove_" + e + "' value='-'></input></td></tr>";
        }
    }

    outputHTML += "</table>"
    return outputHTML;
}

MTScript.registerMacro("ca.pf2e.active_effect_view", active_effect_view);