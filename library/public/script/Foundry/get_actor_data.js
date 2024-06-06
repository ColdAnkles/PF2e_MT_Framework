"use strict";

function get_actor_data(actor, varName) {
    if (typeof (actor) == "string") {
        actor = MapTool.tokens.getTokenByID(actor);
    }
    let actorData = JSON.parse(actor.getProperty("foundryActor"));
    let result = null;
    //MapTool.chat.broadcast(JSON.stringify(actorData));
    //MapTool.chat.broadcast(varName);
    try {
        result = eval("actorData." + varName);
    } catch {
        result = null;
    }
    return result;
}

MTScript.registerMacro("ca.pf2e.get_actor_data", get_actor_data);