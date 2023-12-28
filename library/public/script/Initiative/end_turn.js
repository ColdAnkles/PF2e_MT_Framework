"use strict";

function end_turn(turnToken){	
	if (typeof(turnToken)=="string"){
		turnToken = MapTool.tokens.getTokenByID(turnToken);
	}
	//MapTool.chat.broadcast(turnToken.getName());
	for (var i in [0,1,2,3,4]){
		set_state("ActionsLeft_"+String(Number(i)+1), 0, turnToken.getId());
	}
	MTScript.evalMacro("[h: nextInitiative()]");
}

MTScript.registerMacro("ca.pf2e.end_turn", end_turn);