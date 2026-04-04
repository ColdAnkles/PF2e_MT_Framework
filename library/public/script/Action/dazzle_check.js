"use strict";

function dazzle_check(token) {
    //Returns True if Succeeds Dazzle Check or is not Dazzled
    let activeConditions = JSON.parse(token.getProperty("conditionDetails"));

    try {
        if ("Dazzled" in activeConditions) {
            return flat_check(token, { "dc": 5, "altTitle": token.getName().replace("Lib:","") + " is dazzled.", "failMsg": token.getName().replace("Lib:","") + " is too dazzled and fails to act." });
        }else{
            return true;
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in dazzle_check");
        MapTool.chat.broadcast("activeConditions: " + JSON.stringify(activeConditions));
        MapTool.chat.broadcast("token: " + String(token));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}