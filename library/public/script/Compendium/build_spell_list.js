"use strict";

function build_spell_list(sortKey, sortDir, searchKey = "") {
    let returnHTML = "<link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><h1 class='feel-title'>Spells</h1>";
    let spellList = JSON.parse(read_data("pf2e_spell"));
    let enabledSources = JSON.parse(read_data("pf2e_enabledSources"));

    let spellSorted = [];
    for (var s in spellList) {
        spellSorted.push(spellList[s]);
    }
    spellSorted.sort(sort_by(sortKey, sortDir == "d", (a) => ((typeof (a) == "string") ? a.toUpperCase() : a)));

    returnHTML += "<form action='macro://Compendium_Window@Lib:ca.pf2e/self/impersonated?'>\
    <div><input name='searchKey' placeholder='Search' value='"+ searchKey + "'></input>\
    <input type='submit' name='searchButton' value='Search'></input>\
    <input type='hidden' name='window' value='spells'></input>\
    <input type='hidden' name='sort' value='"+ sortKey + "'></input>\
    <input type='hidden' name='dir' value='"+ sortDir + "'></input></div></form>";

    returnHTML += "<table><tr><th>" + create_macroLink("Name", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells", "sort": "name", "dir": ((sortKey == "name") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th>" + create_macroLink("Type", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells", "sort": "type", "dir": ((sortKey == "type") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=10%>Traditions</th>";
    returnHTML += "<th>" + create_macroLink("Rarity", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells", "sort": "rarity", "dir": ((sortKey == "rarity") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=10% align=center>Traits</th>";
    returnHTML += "<th width=5% align=center>" + create_macroLink("Level", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells", "sort": "level", "dir": ((sortKey == "level") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";
    returnHTML += "<th width=20% align=center>" + create_macroLink("Source", "Compendium_Window@Lib:ca.pf2e", JSON.stringify({ "window": "spells", "sort": "source", "dir": ((sortKey == "source") ? ((sortDir == "d") ? "a" : "d") : sortDir) })) + "</th>";

    let odd = 1;

    for (var i = 0; i < spellSorted.length; i++) {
        let thisSpell = spellSorted[i];
        if("traditions" in thisSpell.traits){
            thisSpell.traditions =  thisSpell.traits.traditions;
            thisSpell.traits = thisSpell.traits.value;
            thisSpell.source = thisSpell.publication.title;
        }

        if (!enabledSources.includes(thisSpell.source) && thisSpell.source != null) {
            continue;
        }

        if (searchKey != "") {
            var re = new RegExp(searchKey, 'gi');
            if (!(thisSpell.name.match(re))) {
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

        returnHTML += "<td>" + create_macroLink(capitalise(thisSpell.name), "Spell_View_Frame@Lib:ca.pf2e", thisSpell.name) + "</td>";
        returnHTML += "<td>" + capitalise(thisSpell.type) + "</td>";
        returnHTML += "<td>" + capitalise(thisSpell.traditions.join(", ")) + "</td>";
        returnHTML += "<td align=center>" + capitalise(thisSpell.rarity) + "</td>";
        returnHTML += "<td>" + capitalise(thisSpell.traits.join(", ")) + "</td>";
        returnHTML += "<td align=center>" + String(thisSpell.level) + "</td>";
        returnHTML += "<td align=center>" + thisSpell.source + "</td>";
        returnHTML += "</tr>";
    }

    return returnHTML;

}

MTScript.registerMacro("ca.pf2e.build_spell_list", build_spell_list);