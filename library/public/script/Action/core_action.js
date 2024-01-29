"use strict";

function core_action(actionData, actingToken){
	if (typeof(actingToken)=="string"){
		actingToken = MapTool.tokens.getTokenByID(actingToken);
	}

	//MapTool.chat.broadcast(JSON.stringify(actionData));
	
	if ("requirements" in actionData && actionData.requirements != null && "value" in actionData.requirements && actionData.requirements.value != ""){
		MapTool.chat.broadcast("Test Requirements:\n" + JSON.stringify(actionData.requirements));
	}

	let canAct = false;
	let failAct = "Unknown Reason";

	let initiative = get_initiative(actingToken.getId());

	let actionsLeft = Number(actingToken.getProperty("actionsLeft"));
	let reactionsLeft = Number(actingToken.getProperty("reactionsLeft"));

	if (isNaN(initiative) || (actionData.actionType=="action" && actionsLeft>=actionData.actionCost)){
		canAct = true;
	}else if (actionData.actionType=="action"){
		failAct = "Insufficient Actions";
	}else if (isNaN(initiative) || (actionData.actionType=="reaction" && (reactionsLeft>=actionData.actionCost || actionData.actionCost == null))){
		canAct = true;
	}else if (actionData.actionType=="reaction"){
		failAct = "Insufficient Reactions";
	}else if(actionData.actionType=="passive"){
		canAct = true;
	}

	if (canAct){
		//MapTool.chat.broadcast("Performing Action: "+ actionData.name);

		if ("isSpell" in actionData && actionData.isSpell){
			spell_action(actionData, actingToken);
		}else if ("isMelee" in actionData){

			if(!(isNaN(initiative)) && !("useMAP" in actionData)){
				let queryHTML = "<html><p align=center><form action='macro://Core_Action_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>"
				queryHTML += "<input type='hidden' name='actionData' value='"+JSON.stringify(actionData)+"'>";
				queryHTML += "<input type='hidden' name='actingToken' value='"+actingToken.getId()+"'>";
				queryHTML += "Use MAP:<input type='checkbox' id='useMAP' name='useMAP' value='useMAP' checked='true'><br />";
				queryHTML += "Increase MAP:<input type='checkbox' id='increaseMAP' name='increaseMAP' value='increaseMAP' checked='true'><br />";
				queryHTML += "Spend Action:<input type='checkbox' id='spendAction' name='spendAction' value='spendAction' checked='true'><br />";
				queryHTML += "<input type='submit' name='submit' value='Submit'></input>";
				queryHTML += "</form></p></html>";
		
				MTScript.setVariable("queryHTML", queryHTML);
				MTScript.evalMacro("[frame5('Attack Query', 'width=250; height=250; temporary=1; noframe=0; input=1'):{[r: queryHTML]}]")
				return;
			}

			attack_action(actionData, actingToken);
		}else{
			let needsEffect = false;
			let doSave = false;
			let doCheck = false;
			let effectType = ""
			if(!("rules"in actionData)){
				actionData.rules=[];
			}
			for (var r in actionData.rules){
				let ruleData = actionData.rules[r];
				if (ruleData.selector=="saving-throw"){
					needsEffect = true;
					doSave = true;
					effectType = "saving-throw";
				}
			}
	
			if (needsEffect){
				let effectData = {};
				effectData.rules = actionData.rules;
				effectData.duration = {"expiry":"turn-start","sustained":"false","unit":"rounds","value":1}
				effectData.type = effectType;
				effectData.name = "Effect: " + actionData.name
				toggle_action_effect(effectData, actingToken, true);
			}
			
			chat_display(actionData, true, {"level":actingToken.level,"rollDice":true});
	
			if (doSave){
				saving_throw(actingToken, null, {"applyEffect":actionData.name});
			}
			if (doCheck){
				skill_check(actingToken);
			}
		}

		if (!(isNaN(initiative)) && ("spendAction" in actionData && actionData.spendAction)){
			if (actionData.actionType=="action"){
				actingToken.setProperty("actionsLeft", String(actionsLeft-actionData.actionCost));
			}else if(actionData.actionType=="reaction"){
				actingToken.setProperty("reactionsLeft", String(reactionsLeft-actionData.actionCost));
			}
			update_action_bank(actingToken);
		}
	}else{
		MapTool.chat.broadcast("Cannot " + actionData.name + ": " + failAct);
	}
}

MTScript.registerMacro("ca.pf2e.core_action", core_action);