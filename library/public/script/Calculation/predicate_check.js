"use strict";

function predicate_check(predicate, predicateScopes, actor) {

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
            results.push(predicate_check(contents[c], predicateScopes, actor))
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
            results.push(predicate_check(contents[c], predicateScopes, actor))
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
        MapTool.chat.broadcast("Predicate GTE Not implemented.")
    }

    function predicate_not(contents, predicateScopes, actor) {
        return !(predicate_check(contents, predicateScopes, actor));
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

            } else if (pText.match(/^self:/)) {
                let slug = pText.split(":")[1];
                if (slug == "armored") {
                    let eqArmor = get_equipped_armor(actor)
                    predicate_resolution = predicate_resolution && (eqArmor != null && eqArmor.armorType != "unarmored");
                } else if (slug == "effect") {
                    let effectSlug = pText.split(":")[2];
                    let tokenEffects = JSON.parse(actor.getProperty("activeEffects"));
                    if (Object.keys(tokenEffects).length == 0) {
                        return false;
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