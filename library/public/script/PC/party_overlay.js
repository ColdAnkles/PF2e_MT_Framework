"use strict";

function party_overlay() {
    let partyList = find_pc_libs();

    let overlayHTML = "<html><head><link rel='stylesheet' type='text/css' href='lib://ca.pz2e/css/partyOverlay.css'></head><body>";

    for (var p in partyList) {
        let pc = partyList[p];
        let hpValue = pc.getProperty("HP");
        let maxHPValue = pc.getProperty("MaxHP");
        let tempHPValue = pc.getProperty("TempHP");
        let tokenImage = get_token_image(pc.getId(), 40, "Player Characters");

        overlayHTML += "<div class='player'>";
        overlayHTML += "<div class='player-image'><img height=40px width=40px src='" + tokenImage + "'/></div>";

        overlayHTML += "<div><h3>" + pc.getName().replace("Lib:", "") + "</h3></div>";

        let tokenStates = pc.getActiveStates();
        if (tokenStates.length > 0) {
            overlayHTML += "<div style='margin-left: 5px; display: flex; align-items: center;'>"
        }

        for (var s in tokenStates) {
            let stateName = tokenStates[s];
            let stateImage = get_state_image(stateName, 20);
            overlayHTML += "<img height=20px width=20px src='" + stateImage + "' title='" + display_conditions(pc, stateName) + "'/>";
        }
        if (tokenStates.length > 0) {
            overlayHTML += "</div>"
        }

        overlayHTML += "</div><div class='player-hp'>";

        let barRatio = hpValue / maxHPValue;
        let vH = String(Math.max(0, Math.floor(barRatio * 120)));
        let vS = "75";
        let vL = "25";

        overlayHTML += "<div class='player-hp-bar-back'><div class='player-hp-bar' style='height=10px; width=" + String((hpValue / maxHPValue) * 100) + "%; background-color: hsl(" + vH + ", " + vS + "%, " + vL + "%);'>";

        overlayHTML += String(hpValue) + " / " + String(maxHPValue) + (tempHPValue > 0 ? " + " + String(tempHPValue) : "") + "</div></div>";

        overlayHTML += "</div>";
    }

    overlayHTML += "</body></html>";

    //MapTool.chat.broadcast(overlayHTML.replaceAll("<", "&lt;"))

    MTScript.setVariable("overlayHTML", overlayHTML);
    MTScript.evalMacro("[overlay(\"Party Characters\"):{[r: overlayHTML]}]");
}

MTScript.registerMacro("ca.pz2e.party_overlay", party_overlay);