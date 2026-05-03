"use strict";

let pathfinderRuntimeValues = { "runtimeDict": "setup" };

function get_runtime(key) {
	return pathfinderRuntimeValues[key];
}
MTScript.registerMacro("ca.pz2e.getRuntime", get_runtime);

function set_runtime(key, value) {
	pathfinderRuntimeValues[key] = value;
}
MTScript.registerMacro("ca.pz2e.setRuntime", set_runtime);

function set_runtime_object(key, value) {
	pathfinderRuntimeValues[key] = JSON.parse(value);
}
MTScript.registerMacro("ca.pz2e.setRuntimeObj", set_runtime_object);
