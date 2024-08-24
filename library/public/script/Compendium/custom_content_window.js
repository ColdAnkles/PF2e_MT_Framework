"use strict";

function custom_content_window() {
    let customContent = JSON.parse(read_data("customContent"));
    let returnHTML = "<body><table>";

    for (var key in customContent) {
        returnHTML += "<thead><tr><th colspan=3>";
        if (key != "npc") {
            returnHTML += "<h2>" + capitalise(key) + "</h2>";
        } else {
            returnHTML += "<h2>NPC</h2>";
        }
        returnHTML += "</th></tr></thead>";
        for (var contentEntry in customContent[key]) {
            let contentDisplay = contentEntry;
            if (!isNaN(contentDisplay)) {
                contentDisplay = customContent[key][contentEntry]
            }
            returnHTML += "<tr><td>" + contentDisplay + "</td><td>" + create_macroLink("Edit", "Custom_Content_Window_Link@Lib:ca.pf2e", { "key": key, "entry": contentEntry, "action": "edit" }) + "</td><td>" + create_macroLink("Delete", "Custom_Content_Window_Link@Lib:ca.pf2e", { "key": key, "entry": contentEntry, "action": "delete" }) + "</td></tr>";
        }
    }

    returnHTML += "</table></body>"
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.custom_content_window", custom_content_window);