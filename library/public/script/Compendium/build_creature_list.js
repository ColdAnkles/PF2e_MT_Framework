"use strict";  

function build_creature_list(sortKey, sortDir){
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><h1 class='feel-title'>Spells</h1>";
    let creatureList = JSON.parse(read_data("pf2e_npc"));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));

    let creatureSorted = [];
    for (var s in creatureList){
        creatureSorted.push(creatureList[s]);
    }
    creatureSorted.sort(sort_by(sortKey, sortDir=="d", (a) =>  a.toUpperCase()));
    
    returnHTML += "<table><tr><th>" + create_macroLink("Name", "Creature_List_Window@Lib:ca.pf2e", "sort=name;dir="+sortDir) + "</th>";
    returnHTML += "<th>"+create_macroLink("Size", "Creature_List_Window@Lib:ca.pf2e", "sort=size;dir="+sortDir) + "</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Creature_List_Window@Lib:ca.pf2e", "sort=rarity;dir="+sortDir) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Creature_List_Window@Lib:ca.pf2e", "sort=level;dir="+sortDir) + "</th>";
    returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Creature_List_Window@Lib:ca.pf2e", "sort=source;dir="+sortDir) + "</th>";
    returnHTML += "<th>Spawn Link</th>";

    let odd = 1;
    let sizeDict = {"sm":"small","med":"medium","huge":"huge","lg":"large","grg":"gargantuan","tiny":"tiny"};

    for(var i=0; i<creatureSorted.length; i++){
        let thisCreature = creatureSorted[i];

        if(!enabledSources.includes(thisCreature.source)){
            continue;
        }

        if(odd==1){
            returnHTML+="<tr class=bg>";
            odd=0;
        }else{
            returnHTML+="<tr class=>";
            odd=1;
        }

        let capitalName = capitalise(thisCreature.name);
        returnHTML += "<td>"+create_macroLink(capitalName, "Creature_View_Frame@Lib:ca.pf2e", {"name":thisCreature.name,"tokenID":"null"})+"</td>";
        returnHTML += "<td>"+capitalise(sizeDict[thisCreature.size])+"</td>";
        returnHTML += "<td>"+capitalise(thisCreature.rarity)+"</td>";
        returnHTML += "<td>"+capitalise(thisCreature.traits.join(", "))+"</td>";
        returnHTML += "<td align=center>"+String(thisCreature.level)+"</td>";
        returnHTML += "<td align=center>"+thisCreature.source+"</td>";
        returnHTML += "<td width=0%>"+create_macroLink("Make Token","Spawn_NPC@Lib:ca.pf2e",thisCreature.name);

    }
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.build_creature_list", build_creature_list);