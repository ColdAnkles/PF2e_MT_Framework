"use strict";

function build_creature_list(sortKey, sortDir, searchKey = "", minLevel = "", maxLevel = "") {

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'/><h1 class='feel-title'>Creatures</h1>";
    let creatureList = JSON.parse(read_data("pf2e_npc"));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));
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

    returnHTML += "<form action='macro://Compendium_Window@Lib:ca.pf2e/self/impersonated?'>\
    <div><input name='searchKey' placeholder='Search' value='"+ searchKey + "'></input>\
    <input name='minLevel' placeholder='Minimum Level' value='"+ minLevel + "'></input>\
    <input name='maxLevel' placeholder='Maximum Level' value='"+ maxLevel + "'></input>\
    <input type='submit' name='filterButton' value='Filter'></input>\
    <input type='hidden' name='window' value='creatures'></input>\
    <input type='hidden' name='sort' value='"+ sortKey + "'></input>\
    <input type='hidden' name='dir' value='"+ sortDir + "'></input></div></form>";

    returnHTML += "<table><tr><th>" + create_macroLink("Name", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "creatures", "sort": "name", "dir": ((sortKey == "name") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
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
            returnHTML += "<tr class=bg>";
            odd = 0;
        } else {
            returnHTML += "<tr class=>";
            odd = 1;
        }

        let capitalName = capitalise(thisCreature.name);
        returnHTML += "<td>" + create_macroLink(capitalName, "Creature_View_Frame@Lib:ca.pf2e", { "name": thisCreature.key, "tokenID": "null" }) + "</td>";
        returnHTML += "<td>" + capitalise(sizeDict[thisCreature.size]) + "</td>";
        returnHTML += "<td>" + capitalise(thisCreature.rarity) + "</td>";
        returnHTML += "<td>" + capitalise(thisCreature.traits.join(", ")) + "</td>";
        returnHTML += "<td align=center>" + String(thisCreature.level) + "</td>";
        returnHTML += "<td align=center>" + thisCreature.source + "</td>";
        returnHTML += "<td width=0%>" + create_macroLink("Weak", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "weak"]) + "<br />" + create_macroLink("Normal", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "normal"]) + "<br />" + create_macroLink("Elite", "Spawn_NPC@Lib:ca.pf2e", [thisCreature.key, "elite"]);

    }
    return returnHTML;
}

MTScript.registerMacro("ca.pf2e.build_creature_list", build_creature_list);