"use strict";

function update_action_bank(token){
	if (typeof(token)=="string"){
		token = MapTool.tokens.getTokenByID(token);
	}
	
	let actionCount = Number(token.getProperty("actionsLeft"));
	let reactionCount = Number(token.getProperty("reactionsLeft"));
	
	for (var i in [0,1,2,3,4,5]){
		if (i == actionCount && i!=0){
			set_state("ActionsLeft_"+String(i), 1, token.getId());
		}else if (i!=0){
			set_state("ActionsLeft_"+String(i), 0, token.getId());
		}
	}
	
	if(reactionCount == 1){
		set_state("Reaction", 1, token.getId());
	}else{
		set_state("Reaction", 0, token.getId());
	}

	
}