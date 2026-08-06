[h: actionData = json.get(macro.args,0)]
[h: tokenID = json.get(macro.args,1)]
[h: js.ca.pz2e.add_extra_action_to_token(actionData, tokenID)]
[h: ca.pz2e.Compendium_Window(json.set("{}","window","action","tokenID",tokenID))]