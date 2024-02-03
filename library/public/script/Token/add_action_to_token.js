"use strict";

function action_icon_label(actionType, actionCount){
	//MapTool.chat.broadcast(actionType);
	//MapTool.chat.broadcast(String(actionCount));
	if(actionCount==null){
		actionCount=0;
	}
	if (actionType == "action" && !(isNaN(actionCount))){
		if (actionCount == 1){
			return "&#9670;";
		}else if (actionCount == 2){
			return "&#9670;&#9670;";
		}else if (actionCount == 3){
			return "&#9670;&#9670;&#9670;";
		}
	}else if (actionType=="reaction"){
		return "&#10227;";
	}else if (actionType=="freeaction" || actionType=="free"){
		return "&#9671;";
	}else if (actionType=="passive"){
		return "";
	}else if (actionType=="long"){
		return "("+actionCount+")";
	}else if (actionCount.includes("to")){
		let first = actionCount.split(" to ")[0];
		let second = actionCount.split(" to ")[1];
		let char = "&#9670;";
		let returnString = "";
		for (var i = 0; i<first; i++){
			returnString = returnString + char;
		}
		returnString = returnString + " to ";
		for (var j = 0; j<second; j++){
			returnString = returnString + char;
		}
		return returnString;
	}else{
		MapTool.chat.broadcast(actionType);
	}
	return "Error";
}

function add_action_to_token(actionData, tokenID, tokenLevel = 0){
	//MapTool.chat.broadcast(JSON.stringify(actionData));
	if (actionData.type=="basic"){
		
		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_action"));
		let property = JSON.parse(read_data("pf2e_action"));
		let lookupAction = property[actionData.name];

		if (lookupAction == null){
			MapTool.chat.broadcast("Cannot find action: " + actionData.name);
			return;
		}
		//MapTool.chat.broadcast(JSON.stringify(lookupAction));
		
		let actionDesc = chat_display(lookupAction, false, {"level":tokenLevel});
		let props = {"label":action_icon_label(lookupAction.actionType, lookupAction.actionCost)+" "+actionData.name,"playerEditable":0,"command":"[r: js.ca.pf2e.simple_action(\""+actionData.name+"\",currentToken())]","tooltip":actionDesc,"sortBy":actionData.name};
		if ("group" in actionData){
			props.group = actionData.group;
		}
		createMacro(props, tokenID);
		
	}else if (actionData.type=="personal" || actionData.type=="feat"){
		
		//MapTool.chat.broadcast(JSON.stringify(actionData));
		let actionLabel = action_icon_label(actionData.actionType, actionData.actionCost)+" "+actionData.name;
		if ("isMelee" in actionData){
			if(actionData.isMelee){
				actionLabel = actionLabel + " " + icon_img("melee");
			}else{
				actionLabel = actionLabel + " " + icon_img("ranged");
			}
		}
		let props = {"label":actionLabel,"playerEditable":0,"command":"[r: js.ca.pf2e.personal_action(\""+actionData.name+"\",currentToken())]","tooltip":chat_display(actionData, false, {"level":tokenLevel}),"sortBy":actionData.name};
		if ("group" in actionData){
			props.group = actionData.group;
		}
		createMacro(props, tokenID);
		
	}else if (actionData.type=="spell"){
		
		//let libToken = get_runtime("libToken");
		//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
		let property = JSON.parse(read_data("pf2e_spell"));
		let spellName = actionData.name.replaceAll(/\(.*\)/g,"").trim();
		let lookupSpell = null;
		if (!(spellName in property)){
			lookupSpell = actionData.rawData
			let storeSpell = JSON.parse(JSON.stringify(lookupSpell));
			delete storeSpell.castLevel;
			delete storeSpell.location;
			store_object_data(storeSpell);
		}else{
			lookupSpell = property[spellName];
			if("fileURL" in lookupSpell){
				lookupSpell = parse_spell(rest_call(lookupSpell["fileURL"],""));
			}
		}

		//MapTool.chat.broadcast(lookupSpell.name);

		if (!isNaN(lookupSpell.time)){
			actionData.actionType = "action";
			actionData.actionCost = lookupSpell.time;
		}else if (lookupSpell.time.includes("to")){
			actionData.actionType = "action";
			actionData.actionCost = lookupSpell.time;
		}else if(lookupSpell.time=="reaction"){
			actionData.actionType = "reaction";
			actionData.actionCost = 1;
		}else if(lookupSpell.time=="free"){
			actionData.actionType = "free";
			actionData.actionCost = 1;
		}else{
			actionData.actionType = "long";
			actionData.actionCost = lookupSpell.time;
		}
		actionData.description = lookupSpell.description;

		actionData.type = lookupSpell.category;
		if (actionData.traits.includes("cantrip") && actionData.type == "spell"){
			actionData.type = "Cantrip";
			//actionData.castLevel = Math.floor(actionData.creatureLevel/2);
		}else if(actionData.traits.includes("cantrip") && actionData.type == "focus"){
			actionData.type = "Focus Cantrip";
			//actionData.castLevel = Math.floor(actionData.creatureLevel/2);
		}
		actionData.level = lookupSpell.level;
		//actionData.traits = lookupSpell.traits.value.push(lookupSpell.traits.rarity);

		let spellLabel = action_icon_label(actionData.actionType, actionData.actionCost)+" "+actionData.name;
		actionData.name = spellName;
		let tooltipDescription = chat_display(actionData, false, {"level":actionData.castLevel});
	
		let props = {"label":spellLabel,"playerEditable":0,"command":"[r: js.ca.pf2e.cast_spell(\""+spellName+"\","+actionData.castLevel+",currentToken())]","tooltip":tooltipDescription,"sortBy":actionData.name,"group":actionData.group};

		//MapTool.chat.broadcast(JSON.stringify(props));
		createMacro(props, tokenID);
	}
}

MTScript.registerMacro("ca.pf2e.add_action_to_token", add_action_to_token);