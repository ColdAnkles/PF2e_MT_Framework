﻿param (
    $runFuncs
)

function get-master-zip {
    $zipURL = "https://api.github.com/repos/foundryvtt/pf2e/zipball/master"
    Invoke-RestMethod -Uri $zipURL -OutFile pf2e-master.zip
}

function expand-master-zip {
    #Expand-Archive -LiteralPath pf2e-master.zip -DestinationPath pf2e-master
    if (Test-Path "./pf2e-master/" ){
        Remove-Item -Recurse -Force pf2e-master
    }
    7z x pf2e-master.zip -o"pf2e-master" */packs/* */static/lang/* -r
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

    $sources | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding ascii ".\library\public\data\pf2e_source.json"
}

function import-all-sources {
    
    $sourceList = Get-ChildItem .\pf2e-master\*\packs\* | ForEach-Object { $_.FullName }

    #Load More Important Sources First
    $coreContent = @("actions","ancestries","backgrounds","classes","classfeatures","conditions","equipment","feats","hazards","spells","spell-effects","pathfinder-monster-core")
    $skipItems = @()
    ForEach ($source in $sourceList) {
        ForEach($coreItem in $coreContent){
            if ($source.Contains("\packs\"+$coreItem)) {
                $skipItems += $source
                $splitArray = $source -split "\\"
                $sourceName = $splitArray[$splitArray.length - 1 ]
                if (!$script:unwantedPacks.Contains($sourceName)) {
                    import-source $source $sourceName
                }
            }
        }
    }


    ForEach ($source in $sourceList) {
        $splitArray = $source -split "\\"
        $sourceName = $splitArray[$splitArray.length - 1 ]
        if (!$script:unwantedPacks.Contains($sourceName) -and !$skipItems.Contains($source)) {
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

    $childList = Get-ChildItem -Recurse $sourcePath | ForEach-Object { $_.FullName }

    $counter = 0
    $total = $childList.Length
    $importText = "Importing " + $sourceName

    ForEach ($file in $childList) {
        if ( -not ($file -like "*.json")) {
            continue
        }
        $splitArray = $file -split "\\"
        $childName = $splitArray[$splitArray.length - 1 ]
        #Write-Host "Reading " $childName
        #Write-Host $file
        $subPath = ""
        $begin = $false
        ForEach ($p in $splitArray){
            if (( $p -eq "packs" -or $begin ) -and $p -ne $childName){
                $begin = $true
                $subPath += "/" + $p
            }
        }
        import-source-file $file $sourceName $childName $subPath
        $counter = $counter + 1
        $percentProgress = $counter / $total * 100
        Write-Progress -Activity $importText -Status "$percentProgress% Complete:" -PercentComplete $percentProgress
    }
}

function import-source-file {
    
    param (
        $filePath,
        $fileDir,
        $fileName,
        $subPath
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

    if (($data.getType().FullName -eq "System.Object[]")){
        return
    }

    $storeData = @{}

    $script:wantedSources = $script:wantedSources
    $script:foundSources = $script:foundSources
    $script:tagData = $script:tagData

    $storeData.name = $data.name
    $storeData.type = $data.type
    $storeData.id = $data._id
    $baseNameSplit = $fileName -split "\.";
    $storeData.baseName = $baseNameSplit[0]

    if ($data.system.traits.PSObject.Properties.name -contains "otherTags"){
        ForEach ($tagDef in $data.system.traits.otherTags){
            if ( -not ($tagData.Contains($tagDef))){
                $tagData[$tagDef] = [System.Collections.ArrayList]@()
            }
            $tagData[$tagDef].Add($data.name) | Out-Null
        }
    }

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
        $storeData.source = $data.system.publication.title;
    }
    elseif ($data.type -eq "ancestry") {
        $storeData.traits = $data.system.traits.value
        $storeData.rarity = $data.system.traits.rarity
        $storeData.source = $data.system.publication.title
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

    if ($wantedSources.Contains($storeData.source)){
        $storeData.items = $data.items
        $storeData.system = $data.system
    }else{
        $storeData.fileURL = "https://raw.githubusercontent.com/foundryvtt/pf2e/master" + $subPath + "/" + $fileName
    }

    if ( !$foundSources.Contains($storeData.source)) {
        $foundSources.Add($storeData.source) | Out-Null
    }
    if ( !$packData.ContainsKey("pf2e_" + $storedata.type)) {
        $packData["pf2e_" + $storedata.type] = @{}
    }
    if (!$packData["pf2e_" + $storedata.type].Contains($storeData.name)){
        $packData["pf2e_" + $storedata.type][$storeData.name] = $storeData
    }#DUPLICATE NAMED ENTRIES IGNORED
}

function import-lang-file {
    $script:langData = $script:langData
    $langSources = Get-ChildItem .\pf2e-master\*\static\lang\*
    $data = $null
    ForEach ( $source in $langSources ){
        $rawData = Get-Content -Encoding UTF8 $source
        #Windows PS doesn't do case sensitive keys in JSON - 
        $data = $rawData.replace("""condition""", "conditionList").replace("""ui""", "_ui") | ConvertFrom-JSON
        $outFile = ".\library\public\lang_data\"+$source.Name
        $data | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 $outFile
    }

    

}

function write-data-files {

    $script:packData = $script:packData
    $script:foundSources | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 ".\library\public\data\pf2e_publications.json"
    $script:wantedSources | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 ".\library\public\data\pf2e_enabledSources.json"
    $script:tagData | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 ".\library\public\data\pf2e_tagData.json"

    ForEach ($dataType in $packData.Keys) {
        $dataSet = $packData[$dataType]
        $outFile = ".\library\public\data\" + $dataType + ".json"

        $dataSet | ConvertTo-Json -depth 100 -Compress | Out-File -Encoding UTF8 $outFile
    }

}

function diff-check-prep {
    $script:diffCheckFiles = $script:diffCheckFiles
    if (Test-Path pf2e-master){
        Foreach ($file in $diffCheckFiles){
            Get-ChildItem -Path "./pf2e-master" -Recurse -File -Filter $file | Copy-Item -Destination "diffChecks"
        }
    }
}

function diff-checks {
    Foreach ($file in $diffCheckFiles){
        $test = Compare-Object -DifferenceObject (Get-Content "diffChecks/$file") -ReferenceObject (Get-ChildItem -Path "./pf2e-master" -Recurse -File -Filter $file | Get-Content) | Out-Null
        if ($test){
            Write-Host "Differences found in" $file
        }
    }
}

$diffCheckFiles = @("black-dragon-adult.json", "heal.json", "force-barrage.json", "affix-a-talisman.json", "recall-knowledge.json", "off-guard.json")
$unwantedPacks = @("paizo-pregens", "rollable-tables", "vehicles", "kingmaker-features", "macros", "deities", "kingmaker-bestiary", "journals", "kingmaker-features", "iconics", "criticaldeck", "action-macros")
$wantedSources = @("Pathfinder Core Rulebook", "Pathfinder Player Core", "Pathfinder Player Core 2", "Pathfinder Rage of Elements", "Pathfinder GM Core", "Pathfinder Advanced Player's Guide", "Pathfinder Treasure Vault", "Pathfinder Dark Archive", "Pathfinder Gamemastery Guide", "Pathfinder Secrets of Magic", "Pathfinder Bestiary", "Pathfinder Bestiary 2", "Pathfinder Bestiary 3", "Pathfinder Book of the Dead", "Pathfinder Guns & Gears","Pathfinder Monster Core")
$sources = @{}
$packData = @{}
$langData = @{}
$tagData = @{}
$foundSources = [System.Collections.ArrayList]@()

if ($runFuncs -eq "all" -or $runFuncs -eq "download") {
    Write-Host "Downloading Data"
    get-master-zip
    Write-Host "Downloaded Foundry Data"
}

if ($runFuncs -eq "all" -or $runFuncs -eq "expand") {
    Write-Host "Expanding Data"
    expand-master-zip
    Write-Host "Expanded Data"
}

if ($runFuncs -eq "all" -or $runFuncs -eq "lang") {
    import-lang-file
}

if ($runFuncs -eq "all" -or $runFuncs -eq "source") {
    Write-Host "Preparing Sources"
    get-foundry-sources
    Write-Host "Source Data Prepared"
}

if ($runFuncs -eq "diffCheckTest"){
    diff-check-prep
    diff-checks
}

if ($runFuncs -eq "all" -or $runFuncs -eq "import") {
    diff-check-prep
    Write-Host "Importing Sources"
    import-all-sources
    Write-Host "Sources Imported"
    Write-Host "Writing Files"
    write-data-files
    Write-Host "Files Written"
    diff-checks
}