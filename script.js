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

    var getData = function (  ) {
        return fetch ( 'https://api.github.com/repos/KarkLeo/nf-timetable' )
            .then ( response => response.json () )
            .then ( function (data) {
                var updateDate = new Date (data.updated_at);
                // console.log(updateDate);

                var dateYear = updateDate.getFullYear()
                var dateMonth = (updateDate.getMonth() + 1).toString().length === 1 ? '0' + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();
                var dateDay = updateDate.getDate().toString().length === 1 ? '0' + updateDate.getDate().toString() : updateDate.getDate().toString();

                var dateHours = updateDate.getHours().toString().length === 1 ? '0' + updateDate.getHours().toString() : updateDate.getHours().toString();
                var dateMinutes = updateDate.getMinutes().toString().length === 1 ? '0' + updateDate.getMinutes().toString() : updateDate.getMinutes().toString();

                document.querySelector('.updateTime__value').innerText = dateDay + '.' + dateMonth + '.' + dateYear + ' о ' + dateHours + ':' + dateMinutes;

            });
    }
    getData();


}

