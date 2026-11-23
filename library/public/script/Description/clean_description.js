"use strict";

function clean_description(description, removeLineBreaks = true, removeHR = true, removeP = true, additionalData = { "rollDice": false, "invertImages": true, "isPC": false }) {
	//MapTool.chat.broadcast(description.replaceAll("<","&lt;"));
	//MapTool.chat.broadcast(JSON.stringify(additionalData));

	additionalData.removeP = removeP;
	additionalData.removeHR = removeHR;
	additionalData.removeLineBreaks = removeLineBreaks;

	if (!("removeP" in additionalData)) {
		additionalData.removeP = true;
	}
	if (!("removeHR" in additionalData)) {
		additionalData.removeHR = true;
	}
	if (!("removeLineBreaks" in additionalData)) {
		additionalData.removeLineBreaks = true;
	}
	if (!("invertImages" in additionalData)) {
		additionalData.invertImages = true;
	}
	if ("actor" in additionalData && !("level" in additionalData)) {
		additionalData.level = additionalData.actor.getProperty("level");
	}

	let cleanDescription = description;

	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">1.?<\/span>/g, icon_img("1action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">2.?<\/span>/g, icon_img("2action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">3.?<\/span>/g, icon_img("3action", additionalData.invertImages) + " ");
	cleanDescription = cleanDescription.replaceAll(/<span class=\"action-glyph\">R.?<\/span>/g, icon_img("reaction", additionalData.invertImages) + " ");

	let gmRegex = /@GM\[([a-zA-Z0-9,. ]*)\]/g
	if (additionalData.gm) {
		cleanDescription = cleanDescription.replace(gmRegex, (match, p1) => { return p1; });
	} else {
		cleanDescription = cleanDescription.replaceAll(gmRegex, " Save");
	}

	if (removeP) {
		cleanDescription = cleanDescription.replaceAll("<p>", "").replaceAll(".</p>", ". ").replaceAll("</p>", " ");
	} else {
		cleanDescription = cleanDescription.replaceAll("<p>", "").replaceAll(".</p>", ".<br />").replaceAll("</p>", "<br />");
	}
	if (removeLineBreaks) {
		cleanDescription = cleanDescription.replaceAll("<br/>", "").replaceAll(/\n/mg, "")
	}
	if (removeHR) {
		cleanDescription = cleanDescription.replaceAll("<hr />", "");
	}

	if ("level" in additionalData) {
		cleanDescription = cleanDescription.replaceAll("(@level)", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("(@actor.level)", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("(@item.level)", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("(@item.rank)", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("@level", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("@actor.level", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("@item.level", String(additionalData.level));
		cleanDescription = cleanDescription.replaceAll("@item.rank", String(additionalData.level));
	}

	if ("actor" in additionalData) {
		let actor_matches = cleanDescription.match(/(@actor[.a-zA-Z0-9]*)/gm);
		for (var m in actor_matches) {
			let replaceString = clean_actor_data(actor_matches[m], additionalData.actor);
			cleanDescription = cleanDescription.replaceAll(actor_matches[m], replaceString);
		}
	}

	let descriptionTokens = [cleanDescription];
	var identities = ["text"];

	var regexes = [
		{ "regex": /((floor|ceil|max|min)\([^d)(]*(?:\([^d)(]*(?:\([^d)(]*(?:\([^d)(]*\)[^d)(]*)*\)[^d)(]*)*\)[^d)(]*)*\))/gm, "ident": "calc" },
		{ "regex": /resolve\([^()]*\)/gm, "ident": "resolve" },
		{ "regex": /(@Template\[[^\[\]]*\])({[^\[\]]*})?/gm, "ident": "template" },
		{ "regex": /(@Damage\[[^@ ]*\]?\])({.*?})?/gm, "ident": "damage" },
		{ "regex": /(@Check\[[^\[\]]*\])({[^\[\]]*})?/gm, "ident": "check" },
		{ "regex": /(@UUID\[[^\[\]]*\])({[^\[\]]*})?/gm, "ident": "UUID" },
		{ "regex": /@Localize\[.*\]/gm, "ident": "localize" },
		{ "regex": /(\[\[+\/g?m?b?r.*?\]\]+)(\{.*?\})?/gm, "ident": "roll" },
		{ "regex": /(\[\[\/g?m?b?r.*?\]\]\?)(\{.*?\})?/gm, "ident": "roll" },
		{ "regex": /@Embed\[.*\]/gm, "ident": "embed" },
		{ "regex": /\[\[\/act.*\]\]{(.*)}/g, "ident": "act" },
		{ "regex": /\[\[\/act (.*) dc=([0-9]+).*\]\]({.*})?/g, "ident": "act" },
		{ "regex": /\[\[\/act ([^=]*)[\s\]]+.*\]/g, "ident": "act" }];

	var idx = 0;
	for (var r in regexes) {
		var reg = regexes[r];
		while (idx < descriptionTokens.length) {
			let matches = descriptionTokens[idx].match(reg.regex);
			var tidx = 0;
			while (matches != null && matches.length > 0 && tidx < matches.length) {
				if (matches[tidx] != descriptionTokens[idx]) {
					var split = descriptionTokens[idx].split(matches[tidx]);
					descriptionTokens.splice(idx, 1, split[0], matches[0], split[1]);
					identities.splice(idx, 1, "text", reg.ident, "text");
					matches = descriptionTokens[idx].match(reg.regex);
					tidx = 0;
				} else {
					tidx += 1;
				}
			}
			idx += 1;
		}
		idx = 0;
	}

	var finalDescription = { "pc": [], "gm": [] };

	for (var t in descriptionTokens) {
		if (identities[t] == "text") {
			finalDescription.pc.push(descriptionTokens[t]);
			finalDescription.gm.push(descriptionTokens[t]);
		} else if (identities[t] == "calc") {
			let clean = clean_calculations(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "template") {
			let clean = parse_template(descriptionTokens[t]);
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "resolve") {
			let clean = parse_resolve(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "damage") {
			let clean = parse_damage(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean.pc);
			finalDescription.gm.push(clean.gm);
		} else if (identities[t] == "check") {
			let clean = parse_check(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "UUID") {
			let clean = parse_uuid(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "localize") {
			let clean = clean_description(parse_localize(descriptionTokens[t], additionalData), false, removeHR, false, additionalData).gm;
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		} else if (identities[t] == "roll") {
			let clean = parse_roll(descriptionTokens[t], additionalData);
			finalDescription.pc.push(clean.pc);
			finalDescription.gm.push(clean.gm);
		} else if (identities[t] == "embed") {
			finalDescription.pc.push("");
			finalDescription.gm.push("");
		} else if (identities[t] == "act") {
			let clean = descriptionTokens[t].replaceAll(/\[\[\/act.*\]\]{(.*)}/g, "$1").replaceAll(/\[\[\/act (.*) dc=([0-9]+).*\]\]({.*})?/g, "$1 DC $2").replaceAll(/\[\[\/act ([^=]*)[\s\]]+.*\]/g, "$1");
			finalDescription.pc.push(clean);
			finalDescription.gm.push(clean);
		}
	}

	finalDescription.pc = finalDescription.pc.join("");
	finalDescription.gm = finalDescription.gm.join("");

	finalDescription.pc = finalDescription.pc.replaceAll(/\[(.*)\|.*\]/g, " $1 ");
	finalDescription.pc = finalDescription.pc.replaceAll("emanation Aura", "Aura");
	finalDescription.pc = finalDescription.pc.replaceAll("<span class=\"pf2-icon\">1</span>", icon_img("1action"));
	finalDescription.pc = finalDescription.pc.replaceAll("<span class=\"pf2-icon\">2</span>", icon_img("2action"));
	finalDescription.pc = finalDescription.pc.replaceAll("<span class=\"pf2-icon\">3</span>", icon_img("3action"));

	finalDescription.gm = finalDescription.gm.replaceAll(/\[(.*)\|.*\]/g, " $1 ");
	finalDescription.gm = finalDescription.gm.replaceAll("emanation Aura", "Aura");
	finalDescription.gm = finalDescription.gm.replaceAll("<span class=\"pf2-icon\">1</span>", icon_img("1action"));
	finalDescription.gm = finalDescription.gm.replaceAll("<span class=\"pf2-icon\">2</span>", icon_img("2action"));
	finalDescription.gm = finalDescription.gm.replaceAll("<span class=\"pf2-icon\">3</span>", icon_img("3action"));

	//MapTool.chat.broadcast(cleanDescription.replaceAll("<","&lt;"));

	return finalDescription;
}


MTScript.registerMacro("ca.pz2e.clean_description", clean_description);