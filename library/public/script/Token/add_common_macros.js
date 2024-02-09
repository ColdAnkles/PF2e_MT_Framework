"use strict";

function add_common_macros(tokenID){
    let commonMacros = [{"label":"Change HP","playerEditable":0,"command":"[h: js.ca.pf2e.change_hp(currentToken())]","tooltip":"Change Token HP","sortBy":"","group":"1. Common"},
        {"label":"Character Sheet","playerEditable":0,"command":"[r: ca.pf2e.Creature_View_Frame(json.set(\"{}\",\"name\",getName(),\"tokenID\",myID))]","tooltip":"View Character Sheet","sortBy":"","group":"1. Common"},
        {"label":"Saving Throw","playerEditable":0,"command":"[h: js.ca.pf2e.saving_throw(currentToken())]","tooltip":"Attempt Saving Throw","sortBy":"","group":"1. Common"},
        {"label":"Skill Check","playerEditable":0,"command":"[h: js.ca.pf2e.skill_check(currentToken())]","tooltip":"Attempt Skill Check","sortBy":"","group":"1. Common"},
        {"label":"Skill Check (Diff Ability)","playerEditable":0,"command":"[h: js.ca.pf2e.skill_check(currentToken(),true)]","tooltip":"Attempt Skill Check with a different Ability","sortBy":"","group":"1. Common"},
        //{"label":"Increase MAP","playerEditable":0,"command":"[h: js.ca.pf2e.increase_map(myID)]","tooltip":"Increase Token MAP","sortBy":"","group":"Common"},
        {"label":"End Turn","playerEditable":0,"command":"[h: js.ca.pf2e.end_turn(currentToken())]","tooltip":"End Turn","sortBy":"","group":"2. Encounter"},
        {"label":"Initiative","playerEditable":0,"command":"[h: ca.pf2e.Roll_Initiative(currentToken())]","tooltip":"Roll Initiative","sortBy":"","group":"2. Encounter"},
        {"label":"Initiative (Perception)","playerEditable":0,"command":"[h: ca.pf2e.Roll_Initiative(currentToken(),\"Perception\")]","tooltip":"Roll Initiative with Perception","sortBy":"","group":"2. Encounter"},
        {"label":"Use Action","playerEditable":0,"command":"[h: js.ca.pf2e.generic_use_action(currentToken())]","tooltip":"Use An Action","sortBy":"","group":"1. Common"},
        {"label":"Refund Action","playerEditable":0,"command":"[h: js.ca.pf2e.generic_refund_action(currentToken())]","tooltip":"Regain An Action","sortBy":"","group":"1. Common"},
        {"label":"View Active Effects","playerEditable":0,"command":"[h: ca.pf2e.View_Active_Effects(json.set(\"{}\",\"tokenID\",currentToken()))]","tooltip":"View current active effects.","sortBy":"","group":"1. Common"},
        {"label":"Flat Check","playerEditable":0,"command":"[h: js.ca.pf2e.flat_check(myID)]","tooltip":"Attempt Flat Check.","sortBy":"","group":"1. Common"}
        ]
    for (var m in commonMacros){
        createMacro(commonMacros[m], tokenID);
    }

    if(get_token_type(tokenID)=="PC"){
        let PCMacros = [{"label":"Inventory","playerEditable":0,"command":"[h: js.ca.pf2e.view_inventory(myID)]","tooltip":"View Inventory","sortBy":"","group":"1. Common"},
                        {"label":"Recall Knowledge","playerEditable":0,"command":"[h: js.ca.pf2e.simple_action(\"Recall Knowledge\",currentToken())]","tooltip":"Recall Knowledge","sortBy":"","group":"1. Common"}]
        for (var m in PCMacros){
            createMacro(PCMacros[m], tokenID);
        }
    }

}