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

	if("defense" in parsedData && parsedData.defense != null && "save" in parsedData.defense){
		parsedData.spellType = "save";
		parsedData.save = parsedData.defense.save;
	}else if(parsedData.traits.value.includes("attack")){
		parsedData.spellType = "attack";
	}else{
		parsedData.spellType = "unknown";
	}

	if("area" in parsedData && parsedData.area != null && "type" in parsedData.area){
		let areaString = "";
		if("value" in parsedData.area){
			areaString += String(parsedData.area.value) + " ft. ";
		}
		areaString += parsedData.area.type;
		parsedData.area.details = areaString;
	}

	if (parsedData.traits.value.includes("focus")){
		parsedData.category = "focus";
	}else if (parsedData.traits.value.includes("cantrip")){
		parsedData.category = "cantrip";
	}else{
		parsedData.category = "spell";
	}

	//MapTool.chat.broadcast(JSON.stringify(parsedData));

	return parsedData;
}
