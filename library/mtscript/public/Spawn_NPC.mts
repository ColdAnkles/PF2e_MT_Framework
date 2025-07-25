[h: tokenName=json.get(macro.args,0)]
[h: variant = json.get(macro.args,1)]

[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: val = json.set("{}", "tokenImage", "lib://ca.pf2e/image/NPCDefault.png", "name", tokenName,"x",xCoord,"y",yCoord)]
[h: newToken = createToken(val)]
[h: setPropertyType("PF2E_Character", newToken)]

[h: js.ca.pf2e.create_npc(newToken, tokenName, variant)]
[h: tokenSize = getProperty("size",newToken)]
[h: setSize(tokenSize,newToken)]
[h: setHasSight(1, newToken)]

[h: senseList = stringToList(getProperty("senses", newToken),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),newToken)]
	};{}]
}]
[h: setProperty("myID", "[r: currentToken()]", newToken)]