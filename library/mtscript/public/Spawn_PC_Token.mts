[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]

[h:sourceTokenID=macro.args]

[h: baseToken=findToken("PCTemplate","Library")]
[h: rawTokenName = getName(sourceTokenID)]
[h: tokenName = substring(rawTokenName,4,length(rawTokenName))]
[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: newToken=copyToken(baseToken,1,"Library",'{"name":"'+tokenName+'","x":'+xCoord+',"y":'+yCoord+'}')]

[h: tokenSize = getProperty("size",sourceTokenID)]
[h: setSize(tokenSize,newToken)]

[h: senseList = stringToList(getProperty("senses", sourceTokenID),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(pf2e.Capitalize(sense),newToken)]
	};{}]
}]
[h: js.pf2e.update_pc_token(sourceTokenID, newToken)]
[h: setProperty("myID", sourceTokenID, newToken)]

[h: myTokens = getProperty("pcTokens", sourceTokenID)]
[h, if(myTokens==""), code:{
	[h: myTokens = "[]"]
};{}]
[h: myTokens = json.append(myTokens, newToken)]
[h: setProperty("pcTokens", myTokens, sourceTokenID)]