"use strict";

function change_hp(tokenID, changeHPData = null) {
	let token = MapTool.tokens.getTokenByID(tokenID);
	let tokenDisplayName = "";

	if (!(token.getName().includes("Lib")) && token.isPC()) {
		change_hp(token.getProperty("myID"), changeHPData);
		return;
	} else if ((token.getName().includes("Lib")) && token.isPC()) {
		tokenDisplayName = token.getName().replace("Lib:", "");
	} else {
		tokenDisplayName = token.getName();
	}

	let tokenCurrentHP = Number(token.getProperty("HP"));
	let tokenCurrentMaxHP = Number(token.getProperty("MaxHP"));
	let tokenCurrentTempHP = Number(token.getProperty("TempHP"));
	let currentConditions = JSON.parse(token.getProperty("conditionDetails"));
	let tokenTraits = JSON.parse(token.getProperty("traits"));

	if (isNaN(tokenCurrentTempHP)) {
		tokenCurrentTempHP = 0;
	}

	if (changeHPData == null) {

		let queryHTML = "<html><form action='macro://Change_HP_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
		queryHTML = queryHTML + "<input type='hidden' name='tokenID' value='" + tokenID + "'><table>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Damage, Healing, and Temporary HP</b></td></tr>";
		queryHTML = queryHTML + "<tr><td>Number of Hit Points to heal, hurt, or add as temporary HP:</td><td><input type='text' style='font-family: Arial;' name='hpChangeVal' value='0'></td></tr>";
		queryHTML = queryHTML + "<tr><td>Is the character taking lethal or nonlethal damage, being healed or gaining temporary HP?</td><td><input type='radio' name='hpChangeType' value='lethal' checked='checked'>Lethal Damage<br /><input type='radio' name='hpChangeType' value='nonlethal' >Nonlethal Damage<br /><input type='radio' name='hpChangeType' value='healing'>Healing<br /><input type='radio' name='hpChangeType' value='tempHP'>Temp HP</td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current HP is " + String(tokenCurrentHP) + "/" + String(tokenCurrentMaxHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current HP value (if desired)</td><td><input type='text' name='currentHPChange' style='font-family: Arial;' value='" + tokenCurrentHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current Temporary HP is " + String(tokenCurrentTempHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current Temporary HP value (if desired)</td><td><input type='text' name='currentTempHPChange' style='font-family: Arial;' value='" + tokenCurrentTempHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current Maximum HP is " + String(tokenCurrentMaxHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current Maximum HP value (if desired)</td><td><input type='text' name='currentMaxHPChange' style='font-family: Arial;' value='" + tokenCurrentMaxHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan='2' style='text-align:right;'><input type='submit' name='changeHPSubmit' value='Submit'><input type='submit' name='changeHPSubmit' value='Cancel'></td></tr>";
		queryHTML = queryHTML + "</table></form></html>";

		MTScript.setVariable("queryHTML", queryHTML);
		MTScript.evalMacro("[dialog5('Change HP','width=600;height=420;temporary=1; noframe=0; input=1'):{[r:queryHTML]}]");


	} else {
		if (changeHPData.changeHPSubmit == "Cancel") {
			return;
		}

		//MapTool.chat.broadcast(JSON.stringify(changeHPData));

		let silent = false;
		if ("silent" in changeHPData && changeHPData.silent) {
			silent = true;
		}

		let tokenOldHP = tokenCurrentHP;

		if (changeHPData.currentHPChange != tokenCurrentHP) {
			token.setProperty("HP", String(changeHPData.currentHPChange));
			if (changeHPData.currentHPChange <= 0) {
				kill_creature(tokenID);
			} else {
				if (get_state("Dead", token)) {
					set_state("Dead", false, token);
				}
				if (!silent) {
					chat_display({ "name": tokenDisplayName + " HP Set!", "system": { "description": { "value": tokenDisplayName + " HP set to " + String(changeHPData.currentHPChange) + "!" } } }, true);
				}
			}
		} else if (changeHPData.currentMaxHPChange != tokenCurrentMaxHP) {
			token.setProperty("MaxHP", String(changeHPData.currentMaxHPChange));
		} else if (changeHPData.currentTempHPChange != tokenCurrentTempHP) {
			token.setProperty("TempHP", String(changeHPData.currentTempHPChange));
			if (!silent) {
				chat_display({ "name": tokenDisplayName + " changed Temp HP!", "system": { "description": { "value": tokenDisplayName + " temp HP set to " + String(changeHPData.currentTempHPChange) + "!" } } }, true);
			}
		} else if (changeHPData.hpChangeType == "tempHP") {
			tokenCurrentTempHP = Math.max(tokenCurrentTempHP, changeHPData.hpChangeVal);
			token.setProperty("TempHP", String(tokenCurrentTempHP));
			if (!silent) {
				chat_display({ "name": tokenDisplayName + " changed Temp HP!", "system": { "description": { "value": tokenDisplayName + " temp HP set to " + String(tokenCurrentTempHP) + "!" } } }, true);
			}
		} else {
			if (changeHPData.hpChangeType == "lethal") {

				tokenCurrentTempHP = tokenCurrentTempHP - changeHPData.hpChangeVal;
				tokenCurrentHP = tokenCurrentHP + ((tokenCurrentTempHP < 0) ? tokenCurrentTempHP : 0);

				if (tokenCurrentHP <= 0) {
					tokenCurrentHP = 0;
				}

				if (!silent) {
					let description = tokenDisplayName + " takes " + String(changeHPData.hpChangeVal) + " lethal damage!";
					if (tokenTraits.includes("troop")){
						let troopChange = troop_segment_change(tokenCurrentMaxHP, tokenOldHP, tokenCurrentHP)
						if (troopChange.old > troopChange.new){
							description += "<br /> Troop Loses " + String(troopChange.old - troopChange.new) + " Segments.";
						}
					}
					chat_display({ "name": tokenDisplayName + " takes damage!", "system": { "description": { "value": description } } }, true);
				}

				token.setProperty("TempHP", String(tokenCurrentTempHP));
				if (tokenCurrentTempHP <= 0) {
					token.setProperty("TempHP", "0");
				}
				token.setProperty("HP", String(tokenCurrentHP));
				if (tokenCurrentHP <= 0) {
					zero_hp(tokenID);
				}
			} else if (changeHPData.hpChangeType == "nonlethal") {
				tokenCurrentTempHP = tokenCurrentTempHP - changeHPData.hpChangeVal;
				tokenCurrentHP = tokenCurrentHP + ((tokenCurrentTempHP < 0) ? tokenCurrentTempHP : 0);
				if (tokenCurrentHP <= 0) {
					tokenCurrentHP = 0;
				}

				if (!silent) {
					let description = tokenDisplayName + " takes " + String(changeHPData.hpChangeVal) + " nonlethal damage!";
					if (tokenTraits.includes("troop")){
						let troopChange = troop_segment_change(tokenCurrentMaxHP, tokenOldHP, tokenCurrentHP)
						if (troopChange.old > troopChange.new){
							description += "<br /> Troop Loses " + String(troopChange.old - troopChange.new) + " Segments.";
						}
					}
					chat_display({ "name": tokenDisplayName + " takes damage!", "system": { "description": { "value": description } } }, true);
				}

				token.setProperty("TempHP", String(tokenCurrentTempHP));
				if (tokenCurrentTempHP <= 0) {
					token.setProperty("TempHP", "0");
				}
				token.setProperty("HP", String(tokenCurrentHP));
				if (tokenCurrentHP <= 0) {
					knockout_creature(tokenID);
				}
			} else if (changeHPData.hpChangeType == "healing") {
				let tokenOldHP = tokenCurrentHP;
				tokenCurrentHP = tokenCurrentHP + changeHPData.hpChangeVal;
				if (tokenCurrentHP > tokenCurrentMaxHP) {
					tokenCurrentHP = tokenCurrentMaxHP;
				}
				let healVal = tokenCurrentHP - tokenOldHP;
				if (healVal > 0) {
					token.setProperty("HP", String(tokenCurrentHP));
					if ("Dying" in currentConditions) {
						let woundedVal = 0;
						set_condition("Dying", token, 0, true);
						set_condition("Prone", token, 1, true);
						currentConditions = JSON.parse(token.getProperty("conditionDetails"));
						//Any time you lose the dying condition, you gain the wounded 1 condition, or increase your wounded condition value by 1 if you already have that condition.
						if ("Wounded" in currentConditions) {
							woundedVal = currentConditions.Wounded.value.value;
						}
						set_condition("Wounded", token, woundedVal + 1, true);
					}
					if (get_state("Dead", token)) {
						set_state("Dead", false, token);
						chat_display({ "name": tokenDisplayName + " resurrected!", "system": { "description": { "value": tokenDisplayName + " resurrected to " + String(tokenCurrentHP) + " HP!" } } }, true);
					} else {
						chat_display({ "name": tokenDisplayName + " healed!", "system": { "description": { "value": tokenDisplayName + " heals " + String(healVal) + "!" } } }, true);
					}
				}
			}
		}
	}

	if (token.getName().includes("Lib")) {
		update_my_tokens(token);
	}

}

MTScript.registerMacro("ca.pf2e.change_hp", change_hp);

function troop_segment_change(maxHP, oldHP, newHP){
	//MapTool.chat.broadcast(String(oldHP)+"/"+String(maxHP)+" -> " +String(newHP)+"/"+String(maxHP));

	let troopHPInterval = maxHP/3;

	let oldSegmentCount = 4;
    if ((oldHP <= troopHPInterval * 2) && (oldHP > troopHPInterval)) {
        oldSegmentCount = 3;
    } else if (oldHP <= troopHPInterval) {
        oldSegmentCount = 2;
    }

    let newSegmentCount = 4;
    if ((newHP <= troopHPInterval * 2) && (newHP > troopHPInterval)) {
        newSegmentCount = 3;
    } else if (newHP <= troopHPInterval) {
        newSegmentCount = 2;
    }
	//MapTool.chat.broadcast("oldSegmentCount: " + String(oldSegmentCount));
	//MapTool.chat.broadcast("newSegmentCount: " + String(newSegmentCount));

	return {"old":oldSegmentCount, "new":newSegmentCount}

}