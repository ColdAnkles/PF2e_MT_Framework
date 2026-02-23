[h: token = json.get(macro.args,0)]
[h: forceEntry = json.get(macro.args,1)]
[h: skillName = "Perception"]
[h: tokenType = "NPC"]
[h, if(isPC(token)),code:{
	[h: tokenType = "PC"]
};{}]
[h: foundryActor = getProperty("foundryActor",token)]
[h: isSimple = (json.contains(foundryActor,"simple") && json.get(foundryActor,"simple")) || forceEntry]
[h, if(isSimple), code:{
	[h: ans = input("initResult|0|Initiative|TEXT")]
	[h: abort(ans)]
	[h: addToInitiative(false, initResult + 0.0, token)]
	[h: sortInitiative()]
	[h: return(0)]
};{}]

[h: overrideBonus=json.null]

[h, if(json.length(macro.args)==2), code:{
	[h: ans = input("skillName|Acrobatics,Arcana,Athletics,Crafting,Deception,Diplomacy,Intimidation,Medicine,Nature,Occultism,Perception,Performance,Religion,Society,Stealth,Survival,Thievery|Initiative Skill|LIST|SELECT=10 VALUE=STRING")]
	[h: abort(ans)]
};{
	[h: skillName = json.get(macro.args,2)]
}]
[h, if(tokenType=="NPC"), code:{
	[h: overrideBonus = getProperty("perception", token)]
};{}]

[h: checkData = json.set("{}","skillName",skillName,"tokenType",tokenType,"flavourText",(getName(token) + " rolls Initiative!"),"altStat",0,"miscBonus",0,"overrideBonus",overrideBonus,"useMAP",0)]
[h: bonusScopes = json.append("[]","initiative",skillName)]
[h: initResult = json.get(js.ca.pf2e.skill_check(token,false,checkData,bonusScopes),"checkResult")]
[h: tieBreak = js.ca.pf2e.get_actor_data_mtscript(token, "system.initiative.tiebreakPriority")]
[h, if(tieBreak != json.null && tieBreak == 0), code:{
	[h: initResult = initResult + 0.2]
};{}]
[h, if(tokenType=="NPC"), code:{
	[h: initResult = initResult + 0.1]
};{}]
[h: addToInitiative(false, initResult, token)]
[h: sortInitiative()]