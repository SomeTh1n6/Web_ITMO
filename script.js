let errorX = document.getElementById("ErrorX");
let errorY = document.getElementById("ErrorY");
let errorR = document.getElementById("ErrorR");

if (localStorage.tab === undefined){
    localStorage.setItem("tab", "");
}

let x, y, r;
let errorMessage = "";
let leftBorderY = -5;
let rightBorderY = 5;


function chooseR(element) {
    r = element.value;

    [...document.getElementsByClassName("r-button")].forEach(function (btn) {
        console.log("RRR")
        btn.style.transform = "";
    });
    element.style.transform = "scale(1.2)";
}


function isNumber(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}


function addToErrorMessage(errorDesc) {
    errorMessage += errorDesc + "\n";
}


function checkOccurrenceY(value){
    return value >= leftBorderY && value <= rightBorderY;
}

function validateX(){
    let xButton = document.querySelectorAll("input[name=x]");

    xButton.forEach(function (button){
        console.log(button.value);
        if (button.checked){

            x = button.value;
            console.log("success");
        }
    })

    if (x === undefined) {
        errorX.textContent = "X должен быть выбран";
        console.log("check X");
        return false;
    }
    errorX.textContent = "";
    x = parseFloat(x);
    return true;
}


function validateY(){
    y = document.querySelector("input[name=Y]").value.replace(",", ".");
    if (y === undefined || y === "") {
        errorY.textContent = "Поле Y пустое";
        return false;
    }
    if (!isNumber(y)) {
        errorY.textContent = "Y должен быть числом";
        return false;
    }
    if (!checkOccurrenceY(y)){
        errorY.textContent = "Y должен быть в диапазоне: от -5 до 5";
        return false;
    }
    errorY.textContent = "";
    return true;
}


function validateR(){
    if (r === undefined) {
        errorR.textContent = "R должен быть выбран"
        return false;
    }
    r = parseFloat(r);
    errorR.textContent = "";

    return true;
}



function submit() {

    if (validateX() && validateR() && validateY()) {
        $.get("main.php", {
            'x' : parseInt(x),
            'y' : parseFloat(y),
            'r' : parseFloat(r),
            'timezone' : new Date().getTimezoneOffset()
        }).done(function(PHP_RESPONSE){
            let result = JSON.parse(PHP_RESPONSE);
            if (!result.isValid){
                addToErrorMessage("Запрос не обработан. Попробуйте обновить страницу");
                return;
            }
            let newRow = result.isBlueAreaHit ? '<tr class="hit-yes">' : '<tr class="hit-no">';
            newRow += '</tr><td style="text-align:center">' + result.x + '</td>';
            newRow += '<td style="text-align:center">' + result.y + '</td>';
            newRow += '<td style="text-align:center">' + result.r + '</td>';
            newRow += ' <td style="text-align:center">' + result.userTime + '</td>';
            newRow += '<td style="text-align:center">' + result.execTime + '</td>';
            newRow += '<td style="text-align:center">' + (result.isBlueAreaHit ? "Да" : "Нет") + '</td>';
            $('#result-table tr:first').after(newRow);
            if (localStorage.tab !== '') {
                localStorage.tab += '|' + PHP_RESPONSE;
            } else localStorage.tab = PHP_RESPONSE;
            document.getElementById("result-table");
        }).fail(function (error) {
            addToErrorMessage(error);
        });
    }

    if (!(errorMessage === "")) {
        errorMessage = "";
    }
}
