"use strict";

let pathfinderRuntimeValues = {"runtimeDict":"setup"};

function get_runtime(key) {
	return pathfinderRuntimeValues[key];
}
MTScript.registerMacro("ca.pf2e.getRuntime", get_runtime);

function set_runtime(key, value) {
	pathfinderRuntimeValues[key] = value;
}
MTScript.registerMacro("ca.pf2e.setRuntime", set_runtime);

function set_runtime_object(key, value) {
	pathfinderRuntimeValues[key] = JSON.parse(value);
}
MTScript.registerMacro("ca.pf2e.setRuntimeObj", set_runtime_object);
