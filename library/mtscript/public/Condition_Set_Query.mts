[h: conditionName = json.get(macro.args,0)]
[h: tokenID = json.get(macro.args,1)]
[h: tokenName = getName(tokenID)]
[h: conditionDict = getLibProperty("pf2e_condition")]

[h: tempConditionName = replace(conditionName," \\(Time\\)","")]

[h, if(!json.contains(conditionDict,tempConditionName)), code:{
	[h: allStates = getTokenStates("json")]
	[h, if(json.contains(allStates,tempConditionName)),code:{
		[h: js.ca.pf2e.set_condition(conditionName, tokenID)]
	};{}]
	[h: return(0)]
};{}]

[h: conditionData = json.get(conditionDict, tempConditionName)]
[h: currentConditions = getProperty("conditionDetails", tokenID)]
[h, if(json.contains(currentConditions, conditionName)), code:{
	[h: currentConditionValue = json.get(json.get(json.get(json.get(currentConditions,conditionName),"system"),"value"),"value")]
};{
	[h: currentConditionValue = 0]
}]
[h, if(json.contains(conditionData,"fileURL")), code:{
	[h: conditionData = REST.get(json.get(conditionData,"fileURL"))]
};{}]
[h: isValued = json.get(json.get(json.get(conditionData,"system"),"value"),"isValued")]
[h, if(isValued==json.true), code:{
	[h: inputText = "conditionValue|0,1,2,3,4,5,6|Condition Value (Current="+currentConditionValue+")|RADIO|SELECT="+if(currentConditionValue==0,"1","0")]
	[h: ans = input("junkVarN|Condition for "+tokenName+"||LABEL|SPAN=TRUE","junkVar|Condition Values|Enter Value for "+conditionName+"|LABEL",inputText)]
	[h: abort(ans)]
	[h: js.ca.pf2e.set_condition(conditionName, tokenID, conditionValue)]	
};{
	[h: js.ca.pf2e.set_condition(conditionName, tokenID)]
}]
