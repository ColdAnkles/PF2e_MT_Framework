"use strict";

function pos_neg_sign(number){
	if (number<0){
		return String(number);
	}else{
		return "+"+String(number);
	}
}

MTScript.registerMacro("ca.pf2e.pos_neg_sign", pos_neg_sign);