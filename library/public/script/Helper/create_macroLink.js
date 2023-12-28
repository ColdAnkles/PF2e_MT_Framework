"use strict";

function create_macroLink(text, link, args){
	MTScript.setVariable("text", text);
	MTScript.setVariable("link", link);
	MTScript.setVariable("args", args);
	MTScript.evalMacro("[h: linkText = macroLink(text, link, '', args)]");
	return MTScript.getVariable("linkText")
}

MTScript.registerMacro("ca.pf2e.create_macroLink", create_macroLink);