[h: oldData = json.get(macro.args,"old")]
[h: newData = json.get(macro.args,"new")]

[h: nextRound = json.get(oldData, "round")<json.get(newData,"round")]
[h, if(nextRound), code:{
	[h: js.pf2e.on_round_begin()]
};{}]

[h: js.pf2e.on_turn_begin(json.get(newData,"token"))]