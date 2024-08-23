"use strict";

function enabled_source_list(action = null, searchKey=null) {
    if (action != "" && action != null) {
        action = JSON.parse(action);
        action = action[0];
        if("searchKey" in action){
            searchKey = action.searchKey;
        }
    }
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    let allSources = JSON.parse(read_data("pf2e_publications"));
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
    if (searchKey==null){
        searchKey = "";
    }
    enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    let returnHTML = "<form action='macro://Source_Enable_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
    returnHTML += "<div><input name='searchKey' placeholder='Search' value='"+ searchKey + "'></input>\
    <input type='submit' name='searchButton' value='Search'></input>";
    returnHTML += "<table><tr><th>Source Name</th><th>Enabled</th></tr>";
    for (var s of allSources) {
        if (s == "") {
            continue;
        }        
        if (searchKey!=null && searchKey != "") {
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
    }
    //returnHTML += "<tr><td colspan='2' align=center><input type='submit' name='save' value='Save'></input></td></tr></form></table>";
    returnHTML += "</form></table>";
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.enabled_source_list", enabled_source_list);