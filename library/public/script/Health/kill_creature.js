"use strict";

function zero_hp(tokenID){
		
	let token = tokenID;

	if (typeof(token) == "string"){
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	
	if(get_token_type(tokenID)=="PC"){
		set_state("Unconscious", 1, tokenID);

		MTScript.evalMacro("[h: initToken = getInitiativeToken()][h, if(initToken==\"\"), code:{[h:currInit = -1]};{[h: currInit = getInitiative(initToken)]}][h: currRound = getInitiativeRound()]")
		let currentInitiative = Number(MTScript.getVariable("currInit"));
		let newInit = round(currentInitiative + 1);
		MTScript.evalMacro("[h: setInitiative("+String(newInit)+", \""+tokenID+"\")]")

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

		chat_display({"name":token.getName() + " unconscious!","description":token.getName() + " knocked unconscious!"},true);

	}else{
		set_state("Dead", 1, tokenID);
		chat_display({"name":token.getName() + " dies!","description":token.getName() + " dies!"},true);
		MTScript.evalMacro("[h: removeFromInitiative(\""+tokenID+"\")]");
	}
}

MTScript.registerMacro("ca.pf2e.zero_hp", zero_hp);