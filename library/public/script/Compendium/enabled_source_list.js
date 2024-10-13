"use strict";

function enabled_source_list(action = null, searchKey = null) {
    action = JSON.parse(JSON.stringify(action));
    try {
        if (action != "" && action != null) {
            //action = JSON.parse(action);
            //action = action[0];
            if ("searchKey" in action && action.searchKey != "") {
                searchKey = action.searchKey;
                delete action["searchKey"];
            }
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in enabled_source_list during action-setup");
        MapTool.chat.broadcast("action: " + JSON.stringify(action));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    let allSources = JSON.parse(read_data("pf2e_publications"));
    try {
        allSources = allSources.concat(JSON.parse(read_data("customContent")).source);
        allSources = allSources.sort();
        if (action != null && action != "") {
            let changeSource = Object.keys(action)[0].replaceAll(';apos;', '\'');
            let changeAction = action[Object.keys(action)[0]];
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
    } catch (e) {
        MapTool.chat.broadcast("Error in enabled_source_list during custom-content-add");
        MapTool.chat.broadcast("custom sources: " + JSON.stringify(JSON.parse(read_data("customContent")).source));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
    if (searchKey == null) {
        searchKey = "";
    }
    try {
        enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    } catch (e) {
        MapTool.chat.broadcast("Error in enabled_source_list during read-enabled-sources");
        MapTool.chat.broadcast("enabled sources: " + JSON.stringify(JSON.parse(read_data("pf2e_enabledSources"))));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
    let returnHTML = "<form action='macro://Source_Enable_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
    returnHTML += "<div><input name='searchKey' placeholder='Search' value='" + searchKey + "'></input>\
    <input type='submit' name='searchButton' value='Search'></input>";
    returnHTML += "<table><tr><th>Source Name</th><th>Enabled</th></tr>";
    for (var s of allSources) {
        try {
            if (s == "") {
                continue;
            }
            if (searchKey != null && searchKey != "") {
                var re = new RegExp(searchKey, 'gi');
                if (!(s.match(re))) {
                    continue;
                }
            }
            returnHTML += "<tr><td>" + s + "</td>";
            if (enabledSources.includes(s)) {
                returnHTML += "<td><input type='submit' name='" + s.replaceAll('\'', ';apos;') + "' value='Disable'></input></td></tr>";
            } else {
                returnHTML += "<td><input type='submit' name='" + s.replaceAll('\'', ';apos;') + "' value='Enable'></input></td></tr>";
            }
        } catch (e) {
            MapTool.chat.broadcast("Error in enabled_source_list during print-table");
            MapTool.chat.broadcast("Source: " + s);
            MapTool.chat.broadcast("" + e + "\n" + e.stack);
            return;
        }
    }
    //returnHTML += "<tr><td colspan='2' align=center><input type='submit' name='save' value='Save'></input></td></tr></form></table>";
    returnHTML += "</form></table>";
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.enabled_source_list", enabled_source_list);