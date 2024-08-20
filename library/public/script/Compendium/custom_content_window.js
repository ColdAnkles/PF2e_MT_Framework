"use strict";

function custom_content_window() {
    let customContent = JSON.parse(read_data("customContent"));
    let returnHTML = "<body>";

    for (var key in customContent) {
        if (key != "npc") {
            returnHTML += "<h2>" + capitalise(key) + "</h2>";
        } else {
            returnHTML += "<h2>NPC</h2>";
        }
        for (var contentEntry in customContent[key]) {
            returnHTML += contentEntry; //TODO deleting and editing entries
        }
    }

    returnHTML += "</body>"
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.custom_content_window", custom_content_window);