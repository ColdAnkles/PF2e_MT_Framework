"use strict";

function rest_call(uri, headers="") {
	MTScript.setVariable("uri", uri);
	MTScript.setVariable("headers", headers);
	let response = null;
	if (headers == ""){
		MTScript.evalMacro("[h: response = REST.get(uri)]");
	}else{
		MTScript.evalMacro("[h: response = REST.get(uri, headers, 1)]");
	}
	response = JSON.parse(MTScript.getVariable("response"));
	return response;
}

MTScript.registerMacro("mt.rest_call", rest_call);