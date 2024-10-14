[h: token = json.get(macro.args,0)]
[h: skillName = "Perception"]
[h: tokenType = "NPC"]
[h, if(isPC(token)),code:{
	[h: tokenType = "PC"]
};{}]
[h: foundryActor = getProperty("foundryActor",token)]
[h: isSimple = (json.contains(foundryActor,"simple") && json.get(foundryActor,"simple"))]
[h, if(isSimple), code:{
	[h: ans = input("initResult|0|Initiative|TEXT")]
	[h: abort(ans)]
	[h: addToInitiative(false, initResult, token)]
	[h: sortInitiative()]
	[h: return(0)]
};{}]

[h: overrideBonus=json.null]

[h, if(json.length(macro.args)==1), code:{
	[h: ans = input("skillName|Acrobatics,Arcana,Athletics,Crafting,Deception,Diplomacy,Intimidation,Medicine,Nature,Occultism,Perception,Performance,Religion,Society,Stealth,Survival,Thievery|Initiative Skill|LIST|SELECT=10 VALUE=STRING")]
	[h: abort(ans)]
};{
	[h: skillName = json.get(macro.args,1)]
}]
[h, if(tokenType=="NPC"), code:{
	[h: overrideBonus = getProperty("perception", token)]
};{}]

[h: checkData = json.set("{}","skillName",skillName,"tokenType",tokenType,"flavourText",(getName(token) + " rolls Initiative!"),"altStat",0,"miscBonus",0,"overrideBonus",overrideBonus)]
[h: bonusScopes = json.append("[]","initiative",skillName)]
[h: initResult = js.ca.pf2e.skill_check(token,false,checkData,bonusScopes)]
[h, if(tokenType=="NPC"), code:{
	[h: initResult = initResult+0.1]
};{}]
[h: addToInitiative(false, initResult, token)]
[h: sortInitiative()]