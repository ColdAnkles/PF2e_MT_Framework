[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h,if(!json.contains(macro.args,"sort")):sort="name";sort=json.get(macro.args,"sort")]
[h,if(!json.contains(macro.args,"dir")):dir="a";dir=json.get(macro.args,"dir")]
[h,if(!json.contains(macro.args,"searchKey")):searchKey="";searchKey=json.get(macro.args,"searchKey")]
[h,if(!json.contains(macro.args,"minLevel")):minLevel="";minLevel=json.get(macro.args,"minLevel")]
[h,if(!json.contains(macro.args,"maxLevel")):maxLevel="";maxLevel=json.get(macro.args,"maxLevel")]
[h,if(!json.contains(macro.args,"tokenID")):tokenID=json.null;tokenID=json.get(macro.args,"tokenID")]
[h: windowType = json.get(macro.args,"window")]

[h: rollNPC = 0 ]

[h,if(rollNPC==1):output=if(isGM()==1,outputGM,outputPC);output="none"]

[h: windowWidth=200]
[h: windowHeight=200]
[h: windowName = "Compendium Window"]
[h, if(windowType=="spells"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Spell List"]
}]
[h, if(windowType=="creatures"), code:{
    [h: windowWidth=900]
    [h: windowHeight=600]
    [h: windowName = "Creature List"]
}]
[h, if(windowType=="feat"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Feat List"]
}]
[h, if(windowType=="item"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Item List"]
}]
[h, if(windowType=="effect"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Effect List"]
}]
[h, if(windowType=="hazard"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Hazards"]
}]
[h, if(windowType=="action"), code:{
    [h: windowWidth=800]
    [h: windowHeight=600]
    [h: windowName = "Actions"]
}]
[h, if(windowType=="tables"), code:{
    [h: windowName = "Tables"]
    [h: windowHeight=500]
}]

[frame5(windowName, "width="+windowWidth+"; height="+windowHeight+"; temporary=0; noframe=0; input=1"):{
	[r, if(windowType=="spells"), code:{
        [r: js.ca.pf2e.build_spell_list(sort, dir, searchKey)]
    };{}]
    [r, if(windowType=="creatures"), code:{
        [r: js.ca.pf2e.build_creature_list(sort, dir, searchKey, minLevel, maxLevel)]
    };{}]
    [r, if(windowType=="feat" || windowType=="item" || windowType=="hazard" || windowType=="effect" || windowType=="action"), code:{
        [r: js.ca.pf2e.build_item_list(windowType, sort, dir, searchKey, tokenID)]
    };{}]
    [r, if(windowType=="tables"), code:{
        [r:macroLink("Encounters","TableWindow@Lib:ca.pf2e","none","encounters")]<br />
        [r:macroLink("Simple DCs","TableWindow@Lib:ca.pf2e","none","simpleDCs")]<br />
        [r:macroLink("DCs by Level","TableWindow@Lib:ca.pf2e","none","levelDCs")]<br />
        [r:macroLink("Spell DCs","TableWindow@Lib:ca.pf2e","none","spellDCs")]<br />
        [r:macroLink("Magic Item DCs","TableWindow@Lib:ca.pf2e","none","magicItemDCs")]<br />
        [r:macroLink("Adjusting Difficulty","TableWindow@Lib:ca.pf2e","none","adjustingDifficulty")]<br />
        [r:macroLink("Cost of Living","TableWindow@Lib:ca.pf2e","none","costOfLiving")]<br />
        [r:macroLink("Cover","TableWindow@Lib:ca.pf2e","none","cover")]<br />
        [r:macroLink("Services","TableWindow@Lib:ca.pf2e","none","cover")]<br />
        [r:macroLink("Learning Spells","TableWindow@Lib:ca.pf2e","none","learnASpell")]<br />
        [r:macroLink("Earning Income","TableWindow@Lib:ca.pf2e","none","earnIncome")]<br />
        [r:macroLink("Locks","TableWindow@Lib:ca.pf2e","none","locks")]<br />
        [r:macroLink("Structures","TableWindow@Lib:ca.pf2e","none","structures")]<br />
    };{}]
}]