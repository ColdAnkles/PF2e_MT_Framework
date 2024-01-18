"use strict";

function read_hazard_properties(token){
	if (typeof(token)=="string"){
			token = MapTool.tokens.getTokenByID(token);
		if(token==null){
			MapTool.chat.broadcast("Couldn't find token!");
		}
	}
    
}