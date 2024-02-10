"use strict";

function update_my_tokens(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let tokenList = JSON.parse(token.getProperty("pcTokens"));
	let validTokenList = [];
	//MapTool.chat.broadcast(JSON.stringify(tokenList));
	for (var t in tokenList) {
		let updateTokenID = tokenList[t];
		let updateToken = MapTool.tokens.getTokenByID(updateTokenID);
		if (updateToken != null) {
			//MapTool.chat.broadcast(String(updateToken));
			validTokenList.push(updateTokenID);
			update_pc_token(token, updateTokenID)
		}
	}
	//MapTool.chat.broadcast(JSON.stringify(validTokenList));
	token.setProperty("pcTokens", JSON.stringify(validTokenList));
}