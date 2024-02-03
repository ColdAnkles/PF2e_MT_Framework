"use strict";

function zero_hp(tokenID){
	if(get_token_type(tokenID)=="PC"){
		set_state("Unconscious", 1, tokenID);
		
		let token = tokenID;

		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		MTScript.evalMacro("[h: setInitiative("+String(newInit)+", "+tokenID+")]")

		if (typeof(token) == "string"){
			token = MapTool.tokens.getTokenByID(tokenID);
		}

		MTScript.evalMacro("[h: ans=input(\"junkVar|Was the damage a crit?|blah|LABEL|SPAN=TRUE\")]");
		let askResponse = (MTScript.getVariable("ans")==1);

		let tokenConditions = token.getProperty("conditionDetails");

		let woundedVal = 0;

		if("Wounded" in tokenConditions){
			woundedVal = tokenConditions.Wounded.value.value;
		}

		set_state("Dying",((askResponse)?2:1)+woundedVal,token);
		tokenConditions = token.getProperty("conditionDetails");

		if("Wounded" in tokenConditions){
			tokenConditions.Wounded.value.value += 1;
		}

		token.setProperty("conditionDetails",JSON.stringify(tokenConditions));

		MapTool.chat.broadcast(token.getName() + " has been knocked unconscious!");

	}else{
		set_state("Dead", 1, tokenID);
		MapTool.chat.broadcast(token.getName() + " dies!");
	}
}

MTScript.registerMacro("ca.pf2e.zero_hp", zero_hp);