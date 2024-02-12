[h: actionData = json.get(macro.args,0)]
[h: tokenID = json.get(macro.args,1)]
[h: js.ca.pf2e.add_action_to_token(actionData, tokenID)]