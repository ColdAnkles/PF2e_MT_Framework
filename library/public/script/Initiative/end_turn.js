"use strict";

function end_turn(turnToken, forwards=true){
	if(turnToken=="" || turnToken==null){
		MTScript.evalMacro("[h: sortInitiative()][h: nextInitiative()]");
		return
	}
	MTScript.evalMacro("[h: currentInit = getInitiativeToken()]");
	let currentTurnToken = MTScript.getVariable("currentInit");
	if (typeof(turnToken)=="string"){
		turnToken = MapTool.tokens.getTokenByID(turnToken);
	}
	if(currentTurnToken!=turnToken.getId()){
		return;
	}
	//MapTool.chat.broadcast(turnToken.getName());
	for (var i in [0,1,2,3,4]){
		set_state("ActionsLeft_"+String(Number(i)+1), 0, turnToken.getId());
	}
	let tokenConditions = JSON.parse(turnToken.getProperty("conditionDetails"));

	let decrementConditions = ["Frightened"];
	for (var cond of decrementConditions){
		if (cond in tokenConditions && tokenConditions[cond].autoDecrease){
			set_condition(cond, turnToken, tokenConditions[cond].value.value-1, true);
		}
	}

	if(forwards){
		MTScript.evalMacro("[h: nextInitiative()]");
	}else{
		MTScript.evalMacro("[h: prevInitiative()]");
	}
}

MTScript.registerMacro("ca.pf2e.end_turn", end_turn);