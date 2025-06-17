"use strict";

function build_creature_list(sortKey, sortDir, searchKey = "", minLevel = "", maxLevel = "") {

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'/><h1 class='feel-title'>Creatures</h1>";

    let creatureList = null;
    try {
        creatureList = JSON.parse(read_data("pf2e_npc"));
    } catch (e) {
        MapTool.chat.broadcast("Error in build_creature_list during get-creatures");
        MapTool.chat.broadcast("creatureList: " + JSON.stringify(creatureList));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

    let enabledSources = null;
    try {
        enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
    } catch (e) {
        MapTool.chat.broadcast("Error in build_creature_list during get-enabled_sources");
        MapTool.chat.broadcast("enabledSources: " + JSON.stringify(enabledSources));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
    let customNPCs = JSON.parse(read_data("customContent")).npc;

    let creatureSorted = [];
    for (var s in creatureList) {
        creatureList[s].key = s;
        creatureSorted.push(creatureList[s]);
    }
    for (var s in customNPCs) {
        customNPCs[s].key = s;
        creatureSorted.push(customNPCs[s]);
    }
    creatureSorted.sort(sort_by(sortKey, sortDir == "d", (a) => ((typeof (a) == "string") ? a.toUpperCase() : a)));

    returnHTML += "<script src='lib://ca.pf2e/html/filterTable.js'></script> <form action='macro://Compendium_Window@Lib:ca.pf2e/self/impersonated?'>\
    <div><input name='searchKey' id='filterText' placeholder='Search' value='"+ searchKey + "'></input>\
    <input name='minLevel' id='minLevel' placeholder='Minimum Level' value='"+ minLevel + "' style='font-family:Arial;'></input>\
    <input name='maxLevel' id='maxLevel' placeholder='Maximum Level' value='"+ maxLevel + "' style='font-family:Arial;'></input>\
    <input id='filterButton' type='button' value='Filter' onclick='filterTable();' style='font-family:Arial;' />\
    <input type='hidden' name='window' value='creatures'></input>\
    <input type='hidden' name='sort' value='"+ sortKey + "'></input>\
    <input type='hidden' name='dir' value='"+ sortDir + "'></input></div></form>";

    returnHTML += "<table id='filterTable'><tr><th>" + create_macroLink("Name", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "name", "dir": ((sortKey == "name") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>" + create_macroLink("Size", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "size", "dir": ((sortKey == "size") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "rarity", "dir": ((sortKey == "rarity") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "level", "dir": ((sortKey == "level") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "source", "dir": ((sortKey == "source") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>Spawn</th>";

    let odd = 1;
    let sizeDict = { "sm": "small", "med": "medium", "huge": "huge", "lg": "large", "grg": "gargantuan", "tiny": "tiny" };

    for (var i = 0; i < creatureSorted.length; i++) {
        let thisCreature = creatureSorted[i];

        if (!enabledSources.includes(thisCreature.source) && thisCreature.source != null) {
            continue;
        }

        if ((minLevel !== "" && thisCreature.level < minLevel) || (maxLevel !== "" && thisCreature.level > maxLevel)) {
            continue;
        }

        if (searchKey != "") {
            var re = new RegExp(searchKey, 'gi');
            if (!(thisCreature.name.match(re)) && !(thisCreature.source.match(re))) {
                continue;
            }
        }

        if (odd == 1) {
            returnHTML += "<tr class=oddRow>";
            odd = 0;
        } else {
            returnHTML += "<tr class=evenRow>";
            odd = 1;
        }

        let capitalName = capitalise(thisCreature.name);
        returnHTML += "<td id='name'>" + create_macroLink(capitalName, "Creature_View_Frame@Lib:ca.pf2e", { "name": thisCreature.key, "tokenID": "null" }) + "</td>";
        returnHTML += "<td id='size'>" + capitalise(sizeDict[thisCreature.size]) + "</td>";
        returnHTML += "<td id='rarity'>" + capitalise(thisCreature.rarity) + "</td>";
        returnHTML += "<td id='traits'>" + capitalise(thisCreature.traits.join(", ")) + "</td>";
        returnHTML += "<td align=center id='level'>" + String(thisCreature.level) + "</td>";
        returnHTML += "<td align=center id='source'>" + thisCreature.source + "</td>";
        returnHTML += "<td width=0%>" + create_macroLink("Weak", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "weak"]) + "<br />" + create_macroLink("Normal", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "normal"]) + "<br />" + create_macroLink("Elite", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "elite"]);

    }
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.build_creature_list", build_creature_list);