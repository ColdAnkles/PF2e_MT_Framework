[h: type = json.get(macro.args, "checkTokenID")]
[h, if(type == "group"), code:{
    [h: js.ca.pz2e.display_group_skill_check(macro.args)]
};{
    [h: js.ca.pz2e.skill_check(json.get(macro.args,"checkTokenID"),(json.get(macro.args,"altStat")==0),macro.args)]
}]