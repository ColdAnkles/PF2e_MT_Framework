function download-master-zip {
    $zipURL = "https://api.github.com/repos/foundryvtt/pf2e/zipball/master"
    Invoke-RestMethod -Uri $zipURL -OutFile pf2e-master.zip
}

function expand-master-zip {
    #Expand-Archive -LiteralPath pf2e-master.zip -DestinationPath pf2e-master
    7z x pf2e-master.zip -o"pf2e-master" */packs/* -r
}

function get-foundry-sources {
    $base_content_url = "http://api.github.com/repos/foundryvtt/pf2e/contents"
    $base_pack_url = ""
    $script:sources = $script:sources

    $response = Invoke-RestMethod -Uri $base_content_url

    ForEach ($item in $response) {
        if ($item.name -eq "packs"){
            $base_pack_url = $item.git_url+"?recursive=true"
            continue
        }
    }

    $response = Invoke-RestMethod -Uri $base_pack_url

    ForEach ($p in $response.tree){
        if ($p.type -eq "tree"){
            if (!$script:unwantedSources.Contains($p.path)){
                $newSource = @{name=$p.path; content=@{}; enabled=$false;}
                $sources[$p.path]=$newSource
            }
        }elseif ($p.type -eq "blob"){
            $split_array = $p.path -split "/"
            $parent = $split_array[0]
            if (!$script:unwantedSources.Contains($parent)){
                $name = $split_array[$split_array.length -1]
                if ($sources.ContainsKey($parent)){
                    $new_data_file = @{name=$name; path=$p.path;}
                    $sources[$parent]["content"][$name] = $new_data_file
                }
            }
        }
    }

    $sources | ConvertTo-Json -depth 100 | Out-File ".\library\public\data\sourceData.json"
}

function import-all-sources {
    
    $sourceList = Get-ChildItem .\pf2e-master\*\packs\* | % { $_.FullName }

    ForEach ($source in $sourceList){
        $splitArray = $source -split "\\"
        $sourceName = $splitArray[$splitArray.length -1 ]
        if (!$script:unwantedSources.Contains($sourceName)){
            #Write-Host "Importing " $sourceName
            import-source $source $sourceName
        }else{
            #Write-Host "Skipping" $sourceName
        }
    }
}

function import-source {
    
    param (
        [Parameter(Mandatory = $true)] [System.Object] $sourcePath,
        [Parameter(Mandatory = $true)] [string] $sourceName
    )

    $childList = Get-ChildItem $sourcePath | % { $_.FullName }

    $counter = 0
    $total = $childList.Length
    $importText = "Importing " + $sourceName

    ForEach ($file in $childList){
        $splitArray = $file -split "\\"
        $childName = $splitArray[$splitArray.length -1 ]
        #Write-Host "Reading " $childName
        #Write-Host $file
        import-source-file $file $sourceName $childName
        $counter = $counter + 1
        $percentProgress = $counter/$total * 100
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
    try{
        $data = Get-Content $filePath | ConvertFrom-JSON 
    }Catch{
        Write-Host "Error reading" $filePath
        return
    }

    $storeData = @{}

    $storeData.name = $data.name
    $storeData.type = $data.type
    $storeData.id = $data._id
    $storeData.fileURL = "https://raw.githubusercontent.com/foundryvtt/pf2e/master/packs/" + $fileDir + "/" + $fileName

    if ($data.type -eq "npc"){
        $storeData.traits = $data.system.traits.value
        $storeData.level = $data.system.details.level.value
        $storeData.npcType = $data.system.details.creatureType
        $storeData.rarity = $data.system.traits.rarity
        $storeData.size = $data.system.traits.size.value
        $storeData.source = $data.system.details.publication.title
    }elseif ($data.type -eq "action"){
        $storeData.traits = $data.system.traits.value
        $storeData.actionCost = $data.system.actions.value
        $storeData.actionType = $data.system.actionType.value
        $storeData.category = $data.system.category
        $storeData.requirements = $data.system.requirements
        $storeData.description = $data.system.description.value
        $storeData.source = $data.system.source.value
    }elseif ($data.type -eq "ancestry"){
        $storeData.traits = $data.system.traits.value
        $storeData.source = $data.system.source.value
        $storeData.rarity = $data.system.traits.rarity
        $storeData.source = $data.system.details.publication.title
    }elseif ($data.type -eq "condition"){
        $storeData.source = $data.system.publication.title
        $storeData.description = $data.system.description.value
        $storeData.overrides = $data.system.overrides
        $storeData.value = $data.system.value
        $storeData.rules = $data.system.rules
    }elseif ($data.type -eq "class"){
		$storeData.source = $data.system.publication.title;
		$storeData.rarity = $data.system.traits.rarity;
    }elseif ($data.type -eq "feat"){
		$storeData.source = $data.system.publication.title;
		$storeData.rarity = $data.system.traits.rarity;
		$storeData.traits = $data.system.traits.value;
		$storeData.actionCost = $data.system.actions.value;
		$storeData.actionType = $data.system.actionType.value;
    }elseif ($data.type -eq "spell"){
		$storeData.source = $data.system.publication.title;
		$storeData.rarity = $data.system.traits.rarity;
		$storeData.traits = $data.system.traits.value;
		$storeData.traditions = $data.system.traditions;
		$storeData.level = $data.system.level.value;
    }elseif ($data.type -eq "hazard"){
		$storeData.source = $data.system.details.publication.title;
		$storeData.rarity = $data.system.traits.rarity;
		$storeData.traits = $data.system.traits.value;
		$storeData.level = $data.system.details.level.value;
		$storeData.isComplex = $data.system.isComplex;
		$storeData.hazardType = $data.system.value;
    }elseif ($data.type -eq "effect"){
		$storeData.source = $data.system.publication.title;
		$storeData.duration = $data.system.duration;
		$storeData.rules = $data.system.rules;
    }elseif ($data.type -eq "heritage"){
		$storeData.source = $data.system.publication.title;
		$storeData.description = $data.system.description.value;
		$storeData.ancestry = $data.system.ancestry;
		$storeData.rules = $data.system.rules;
		$storeData.traits = $data.system.traits.value;
		$storeData.rarity = $data.system.traits.rarity;
    }else{
        #Write-Host "Unknown Type: " + $data.type
        return
    }

    if (! $packData.ContainsKey("pf2e_"+$data.type)){
        $packData["pf2e_"+$data.type] = @{}
    }
    $packData["pf2e_"+$data.type][$storeData.name]=$storeData

}

function write-data-files {

    $script:packData = $script:packData

    ForEach ($dataType in $packData.Keys){
        $dataSet = $packData[$dataType]
        $outFile = ".\library\public\data\"+$dataType+".json"

        $dataSet | ConvertTo-Json -depth 100 -Compress | Out-File $outFile
    }

}

$unwantedSources = @("paizo-pregens", "rollable-tables", "vehicles", "kingmaker-features", "macros", "deities", "kingmaker-bestiary", "journals", "kingmaker-features", "iconics",  "criticaldeck", "action-macros")
$sources = @{}
$packData = @{}

download-master-zip
Write-Host "Downloaded Foundry Data"

expand-master-zip
Write-Host "Expanded Data"

get-foundry-sources
Write-Host "Source Data Prepared"

import-all-sources
Write-Host "Sources Imported"

write-data-files
Write-Host "Data Written"