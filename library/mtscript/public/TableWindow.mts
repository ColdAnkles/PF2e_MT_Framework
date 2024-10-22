[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: table=macro.args]

[h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]

[h: windowWidth=200]
[h: windowHeight=200]
[h: windowName = "Compendium Window"]
[h, if(table=="Encounters"), code:{
    [h: windowName = "encounters"]
    [h: windowWidth=1000]
    [h: windowHeight=1500]
}]
[h, if(table=="simpleDCs"), code:{
    [h: windowName = "Simple DCs"]
    [h: windowWidth=100]
    [h: windowHeight=100]
}]
[h, if(table=="spellDCs"), code:{
    [h: windowName = "Spell DCs"]
    [h: windowWidth=500]
    [h: windowHeight=500]
}]
[h, if(table=="levelDCs"), code:{
    [h: windowName = "DCs By Level"]
    [h: windowWidth=50]
    [h: windowHeight=1500]
}]
[h, if(table=="magicItemDCs"), code:{
    [h: windowName = "Magic Item DCs"]
    [h: windowWidth=50]
    [h: windowHeight=500]
}]
[h, if(table=="adjustingDifficulty"), code:{
    [h: windowName = "DC Adjustments"]
    [h: windowWidth=300]
    [h: windowHeight=100]
}]
[h, if(table=="costOfLiving"), code:{
    [h: windowName = "Cost of Living"]
    [h: windowWidth=150]
    [h: windowHeight=100]
}]
[h, if(table=="cover"), code:{
    [h: windowName = "Cover"]
    [h: windowWidth=450]
    [h: windowHeight=100]
}]
[h, if(table=="learnASpell"), code:{
    [h: windowName = "Learn A Spell"]
    [h: windowWidth=400]
    [h: windowHeight=400]
}]
[h, if(table=="earnIncome"), code:{
    [h: windowName = "Earning Income"]
    [h: windowWidth=300]
    [h: windowHeight=300]
}]
[h, if(table=="locks"), code:{
    [h: windowName = "Locks"]
    [h: windowWidth=150]
    [h: windowHeight=200]
}]
[h, if(table=="structures"), code:{
    [h: windowName = "Structures"]
    [h: windowWidth=200]
    [h: windowHeight=400]
}]

[frame5(windowName, "width="+windowWidth+"; height="+windowHeight+"; temporary=0; noframe=0; input=1"):{
    <html>
    <link rel="stylesheet" type="text/css" href=[r:cssName]>
	[r, if(table=="encounters"), code:{
        <script src='lib://ca.pf2e/html/encounterHelper.js'></script>
        [r: data.getStaticData('ca.pf2e', "public/html/encounterTable.html")]
    }]
	[r, if(table=="simpleDCs"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/simpleDCs.html")]
    }]
	[r, if(table=="spellDCs"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/spellDCs.html")]
    }]
	[r, if(table=="levelDCs"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/dcsByLevel.html")]
    }]
	[r, if(table=="magicItemDCs"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/magicItemDCs.html")]
    }]
	[r, if(table=="adjustingDifficulty"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/adjustingDifficulty.html")]
    }]
	[r, if(table=="costOfLiving"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/costOfLiving.html")]
    }]
	[r, if(table=="cover"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/cover.html")]
    }]
	[r, if(table=="learnASpell"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/learnASpell.html")]
    }]
	[r, if(table=="earnIncome"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/earnIncome.html")]
    }]
	[r, if(table=="locks"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/locks.html")]
    }]
	[r, if(table=="structures"), code:{
        [r: data.getStaticData('ca.pf2e', "public/html/structures.html")]
    }]
    </html>
}]