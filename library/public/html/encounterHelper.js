function encounterHelper() {
    var budgetTable, levelTable, partyLevel, playerCount;
    budgetTable = document.getElementById("budgetTable");
    levelTable = document.getElementById("levelTable");
    partyLevel = Number(document.getElementById("pcLevel").value);
    playerCount = Number(document.getElementById("pcCount").value);

    if (playerCount < 1) {
        playerCount = 1;
        document.getElementById("pcCount").value = 1;
    }

    if (partyLevel < 1) {
        partyLevel = 1;
        document.getElementById("pcLevel").value = 1;
    } else if (partyLevel > 20) {
        partyLevel = 20;
        document.getElementById("pcLevel").value = 20;
    }

    let charAdj = playerCount - 4;

    budgetTable.rows[1].cells[1].innerText = String(40 + (10 * charAdj)) + " or less";
    budgetTable.rows[2].cells[1].innerText = String(60 + (20 * charAdj));
    budgetTable.rows[3].cells[1].innerText = String(80 + (20 * charAdj));
    budgetTable.rows[4].cells[1].innerText = String(120 + (30 * charAdj));
    budgetTable.rows[5].cells[1].innerText = String(160 + (40 * charAdj));

    levelTable.rows[1].cells[0].innerText = String(partyLevel - 4);
    levelTable.rows[2].cells[0].innerText = String(partyLevel - 3);
    levelTable.rows[3].cells[0].innerText = String(partyLevel - 2);
    levelTable.rows[4].cells[0].innerText = String(partyLevel - 1);
    levelTable.rows[5].cells[0].innerText = String(partyLevel);
    levelTable.rows[6].cells[0].innerText = String(partyLevel + 1);
    levelTable.rows[7].cells[0].innerText = String(partyLevel + 2);
    levelTable.rows[8].cells[0].innerText = String(partyLevel + 3);
    levelTable.rows[9].cells[0].innerText = String(partyLevel + 4);
    return;
}