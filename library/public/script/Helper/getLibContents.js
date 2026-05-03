"use strict";

function getLibContents(search = "") {
    MTScript.evalMacro("[h: content = library.getContents('ca.pz2e')]")
    let content = JSON.parse(MTScript.getVariable("content"));

    if (search == "") {
        return content;
    }

    let matchingContent = [];
    for (var c in content) {
        let contentString = content[c];
        //MapTool.chat.broadcast(contentString);
        if (contentString.includes(search)) {
            matchingContent.push(contentString);
        }
    }

    return matchingContent;

}

MTScript.registerMacro("ca.pz2e.getLibContents", getLibContents);