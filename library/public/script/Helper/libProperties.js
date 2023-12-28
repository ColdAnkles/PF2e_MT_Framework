"use strict";

function setLibProperty(libName, propertyName, propertyValue){
    MTScript.setVariable("libName", libName);
    MTScript.setVariable("varName", propertyName);
    MTScript.setVariable("varProperty", propertyValue);
	//MTScript.evalMacro("[h: data.setData('addon:', 'ca.pf2e', varName, varProperty )]")
    MTScript.evalMacro("[h: setLibProperty(varName, varProperty, libName)")
}

function getLibProperty(libName, propertyName){
    MTScript.setVariable("libName", libName);
	MTScript.setVariable("varName", propertyName);
	//MTScript.evalMacro("[h: returnedData = data.getData('addon:', 'ca.pf2e', varName)]");
    MTScript.evalMacro("[h: returnedData = getLibProperty(varName, libName)]")
    return MTScript.getVariable("returnedData");
}