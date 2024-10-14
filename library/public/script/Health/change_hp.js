"use strict";

function change_hp(tokenID, changeHPData = null) {
	let token = MapTool.tokens.getTokenByID(tokenID);
	let tokenDisplayName = "";

	if (!(token.getName().includes("Lib")) && get_token_type(token) == "PC") {
		change_hp(token.getProperty("myID"), changeHPData);
		return;
	} else if ((token.getName().includes("Lib")) && get_token_type(token) == "PC") {
		tokenDisplayName = token.getName().replace("Lib:", "");
	} else {
		tokenDisplayName = token.getName();
	}

	let tokenCurrentHP = Number(token.getProperty("HP"));
	let tokenCurrentMaxHP = Number(token.getProperty("MaxHP"));
	let tokenCurrentTempHP = Number(token.getProperty("TempHP"));

	if (isNaN(tokenCurrentTempHP)) {
		tokenCurrentTempHP = 0;
	}

	if (changeHPData == null) {

		let queryHTML = "<html>";
		queryHTML = queryHTML + "<table><form action='macro://Change_HP_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
		queryHTML = queryHTML + "<input type='hidden' name='tokenID' value='" + tokenID + "'>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Damage, Healing, and Temporary HP</b></td></tr>";
		queryHTML = queryHTML + "<tr><td>Number of Hit Points to heal, hurt, or add as temporary HP:</td><td><input type='text' name='hpChangeVal' value='0'></td></tr>";
		queryHTML = queryHTML + "<tr><td>Is the character taking lethal or nonlethal damage, being healed or gaining temporary HP?</td><td><input type='radio' name='hpChangeType' value='lethal' checked='checked'>Lethal Damage<br /><input type='radio' name='hpChangeType' value='nonlethal' >Nonlethal Damage<br /><input type='radio' name='hpChangeType' value='healing'>Healing<br /><input type='radio' name='hpChangeType' value='tempHP'>Temp HP</td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current HP is " + String(tokenCurrentHP) + "/" + String(tokenCurrentMaxHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current HP value (if desired)</td><td><input type='text' name='currentHPChange' value='" + tokenCurrentHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current Temporary HP is " + String(tokenCurrentTempHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current Temporary HP value (if desired)</td><td><input type='text' name='currentTempHPChange' value='" + tokenCurrentTempHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan=2><b>Current Maximum HP is " + String(tokenCurrentMaxHP) + "</td></tr>";
		queryHTML = queryHTML + "<tr><td>Enter new current Maximum HP value (if desired)</td><td><input type='text' name='currentMaxHPChange' value='" + tokenCurrentMaxHP + "'></td></tr>";

		queryHTML = queryHTML + "<tr><td colspan='2' style='text-align:right;'><input type='submit' name='changeHPSubmit' value='Submit'><input type='submit' name='changeHPSubmit' value='Cancel'></td></tr>";

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

		if (changeHPData.currentHPChange != tokenCurrentHP) {
			token.setProperty("HP", String(changeHPData.currentHPChange));
			if (changeHPData.currentHPChange <= 0) {
				kill_creature(tokenID);
			} else {
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

				if (!silent) {
					chat_display({ "name": tokenDisplayName + " takes damage!", "system": { "description": { "value": tokenDisplayName + " takes " + String(changeHPData.hpChangeVal) + " lethal damage!" } } }, true);
				}
				tokenCurrentTempHP = tokenCurrentTempHP - changeHPData.hpChangeVal;
				tokenCurrentHP = tokenCurrentHP + ((tokenCurrentTempHP < 0) ? tokenCurrentTempHP : 0);
				if (tokenCurrentHP <= 0) {
					tokenCurrentHP = 0;
				}
				token.setProperty("TempHP", tokenCurrentTempHP);
				if (tokenCurrentTempHP <= 0) {
					token.setProperty("TempHP", 0);
				}
				token.setProperty("HP", String(tokenCurrentHP));
				if (tokenCurrentHP <= 0) {
					zero_hp(tokenID);
				}
			} else if (changeHPData.hpChangeType == "nonlethal") {

				if (!silent) {
					chat_display({ "name": tokenDisplayName + " takes damage!", "system": { "description": { "value": tokenDisplayName + " takes " + String(changeHPData.hpChangeVal) + " nonlethal damage!" } } }, true);
				}
				tokenCurrentTempHP = tokenCurrentTempHP - changeHPData.hpChangeVal;
				tokenCurrentHP = tokenCurrentHP + tokenCurrentTempHP;
				if (tokenCurrentHP <= 0) {
					tokenCurrentHP = 0;
				}
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
				token.setProperty("HP", String(tokenCurrentHP));
				if (get_state("Dead", token)) {
					set_state("Dead", 0, token);
					chat_display({ "name": tokenDisplayName + " resurrected!", "system": { "description": { "value": tokenDisplayName + " resurrected to " + String(tokenCurrentHP) + " HP!" } } }, true);
				} else {
					chat_display({ "name": tokenDisplayName + " healed!", "system": { "description": { "value": tokenDisplayName + " heals " + String(healVal) + "!" } } }, true);
				}
			}
		}
	}

	if (token.getName().includes("Lib")) {
		update_my_tokens(token);
	}

}

MTScript.registerMacro("ca.pf2e.change_hp", change_hp);