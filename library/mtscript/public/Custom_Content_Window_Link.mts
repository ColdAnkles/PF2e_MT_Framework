[h: action = json.get(macro.args, "action")]
[h: key = json.get(macro.args, "key")]
[h: entry = json.get(macro.args, "entry")]

[h: js.ca.pf2e.manage_custom_content(key, entry, action)]