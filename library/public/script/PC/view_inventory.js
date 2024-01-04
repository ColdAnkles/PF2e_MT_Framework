"use strict";

function view_inventory(tokenID, inventoryAction = null){

    let token = MapTool.tokens.getTokenByID(tokenID);
    let inventory = JSON.parse(token.getProperty("inventory"));

    if(inventoryAction!=null){
        let shareItem = "";
        for (var key in inventoryAction){
            if (key.includes("share_")){
                shareItem = inventory[key.replace("share_","")];
            }
        }
        chat_display(shareItem);
    }

    let tokenName = token.getName().replaceAll("Lib:","");

    let inventoryHTML = "<html><link rel='stylesheet' type='text/css' href='lib://ca.pf2e/css/NethysCSS.css'/><h1 class='feel-title'>" + tokenName +"'s Inventory</h1>";
    inventoryHTML += "<table width=100%><form action='macro://Inventory_Form_To_JS@Lib:ca.pf2e/self/impersonated?'>";
    inventoryHTML += "<input type='hidden' name='tokenID' value='"+tokenID+"'>";
    inventoryHTML += "<tr><th>Item Name</th><th>Quantity</th><th>Use</th></tr>";

    for (var itemID in inventory){
        let thisItem = inventory[itemID];
        inventoryHTML += "<tr><td>" + thisItem.name + "</td><td>"+String(thisItem.quantity)+"</td><td><input type='submit' name='share_"+thisItem.id+"' value='Submit'></td></tr>"
    }

    inventoryHTML += "</form></table></html>"

    MTScript.setVariable("frameHTML", inventoryHTML);
    MTScript.evalMacro("[frame5('Inventory', 'width=500; height=600; temporary=1; noframe=0; input=1'):{[r: frameHTML]}]")



}

MTScript.registerMacro("ca.pf2e.view_inventory", view_inventory);