"use strict";

function build_item_list(sortKey, sortDir){
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><h1 class='feel-title'>Items</h1>";
    let itemList = JSON.parse(read_data("pf2e_item"));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    
    let itemSorted = [];
    for (var s in itemList){
        itemSorted.push(itemList[s]);
    }
    itemSorted.sort(sort_by(sortKey, sortDir=="d", (a) =>  ((typeof(a)=="string") ? a.toUpperCase() : a )));
        
    returnHTML += "<table><tr><th>" + create_macroLink("Name", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({"window":"items","sort":"name","dir":((sortKey=="name") ? ((sortDir=="d") ? "a":"d"): sortDir)})) + "</th>";
    returnHTML += "<th>"+create_macroLink("Type", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({"window":"items","sort":"type","dir":((sortKey=="type") ? ((sortDir=="d") ? "a":"d"): sortDir)})) + "</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({"window":"items","sort":"rarity","dir":((sortKey=="rarity") ? ((sortDir=="d") ? "a":"d"): sortDir)})) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({"window":"items","sort":"level","dir":((sortKey=="level") ? ((sortDir=="d") ? "a":"d"): sortDir)})) + "</th>";
    returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({"window":"items","sort":"source","dir":((sortKey=="source") ? ((sortDir=="d") ? "a":"d"): sortDir)})) + "</th>";
    
    let odd = 1;

    for(var i=0; i<itemSorted.length; i++){
        let thisItem = itemSorted[i];
        //MapTool.chat.broadcast(JSON.stringify(thisItem));

        if(!enabledSources.includes(thisItem.source)){
            continue;
        }

        if(odd==1){
            returnHTML+="<tr class=bg>";
            odd=0;
        }else{
            returnHTML+="<tr class=>";
            odd=1;
        }

        returnHTML += "<td>"+create_macroLink(capitalise(thisItem.name),"Item_View_Frame@Lib:ca.pf2e",thisItem.name) +"</td>";
        returnHTML += "<td>"+capitalise(thisItem.type)+"</td>";
        returnHTML += "<td align=center>"+capitalise(thisItem.rarity)+"</td>";
        returnHTML += "<td>"+capitalise(thisItem.traits.join(", ")) + "</td>";
        returnHTML += "<td align=center>"+String(thisItem.level)+"</td>";
        returnHTML += "<td align=center>"+thisItem.source+"</td>";
        returnHTML += "</tr>";
    }

    return returnHTML;

}

MTScript.registerMacro("ca.pf2e.build_item_list", build_item_list);