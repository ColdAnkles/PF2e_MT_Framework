"use strict";

function parse_resolve(resolveString, additionalData) {
	let resolved = resolveString;
	let parsed = [...resolveString.matchAll(/\((.*)\)/g)]

	//MapTool.chat.broadcast(resolveString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));

	if (parsed != null && parsed.length > 0) {
		parsed = parsed[parsed.length - 1];
	}
	if (parsed != null && parsed.length > 0) {
		parsed = parsed[parsed.length - 1];
	}

	if (parsed == "@actor.attributes.spellDC.value") {
		if ("actor" in additionalData && "action" in additionalData && "traits" in additionalData.action) {
			let castingAbilities = JSON.parse(additionalData.actor.getProperty("spellRules"));
			let castingAbility = null;
			for (var ca in castingAbilities) {
				if (additionalData.action.traits.includes(ca.toLowerCase())) {
					castingAbility = Number(additionalData.actor.getProperty(castingAbilities[ca].castingAbility));
				}
			}
			let castStats = ["arcana", "occult", "nature", "religion"];
			for (var c in castStats) {
				if (additionalData.action.traits.includes(castStats[c])) {
					let castName = "Casting" + capitalise(castStats[c]);
					let actorProfs = JSON.parse(additionalData.actor.getProperty("proficiencies"));
					for (var p in actorProfs) {
						if (actorProfs[p].name == castName) {
							return String(Number(actorProfs[p].bonus + 10 + castingAbility));
						}
					}
				}
			}

		}
	}
	return resolved;
}