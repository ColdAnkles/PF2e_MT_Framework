[h: conditionName = json.get(macro.args,0)]
[h: tokenID = json.get(macro.args,1)]
[h: tokenName = getName(tokenID)]
[h: conditionDict = getLibProperty("pf2e_condition")]
[h: conditionData = json.get(conditionDict, conditionName)]
[h: currentConditions = getProperty("conditionDetails", tokenID)]
[h, if(json.contains(currentConditions, conditionName)), code:{
	[h: currentConditionValue = json.get(json.get(json.get(currentConditions,conditionName),"value"),"value")]
};{
	[h: currentConditionValue = 0]
}]
[h: isValued = json.get(json.get(conditionData,"value"),"isValued")]
[h, if(isValued==json.true), code:{
	[h: inputText = "conditionValue|0,1,2,3,4,5,6|Condition Value (Current="+currentConditionValue+")|RADIO|SELECT="+if(currentConditionValue==0,"1","0")]
	[h: ans = input("junkVarN|Condition for "+tokenName+"||LABEL|SPAN=TRUE","junkVar|Condition Values|Enter Value for "+conditionName+"|LABEL",inputText)]
	[h: abort(ans)]
	[h: js.ca.pf2e.set_condition(conditionName, tokenID, conditionValue)]	
};{
	[h: js.ca.pf2e.set_condition(conditionName, tokenID)]	
}]
