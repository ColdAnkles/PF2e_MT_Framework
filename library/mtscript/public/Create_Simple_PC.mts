[h: ans = input("pcLevel|1|Level|Text",
                "pcName|New Character|Character Name|TEXT",
                "pcHP|10|Max HP|TEXT","pcAC|10|Normal AC|TEXT",
                "pcStr|0|Strength|TEXT",
                "pcDex|0|Dexterity|TEXT",
                "pcCon|0|Constitution|TEXT",
                "pcInt|0|Intelligence|TEXT",
                "pcWis|0|Wisdom|TEXT",
                "pcCha|0|Charisma|TEXT",
                "pcWill|10|Will Save|TEXT",
                "pcFort|10|Fortitude Save|TEXT",
                "pcRef|10|Reflex Save|TEXT",
                "pcSpeed|25|Land Speed|TEXT",
                "pcPerc|10|Perception|TEXT",
                "pcSize|Tiny,Small,Medium,Large|Size|LIST|VALUE=STRING SELECT=2",
                "pcVision|Normal,Low-Light,Darkvision,Greater Darkvision|Vision|LIST|VALUE=STRING",
                "pcTraits|Trait, List, Here|Traits|TEXT")]
[h: abort(ans)]
[h: tokenData = json.set("{}","name",pcName,
                                "maxHP",pcHP,
                                "str",pcStr,
                                "dex",pcDex,
                                "con",pcCon,
                                "int",pcInt,
                                "wis",pcWis,
                                "cha",pcCha,
                                "ac",pcAC,
                                "will",pcWill,
                                "fort",pcFort,
                                "ref",pcRef,
                                "speed",pcSpeed,
                                "perception",pcPerc,
                                "vision",pcVision,
                                "size",pcSize,
                                "level",pcLevel,
                                "traits",pcTraits)]

[h: data = json.set("{}","pathbuilderID",-1,"isPB",false,"simpleData",tokenData)]
[r: ca.pf2e.Spawn_PC_Lib(data)]
[h, if(isFrameVisible("Compendium")), code:{
	[h: ca.pf2e.Compendium_Home()]
};{}]