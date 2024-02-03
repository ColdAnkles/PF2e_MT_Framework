"use strict";

function knockout_creature(tokenID){
	set_state("Unconscious", 1, tokenID)
	
	if(get_token_type(tokenID)==PC){
		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		MTScript.evalMacro("[h: setInitiative("+String(newInit)+", "+tokenID+")]")
	}

	MapTool.chat.broadcast(token.getName() + " has been knocked unconscious!");
}

MTScript.registerMacro("ca.pf2e.knockout_creature", knockout_creature);