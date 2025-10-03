"use strict";

function spawn_item(itemData, position) {
    try {
        let itemType = capitalise(itemData.type);
        if (itemType == "Equipment") {
            itemType = "Item";
        }

        MTScript.setVariable("xCoord", position.x);
        MTScript.setVariable("yCoord", position.y);
        MTScript.setVariable("itemName", itemData.name);
        MTScript.setVariable("imagePath", "lib://ca.pf2e/image/" + itemType + "Default.png");

        MTScript.evalMacro("[h: val = json.set(\"{}\", \"tokenImage\", imagePath, \"name\", itemName,\"x\",xCoord,\"y\",yCoord)]\
            [h: newItem = createToken(val)]\
            [h: setPropertyType(\"PF2E_Item\", newItem)]\
            [h: setSize(\"Tiny\",newItem)]");

        let newItemID = MTScript.getVariable("newItem");
        let newItem = MapTool.tokens.getTokenByID(newItemID);
        newItem.setProperty("ItemData", JSON.stringify(itemData));

        let tooltipDescription = chat_display(itemData, false,{"isPC":true});
        createMacro({ "label": "View Item", "playerEditable": 0, "command": "[h: ca.pf2e.Item_View_Frame(json.set(\"{}\",\"itemName\",\""+itemData.name+"\",\"itemType\",\""+itemData.type+"\",\"itemData\",ItemData))]", "tooltip": tooltipDescription, "sortBy": ""}, newItemID);
	    createMacro({ "label": "Share Details", "playerEditable": 0, "command": "[r: js.ca.pf2e.share_item(currentToken())]", "tooltip": tooltipDescription, "sortBy": "" }, newItemID);

        return newItem
    } catch (e) {
        MapTool.chat.broadcast("Error in spawn_item");
        MapTool.chat.broadcast("itemData: " + JSON.stringify(itemData));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}

function spawn_item_by_name(itemName, position) {
    try {
        let itemList = JSON.parse(read_data("pf2e_item"));
        if (!(itemName in itemList)) {
            MapTool.chat.broadcast("Could not find " + itemName)
        } else {
            let itemData = itemList[itemName];
            if ("fileURL" in itemData) {
                itemData = rest_call(itemData["fileURL"], "");
            }
            return spawn_item(itemData, position);
        }
    } catch (e) {
        MapTool.chat.broadcast("Error in spawn_item_by_name");
        MapTool.chat.broadcast("itemName: " + JSON.stringify(itemName));
        MapTool.chat.broadcast("" + e + "\n" + e.stack);
        return;
    }
}

MTScript.registerMacro("ca.pf2e.spawn_item_by_name", spawn_item_by_name);