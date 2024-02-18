param (
    $runFuncs
)

function get-master-zip {
    $zipURL = "https://api.github.com/repos/foundryvtt/pf2e/zipball/master"
    Invoke-RestMethod -Uri $zipURL -OutFile pf2e-master.zip
}

function expand-master-zip {
    #Expand-Archive -LiteralPath pf2e-master.zip -DestinationPath pf2e-master
    7z x pf2e-master.zip -o"pf2e-master" */packs/* */static/lang/en.json -r
}

function get-foundry-sources {
    $base_content_url = "http://api.github.com/repos/foundryvtt/pf2e/contents"
    $base_pack_url = ""
    $script:sources = $script:sources

    $response = Invoke-RestMethod -Uri $base_content_url

    ForEach ($item in $response) {
        if ($item.name -eq "packs") {
            $base_pack_url = $item.git_url + "?recursive=true"
            continue
        }
    }

    $response = Invoke-RestMethod -Uri $base_pack_url

    ForEach ($p in $response.tree) {
        if ($p.type -eq "tree") {
            if (!$script:unwantedPacks.Contains($p.path)) {
                $newSource = @{name = $p.path; content = @{}; enabled = $false; }
                $sources[$p.path] = $newSource
            }
        }
        elseif ($p.type -eq "blob") {
            $split_array = $p.path -split "/"
            $parent = $split_array[0]
            if (!$script:unwantedPacks.Contains($parent)) {
                $name = $split_array[$split_array.length - 1]
                if ($sources.ContainsKey($parent)) {
                    $new_data_file = @{name = $name; path = $p.path; }
                    $sources[$parent]["content"][$name] = $new_data_file
                }
            }
        }
    }

    $sources | ConvertTo-Json -depth 100 | Out-File -Encoding ascii ".\library\public\data\pf2e_source.json"
}

function import-all-sources {
    
    $sourceList = Get-ChildItem .\pf2e-master\*\packs\* | ForEach-Object { $_.FullName }

    ForEach ($source in $sourceList) {
        $splitArray = $source -split "\\"
        $sourceName = $splitArray[$splitArray.length - 1 ]
        if (!$script:unwantedPacks.Contains($sourceName)) {
            #Write-Host "Importing " $sourceName
            import-source $source $sourceName
        }
        else {
            #Write-Host "Skipping" $sourceName
        }
    }
}

function import-source {
    
    param (
        [Parameter(Mandatory = $true)] [System.Object] $sourcePath,
        [Parameter(Mandatory = $true)] [string] $sourceName
    )

    $childList = Get-ChildItem $sourcePath | ForEach-Object { $_.FullName }

    $counter = 0
    $total = $childList.Length
    $importText = "Importing " + $sourceName

    ForEach ($file in $childList) {
        $splitArray = $file -split "\\"
        $childName = $splitArray[$splitArray.length - 1 ]
        #Write-Host "Reading " $childName
        #Write-Host $file
        import-source-file $file $sourceName $childName
        $counter = $counter + 1
        $percentProgress = $counter / $total * 100
        Write-Progress -Activity $importText -Status "$percentProgress% Complete:" -PercentComplete $percentProgress
    }
}

