"use strict";  

function build_spell_list(sortKey, sortDir){
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><h1 class='feel-title'>Spells</h1>";
    let spellList = JSON.parse(read_data("pf2e_spell"));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));

    let spellSorted = [];
    for (var s in spellList){
        spellSorted.push(spellList[s]);
    }
    spellSorted.sort(sort_by(sortKey, sortDir=="d", (a) =>  a.toUpperCase()));
    
    returnHTML += "<table><tr><th>" + create_macroLink("Name", "Spell_List_Window@Lib:ca.pf2e", "sort=name;dir="+sortDir) + "</th>";
    returnHTML += "<th>"+create_macroLink("Type", "Spell_List_Window@Lib:ca.pf2e", "sort=type;dir="+sortDir) + "</th>";
    returnHTML += "<th width=10%>Traditions</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Spell_List_Window@Lib:ca.pf2e", "sort=rarity;dir="+sortDir) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Spell_List_Window@Lib:ca.pf2e", "sort=level;dir="+sortDir) + "</th>";
    returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Spell_List_Window@Lib:ca.pf2e", "sort=source;dir="+sortDir) + "</th>";
    
    let odd = 1;

    for(var i=0; i<spellSorted.length; i++){
        let thisSpell = spellSorted[i];

        if(!enabledSources.includes(thisSpell.source)){
            continue;
        }

        if(odd==1){
            returnHTML+="<tr class=bg>";
            odd=0;
        }else{
            returnHTML+="<tr class=>";
            odd=1;
        }

        returnHTML += "<td>"+create_macroLink(capitalise(thisSpell.name),"Spell_View_Frame@Lib:ca.pf2e",thisSpell.name) +"</td>";
        returnHTML += "<td>"+capitalise(thisSpell.type)+"</td>";
        returnHTML += "<td>"+capitalise(thisSpell.traditions.join(", ")) + "</td>";
        returnHTML += "<td align=center>"+capitalise(thisSpell.rarity)+"</td>";
        returnHTML += "<td>"+capitalise(thisSpell.traits.join(", ")) + "</td>";
        returnHTML += "<td align=center>"+String(thisSpell.level)+"</td>";
        returnHTML += "<td align=center>"+thisSpell.source+"</td>";
        returnHTML += "</tr>";
    }

    return returnHTML;

}

MTScript.registerMacro("ca.pf2e.build_spell_list", build_spell_list);