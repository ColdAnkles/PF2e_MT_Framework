"use strict";

function predicate_check(predicate, predicateScopes, actor, item) {

    if (typeof (actor) == "string") {
        actor = MapTool.tokens.getTokenByID(actor);
    }
    let actorFeats = [];

    if (actor != null) {
        actorFeats = JSON.parse(actor.getProperty("allFeatures"));
    }

    function predicate_and(contents, predicateScopes, actor) {
        let results = [];
        for (var c in contents) {
            results.push(predicate_check(contents[c], predicateScopes, actor, item))
        }
        let finalResult = true;
        for (var r in results) {
            finalResult = (finalResult && results[r]);
        }
        return finalResult;
    }

    function predicate_nand(contents, predicateScopes, actor) {
        return !(predicate_and(contents, predicateScopes, actor));
    }

    function predicate_or(contents, predicateScopes, actor) {
        let results = [];
        for (var c in contents) {
            results.push(predicate_check(contents[c], predicateScopes, actor, item))
        }
        let finalResult = true;
        for (var r in results) {
            finalResult = (finalResult || results[r]);
        }
        return finalResult;
    }

    function predicate_nor(contents, predicateScopes, actor) {
        return !(predicate_or(contents, predicateScopes, actor));
    }

    function predicate_gte(contents, predicateScopes, actor) {
        let partA = contents[0];
        let partB = contents[1];
        if (isNaN(partA)) {
            partA = predicate_check(partA, predicateScopes, actor, item);
        }
        if (isNaN(partB)) {
            partB = predicate_check(partB, predicateScopes, actor, item);
        }
        return partA >= partB;
    }

    

    function predicate_gt(contents, predicateScopes, actor) {
        let partA = contents[0];
        let partB = contents[1];
        if (isNaN(partA)) {
            partA = predicate_check(partA, predicateScopes, actor, item);
        }
        if (isNaN(partB)) {
            partB = predicate_check(partB, predicateScopes, actor, item);
        }
        return partA > partB;
    }

    function predicate_lt(contents, predicateScopes, actor) {
        let partA = contents[0];
        let partB = contents[1];
        if (isNaN(partA)) {
            partA = predicate_check(partA, predicateScopes, actor, item);
        }
        if (isNaN(partB)) {
            partB = predicate_check(partB, predicateScopes, actor, item);
        }
        return partA < partB;
    }

    function predicate_lte(contents, predicateScopes, actor) {
        let partA = contents[0];
        let partB = contents[1];
        if (isNaN(partA)) {
            partA = predicate_check(partA, predicateScopes, actor, item);
        }
        if (isNaN(partB)) {
            partB = predicate_check(partB, predicateScopes, actor, item);
        }
        return partA <= partB;
    }

    function predicate_not(contents, predicateScopes, actor) {
        return !(predicate_check(contents, predicateScopes, actor, item));
    }

    if (typeof (predicate) == "string") {
        predicate = [predicate];
    }

    //MapTool.chat.broadcast(JSON.stringify(predicateScopes));

    let predicate_resolution = true;
    for (var pK in predicate) {
        if (typeof (predicate[pK]) == "string") {
            let pText = predicate[pK];
            //MapTool.chat.broadcast(pText);
            if (pText.match(/^feat:/)) {
                let featSlug = pText.split(":")[1];
                predicate_resolution = predicate_resolution && actorFeats.includes(featSlug);
            } else if (pText.match(/^item:/)) {
                //MapTool.chat.broadcast(JSON.stringify(item));
                let slug = pText.split(":")[1];
                if (slug == "proficiency" && actor != null && item != null) {
                    let profSlug = pText.split(":")[2];
                    if (profSlug == "rank") {
                        let findProf = item.category;
                        let foundProf = 0;
                        let tokenProfs = JSON.parse(actor.getProperty("proficiencies"));
                        for (var p in tokenProfs) {
                            if (findProf.toUpperCase() == tokenProfs[p].name.toUpperCase()) {
                                foundProf = (tokenProfs[p].bonus - actor.getProperty("level")) / 2;
                            }
                        }
                        if (pText.split(":").length == 4) {
                            predicate_resolution = foundProf == Number(pText.split(":")[3]);
                        } else {
                            predicate_resolution = foundProf;
                        }
                    }
                } else {
                    predicate_resolution = false;
                }
            } else if (pText.match(/^self:/)) {
                let slug = pText.split(":")[1];
                if (slug == "armored") {
                    let eqArmor = get_equipped_armor(actor)
                    predicate_resolution = predicate_resolution && (eqArmor != null && eqArmor.armorType != "unarmored");
                } else if (slug == "effect") {
                    let effectSlug = pText.split(":")[2];
                    let tokenEffects = JSON.parse(actor.getProperty("activeEffects"));
                    if (Object.keys(tokenEffects).length == 0) {
                        predicate_resolution = false;
                    } else {
                        for (var e in tokenEffects) {
                            if (tokenEffects[e].baseName == effectSlug || tokenEffects[e].baseName.replace("stance-", "") == effectSlug || tokenEffects[e].baseName.replace("effect-") == effectSlug) {
                                predicate_resolution = predicate_resolution && true;
                                break;
                            }
                        }
                    }
                }
            } else if (pText.match(/^action:/)) {
                let actionSlug = pText.split(":")[1];
                predicate_resolution = predicate_resolution && predicateScopes.includes(actionSlug);
            } else {
                predicate_resolution = false;
            }
        } else {
            //MapTool.chat.broadcast(JSON.stringify(predicate[pK]));
            for (var k in predicate[pK]) {
                //MapTool.chat.broadcast(JSON.stringify(predicate[pK][k]));
                if (k == "and") {
                    predicate_resolution = predicate_resolution && predicate_and(predicate[pK][k], predicateScopes, actor);
                } else if (k == "nand") {
                    predicate_resolution = predicate_resolution && predicate_nand(predicate[pK][k], predicateScopes, actor);
                } else if (k == "or") {
                    predicate_resolution = predicate_resolution && predicate_or(predicate[pK][k], predicateScopes, actor);
                } else if (k == "nor") {
                    predicate_resolution = predicate_resolution && predicate_nor(predicate[pK][k], predicateScopes, actor);
                } else if (k == "gte") {
                    predicate_resolution = predicate_resolution && predicate_gte(predicate[pK][k], predicateScopes, actor);
                } else if (k == "gt") {
                    predicate_resolution = predicate_resolution && predicate_gt(predicate[pK][k], predicateScopes, actor);
                } else if (k == "lt") {
                    predicate_resolution = predicate_resolution && predicate_lt(predicate[pK][k], predicateScopes, actor);
                } else if (k == "lte") {
                    predicate_resolution = predicate_resolution && predicate_lte(predicate[pK][k], predicateScopes, actor);
                } else if (k == "not") {
                    predicate_resolution = predicate_resolution && predicate_not(predicate[pK][k], predicateScopes, actor);
                } else {
                }
            }
        }
    }

    //MapTool.chat.broadcast(JSON.stringify(predicate) + " = " + String(predicate_resolution));
    return predicate_resolution;
}