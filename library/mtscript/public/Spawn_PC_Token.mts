[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]

[h:sourceTokenID=macro.args]

[h: baseToken=findToken("PCTemplate","Library")]
[h: rawTokenName = getName(sourceTokenID,"Player Characters")]
[h: tokenName = substring(rawTokenName,4,length(rawTokenName))]
[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: val = json.set("{}", "tokenImage", "lib://ca.pf2e/image/PCDefault.png", "name", tokenName,"x",xCoord,"y",yCoord)]
[h: newToken = createToken(val)]
[h: setPC(newToken)]
[h: setPropertyType("PF2E_Character", newToken)]

[h: tokenSize = getProperty("size",sourceTokenID, "Player Characters")]
[h: setSize(tokenSize,newToken)]

[h: senseList = stringToList(getProperty("senses", sourceTokenID, "Player Characters"),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),newToken)]
	};{}]
}]
[h: js.ca.pf2e.update_pc_token(sourceTokenID, newToken)]
[h: setProperty("myID", sourceTokenID, newToken)]

[h: myTokens = getProperty("pcTokens", sourceTokenID, "Player Characters")]
[h, if(myTokens==""), code:{
	[h: myTokens = "[]"]
};{}]
[h: myTokens = json.append(myTokens, newToken)]
[h: setProperty("pcTokens", myTokens, sourceTokenID, "Player Characters")]
[h: js.ca.pf2e.create_pc_token(newToken, sourceTokenID)]
[h: setOwner(getOwners("JSON", sourceTokenID, "Player Characters"), newToken)]
[h: setTokenImage(getTokenImage("", sourceTokenID, "Player Characters"), newToken)]
