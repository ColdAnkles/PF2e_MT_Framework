[h: type = json.type(macro.args)]
[h, if(type=="ARRAY"), code:{
    [h: macro.args = json.get(macro.args,0)]
};{}]
[h: type = json.type(macro.args)]
[h, if(type=="UNKNOWN"), code:{
    [h: allNPC = getLibProperty("pf2e_npc","lib:ca.pf2e")]
    [h: npcData = json.get(allNPC, macro.args)]
    [h, if(json.contains(npcData, "fileURL")), code:{
        [h: npcData = REST.get(json.get(npcData,"fileURL"))]
    };{}]
};{
    [h: npcData = macro.args]
}]

[r: js.ca.pf2e.npc_editor(npcData)]