[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: pathBuilderID = json.get(macro.args,"pbID")]
[h: tokenID = json.get(macro.args,"tokenID")]
[h: js.pf2e.create_pc_lib(pathbuilderID, tokenID)]
[h: setPC(tokenID, "Player Characters")]
[h: tokenSize = getProperty("size",tokenID,"Player Characters")]
[h: tokenName = getName(tokenID,"Player Characters")]
[h: setName("Lib:"+tokenName, tokenID, "Player Characters")]
[h: setSize(tokenSize,tokenID,"Player Characters")]
[h: senseList = stringToList(getProperty("senses", tokenID,"Player Characters"),",")]
[h: visionList = json.append("[]","darkvision","low-light","greater darkvision")]
[h, foreach(sense, senseList), code:{
	[h, if(json.contains(visionList,sense)), code:{
		[h: setSightType(pf2e.Capitalize(sense),tokenID,"Player Characters")]
	};{}]
}]