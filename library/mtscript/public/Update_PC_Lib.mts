[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: pathBuilderID = json.get(macro.args,"pbID")]
[h: tokenID = json.get(macro.args,"tokenID")]
[h: existing = findToken(tokenID,"Player Characters")]
[h, if(existing == ""), code:{
	[h: broadcast("Player Token Removed!")]
	[h: return(0)]
};{}]
[h: js.ca.pf2e.create_pc_lib(pathbuilderID, tokenID)]
[h: setPC(tokenID, "Player Characters")]
[h: tokenSize = getProperty("size",tokenID,"Player Characters")]
[h: tokenName = getName(tokenID,"Player Characters")]
[h: setName("Lib:"+tokenName, tokenID, "Player Characters")]
[h: setSize(tokenSize,tokenID,"Player Characters")]
[h: senseList = stringToList(getProperty("senses", tokenID,"Player Characters"),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(js.ca.pf2e.capitalise(sense),tokenID,"Player Characters")]
	};{}]
}]
[h: js.ca.pf2e.update_my_tokens(tokenID)]