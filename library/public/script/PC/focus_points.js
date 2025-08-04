"use strict";

function add_focus_point(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    if (!(token.getName().includes("Lib")) && token.isPC()) {
        add_focus_point(token.getProperty("myID"));
        return;
    }

    let tokenResources = JSON.parse(token.getProperty("resources"));
    if ("focus" in tokenResources) {
        tokenResources.focus.current = Math.min(tokenResources.focus.max, tokenResources.focus.current + 1);
    }
    token.setProperty("resources", JSON.stringify(tokenResources));

    if (token.getName().includes("Lib")) {
        update_my_tokens(token);
    }
}

MTScript.registerMacro("ca.pf2e.add_focus_point", add_focus_point);

function use_focus_point(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    if (!(token.getName().includes("Lib")) && token.isPC()) {
        use_focus_point(token.getProperty("myID"));
        return;
    }

    let tokenResources = JSON.parse(token.getProperty("resources"));
    if ("focus" in tokenResources) {
        tokenResources.focus.current = Math.max(0, tokenResources.focus.current - 1);
    }
    token.setProperty("resources", JSON.stringify(tokenResources));

    if (token.getName().includes("Lib")) {
        update_my_tokens(token);
    }
}

MTScript.registerMacro("ca.pf2e.use_focus_point", use_focus_point);