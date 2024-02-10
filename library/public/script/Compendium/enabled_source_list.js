"use strict";

function enabled_source_list(action = null) {
    if (action != "") {
        action = JSON.parse(action);
        action = action[0];
    }
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    let allSources = JSON.parse(read_data("pf2e_publications"));
    allSources = allSources.sort();
    if (action != null && action != "") {
        let changeSource = Object.keys(action)[0];
        let changeAction = action[changeSource];
        if (changeAction == "Enable") {
            enabledSources.push(changeSource);
        } else {
            const index = enabledSources.indexOf(changeSource);
            if (index > -1) {
                enabledSources.splice(index, 1);
            }
        }
        write_data("pf2e_enabledSources", JSON.stringify(enabledSources));
    }
    enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    let returnHTML = "<table><tr><th>Source Name</th><th>Enabled</th></tr>";
    returnHTML += "<form action='macro://Source_Enable_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
    for (var s of allSources) {
        if (s == "") {
            continue;
        }
        returnHTML += "<tr><td>" + s + "</td>";
        if (enabledSources.includes(s)) {
            returnHTML += "<td><input type='submit' name='" + s + "' value='Disable'></input></td></tr>";
        } else {
            returnHTML += "<td><input type='submit' name='" + s + "' value='Enable'></input></td></tr>";
        }
    }
    returnHTML += "<tr><td colspan='2' align=center><input type='submit' name='save' value='Save'></input></td></tr></form></table>";
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.enabled_source_list", enabled_source_list);