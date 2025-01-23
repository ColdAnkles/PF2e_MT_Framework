"use strict";

function build_item_list(itemType, sortKey, sortDir, searchKey = "", relatedToken = null) {

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'/><h1 class='feel-title'>" + capitalise(itemType) + "</h1>";
    let itemList = JSON.parse(read_data("pf2e_" + itemType));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));

    let itemSorted = [];
    for (var s in itemList) {
        itemList[s].key = s;
        itemSorted.push(itemList[s]);
    }
    itemSorted.sort(sort_by(sortKey, sortDir == "d", (a) => ((typeof (a) == "string") ? a.toUpperCase() : a)));

    returnHTML += "<script src='lib://ca.pf2e/html/filterTable.js'></script> <form action='macro://Compendium_Window@Lib:ca.pf2e/self/impersonated?'>\
    <div><input name='searchKey' id='filterText' placeholder='Search' value='"+ searchKey + "'></input>\
    <input name='minLevel' id='minLevel' placeholder='Minimum Level' value=''></input>\
    <input name='maxLevel' id='maxLevel' placeholder='Maximum Level' value=''></input>\
    <input id='filterButton' type='button' value='Filter' onclick='filterTable();' />\
    <input type='hidden' name='window' value='"+ itemType + "'></input>\
    <input type='hidden' name='sort' value='"+ sortKey + "'></input>\
    <input type='hidden' name='dir' value='"+ sortDir + "'></input>";
    if (relatedToken != null) {
        returnHTML += "<input type='hidden' name='tokenID' value='" + relatedToken + "'></input>";
    }
    returnHTML += "</div></form>";

    returnHTML += "<table id='filterTable'><tr><th>" + create_macroLink("Name", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": itemType, "sort": "name", "dir": ((sortKey == "name") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>" + create_macroLink("Type", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": itemType, "sort": "type", "dir": ((sortKey == "type") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": itemType, "sort": "rarity", "dir": ((sortKey == "rarity") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    if (itemType == "action") {
        if (relatedToken != null) {
            returnHTML += "<th width=10% align=center>Add Macro</th>";
        }
    } else {
        returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": itemType, "sort": "level", "dir": ((sortKey == "level") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
        returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": itemType, "sort": "source", "dir": ((sortKey == "source") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    }
    if (itemType == "hazard") {
        returnHTML += "<th>Spawn Link</th>";
    } else if (itemType == "consumable" || itemType == "weapon" || itemType == "armor" || itemType == "shield" || itemType == "item") {
        returnHTML += "<th>Spawn Item</th>";
    }

    let odd = 1;

    for (var i = 0; i < itemSorted.length; i++) {
        let thisItem = itemSorted[i];
        //MapTool.chat.broadcast(JSON.stringify(thisItem));

        if (!enabledSources.includes(thisItem.source) && thisItem.source != null) {
            continue;
        }

        if (searchKey != "") {
            var re = new RegExp(searchKey, 'gi');
            if (!(thisItem.name.match(re))) {
                continue;
            }
        }

        if (odd == 1) {
            returnHTML += "<tr class=bg>";
            odd = 0;
        } else {
            returnHTML += "<tr class=>";
            odd = 1;
        }

        if (itemType == "hazard") {
            returnHTML += "<td id='name'>" + create_macroLink(capitalise(thisItem.name), "Hazard_View_Frame@Lib:ca.pf2e", { "name": thisItem.key, "tokenID": "null" }) + "</td>";
        } else {
            returnHTML += "<td id='name'>" + create_macroLink(capitalise(thisItem.name), "Item_View_Frame@Lib:ca.pf2e", { "itemType": itemType, "itemName": thisItem.key }) + "</td>";
        }
        returnHTML += "<td id='type'>" + capitalise(thisItem.type) + "</td>";
        if ("rarity" in thisItem) {
            returnHTML += "<td align=center id='rarity'>" + capitalise(thisItem.rarity) + "</td>";
        } else {
            returnHTML += "<td align=center id='rarity'>Common</td>";
        }
        if ("traits" in thisItem) {
            returnHTML += "<td id='traits'>" + capitalise(thisItem.traits.join(", ")) + "</td>";
        } else {
            returnHTML += "<td id='traits'></td>";
        }
        if (itemType != "action") {
            if ("level" in thisItem) {
                returnHTML += "<td align=center id='level'>" + String(thisItem.level) + "</td>";
            } else {
                returnHTML += "<td align=center id='level'>0</td>";
            }
            returnHTML += "<td align=center id='source'>" + thisItem.source + "</td>";
        } else if (itemType == "action" && relatedToken != null) {
            returnHTML += "<td align=center>" + create_macroLink("Add Macro", "Add_Action_To_Token@Lib:ca.pf2e", "[" + JSON.stringify({ "name": thisItem.key, "type": "basic", "group": "Extra" }) + ", " + relatedToken + "]") + "</td>";
        }
        if (itemType == "hazard") {
            returnHTML += "<td width=0%>" + create_macroLink("Make Token", "Spawn_Hazard@Lib:ca.pf2e", thisItem.key);
        } else if (itemType == "consumable" || itemType == "weapon" || itemType == "armor" || itemType == "shield" || itemType == "item") {
            returnHTML += "<td width=0%>" + create_macroLink("Spawn Item", "Spawn_Item@Lib:ca.pf2e", thisItem.key);
        }
        returnHTML += "</tr>";
    }

    return returnHTML;

}

MTScript.registerMacro("ca.pf2e.build_item_list", build_item_list);