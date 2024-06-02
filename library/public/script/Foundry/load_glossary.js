"use strict";

function load_glossary(string) {
    MTScript.evalMacro("[h: output = library.getContents('ca.pf2e')]")
    let libContents = JSON.parse(MTScript.getVariable("output"));
    let glossary = null;
    for (var file in libContents) {
        let fileName = libContents[file];
        if (fileName.includes("/lang_data/")) {
            MTScript.setVariable("item", fileName);
            MTScript.evalMacro("[h: importData = data.getStaticData('ca.pf2e', item)]");
            let importData = JSON.parse(MTScript.getVariable("importData"));
            if (glossary == null) {
                glossary = importData;
            } else {
                //Merge Dictionaries
                glossary = merge_dict(glossary, importData)
            }
        }
    }
    //MapTool.chat.broadcast(JSON.stringify(glossary));
    write_data("pf2e_glossary", glossary);
}

MTScript.registerMacro("ca.pf2e.load_glossary", load_glossary);