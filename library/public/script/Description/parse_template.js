"use strict";

function parse_template(templateString) {
	//MapTool.chat.broadcast(JSON.stringify(templateString));
	let parsed = parse_foundry_strings(templateString);
	//MapTool.chat.broadcast(JSON.stringify(parsed));
	if (parsed.braceContents != null) {
		return parsed.braceContents;
	} else if (("type" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot " + parsed.bracketDetail.type.join(", ");
	} else if (("cone" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot cone";
	} else if (("line" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot line";
	} else if (("emanation" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot emanation";
	} else if (("burst" in parsed.bracketDetail && "distance" in parsed.bracketDetail)) {
		return + parsed.bracketDetail.distance.join(" ") + "-foot burst";
	}

	return templateString;
}