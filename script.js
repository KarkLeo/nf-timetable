function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
readTextFile("data.json", gridCreated);

function gridCreated (text) {
    var data = JSON.parse(text);

    var rowGrid = data.timeFrame.length;
    data.timeFrame.forEach (function (day) {
        rowGrid += day.dayFinish - day.dayStart;
        console.log(rowGrid);
    });
    var colGrid = data.glades.length + 1;

    var grid = document.querySelector('.grid');
    grid.style.gridTemplateColumns = `repeat(${colGrid}, auto)`;
    grid.style.gridTemplateRows = `repeat(${rowGrid}, auto)`;

    var gridItemsCount = 0
    var activRow = 1;

    data.timeFrame.forEach ( function (day, item) {
        let gridItem = document.createElement ( "div" );
        gridItem.innerText = `День ${item + 1}`;
        gridItem.classList.add('grid__item', 'grid__gladeName', 'grid__timeCell');
        gridItem.style.gridColumn = `1 / 2`;
        gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
        grid.appendChild(gridItem);
        gridItemsCount++;

        data.glades.forEach (function (title, item) {
            let gridItem = document.createElement ( "div" );
            gridItem.innerText = title;
            gridItem.classList.add('grid__item', 'grid__gladeName');
            gridItem.style.gridColumn = `${item + 2} / ${item + 3}`;
            gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
            grid.appendChild(gridItem);
            gridItemsCount++;
        });

        activRow++;

        for (i = 0; i < (day.dayFinish - day.dayStart); i++) {
            let gridItem = document.createElement ( "div" );
            gridItem.innerText = `${day.dayStart + i}:00`;
            gridItem.classList.add('grid__item', 'grid__timeCell');
            gridItem.style.gridColumn = `1 / 2`;
            gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
            grid.appendChild(gridItem);
            gridItemsCount++;
            activRow++;
        }
    });

    for (i = 0; i < (rowGrid * colGrid - gridItemsCount); i++) {
        let gridItem = document.createElement ( "div" );
        gridItem.innerText = ``;
        gridItem.classList.add('grid__item', 'grid__itemNull');
        grid.appendChild(gridItem);
    }
}

