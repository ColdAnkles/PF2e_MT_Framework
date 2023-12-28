"use strict";

function parse_spell(spellData){
	let parsedData = {};
	for (var key in spellData){
		if (key != "system"){
			parsedData[key] = spellData[key];
		}else{
			for(var systemKey in spellData.system){
				if (spellData.system[systemKey]==null || typeof(spellData.system[systemKey])!="object" ){
					parsedData[systemKey]=spellData.system[systemKey];
				}else if ("value" in spellData.system[systemKey] && Object.keys(spellData.system[systemKey]).length==1){
					parsedData[systemKey]=spellData.system[systemKey].value;
				}else{
					parsedData[systemKey]=spellData.system[systemKey];
				}
			}
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(parsedData));

	return parsedData;
}
