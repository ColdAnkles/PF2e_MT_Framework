"use strict";

function getLibContents(search = ""){
    MTScript.evalMacro("[h: content = library.getContents('ca.pf2e')]")
    let content = JSON.parse(MTScript.getVariable("content"));

    if (search == "" ){
        return content;
    }

    let matchingContent = [];
    for (var c in content){
        let contentString = content[c];
        //MapTool.chat.broadcast(contentString);
        if (contentString.includes(search)){
            matchingContent.push(contentString);
        }
    }

    return matchingContent;

}

MTScript.registerMacro("ca.pf2e.getLibContents", getLibContents);