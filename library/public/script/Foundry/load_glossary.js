"use strict";

function load_glossary() {
    MTScript.evalMacro("[h: output = library.getContents('ca.pz2e')]")
    let libContents = JSON.parse(MTScript.getVariable("output"));
    let system = read_data("gameSystem");
    let glossary = null;
    for (var file in libContents) {
        let fileName = libContents[file];
        if (fileName.includes("/lang_data/") && !fileName.includes("sf2e-overrides")) {
            MTScript.setVariable("item", fileName);
            MTScript.evalMacro("[h: importData = data.getStaticData('ca.pz2e', item)]");
            let importData = JSON.parse(MTScript.getVariable("importData"));
            if (glossary == null) {
                glossary = importData;
            } else {
                //Merge Dictionaries
                glossary = merge_dict(glossary, importData)
            }
        }
    }
    //Merge SF2E Overrides Afterwards
    if (system == "sf2e" && libContents.includes("public/lang_data/sf2e-overrides-en.json")){
        MTScript.evalMacro("[h: importData = data.getStaticData('ca.pz2e', item)]");
        let importData = JSON.parse(MTScript.getVariable("importData"));
        glossary = merge_dict(glossary, importData)
    }
    //MapTool.chat.broadcast(JSON.stringify(glossary));
    write_data("pz2e_glossary", glossary);
}

MTScript.registerMacro("ca.pz2e.load_glossary", load_glossary);