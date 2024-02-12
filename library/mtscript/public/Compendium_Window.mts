[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h,if(!json.contains(macro.args,"sort")):sort="name";sort=json.get(macro.args,"sort")]
[h,if(!json.contains(macro.args,"dir")):dir="a";dir=json.get(macro.args,"dir")]
[h,if(!json.contains(macro.args,"searchKey")):searchKey="";searchKey=json.get(macro.args,"searchKey")]
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

[frame5(windowName, "width="+windowWidth+"; height="+windowHeight+"; temporary=0; noframe=0; input=1"):{
	[r, if(windowType=="spells"), code:{
        [r: js.ca.pf2e.build_spell_list(sort, dir, searchKey)]
    }]
    [r, if(windowType=="creatures"), code:{
        [r: js.ca.pf2e.build_creature_list(sort, dir, searchKey)]
    }]
    [r, if(windowType=="feat" || windowType=="item" || windowType=="hazard" || windowType=="effect" || windowType=="action"), code:{
        [r: js.ca.pf2e.build_item_list(windowType, sort, dir, searchKey, tokenID)]
    }]
}]