"use strict";

function cast_spell(spellName, castLevel, casterToken, additionalData = null){
	//MapTool.chat.broadcast(spellName);
	//MapTool.chat.broadcast(String(castLevel));
	//MapTool.chat.broadcast(casterToken);
	//MapTool.chat.broadcast(String(additionalData));

	castLevel = Number(castLevel);
	
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	
	if (!(spellName in property)){
		MapTool.chat.broadcast("<h2>Could not find spell " + spellName + "</h2>");
		return;
	}
	
	let spellData = property[spellName];
	if ("fileURL" in spellData){
		spellData = rest_call(spellData["fileURL"],"");
	}
	spellData = parse_spell(spellData);

	let actionData = {"name":spellData.name,"isSpell":true,"castLevel":castLevel};

	if(!(isNaN(spellData.time))){
		actionData.actionType="action";
		actionData.actionCost=spellData.time;
	}else if (spellData.time.includes("to") && additionalData == null){
		//Ask actions spent
		let first = Number(spellData.time.split(" to ")[0]);
		let second = Number(spellData.time.split(" to ")[1]);
		if (isNaN(second)){
			second = 3;
		}
		let inputText = "additionalData|";
		for (let i=first; i<=second; i++){
			inputText = inputText + String(i) + " " + icon_img(String(i)+"action",false, true) + ",";
		}
		inputText = inputText.substring(0,inputText.length-1) + "|Actions to use|LIST|ICON=TRUE";
		
		let transferData = {"spellName":spellName,"castLevel":String(castLevel),"casterToken":casterToken,"inputText":inputText,"first":first};
		MTScript.setVariable("transferData",JSON.stringify(transferData));
		MTScript.evalMacro("[h: pf2e.Spell_Actions_Form_To_JS(transferData)]");
		return;
	}else if(spellData.time.includes("to") && additionalData != null){
		actionData.actionType="action";
		actionData.actionCost=Number(additionalData);
	}else if(spellData.time=="reaction"){
		actionData.actionType="reaction";
		actionData.actionCost=1;
	}else{
		//Non-encounter mode spells
		actionData.actionType="action";
		actionData.actionCost=100;
	}
	
	core_action(actionData, casterToken);
	
}

MTScript.registerMacro("ca.pf2e.cast_spell", cast_spell);