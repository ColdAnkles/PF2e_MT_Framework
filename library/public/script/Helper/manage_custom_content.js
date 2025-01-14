"use strict";

function manage_custom_content(key, entry, action) {
    let customContent = JSON.parse(read_data("customContent"));
    if (key == "npc") {
        if (action == "edit") {
            npc_editor(customContent[key][entry]);
        } else if (action == "delete") {
            delete customContent[key][entry];
            write_data("customContent", JSON.stringify(customContent));
        } else if (action == "export") {
            message_window(entry + " Export", JSON.stringify(customContent[key][entry]).replaceAll("<", "&lt;"));
        }
    } else if (key == "source") {
        if (action == "delete") {
            let delIndex = customContent[key].indexOf(entry);
            customContent[key].splice(delIndex, 1);
            write_data("customContent", JSON.stringify(customContent));
        }
    } else if (key == "all" && action == "export") {
        message_window("Custom Content Export", JSON.stringify(customContent).replaceAll("<", "&lt;"));
    } else if (key == "all" && action == "import") {
        MTScript.evalMacro("[h: input(\"importJson|Enter JSON|Import JSON\")]")
        let importData = JSON.parse(MTScript.getVariable("importJson"));
        if (!("type" in importData)) {
            //TODO - FOR KEY IN IMPORT DATA, IMPORT EACH ENTRY
            MapTool.chat.broadcast("Importing All")
        } else {
            customContent[importData.type][importData.name] = importData;
            write_data("customContent", JSON.stringify(customContent));
        }
    }
    MTScript.evalMacro("[h: ca.pf2e.Custom_Content_Window()]")
}

MTScript.registerMacro("ca.pf2e.manage_custom_content", manage_custom_content);