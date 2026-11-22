"use strict";

function parse_localize(localizeString, additionalData) {
	let parsed = parse_foundry_strings(localizeString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));

	if (parsed.bracketContents != "") {
		let glossaryData = glossary_find(parsed.bracketContents);
		if (glossaryData != null) {
			return glossaryData;
		}
	}

	return "";
}