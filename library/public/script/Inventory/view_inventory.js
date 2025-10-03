"use strict";

function view_inventory(tokenID, inventoryAction = null) {

    let token = MapTool.tokens.getTokenByID(tokenID);
    let inventory = JSON.parse(token.getProperty("inventory"));

    if (inventoryAction != null) {
        let actionItem = "";
        let action = null;
        for (var key in inventoryAction) {
            if (key.includes("share_")) {
                actionItem = inventory[key.replace("share_", "")];
                action = "share";
            } else if (key.includes("equip_")) {
                actionItem = inventory[key.replace("equip_", "")];
                action = "equip";
            } else if (key.includes("drop_")) {
                actionItem = inventory[key.replace("drop_", "")];
                action = "drop";
            } else if (key.includes("pickup_")) {
                actionItem = key.replace("pickup_", "");
                action = "pickup";
            } else if (key.includes("view_")) {
                actionItem = inventory[key.replace("view_", "")];
                action = "view";
            }
        }
        if (actionItem != "") {
            if (action == "share") {
                chat_display(actionItem);
            } else if (action == "equip") {
                actionItem.system.equipped = !actionItem.system.equipped;
                token.setProperty("inventory", JSON.stringify(inventory));
            } else if (action == "drop") {
                drop_item(token, actionItem._id);
                inventory = JSON.parse(token.getProperty("inventory"));
            } else if (action == "pickup") {
                pickup_item(token, actionItem);
                inventory = JSON.parse(token.getProperty("inventory"));
            } else if (action == "view") {
                MapTool.chat.broadcast(JSON.stringify(actionItem));
                MTScript.setVariable("itemData", actionItem);
                MTScript.evalMacro("[h: ca.pf2e.Item_View_Frame(json.set(\"{}\",\"itemName\",\""+actionItem.name+"\",\"itemType\",\""+actionItem.type+"\",\"itemData\",itemData))]")
            }
        }
    }

    let tokenName = token.getName().replaceAll("Lib:", "");

    let themeData = JSON.parse(read_data("pf2e_themes"))[read_data("selectedTheme")];

    let inventoryHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/" + themeData.css + "'/><h1 class='feel-title'>" + tokenName + "'s Inventory</h1>";
    inventoryHTML += "<table width=100%><form action='macro://Inventory_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
    inventoryHTML += "<input type='hidden' name='tokenID' value='" + tokenID + "'>";
    inventoryHTML += "<tr><th>Item Name</th><th>Quantity</th><th>Equip</th><th>Use</th><th>Drop</th></tr>";

    for (var itemID in inventory) {
        let thisItem = inventory[itemID];
        let viewButtonJSON = {"tokenID":tokenID};
        viewButtonJSON["view_"+thisItem._id] = "Submit";
        inventoryHTML += "<tr><td>" + create_macroLink(thisItem.name, "Inventory_Form_To_JS@Lib:ca.pf2e", viewButtonJSON) + "</td>";
        inventoryHTML += "<td>" + String(thisItem.system.quantity) + "</td><td><input type='submit' name='equip_" + thisItem._id + "' value='" + ((thisItem.system.equipped) ? "Unequip" : "Equip") + "'></td>";
        inventoryHTML += "<td><input type='submit' name='share_" + thisItem._id + "' value='Submit'></td>";
        inventoryHTML += "<td><input type='submit' name='drop_" + thisItem._id + "' value='Drop'></tr>";
    }

    inventoryHTML += "</form></table></html>"

    let groundItems = find_items_on_ground(token);

    if (groundItems.length > 0) {
        inventoryHTML += "<br /><br /><h1 class='feel-title'>The Ground</h1>"
        inventoryHTML += "<table width=100%><form action='macro://Inventory_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
        inventoryHTML += "<input type='hidden' name='tokenID' value='" + tokenID + "'>";
        inventoryHTML += "<tr><th>Item Name</th><th>Quantity</th><th>Pick Up</th></tr>";

        for (var item in groundItems) {
            let thisItem = JSON.parse(groundItems[item].getProperty("ItemData"));
            inventoryHTML += "<tr><td>" + thisItem.name + "</td><td>" + String(thisItem.system.quantity) + "</td>"
            inventoryHTML += "<td><input type='submit' name='pickup_" + groundItems[item].getId() + "' value='Pick Up'></tr>";
        }

        inventoryHTML += "</form></table></html>"

    }


    MTScript.setVariable("frameHTML", inventoryHTML);
    MTScript.setVariable("frameName", token.getName().replace("Lib:","") + "\'s Inventory")
    MTScript.evalMacro("[frame5(frameName, 'width=500; height=600; temporary=1; noframe=0; input=1'):{[r: frameHTML]}]")



}

MTScript.registerMacro("ca.pf2e.view_inventory", view_inventory);