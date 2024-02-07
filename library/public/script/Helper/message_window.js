"use strict";

function message_window(title, text){
    let htmlText = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><div>" + text + "</div>";
    MTScript.setVariable("htmlText", htmlText)
    MTScript.evalMacro("[frame5('"+title+"', 'width=350; height=200; temporary=1; noframe=0; input=1'):{[r: htmlText]}]")
}

function close_message_window(windowTitle){
    MTScript.evalMacro("[h: closeFrame("+windowTitle+")]");
}