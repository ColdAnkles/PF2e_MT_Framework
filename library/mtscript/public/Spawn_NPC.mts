[h:tokenName=macro.args]

[h: id=findToken("NPCTemplate","Library")]
[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: newToken=copyToken(id,1,"Library",'{"name":"'+tokenName+'","x":'+xCoord+',"y":'+yCoord+'}')]

[h: js.ca.pf2e.create_npc(newToken, tokenName)]
[h: tokenSize = getProperty("size",newToken)]
[h: setSize(tokenSize,newToken)]

[h: senseList = stringToList(getProperty("senses", newToken),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),newToken)]
	};{}]
}]
[h: setProperty("myID", newToken, newToken)]