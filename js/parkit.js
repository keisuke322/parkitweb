var storage = localStorage;
var parkedDate = new Date();

init();



function init() {
    
    // Web Storage機能が利用可能かチェック
    if (typeof localStorage == 'undefined') {
        window.alert("ご利用の端末ではWeb Storage機能がサポートされていないため、本アプリを利用できません");
    }
    
    // 各ページがDOMに追加されてからの処理
    $(document).delegate("#home", "pagecreate", displayHomePage);
    $(document).delegate("#parkInfoInput", "pagecreate", displayParkInfoInputPage);
    $(document).delegate("#parkInfo", "pagecreate", displayParkInfoPage);
}

function setSessionStorage() {
    var key = parkedDate.getTime();
    var value = document.getElementById("parkingNumberInput").value;
    //alert(value);

    if (key && value) {
        storage.clear();
        storage.setItem(key, value);
    }
}

function getParkingTimeString() {
    var nowTime = new Date().getTime();

    var passedSeconds = parseInt((nowTime - parkedDate.getTime()) / 1000);
    //alert(passedSeconds);
    var hour = parseInt(passedSeconds / 3600);
    var min = parseInt((passedSeconds / 60) % 60);
    var sec = passedSeconds % 60;

    // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
    if(hour < 10) { hour = "0" + hour; }
    if(min < 10) { min = "0" + min; }
    if(sec < 10) { sec = "0" + sec; }
    
    return hour + ":" + min + ":" + sec;
}

function refreshCurrentDateTime() {
    var now = new Date();
    var nowString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    document.getElementById("refreshCurrentDateTime").innerHTML = nowString;
    
    setTimeout(displayHomePage, 1000);    
}

function refreshParkingTime() {
    document.getElementById("parkingTimeForInput").innerHTML = getParkingTimeString();
    
    setTimeout(displayParkInfoInputPage, 1000);
}

function refreshParkInfo() {
    if (storage.length > 0) {
        document.getElementById("parkingNumber").innerHTML = storage.getItem(storage.key(0));
        var parkedTime = parseInt(storage.key(0));
        var parkedDate = new Date(parkedTime);
        //alert(parkedTime);
        var nowTime = new Date().getTime();

        var passedSeconds = parseInt((nowTime - parkedTime) / 1000);
        //alert(passedSeconds);
        var hour = parseInt(passedSeconds / 3600);
        var min = parseInt((passedSeconds / 60) % 60);
        var sec = passedSeconds % 60;

        // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
        if(hour < 10) { hour = "0" + hour; }
        if(min < 10) { min = "0" + min; }
        if(sec < 10) { sec = "0" + sec; }

        document.getElementById("parkingTime").innerHTML = hour + ":" + min + ":" + sec;

        document.getElementById("parkedTime").innerHTML = parkedDate.toLocaleDateString() + " " + parkedDate.toLocaleTimeString();

        setTimeout(refreshParkInfo, 1000);
    }
}

/**
 * home page用
 */
function displayHomePage() {
    
    /* 現在時刻を表示する */
    refreshCurrentDateTime();
}

/**
 * park info input用
 */
function displayParkInfoInputPage() {
    
    /* 経過時間を表示する */
    refreshParkingTime();
    
    /* 駐車番号をフォームにセットする */
    
    /* 駐車時刻をフォームにセットする */
    var year = parkedDate.getFullYear();
    var month = parkedDate.getMonth() + 1;
    var date = parkedDate.getDate();
    var hour = parkedDate.getHours();
    var min = parkedDate.getMinutes();
    
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    
    var dateValue = year + "-" + month + "-" + date;
    var timeValue = hour + ":" + min;
    
    document.getElementById("parkedDateInput").value = dateValue;
    document.getElementById("parkedTimeInput").value = timeValue;
}

/**
 * park info用
 */
function displayParkInfoPage() {
    
    /* 駐車情報を表示する */
    refreshParkInfo();
}

/**
 * 入庫された時
 */
function submitPark() {
    parkedDate = new Date();
}

/**
 * 駐車情報が更新された時
 */
function submitParkInfo() {
    
    /* Web Storageに記録する */
    setSessionStorage();
    
    /* 駐車時刻アコーディオンを閉じる */
    $("#parkedDateTimeFieldSet").collapsible("option", "collapsed", true);
}
