[h, if(isFrameVisible("Attack Query")), code:{
    [h: closeFrame("Attack Query")]
};{}]
[h: actionData = json.get(macro.args,"actionData")]
[h: actingToken = json.get(macro.args,"actingToken")]
[h: actionData = json.set(actionData, "useMAP", json.contains(macro.args, "useMAP"))]
[h: actionData = json.set(actionData, "increaseMAP", json.contains(macro.args, "increaseMAP"))]
[h: actionData = json.set(actionData, "spendAction", json.contains(macro.args, "spendAction"))]
[h: js.ca.pf2e.core_action(actionData,actingToken)]