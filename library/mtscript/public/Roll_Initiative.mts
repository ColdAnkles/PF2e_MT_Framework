[h: token = json.get(macro.args,0)]
[h: skillName = "Perception"]
[h: tokenType = "NPC"]
[h, if(isPC(token)),code:{
	[h: tokenType = "PC"]
};{}]
[h, if(json.length(macro.args)==1), code:{
	[h: ans = input("skillName|Acrobatics,Arcana,Athletics,Crafting,Deception,Diplomacy,Intimidation,Medicine,Nature,Occultism,Perception,Performance,Religion,Society,Stealth,Survival,Thievery|Initiative Skill|LIST|SELECT=10 VALUE=STRING")]
	[h: abort(ans)]
};{
	[h: skillName = json.get(macro.args,1)]
}]
[h: checkData = json.set("{}","skillName",skillName,"tokenType",tokenType,"flavourText",(getName(token) + " rolls Initiative!"),"altStat",0,"miscBonus",0)]
[h: bonusScopes = json.append("[]","initiative",skillName)]
[h: initResult = js.pf2e.skill_check(token,false,checkData,bonusScopes)]
[h, if(tokenType=="NPC"), code:{
	[h: initResult = initResult+0.1]
};{}]
[h: addToInitiative(false, initResult, token)]
[h: sortInitiative()]