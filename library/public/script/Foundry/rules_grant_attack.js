"use strict";

function rules_grant_attack(rules) {
	var newAttacks = [];
	for (var r in rules) {
		let newRule = rules[r];
		if ("key" in newRule && newRule.key == "Strike" && "traits" in newRule && "category" in newRule && "damage" in newRule && "label" in newRule) {
			let newAttack = {};
			if (newRule.label.includes(".")) {
				let strSplit = newRule.label.split(".");
				newAttack.name = strSplit[strSplit.length - 1];
			} else {
				newAttack.name = newRule.label;
			}
			newAttack.traits = newRule.traits;
			newRule.damage.base.damage = String(newRule.damage.base.dice) + String(newRule.damage.base.die);
			newAttack.damage = [newRule.damage.base];
			newAttack.actionCost = 1;
			newAttack.actionType = "action";
			newAttack.linkedWeapon = "unarmed";
			newAttack.description = "";
			newAttack.category = newRule.category;
			newAttack.effects = [];
			if ("range" in newRule) {
				newAttack.isMelee = newRule.range == null;
				newAttack.range = newRule.range;
			} else {
				newAttack.isMelee = true;
			}
			newAttack.group = "";
			newAttacks.push(newAttack);
		}
	}
	return newAttacks;
}