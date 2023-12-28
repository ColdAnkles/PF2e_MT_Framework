"use strict";

function set_state(stateName, stateVal, tokenID){
	
	if (typeof(tokenID)!="string"){
		tokenID = tokenID.getId();
	}
	
	MTScript.setVariable("tokenID", tokenID);
	MTScript.setVariable("stateName", stateName);
	MTScript.setVariable("stateVal", stateVal);
	MTScript.evalMacro("[h: setState(stateName, stateVal, tokenID)]");
}
