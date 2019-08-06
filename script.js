// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }
// readTextFile("data.json", gridCreated);

function gridCreated (text) {
    if (typeof  text === "string" ) {
        var data = JSON.parse(text);
    } else if (typeof  text === "object" ) {
        var data = text;
    }

    //Cell calculation
    var rowGrid = data.timeFrame.length;
    data.timeFrame.forEach (function (day) {
        rowGrid += (day.dayFinish - day.dayStart) * 2;
    });
    var colGrid = data.places.length + 1;

    //Create grid
    var grid = document.querySelector('.grid');
    grid.style.gridTemplateColumns = `repeat(${colGrid}, auto)`;
    grid.style.gridTemplateRows = `repeat(${rowGrid}, auto)`;

    //Global grid state
    var gridItemsCountgridItemsCount = 0
    var activRow = 1;

    let getTimeFormat = (time) => `${Math.floor(time) >= 10 ? Math.floor(time) : '0' + Math.floor(time)}:${Math.ceil(time) - time > 0 ? '30' : '00'}`;
    let getDurationFormat = (time) => `${Math.floor(time)}:${Math.ceil(time) - time > 0 ? '30' : '00'}`;

    data.timeFrame.forEach ( function (day) {

        let gridItem = document.createElement ( "div" );
        gridItem.innerText = day.dayName;
        gridItem.classList.add('grid__item', 'grid__placeName', 'grid__timeCell');
        gridItem.style.gridColumn = `1 / 2`;
        gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
        grid.appendChild(gridItem);
        gridItemsCount++;

        data.places.forEach (function (title, item) {
            let gridItem = document.createElement ( "div" );
            gridItem.innerText = title;
            gridItem.classList.add('grid__item', 'grid__placeName');
            gridItem.style.gridColumn = `${item + 2} / ${item + 3}`;
            gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
            grid.appendChild(gridItem);
            gridItemsCount++;
        });

        activRow++;

        for (i = 0; i < (day.dayFinish - day.dayStart); i += 0.5) {
            let gridItem = document.createElement ( "div" );

            gridItem.innerText = getTimeFormat(day.dayStart + i);
            gridItem.classList.add('grid__item', 'grid__timeCell');
            gridItem.style.gridColumn = `1 / 2`;
            gridItem.style.gridRow = `${activRow} / ${activRow + 1}`;
            grid.appendChild(gridItem);
            gridItemsCount++;
            activRow++;
        }
    });

    var getTimeStartIndex = function (day, timeStart) {
        var rowIndex = day + 2;

        for (i = 0; i < day; i++) rowIndex += (data.timeFrame[i].dayFinish - data.timeFrame[i].dayStart) * 2;
        rowIndex += (timeStart - data.timeFrame[day].dayStart) * 2;

        return rowIndex;
    }

    var getPlaceIndex = function (placeName) {
        var placeIndex = 0;
        data.places.forEach(function (place, i) {
            placeIndex = placeName === place ? (i + 2) : placeIndex;
        })
        return placeIndex;
    }

    data.events.forEach(function (event) {
        let gridItemEvent = document.createElement ( "div" );
        gridItemEvent.innerHTML = `
                <ul class="iconList">
                    <li class="iconList__item">
                        <svg class="iconList__icon">
                            <use xlink:href="#timeStart"></use>
                        </svg>
                        ${getTimeFormat(event.timeStart)}
                    </li>
                    <li class="iconList__item">
                        <svg class="iconList__icon">
                            <use xlink:href="#duration"></use>
                        </svg>
                        ${getDurationFormat(event.duration)}
                    </li>
                </ul>
                <h3>${event.title}</h3>
                <p>${event.author}</p>
                
        `;
        gridItemEvent.classList.add('grid__item', 'grid__eventCell');
        gridItemEvent.style.gridColumn = `${getPlaceIndex(event.place)} / ${getPlaceIndex(event.place) + 1}`;
        gridItemEvent.style.gridRow = `${getTimeStartIndex(event.day, event.timeStart)} / ${getTimeStartIndex(event.day, event.timeStart) + event.duration * 2}`;
        grid.appendChild(gridItemEvent);
        gridItemsCount += event.duration * 2;
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

                var dateYear = updateDate.getFullYear()
                var dateMonth = (updateDate.getMonth() + 1).toString().length === 1 ? '0' + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();
                var dateDay = updateDate.getDate().toString().length === 1 ? '0' + updateDate.getDate().toString() : updateDate.getDate().toString();

                var dateHours = updateDate.getHours().toString().length === 1 ? '0' + updateDate.getHours().toString() : updateDate.getHours().toString();
                var dateMinutes = updateDate.getMinutes().toString().length === 1 ? '0' + updateDate.getMinutes().toString() : updateDate.getMinutes().toString();

                document.querySelector('.updateTime__value').innerText = dateDay + '.' + dateMonth + '.' + dateYear + ' о ' + dateHours + ':' + dateMinutes;

                window.scrollTo( 0, 0 );
                html2canvas(document.querySelector(".content")).then(canvas => {
                    document.body.appendChild(canvas)
                });
            });
    }
    getData();

    function getImage(canvas){
        var imageData = canvas.toDataURL();
        var image = new Image();
        image.src = imageData;
        return image;
    }

    function saveImage(image) {
        var link = document.createElement("a");

        link.setAttribute("href", image.src);
        link.setAttribute("download", "Програма NametFest");
        link.click();
    }

    var imageButton = document.querySelector(".save_image");
    imageButton.onclick =  function (event) {

        window.scrollTo( 0, 0 );
        var image = getImage(document.querySelector("canvas"));
        saveImage(image);
    }
}

