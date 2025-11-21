"use strict";

function saving_throw_dialog(tokenID, tokenName, bonuses, specialEffects, saveStrings, tokenList = "") {
    try {
        let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

        let queryHTML = "<html><form action='macro://Saving_Throw_Form_To_JS@Lib:ca.pf2e/self/impersonated?'><table width=100% class='staticTable'><link rel=\"stylesheet\" type=\"text/css\" href=\"lib://ca.pf2e/css/" + themeData.css + "\">";
        queryHTML += "<input type='hidden' name='saveTokenID' value='" + tokenID + "'>";
        queryHTML += "<input type='hidden' name='secretCheck' value='0'>";
        queryHTML += "<input type='hidden' name='tokenList' value='" + tokenList + "'>";

        queryHTML += "<tr><th colspan='5' style='text-align:center'><b>Saving Throw</b></th></tr>";
        queryHTML = queryHTML + "<tr><td colspan='1' style='text-align:right'>Save:</td><td colspan='4'><select name='saveName'>";
        for (var s in saveStrings) {
            queryHTML = queryHTML + "<option value='" + saveStrings[s].name + "'>" + saveStrings[s].string + "</option>";
        }
        queryHTML = queryHTML + "</select></td></tr>";

        for (var e in specialEffects) {
            let effectData = specialEffects[e];
            let effectIndex = 0
            //MapTool.chat.broadcast(JSON.stringify(effectData));
            let effectName = effectData.name.replaceAll("Effect: ", "");
            if (specialEffects[e].type == "saving-throw") {
                queryHTML += "<tr><td>Apply " + effectName + "?</td><td><input type='checkbox' name='specialEffect" + String(effectIndex) + "' value='";
                queryHTML += effectData.name + "'" + ((additionalData.applyEffect == effectName) ? "checked" : "") + "></td></tr>";
                effectIndex += 1;
            }
        }

        queryHTML = queryHTML + "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
			<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='"+ String(bonuses.cBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='cMalus' value='"+ String(bonuses.cMalus) + "' size='2'></input></td></tr>";

        queryHTML = queryHTML + "<tr><td>Secret Check?</td><td><input type='checkbox' name='secretCheck' value='1'></td>\
			<td>Status:</b></td><td>+<input type='text' name='sBonus' value='"+ String(bonuses.sBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='sMalus' value='"+ String(bonuses.sMalus) + "' size='2'></input></td></tr>";

        queryHTML = queryHTML + "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >" + tokenName.replace("Lib:","") + " attempts to save.</textarea></td>\
			<td>Item:</b></td><td>+<input type='text' name='iBonus' value='"+ String(bonuses.iBonus) + "' size='2'></input></td>\
			<td>-<input type='text' name='iMalus' value='"+ String(bonuses.iMalus) + "' size='2'></input></td></tr>";

        queryHTML += "<tr><td colspan='2' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td>\
			<td>Other:</b></td><td>+<input type='text' name='oBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='oMalus' value='0' size='2'></input></td></tr>";

        queryHTML = queryHTML + "<tr><td colspan='5' style='text-align:center'><input type='submit' name='savingThrowSubmit' value='Submit'></td></tr>";

        queryHTML = queryHTML + "</table></form></html>"

        MTScript.setVariable("queryHTML", queryHTML);
        MTScript.evalMacro("[dialog5('Saving Throw','width=600;height=350;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");

    } catch (e) {
        MapTool.chat.broadcast("Error in saving_throw_dialog");
        MapTool.chat.broadcast("tokenName: " + tokenName);
        MapTool.chat.broadcast("bonuses: " + JSON.stringify(bonuses));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}