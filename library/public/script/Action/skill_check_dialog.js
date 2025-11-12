"use strict";

function skill_check_dialog(tokenID, tokenName, tokenType, altStat, extraScopes, skillStrings, statStrings, initiative, tokenList = "") {
    try {
        let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
        let queryHTML = "<html>";

        queryHTML += "<form action='macro://Skill_Check_Form_To_JS@Lib:ca.pf2e/self/impersonated?'><table width=100% class='staticTable'><link rel=\"stylesheet\" type=\"text/css\" href=\"lib://ca.pf2e/css/" + themeData.css + "\">";
        queryHTML += "<input type='hidden' name='checkTokenID' value='" + tokenID + "'>";
        queryHTML += "<input type='hidden' name='tokenType' value='" + tokenType + "'>";
        queryHTML += "<input type='hidden' name='secretCheck' value='0'>";
        queryHTML += "<input type='hidden' name='altStat' value='" + Number(altStat) + "'>";
        queryHTML += "<input type='hidden' name='extraScopes' value='" + extraScopes + "'>";
        queryHTML += "<input type='hidden' name='useMAP' value='0'>";
        queryHTML += "<input type='hidden' name='increaseMAP' value='0'>";
        queryHTML += "<input type='hidden' name='tokenList' value='" + tokenList + "'>";

        queryHTML += "<tr><th colspan='5' style='text-align:center'><b>Skill Check</b></th></tr>";
        queryHTML += "<tr><td " + ((altStat) ? "" : "colspan='2'") + ">Skill:</td><td " + ((altStat) ? "" : "colspan='3'") + "><select name='skillName'>";
        for (var s in skillStrings) {
            queryHTML += "<option value='" + s + "'>" + skillStrings[s] + "</option>";
        }
        queryHTML += "</select></td>";

        if (altStat) {
            queryHTML += "<td>Attribute:</td><td colspan=2><select name='statName'>";
            for (var s in statStrings) {
                queryHTML += "<option value='" + statStrings[s].name + "'>" + statStrings[s].string + "</option>";
            }
            queryHTML += "</select></td>";
        }
        queryHTML += "</tr>";

        queryHTML += "<tr><td>Misc Bonus:</td><td><input type='text' name='miscBonus' size='' maxlength='' value='0'></td>\
			<td>Circumstance:</b></td><td>+<input type='text' name='cBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='cMalus' value='0' size='2'></input></td></tr>";

        queryHTML += "<tr><td>Secret Check?</td><td><input type='checkbox' id='secretCheck' name='secretCheck' value='1'></td>\
			<td>Status:</b></td><td>+<input type='text' name='sBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='sMalus' value='0' size='2'></input></td></tr>";

        queryHTML += "<tr><td>Flavour Text:</td><td><textarea name='flavourText' cols='20' rows='3' >" + tokenName + " tries to be skillful.</textarea></td>\
			<td>Item:</b></td><td>+<input type='text' name='iBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='iMalus' value='0' size='2'></input></td></tr>";

        queryHTML += "<tr><td colspan='2' style='text-align:center'><select name='fortuneSelect'><option value='fortune'>Fortune</option><option value='normal' selected>Normal</option><option value='misfortune'>Misfortune</option></select></td>\
			<td>Other:</b></td><td>+<input type='text' name='oBonus' value='0' size='2'></input></td>\
			<td>-<input type='text' name='oMalus' value='0' size='2'></input></td></tr>";

        if (!(isNaN(initiative))) {
            queryHTML += "<tr><td colspan='2' style='text-align:center'>Use MAP:<input type='checkbox' id='useMAP' name='useMAP' value='useMAP'></td>\
				<td colspan='3' style='text-align:center'>Increase MAP:<input type='checkbox' id='increaseMAP' name='increaseMAP' value='increaseMAP'></td></tr>";
        }
        //queryHTML += "<tr><td colspan='5' style='text-align:center'>Secret Check:<input type='checkbox' id='secretCheck' name='secretCheck' value='secretCheck'></td></tr>";

        queryHTML += "<tr><td colspan='5' style='text-align:center'><input type='submit' name='skillCheckSubmit' value='Submit'></td></tr>";

        queryHTML += "</form></table></html>"

        MTScript.setVariable("queryHTML", queryHTML);
        let windowHeight = 360;
        if (!(isNaN(initiative))) {
            windowHeight += 20;
        }
        MTScript.evalMacro("[dialog5('Skill Check','width=600;height=" + String(windowHeight) + ";temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");

    } catch (e) {
        MapTool.chat.broadcast("Error in skill_check_dialog");
        MapTool.chat.broadcast("tokenName: " + tokenName);
        MapTool.chat.broadcast("altStat: " + String(altStat));
        MapTool.chat.broadcast("extraScopes: " + JSON.stringify(extraScopes));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}