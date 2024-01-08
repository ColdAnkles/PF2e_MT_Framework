[h: pathbuilderID=macro.args]

[h: id=findToken("PCLibTemplate","Library")]
[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: newToken=copyToken(id,1,"Library",'{"name":"NewPC","x":'+xCoord+',"y":'+yCoord+'}')]

[h: js.ca.pf2e.create_pc_lib(pathbuilderID, newToken)]
[h: tokenMaps = getTokenMap(newToken)]
[h, if(!json.contains(tokenMaps,"Player Characters")), code:{
	[h: moveTokenToMap(newToken, "Player Characters")]
};{}]
[h: setPC(newToken, "Player Characters")]
[h: tokenSize = getProperty("size",newToken,"Player Characters")]
[h: tokenName = getName(newToken,"Player Characters")]
[h: setName("Lib:"+tokenName, newToken, "Player Characters")]
[h: setSize(tokenSize,newToken,"Player Characters")]

[h: senseList = stringToList(getProperty("senses", newToken,"Player Characters"),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),newToken,"Player Characters")]
	};{}]
}]
[h: playerData = player.getInfo()]
[h: setOwner(json.get(playerData,"name"), newToken, "Player Characters")]
