[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: petData=macro.args]

[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: val = json.set("{}", "tokenImage", "lib://ca.pf2e/image/PetDefault.png", "name", "NewPC","x",xCoord,"y",yCoord)]
[h: newToken = createToken(val)]
[h: setPropertyType("PF2E_Character", newToken)]
[h: setPC(newToken)]

[h: js.ca.pf2e.write_creature_properties(petData, newToken)]

[h: tokenMaps = getTokenMap(newToken)]
[h, if(!json.contains(tokenMaps,"Player Characters")), code:{
	[h: moveTokenToMap(newToken, "Player Characters")]
};{}]
[h: tokenSize = getProperty("size",newToken,"Player Characters")]
[h: tokenName = getName(newToken,"Player Characters")]
[h: setName("Lib:"+tokenName, newToken, "Player Characters")]
[h: setSize(tokenSize,newToken,"Player Characters")]

[h: setSightType("Normal",newToken,"Player Characters")]
[h: senseList = stringToList(getProperty("senses", newToken,"Player Characters"),",")]
[h: visionList = json.append("[]","low-light","darkvision","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),newToken,"Player Characters")]
	};{}]
}]
[h: playerData = player.getInfo()]
[h: setOwner(json.get(playerData,"name"), newToken, "Player Characters")]
[h: macro.return = newToken]