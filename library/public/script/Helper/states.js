"use strict";

function set_state(stateName, stateVal, tokenID){
	let token = tokenID;
	if (typeof(tokenID)!="string"){
		tokenID = tokenID.getId();
	}else{
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	let tokenName = token.getName();

	let updateTokens = [tokenID];
	if(get_token_type(tokenID)=="PC"){
		if(tokenName.includes("Lib:")){
			let subTokens = JSON.parse(token.getProperty("pcTokens"));
			updateTokens = updateTokens.concat(subTokens);
		}else{
			set_state(token.getProperty("myID"), stateVal, tokenID);
			return;
		}
	}
	
	MTScript.setVariable("stateName", stateName);
	MTScript.setVariable("stateVal", stateVal);
	for(var t in updateTokens){
		MTScript.setVariable("tokenID", updateTokens[t]);
		MTScript.evalMacro("[h: setState(stateName, stateVal, tokenID)]");
	}
}

function get_state(stateName, tokenID){
	let token = tokenID;
	if (typeof(tokenID)!="string"){
		tokenID = tokenID.getId();
	}else{
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	let tokenName = token.getName();
	if(get_token_type(tokenID)=="PC"){
		if(!tokenName.includes("Lib:")){
			return get_state(token.getProperty("myID"), tokenID);
		}
	}
	
	MTScript.setVariable("stateName", stateName);
	MTScript.setVariable("tokenID", tokenID);
	MTScript.evalMacro("[h: state = getState(stateName, tokenID)]");
	let result = Boolean((String(MTScript.getVariable("state"))=="1"));
	return result;
}