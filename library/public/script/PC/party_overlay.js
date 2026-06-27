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
        let tokenStateHTML = "<div style='margin-left: 5px; display: grid; align-items: center;'><div style='margin-left: 5px; display: flex; align-items: center;'>";
        let displayTokenStates = false;

        let heroPointCount = 0;

        for (var s in tokenStates) {
            let stateName = tokenStates[s];
            if (stateName.includes("HeroPoint")) {
                heroPointCount = Number(stateName.split("_")[1]);
                continue;
            } else if (stateName == "Dead" || stateName.includes("ActionsLeft") || stateName == "Reaction") {
                continue;
            }
            displayTokenStates = true;
            let stateImage = get_state_image(stateName, 20);
            tokenStateHTML += "<img height=20px width=20px src='" + stateImage + "' title='" + display_conditions(pc, stateName) + "'/>";
        }
        tokenStateHTML += "</div>";
        if (displayTokenStates) {
            overlayHTML += tokenStateHTML;
        }
        if (heroPointCount > 0) {
            overlayHTML += "<div style='margin-left: 5px; display: flex; align-items: center;'>";
            let heroPointImage = get_state_image("HeroPoint_1", 20);
            for (var i = 0; i < heroPointCount; i++) {
                overlayHTML += "<img height=20px width=20px src='" + heroPointImage + "'/>";
            }
            overlayHTML += "</div>";
        }
        overlayHTML += "</div>";

        overlayHTML += "</div><div class='player-hp'>";

        let barRatio = hpValue / maxHPValue;
        let vH = String(Math.max(0, Math.floor(barRatio * 120)));
        let vS = "75";
        let vL = "25";

        overlayHTML += "<div class='player-hp-bar-back' style='height:25px; width:"+String(maxHPValue*2)+"'>";
        overlayHTML += "<div class='player-hp-bar' style='height:95%; width:" + String((hpValue / maxHPValue) * 100) + "%; background-color: hsl(" + vH + ", " + vS + "%, " + vL + "%);'>";

        overlayHTML += String(hpValue) + " / " + String(maxHPValue) + (tempHPValue > 0 ? " + " + String(tempHPValue) : "") + "</div></div>";

        overlayHTML += "</div>";
    }

    overlayHTML += "</body></html>";

    //MapTool.chat.broadcast(overlayHTML.replaceAll("<", "&lt;"))

    MTScript.setVariable("overlayHTML", overlayHTML);
    MTScript.evalMacro("[overlay(\"Party Characters\"):{[r: overlayHTML]}]");
}

MTScript.registerMacro("ca.pz2e.party_overlay", party_overlay);