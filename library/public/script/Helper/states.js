"use strict";

function set_state(stateName, stateVal, tokenID) {
	let token = tokenID;
	let tokenName = null;
	let updateTokens = [];
	try {
		if (typeof (tokenID) != "string") {
			tokenID = tokenID.getId();
		} else {
			token = MapTool.tokens.getTokenByID(tokenID);
		}
		tokenName = token.getName();

		updateTokens = [tokenID];
		if (get_token_type(tokenID) == "PC") {
			if (tokenName.includes("Lib:")) {
				let subTokens = JSON.parse(token.getProperty("pcTokens"));
				updateTokens = updateTokens.concat(subTokens);
			} else {
				set_state(stateName, stateVal, token.getProperty("myID"));
				return;
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_state during token resolution");
		MapTool.chat.broadcast("stateName: " + String(stateName));
		MapTool.chat.broadcast("stateVal: " + String(stateVal));
		MapTool.chat.broadcast("tokenID: " + String(tokenID));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		MTScript.setVariable("stateName", stateName);
		MTScript.setVariable("stateVal", stateVal);
		for (var t in updateTokens) {
			MTScript.setVariable("tokenID", updateTokens[t]);
			let token = MapTool.tokens.getTokenByID(updateTokens[t]);
			let tokenName = token.getName();
			if (tokenName.includes("Lib:")) {
				token.setState(stateName, stateVal);
			} else {
				token.setState(stateName, stateVal);
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in set_state during setting state");
		MapTool.chat.broadcast("stateName: " + String(stateName));
		MapTool.chat.broadcast("stateVal: " + String(stateVal));
		MapTool.chat.broadcast("tokenID: " + String(tokenID));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
}

function get_state(stateName, tokenID) {
	let token = tokenID;
	if (typeof (tokenID) != "string") {
		tokenID = tokenID.getId();
	} else {
		token = MapTool.tokens.getTokenByID(tokenID);
	}
	let tokenName = token.getName();
	if (get_token_type(tokenID) == "PC") {
		if (!tokenName.includes("Lib:")) {
			return get_state(stateName, token.getProperty("myID"));
		} else {
			return token.getState(stateName);
		}
	} else {
		return token.getState(stateName);
	}
}