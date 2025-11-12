[h: type = json.get(macro.args, "saveTokenID")]
[h, if(type == "group"), code:{
    [h: js.ca.pf2e.display_group_saving_throw(macro.args)]
};{
    [h: js.ca.pf2e.saving_throw(json.get(macro.args,"saveTokenID"), macro.args)]
}]