function import-source-file {
    
    param (
        $filePath,
        $fileDir,
        $fileName
    )

    $script:packData = $script:packData

    #$data = Invoke-RestMethod -Uri $fileURL
    try {
        $data = Get-Content -Encoding UTF8 $filePath | ConvertFrom-JSON 
    }
    Catch {
        Write-Host "Error reading" $filePath
        return
    }

    $storeData = @{}

    $script:foundSources = $script:foundSources

    $storeData.name = $data.name
    $storeData.type = $data.type
    $storeData.id = $data._id
    $storeData.fileURL = "https://raw.githubusercontent.com/foundryvtt/pf2e/master/packs/" + $fileDir + "/" + $fileName

    if ($null -eq $data.type) {
        $storeData.type = "null"
    }
    elseif ($data.type -eq "npc") {
        $storeData.traits = $data.system.traits.value
        $storeData.level = $data.system.details.level.value
        $storeData.npcType = $data.system.details.creatureType
        $storeData.rarity = $data.system.traits.rarity
        $storeData.size = $data.system.traits.size.value
        $storeData.source = $data.system.details.publication.title
    }
    elseif ($data.type -eq "action") {
        $storeData.traits = $data.system.traits.value
        $storeData.actionCost = $data.system.actions.value
        $storeData.actionType = $data.system.actionType.value
        $storeData.category = $data.system.category
        $storeData.requirements = $data.system.requirements
        $storeData.description = $data.system.description.value
        $storeData.source = $data.system.details.publication.title;
    }
    elseif ($data.type -eq "ancestry") {
        $storeData.traits = $data.system.traits.value
        $storeData.rarity = $data.system.traits.rarity
        $storeData.source = $data.system.details.publication.title
    }
    elseif ($data.type -eq "condition") {
        $storeData.description = $data.system.description.value
        $storeData.overrides = $data.system.overrides
        $storeData.value = $data.system.value
        $storeData.rules = $data.system.rules
        $storeData.source = $data.system.publication.title
    }
    elseif ($data.type -eq "class") {
        $storeData.source = $data.system.publication.title;
        $storeData.rarity = $data.system.traits.rarity;
    }
    elseif ($data.type -eq "feat") {
        $storeData.source = $data.system.publication.title;
        $storeData.rarity = $data.system.traits.rarity;
        $storeData.traits = $data.system.traits.value;
        $storeData.actionCost = $data.system.actions.value;
        $storeData.actionType = $data.system.actionType.value;
        $storeData.level = $data.system.level.value;
        if ($storeData.name -eq "Aquatic Adaptation" -and $storeData.traits.Contains("lizardfolk")) {
            $storeData.name = "Aquatic Adaptation (Lizardfolk)";
        }
    }
    elseif ($data.type -eq "spell") {
        $storeData.source = $data.system.publication.title;
        $storeData.rarity = $data.system.traits.rarity;
        $storeData.traits = $data.system.traits.value;
        $storeData.traditions = $data.system.traits.traditions;
        $storeData.level = $data.system.level.value;
    }
    elseif ($data.type -eq "hazard") {
        $storeData.source = $data.system.details.publication.title;
        $storeData.rarity = $data.system.traits.rarity;
        $storeData.traits = $data.system.traits.value;
        $storeData.level = $data.system.details.level.value;
        $storeData.isComplex = $data.system.isComplex;
        $storeData.hazardType = $data.system.value;
    }
    elseif ($data.type -eq "effect") {
        $storeData.source = $data.system.publication.title;
        $storeData.duration = $data.system.duration;
        $storeData.rules = $data.system.rules;
        $storeData.start = $data.system.start;
        $storeData.rarity = $data.system.traits.rarity;
        $storeData.traits = $data.system.traits.value;
        $storeData.level = $data.system.level.value;
    }
    elseif ($data.type -eq "heritage") {
        $storeData.source = $data.system.publication.title;
        $storeData.description = $data.system.description.value;
        $storeData.ancestry = $data.system.ancestry;
        $storeData.rules = $data.system.rules;
        $storeData.traits = $data.system.traits.value;
        $storeData.rarity = $data.system.traits.rarity;
    }
    elseif ($data.type -eq "weapon" -or $data.type -eq "armor" -or $data.type -eq "consumable" -or $data.type -eq "equipment" -or $data.type -eq "shield" -or $data.type -eq "treasure" -or $data.type -eq "backpack") {
        $storedata.type = "item";
        $storeData.source = $data.system.publication.title;
        $storeData.rules = $data.system.rules;
        $storeData.traits = $data.system.traits.value;
        $storeData.rarity = $data.system.traits.rarity;
        $storeData.itemType = $data.system.type;
        $storeData.level = $data.system.level.value;
        $storeData.bulk = $data.system.bulk.value;
    }
    else {
        #Write-Host "Unknown Type: " $data.type
    }
    if ( !$foundSources.Contains($storeData.source)) {
        $foundSources.Add($storeData.source) | Out-Null
    }
    if ( !$packData.ContainsKey("pf2e_" + $storedata.type)) {
        $packData["pf2e_" + $storedata.type] = @{}
    }
    $packData["pf2e_" + $storedata.type][$storeData.name] = $storeData

}

function import-lang-file {
    $script:langData = $script:langData
    $langSource = Get-ChildItem .\pf2e-master\*\static\lang\en.json
    $rawData = Get-Content -Encoding UTF8 $langSource
    #Windows PS doesn't does case sensitive keys in JSON - 
    $data = $rawData.replace("""condition""", "conditionList").replace("""ui""", "_ui") | ConvertFrom-JSON

    #$langData.npcAbility = $data.PF2E.NPC.Abilities.Glossary
    #$langData.traitDescriptions = @{}
    #$langData.SpecificRule = @{}

    #ForEach ($entry in $data.PF2E.PSObject.Properties){
    #    if ($entry.name -match "^TraitDescription"){
    #        $key = $entry.name.substring(16)
    #        $value = $entry.value
    #        $langData.traitDescriptions[$key] = $value
    #    }
    #}

    $outFile = ".\library\public\data\pf2e_glossary.json"

    $data | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 $outFile
}

function write-data-files {

    $script:packData = $script:packData
    $script:foundSources | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 ".\library\public\data\pf2e_publications.json"
    $script:wantedSources | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 ".\library\public\data\pf2e_enabledSources.json"

    ForEach ($dataType in $packData.Keys) {
        $dataSet = $packData[$dataType]
        $outFile = ".\library\public\data\" + $dataType + ".json"

        $dataSet | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 $outFile
    }

}

$unwantedPacks = @("paizo-pregens", "rollable-tables", "vehicles", "kingmaker-features", "macros", "deities", "kingmaker-bestiary", "journals", "kingmaker-features", "iconics", "criticaldeck", "action-macros")
$wantedSources = @("Pathfinder Core Rulebook", "Pathfinder Player Core", "Pathfinder Rage of Elements", "Pathfinder GM Core", "Pathfinder Advanced Player's Guide", "Pathfinder Treasure Vault", "Pathfinder Dark Archive", "Pathfinder Gamemastery Guide", "Pathfinder Secrets of Magic", "Pathfinder Bestiary", "Pathfinder Bestiary 2", "Pathfinder Bestiary 3", "Pathfinder Book of the Dead", "Pathfinder Guns & Gears")
$sources = @{}
$packData = @{}
$langData = @{}
$foundSources = [System.Collections.ArrayList]@()

if ($runFuncs -eq "all" -or $runFuncs -eq "download") {
    get-master-zip
    Write-Host "Downloaded Foundry Data"
    expand-master-zip
    Write-Host "Expanded Data"
}

if ($runFuncs -eq "all" -or $runFuncs -eq "lang") {
    import-lang-file
}

if ($runFuncs -eq "all" -or $runFuncs -eq "source") {
    get-foundry-sources
    Write-Host "Source Data Prepared"
}

if ($runFuncs -eq "all" -or $runFuncs -eq "import") {
    import-all-sources
    Write-Host "Sources Imported"
    write-data-files
    Write-Host "Data Written"
}