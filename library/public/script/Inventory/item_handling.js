"use strict";

function drop_item(token, itemID) {
    let tokenID = token;
    let trueToken = token;
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
        trueToken = token;
    } else {
        tokenID = token.getId()
    }

    let itemData = null;
    try {
        let inventory = JSON.parse(token.getProperty("inventory"));
        itemData = inventory[itemID];
        itemData.system.equipped = false;

        let tokenName = token.getName();
        if (tokenName.includes("Lib:")){
            tokenName = tokenName.replace("Lib:","");
            let thisMapTokensTemp = MapTool.tokens.getMapTokens();
            let thisMapTokens = [];
            for (var t in thisMapTokensTemp){
                thisMapTokens.push(thisMapTokensTemp[t].getId());
            }
            let PCTokenList = JSON.parse(token.getProperty("pcTokens"));
            trueToken = MapTool.tokens.getTokenByID(thisMapTokens.filter(value => PCTokenList.includes(value))[0]);
        }

        chat_display({ "name": tokenName, "system": { "description": { "value": (tokenName + " drops their " + itemData.name) } } });

        let tokenPosition = get_token_position(trueToken);

        spawn_item(itemData, tokenPosition);
        delete inventory[itemID];
        token.setProperty("inventory", JSON.stringify(inventory));
    } catch (e) {
        MapTool.chat.broadcast("Error in drop_item");
        MapTool.chat.broadcast("token: " + String(token));
        MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }


}

function pickup_item(token, itemID) {
    let tokenID = token;
    if (typeof (token) == "string") {
        token = MapTool.tokens.getTokenByID(token);
    } else {
        tokenID = token.getId()
    }
    let itemData = null;
    try {
        let itemToken = MapTool.tokens.getTokenByID(itemID);
        itemData = JSON.parse(itemToken.getProperty("ItemData"))
        let inventory = JSON.parse(token.getProperty("inventory"));
        inventory[itemData._id] = itemData;
        token.setProperty("inventory", JSON.stringify(inventory));

        chat_display({ "name": token.getName(), "system": { "description": { "value": (token.getName().replace("Lib:","") + " picks up a " + itemData.name) } } });

        MTScript.setVariable("itemTokenID", itemID);
        MTScript.evalMacro("[h: removeToken(itemTokenID)]");

    } catch (e) {
        MapTool.chat.broadcast("Error in pickup_item");
        MapTool.chat.broadcast("token: " + String(token));
        MapTool.chat.broadcast("itemID: " + String(itemID));
        MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}

function find_items_on_ground(token = null) {
    try {

        let mapTokens = MapTool.tokens.getMapTokens();

        if (token.getName().includes("Lib:")){
            let thisMapTokens = [];
            for (var t in mapTokens){
                thisMapTokens.push(mapTokens[t].getId());
            }
            let PCTokenList = JSON.parse(token.getProperty("pcTokens"));
            token = MapTool.tokens.getTokenByID(thisMapTokens.filter(value => PCTokenList.includes(value))[0]);
        }

        let itemList = [];

        for (var t in mapTokens) {
            if (get_token_property_type(mapTokens[t]) == "PF2E_Item") {
                if (token == null) {
                    itemList.push(mapTokens[t]);
                } else {
                    let tokenID = token;
                    if (typeof (token) == "string") {
                        token = MapTool.tokens.getTokenByID(token);
                    } else {
                        tokenID = token.getId()
                    }
                    let tokenPosition = get_token_position(token);
                    let itemPosition = get_token_position(mapTokens[t])
                    if (tokenPosition.x == itemPosition.x && tokenPosition.y == itemPosition.y) {
                        itemList.push(mapTokens[t]);
                    }
                }
            }
        }

        return itemList;

    } catch (e) {
        MapTool.chat.broadcast("Error in find_items_on_ground");
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }

}