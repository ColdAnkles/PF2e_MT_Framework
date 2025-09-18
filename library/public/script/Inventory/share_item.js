"use strict";

function share_item(itemID, broadcast = true) {
    let item = MapTool.tokens.getTokenByID(itemID);
    let itemData = JSON.parse(item.getProperty("ItemData"));

    if (broadcast) {
        chat_display(itemData, true, { "rollDice": true, "actor": item, "action": itemData, "isPC": item.isPC() });
    } else {
        return chat_display(itemData, false);
    }
}

MTScript.registerMacro("ca.pf2e.share_item", share_item);