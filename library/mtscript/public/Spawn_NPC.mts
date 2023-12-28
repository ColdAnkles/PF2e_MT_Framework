[h:tokenName=macro.args]

[h: id=findToken("NPCTemplate","Library")]
[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: newToken=copyToken(id,1,"Library",'{"name":"'+tokenName+'","x":'+xCoord+',"y":'+yCoord+'}')]

[h: js.pf2e.create_npc(newToken, tokenName)]
[h: tokenSize = getProperty("size",newToken)]
[h: setSize(tokenSize,newToken)]

[h: senseList = stringToList(getProperty("senses", newToken),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(pf2e.Capitalize(sense),newToken)]
	};{}]
}]
