"use strict";

function manage_custom_content(key, entry, action) {
    let customContent = JSON.parse(read_data("customContent"));
    if (key == "npc") {
        if (action == "edit") {
            npc_editor(customContent[key][entry]);
        } else if (action == "delete") {
            delete customContent[key][entry];
            write_data("customContent", JSON.stringify(customContent));
        }
    }
}

MTScript.registerMacro("ca.pf2e.manage_custom_content", manage_custom_content);