[h,if(!json.contains(macro.args,"sort")):sort="name";sort=json.get(macro.args,"sort")]
[h,if(!json.contains(macro.args,"dir")):dir="a";dir=json.get(macro.args,"dir")]
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

[dialog5(windowName, "width="+windowWidth+"; height="+windowHeight+"; temporary=1; noframe=0; input=1"):{
	[r, if(windowType=="spells"), code:{
        [r: js.ca.pf2e.build_spell_list(sort, dir)]
    }]
    [r, if(windowType=="creatures"), code:{
        [r: js.ca.pf2e.build_creature_list(sort, dir)]
    }]
    [r, if(windowType=="feat"), code:{
        [r: js.ca.pf2e.build_item_list("feat", sort, dir)]
    }]
    [r, if(windowType=="item"), code:{
        [r: js.ca.pf2e.build_item_list("item", sort, dir)]
    }]
}]