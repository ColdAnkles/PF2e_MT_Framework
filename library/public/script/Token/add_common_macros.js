"use strict";

function add_common_macros(tokenID){
    let commonMacros = [{"label":"Change HP","playerEditable":0,"command":"[h: js.ca.pf2e.change_hp(currentToken())]","tooltip":"Change Token HP","sortBy":"","group":"Common"},
        {"label":"Character Sheet","playerEditable":0,"command":"[r: ca.pf2e.Creature_View_Frame(json.set(\"{}\",\"name\",getName(),\"tokenID\",myID))]","tooltip":"View Character Sheet","sortBy":"","group":"Common"},
        {"label":"Saving Throw","playerEditable":0,"command":"[h: js.ca.pf2e.saving_throw(currentToken())]","tooltip":"Attempt Saving Throw","sortBy":"","group":"Common"},
        {"label":"Skill Check","playerEditable":0,"command":"[h: js.ca.pf2e.skill_check(currentToken())]","tooltip":"Attempt Skill Check","sortBy":"","group":"Common"},
        {"label":"Skill Check (Diff Ability)","playerEditable":0,"command":"[h: js.ca.pf2e.skill_check(currentToken(),true)]","tooltip":"Attempt Skill Check with a different Ability","sortBy":"","group":"Common"},
        //{"label":"Increase MAP","playerEditable":0,"command":"[h: js.ca.pf2e.increase_map(myID)]","tooltip":"Increase Token MAP","sortBy":"","group":"Common"},
        {"label":"End Turn","playerEditable":0,"command":"[h: js.ca.pf2e.end_turn(currentToken())]","tooltip":"End Turn","sortBy":"","group":"Encounter"},
        {"label":"Initiative","playerEditable":0,"command":"[h: ca.pf2e.Roll_Initiative(currentToken())]","tooltip":"Roll Initiative","sortBy":"","group":"Encounter"},
        {"label":"Initiative (Perception)","playerEditable":0,"command":"[h: ca.pf2e.Roll_Initiative(currentToken(),\"Perception\")]","tooltip":"Roll Initiative with Perception","sortBy":"","group":"Encounter"}
        ]
    for (var m in commonMacros){
        createMacro(commonMacros[m], tokenID);
    }

    if(get_token_type(tokenID)=="PC"){
        let PCMacros = [{"label":"Inventory","playerEditable":0,"command":"[h: js.ca.pf2e.view_inventory(myID)]","tooltip":"View Inventory","sortBy":"","group":"Common"}]
        for (var m in PCMacros){
            createMacro(PCMacros[m], tokenID);
        }
    }

}