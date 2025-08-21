[h: tokenID = json.get(macro.args,0)]
[h: setState("Dead", !getState("Dead", tokenID), tokenID)]