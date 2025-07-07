"use strict";

function generic_use_action(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let initiative = get_initiative(token.getId());
	let actionsLeft = Number(token.getProperty("actionsLeft"));
	if (!(isNaN(initiative))) {
		token.setProperty("actionsLeft", String(actionsLeft - 1));
		update_action_bank(token);
	}

}

MTScript.registerMacro("ca.pf2e.generic_use_action", generic_use_action);

function generic_refund_action(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let initiative = get_initiative(token.getId());
	let actionsLeft = Number(token.getProperty("actionsLeft"));
	if (!(isNaN(initiative))) {
		token.setProperty("actionsLeft", String(actionsLeft + 1));
		update_action_bank(token);
	}

}

MTScript.registerMacro("ca.pf2e.generic_refund_action", generic_refund_action);

function add_hero_point(token) {

	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let pointStates = null;
	let gained = false;
	try {
		pointStates = { 1: get_state("HeroPoint_1", token), 2: get_state("HeroPoint_2", token), 3: get_state("HeroPoint_3", token) };
	} catch (e) {
		MapTool.chat.broadcast("Error in add_hero_point during get_current");
		MapTool.chat.broadcast("token: " + String(token));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	try {
		if (pointStates[2]) {
			set_state("HeroPoint_3", true, token);
			set_state("HeroPoint_2", false, token);
			set_state("HeroPoint_1", false, token);
			gained = true;
		} else if (pointStates[1]) {
			set_state("HeroPoint_3", false, token);
			set_state("HeroPoint_2", true, token);
			set_state("HeroPoint_1", false, token);
			gained = true;
		} else if (!(pointStates[1]) && !(pointStates[2]) && !(pointStates[3])) {
			set_state("HeroPoint_3", false, token);
			set_state("HeroPoint_2", false, token);
			set_state("HeroPoint_1", true, token);
			gained = true;
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in add_hero_point during update points");
		MapTool.chat.broadcast("casterToken: " + String(token));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	if (gained) {
		chat_display({ "name": "Hero Point", "system": { "description": { "value": token.getName().replace("Lib:", "") + " gains a hero point!" } } });
	}
}

MTScript.registerMacro("ca.pf2e.add_hero_point", add_hero_point);

function use_hero_point(token) {

	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let pointStates = { 1: get_state("HeroPoint_1", token), 2: get_state("HeroPoint_2", token), 3: get_state("HeroPoint_3", token) };
	let used = false;
	if (pointStates[3]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", true, token);
		set_state("HeroPoint_1", false, token);
		used = true;
	} else if (pointStates[2]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", false, token);
		set_state("HeroPoint_1", true, token);
		used = true;
	} else if (pointStates[1]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", false, token);
		set_state("HeroPoint_1", false, token);
		used = true;
	}
	if (used) {
		chat_display({ "name": "Hero Point", "system": { "description": { "value": token.getName().replace("Lib:", "") + " uses a hero point!<br />New Roll: " + String(roll_dice("1d20")) } } });
	}
}

MTScript.registerMacro("ca.pf2e.use_hero_point", use_hero_point);

function remove_hero_point(token) {

	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	let pointStates = { 1: get_state("HeroPoint_1", token), 2: get_state("HeroPoint_2", token), 3: get_state("HeroPoint_3", token) };
	if (pointStates[3]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", true, token);
		set_state("HeroPoint_1", false, token);
	} else if (pointStates[2]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", false, token);
		set_state("HeroPoint_1", true, token);
	} else if (pointStates[1]) {
		set_state("HeroPoint_3", false, token);
		set_state("HeroPoint_2", false, token);
		set_state("HeroPoint_1", false, token);
	}
}

MTScript.registerMacro("ca.pf2e.remove_hero_point", remove_hero_point);