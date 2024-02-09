"use strict";
//Foundry has some functions that don't quite match JS for use in eval(). Defining the short names here now.

function max(a, b){
	return Math.max(a,b);
}

function min(a, b){
	return Math.min(a,b);
}

function ceil(a){
    return Math.ceil(a);
}

function floor(a){
    return Math.floor(a);
}

function ternary(decider, ifT, ifF){
    return (decider)?ifT:ifF;
}

function gte(a, b){
    return a>=b;
}

function gt(a, b){
    return a>b;
}

function lte(a, b){
    return a<=b;
}

function lt(a, b){
    return a<b;
}