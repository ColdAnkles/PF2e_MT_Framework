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
	let pointStates = { 1: get_state("HeroPoint_1", token), 2: get_state("HeroPoint_2", token), 3: get_state("HeroPoint_3", token) };
	let gained = false;
	if (pointStates[2]) {
		set_state("HeroPoint_3", 1, token);
		set_state("HeroPoint_2", 0, token);
		set_state("HeroPoint_1", 0, token);
		gained = true;
	} else if (pointStates[1]) {
		set_state("HeroPoint_3", 0, token);
		set_state("HeroPoint_2", 1, token);
		set_state("HeroPoint_1", 0, token);
		gained = true;
	} else if (!(pointStates[1]) && !(pointStates[2]) && !(pointStates[3])) {
		set_state("HeroPoint_3", 0, token);
		set_state("HeroPoint_2", 0, token);
		set_state("HeroPoint_1", 1, token);
		gained = true;
	}
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}

	if (gained) {
		chat_display({ "name": "Hero Point", "description": token.getName() + " gains a hero point!" });
	}
}

MTScript.registerMacro("ca.pf2e.add_hero_point", add_hero_point);

function use_hero_point(token) {
	let pointStates = { 1: get_state("HeroPoint_1", token), 2: get_state("HeroPoint_2", token), 3: get_state("HeroPoint_3", token) };
	let used = false;
	if (pointStates[3]) {
		set_state("HeroPoint_3", 0, token);
		set_state("HeroPoint_2", 1, token);
		set_state("HeroPoint_1", 0, token);
		used = true;
	} else if (pointStates[2]) {
		set_state("HeroPoint_3", 0, token);
		set_state("HeroPoint_2", 0, token);
		set_state("HeroPoint_1", 1, token);
		used = true;
	} else if (pointStates[1]) {
		set_state("HeroPoint_3", 0, token);
		set_state("HeroPoint_2", 0, token);
		set_state("HeroPoint_1", 0, token);
		used = true;
	}
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	if (used) {
		chat_display({ "name": "Hero Point", "description": token.getName() + " uses a hero point!<br />New Roll: " + String(roll_dice("1d20")) });
	}
}

MTScript.registerMacro("ca.pf2e.use_hero_point", use_hero_point);