// (function () {
//     var app = "https://script.google.com/macros/s/AKfycbyuN6aArjojgmt_VC3S8aJZx281n234g-GwMaI6VA/exec",
//         xhr = new XMLHttpRequest();
//     xhr.open('GET', app);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState !== 4) return;
//
//         if (xhr.status == 200) {
//             try {
//                 gridCreated (JSON.parse(xhr.responseText).result);
//             } catch(e) {}
//         }
//     }
//     xhr.send()
// })();


let getHoursToFormat = (dateObj) => `${dateObj.getHours().toString().length === 1 ? '0' + dateObj.getHours().toString() : dateObj.getHours().toString()}`;
let getMinutsToDubleFormat = (dateObj) => `${dateObj.getMinutes() < 30 ? '00' : '30'}`;
let getDurationFormat = (cellHeight) => `${Math.floor(cellHeight / 2)}:${Math.ceil(cellHeight / 2) - cellHeight / 2 > 0 ? '30' : '00'}`;

function getNormalTimeFormat (timeTostring) {
    let useDate = new Date (timeTostring);
    return getHoursToFormat (useDate) + ':' + getMinutsToDubleFormat (useDate);
} 

function gridCreatedFromGTable (dataArray) {
    let rowGrid = (function () {
        let countRow = 0;
        dataArray.forEach(function (cell) {
            countRow = (cell.r + cell.h) > countRow ? (cell.r + cell.h) : countRow;
        });
        return --countRow;
    })();
    let colGrid = (function () {
       let countColumn = 0;
       dataArray.forEach(function (cell) {
           countColumn = (cell.c + cell.w) > countColumn ? (cell.c + cell.w) : countColumn;
       });
       return --countColumn;
    })();

    //Create grid
    let grid = document.querySelector('.grid');
    grid.style.gridTemplateColumns = `repeat(${colGrid}, auto)`;
    grid.style.gridTemplateRows = `repeat(${rowGrid}, auto)`;

    //Global grid state
    let gridItemsCount = 0;

    //Current time
    let currentTime = 0;

    //Reg masks 
    let timeFormat = new RegExp(/\d\d\d\-\d\d\-\d\dT\d\d\:\d\d\:\d\d.\d\d\dZ/);
    let authorFormat = new RegExp(/\(.+\)/);
    let locationFormat = new RegExp(/\{.+\}/);
    let timeTextFormat = new RegExp(/\[.+\]/);

    dataArray.forEach(function (cellObj) {
        let itemCell = document.createElement("div");        
        let cellContent = `            
            <p>${timeFormat.test(cellObj.v) ? getNormalTimeFormat(cellObj.v) : cellObj.v}</p>
        `;
        itemCell.classList.add('grid__item');
        if (cellObj.r === 1) itemCell.classList.add('grid__placeName'); 
        if (timeFormat.test(cellObj.v)) {
            itemCell.classList.add('grid__timeCell'); 
            currentTime = cellObj.v;
        }
        if (cellObj.w === colGrid) itemCell.classList.add('grid__title'); 


        if (cellObj.r !== 1 && !(timeFormat.test(cellObj.v)) && cellObj.w !== colGrid) {

            let author = cellObj.v.match(authorFormat) !== null ? cellObj.v.match(authorFormat)[0].slice(1, -1) : '';
            let location = cellObj.v.match(locationFormat) !== null ? cellObj.v.match(locationFormat)[0].slice(1, -1) : '';
            let timeText = cellObj.v.match(timeTextFormat) !== null ? cellObj.v.match(timeTextFormat)[0].slice(1, -1) : '';

            let value = authorFormat.test(cellObj.v) ? cellObj.v.replace(authorFormat, '') : cellObj.v;
            value = locationFormat.test(value) ? value.replace(locationFormat, '') : value;
            value = timeTextFormat.test(value) ? value.replace(timeTextFormat, '') : value;
            value = value.replace('\\br', '<br/>');
            console.log(value);
            
            cellContent = `
                <ul class="iconList">
                    <li class="iconList__item">
                        <svg class="iconList__icon">
                            <use xlink:href="#timeStart"></use>
                        </svg>
                        ${getNormalTimeFormat(currentTime)}
                    </li>
                    <li class="iconList__item">
                        <svg class="iconList__icon">
                            <use xlink:href="#duration"></use>
                        </svg>
                        ${timeText !== '' ? timeText : getDurationFormat(cellObj.h)}
                    </li>
                </ul>
                <p>${value}</p>
            `
            if (author != '') cellContent += `<span class="author">${author}</span>`;
            if (location != '') cellContent += `<span class="location">${location}</span>`;

            itemCell.classList.add('grid__eventCell'); 
        } 

        itemCell.style.gridColumn = `${cellObj.c} / ${cellObj.c + cellObj.w}`;
        itemCell.style.gridRow = `${cellObj.r} / ${cellObj.r + cellObj.h}`;

        itemCell.innerHTML = cellContent
        grid.appendChild(itemCell);
        gridItemsCount += cellObj.h * cellObj.w;

    });

    for (i = 0; i < (rowGrid * colGrid - gridItemsCount); i++) {
        let gridItem = document.createElement ( "div" );
        gridItem.innerText = ``;
        gridItem.classList.add('grid__item', 'grid__itemNull');
        grid.appendChild(gridItem);
    }

    //Update date

    var getData = function (  ) {
        return fetch ( 'https://api.github.com/repos/KarkLeo/nf-timetable' )
            .then ( response => response.json () )
            .then ( function (data) {
                var updateDate = new Date (data.updated_at);

                var dateYear = updateDate.getFullYear()
                var dateMonth = (updateDate.getMonth() + 1).toString().length === 1 ? '0' + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();
                var dateDay = updateDate.getDate().toString().length === 1 ? '0' + updateDate.getDate().toString() : updateDate.getDate().toString();

                var dateHours = updateDate.getHours().toString().length === 1 ? '0' + updateDate.getHours().toString() : updateDate.getHours().toString();
                var dateMinutes = updateDate.getMinutes().toString().length === 1 ? '0' + updateDate.getMinutes().toString() : updateDate.getMinutes().toString();

                document.querySelector('.updateTime__value').innerText = dateDay + '.' + dateMonth + '.' + dateYear + ' о ' + dateHours + ':' + dateMinutes;

                window.scrollTo( 0, 0 );
                html2canvas(document.querySelector(".content")).then(canvas => {
                    document.body.appendChild(canvas)
                });
            });
    }
    getData();

    //Canvas images

    function getImage(canvas){
        var imageData = canvas.toDataURL();
        var image = new Image();
        image.src = imageData;
        return image;
    }

    function saveImage(image) {
        var link = document.createElement("a");

        link.setAttribute("href", image.src);
        link.setAttribute("download", "Програма NametFest");
        link.click();
    }

    var imageButton = document.querySelector(".save_image");
    imageButton.onclick =  function (event) {

        window.scrollTo( 0, 0 );
        var image = getImage(document.querySelector("canvas"));
        saveImage(image);
    }

    document.querySelectorAll('.onload').forEach(function (elem) {
        elem.classList.remove('onload');
    })
    document.querySelector('.preloader').classList.add('hide');
}

function getJosnData (jsonData) {
    gridCreatedFromGTable (JSON.parse(jsonData).result);
}

// JSON
// -----------------------
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
readTextFile("table.json", getJosnData);

// Goole sheets
// -----------------------
// (function () {
//     var app = "https://script.google.com/macros/s/AKfycbwZNPY5JIkleEJbtOBEOGwHOfCtx6nTPmbfbEyqzqOX9uhEVQ/exec",
//         xhr = new XMLHttpRequest();
//     xhr.open('GET', app);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState !== 4) return;

//         if (xhr.status == 200) {
//             try {
//                 gridCreatedFromGTable (JSON.parse(xhr.responseText).result);
//             } catch(e) {}
//         }
//     }
//     xhr.send()
// })();