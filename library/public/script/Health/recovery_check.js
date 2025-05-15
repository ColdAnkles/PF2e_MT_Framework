"use strict";

function recovery_check(token) {
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    }

    let currentConditions = JSON.parse(token.getProperty("conditionDetails"));
    if (!("Dying" in currentConditions)) {
        return;
    }

    let dyingValue = Number(currentConditions.Dying.value.value);
    let recoveryDC = 10 + dyingValue;
    let critSuccessDC = recoveryDC + 10;
    let critFailDC = recoveryDC - 10;

    let regenData = calculate_bonus(turnToken, ["regen"]);
    let actorData = JSON.parse(turnToken.getProperty("foundryActor"));

    let deathValue = get_actor_data(token, "system.attributes.dying.max");

    if (deathValue == null){
        deathValue = 4;
    }

    if ("system" in actorData && "attributes" in actorData.system && "dying" in actorData.system.attributes && "max" in actorData.system.attributes.dying) {
        deathValue = actorData.system.attributes.dying.max;
    }

    let regenerating = false;

    if ("FastHealing" in regenData.otherEffects) {
        let regenDisabled = false;
        if ("regen" in actorData) {
            regenDisabled = !actorData.regen;
        }
        regenData = regenData.otherEffects.FastHealing;
        regenerating = (!regenDisabled && regenData.type == "regeneration");
    }

    MTScript.evalMacro("[h: dTwenty = roll(1,20)]");
    let dTwenty = String(MTScript.getVariable("dTwenty"));

    let result = null;

    if (dTwenty >= critSuccessDC) {
        //Crit Success
        result = "Critical Success";
    } else if (dTwenty >= recoveryDC) {
        //Success
        result = "Success";
    } else if (dTwenty >= critFailDC) {
        //Failure
        result = "Failure";
    } else {
        //Crit Fail
        result = "Critical Failure";
    }

    if (dTwenty == 20) {
        if (result == "Success") {
            result = "Critical Success";
        } else if (result == "Failure") {
            result = "Success";
        } else if (result == "Critical Failure") {
            result = "Failure";
        }
    } else if (dTwenty == 1) {
        if (result == "Critical Success") {
            result = "Success";
        } else if (result == "Success") {
            result = "Failure";
        } else if (result == "Failure") {
            result = "Critical Failure";
        }
    }

    let checkDescription = "Recovery Check Result: " + dTwenty + " vs DC " + recoveryDC + " = " + result;

    //Critical Success Your dying value is reduced by 2.
    //Success Your dying value is reduced by 1.
    //Failure Your dying value increases by 1.
    //Critical Failure Your dying value increases by 2.

    let futureDying = dyingValue

    if (result == "Critical Success") {
        futureDying -= 2;
    } else if (result == "Success") {
        futureDying -= 1;
    } else if (result == "Failure") {
        futureDying += 1;
    } else if (result == "Critical Failure") {
        futureDying += 2;
    }

    futureDying = Math.max(0, futureDying);

    if (regenerating) {
        futureDying = Math.min(deathValue - 1, futureDying);
    }

    if (futureDying != dyingValue) {
        checkDescription += "<br />Their Dying condition value changes to " + futureDying;
    }

    chat_display({ "name": token.getName() + " attempts a recovery check check!", "system": { "description": { "value": checkDescription } } }, true);

    if (futureDying <= 0) {
        let woundedVal = 0;
        set_condition("Dying", token, 0, true);
        set_condition("Unconscious", token, 1, true);
        currentConditions = JSON.parse(token.getProperty("conditionDetails"));
        //Any time you lose the dying condition, you gain the wounded 1 condition, or increase your wounded condition value by 1 if you already have that condition.
        if ("Wounded" in currentConditions) {
            woundedVal = currentConditions.Wounded.value.value;
        }
        set_condition("Wounded", token, woundedVal + 1, true);
    } else if (futureDying >= deathValue) { //Check Modifiers etc. for dying value, including regeneration
        zero_hp(token);
    } else {
        set_condition("Dying", token, futureDying, true);
    }
}

MTScript.registerMacro("ca.pf2e.recovery_check", recovery_check);