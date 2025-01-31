"use strict";

function share_hazard(hazardID, details, broadcast = true) {
    let hazard = MapTool.tokens.getTokenByID(hazardID);
    let hazardData = read_hazard_properties(hazard);

    let output = "";

    if ((details == "all" || details == "description") && hazardData.description != "") {
        output += "<b>Description</b> " + hazardData.description;
    }
    if ((details == "all" || details == "stealth") && hazardData.stealth != "") {
        output += "<b>Stealth</b> DC " + hazardData.stealth.dc + " Perception " + hazardData.stealth.details;
    }
    if ((details == "all" || details == "disable") && hazardData.disable != "") {
        output += "<b>Disable</b> " + hazardData.disable;
    }
    if ((details == "all" || details == "reset") && hazardData.reset != "") {
        output += "<b>Reset</b> " + hazardData.reset;
    }
    if ((details == "all" || details == "routine") && hazardData.routine != "") {
        output += "<b>Routine</b> " + hazardData.routine;
    }
    let displayData = { "system": { "description": { "value": null } } };

    displayData.name = hazardData.name;
    displayData.system.description.value = output;
    displayData.type = "hazard";
    displayData.level = hazardData.level;
    displayData.system.traits = { "value": hazardData.traits };

    if (broadcast) {
        chat_display(displayData);
    } else {
        return chat_display(displayData, false);
    }
}

MTScript.registerMacro("ca.pf2e.share_hazard", share_hazard);