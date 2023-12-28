"use strict";

function parse_feature(feature, assignDict){
	let itemData = feature;
	//MapTool.chat.broadcast(JSON.stringify(itemData));

	if (itemData.type == "feat" || (itemData.type=="heritage" && "actionType" in itemData.system)){
		itemData.type = "action";
	}

	
	if (itemData.type == "lore"){
			assignDict.skillList.push({"string":itemData.name+" +"+itemData.system.mod.value,"name":itemData.name,"bonus":itemData.system.mod.value});
			
		}else if(itemData.type == "weapon" || itemData.type == "armor" || itemData.type == "consumable"){
			//MapTool.chat.broadcast(JSON.stringify(itemData));
			let newItem = {"name":itemData.name,"quantity":itemData.system.quantity,"hardness":itemData.system.hardness,"hp":itemData.system.hp.max,"type":itemData.type,"id":itemData._id};
			if (itemData.type == "armor"){
				newItem.armorType = itemData.system.category;
				if (itemData.system.category == "shield"){
					newItem.acBonus = itemData.system.acBonus;
				}
			}else if (itemData.type == "weapon"){
				newItem.damage = itemData.system.damage;
			}
			if ("potencyRune" in itemData.system && "value" in itemData.system.potencyRune){
				newItem.potencyRune = itemData.system.potencyRune.value;
			}
			if ("strikingRune" in itemData.system && "value" in itemData.system.strikingRune){
				newItem.strikingRune = itemData.system.strikingRune.value;
			}
			assignDict.itemList[itemData._id] = newItem;
			
		}else if(itemData.type == "action" && (itemData.system.category=="interaction" || assignDict.type != "npc")&& itemData.system.actionType.value=="passive" && itemData.system.rules.length>0){
			let tempString = clean_description(itemData.system.description.value)
			assignDict.passiveSkills.push({"mainText":itemData.name,"subText":tempString,"rules":itemData.system.rules,"requirements":itemData.system.requirements,"description":tempString,"name":itemData.name});
			
		}else if(itemData.type == "action" && ((itemData.system.category=="defensive" || itemData.system.category=="interaction")  || assignDict.type != "npc") && itemData.system.actionType.value=="passive" && itemData.system.rules.length>0 && "selector" in itemData.system.rules[0] && itemData.system.rules[0].selector=="saving-throw"){
			let tempString = clean_description(itemData.system.description.value)
			assignDict.passiveDefenses.push({"mainText":itemData.name,"subText":tempString,"rules":itemData.system.rules,"requirements":itemData.system.requirements,"actionType":"passive","actionCost":0,"description":tempString,"name":itemData.name});
			
		}else if(itemData.type == "action" && (itemData.system.category=="defensive"  || assignDict.type != "npc")){
			assignDict.otherDefenses.push({"description":itemData.system.description.value,"name":itemData.name,"actionType":itemData.system.actionType.value,"actionCost":itemData.system.actions.value,"traits":itemData.system.traits.value,"rules":itemData.system.rules,"requirements":itemData.system.requirements});
			
		}else if(itemData.type == "melee"){
			//MapTool.chat.broadcast(JSON.stringify(itemData));
			let itemDescription = itemData.system.description.value;
			let newItem = {"name":itemData.name,"bonus":itemData.system.bonus.value,"damage":itemData.system.damageRolls,"traits":itemData.system.traits.value, "isMelee":(itemData.system.weaponType.value=="melee"),"description":itemDescription,"effects":itemData.system.attackEffects.value,"actionType":"action","actionCost":1};
			if ("flags" in itemData && "pf2e" in itemData.flags && "linkedWeapon" in itemData.flags.pf2e){
				newItem.linkedWeapon = itemData.flags.pf2e.linkedWeapon;
			}
			assignDict.basicAttacks.push(newItem);
			
		}else if (itemData.type == "spellcastingEntry"){
			let newSpellEntry = {"name":itemData.name,"spells":[],"spellDC":itemData.system.spelldc.dc,"spellAttack":itemData.system.spelldc.value,"type":itemData.system.prepared.value}
			assignDict.spellRules[itemData._id]=newSpellEntry;
			
		}else if(itemData.type == "spell"){
			//MapTool.chat.broadcast(JSON.stringify(itemData));
			let newSpellEntry = parse_spell(itemData);
			//let newSpellEntry = {"name":itemData.name,"level":itemData.system.level.value,"traits":itemData.system.traits.value};
			if ("heightenedLevel" in itemData.system.location){
				newSpellEntry.castLevel = itemData.system.location.heightenedLevel;
			}else{
				newSpellEntry.castLevel = newSpellEntry.level;
			}
			if (itemData.system.location.value in assignDict.spellRules){
				assignDict.spellRules[itemData.system.location.value].spells.push(newSpellEntry);
			}
		}else if(itemData.type == "action" && (itemData.system.category=="offensive" || assignDict.type != "npc")){
			assignDict.offensiveActions.push({"description":itemData.system.description.value,"name":itemData.name,"actionType":itemData.system.actionType.value,"actionCost":itemData.system.actions.value,"traits":itemData.system.traits.value});
			
		}else{
			//MapTool.chat.broadcast(JSON.stringify(itemData));
		}
}
