"use strict";

function create_simple_pc_lib(simpleData, tokenID) {

	let PCData = { "name": "Lib:"+simpleData.name,
        "hp": { "max": simpleData.maxHP, "details": "" ,"current":simpleData.maxHP, "temp":0},
        "abilities": { "str": simpleData.str, "dex": simpleData.dex, "con": simpleData.con, "int": simpleData.int, "wis": simpleData.wis, "cha": simpleData.cha },
        "ac": { "value": simpleData.ac, "details": "" },
        "saves": { "fortitude": simpleData.fort, "reflex": simpleData.ref, "will": simpleData.will },
        "speeds": { "base": simpleData.speed, "other": [] },
        "perception":simpleData.perception,
        "level":simpleData.level,
        "weaknesses":[],
        "resistances":[],
        "immunities":[],
        "otherDefenses":[],
        "passiveDefenses":[],
        "proficiencies":[],
        "basicAttacks":[],
        "offensiveActions":[],
        "passiveSkills":[],
        "spellRules":{},
        "senses":[simpleData.vision.toLowerCase()],
        "size":simpleData.size,
        "alignment":"",
        "rarity":"unique",
        "inventory":{},
        "languages":[],
        "resources":[],
        "traits":simpleData.traits.split(', '),
        "foundryActor":{"simple":true}};

    

    write_creature_properties(PCData, tokenID);
}

MTScript.registerMacro("ca.pf2e.create_simple_pc_lib", create_simple_pc_lib);