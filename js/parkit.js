

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
    
    //var util = new DateUtil();
    //console.log(util.getFullYearMonthDate(new Date()));
}

function setSessionStorage() {
    var key = parkedDate.getTime();
    var value = document.getElementById("parkingNumberInput").value;

    if (key && value) {
        storage.clear();
        storage.setItem(key, value);
    }
}

/*
function getParkingTimeString() {
    var nowTime = new Date().getTime();

    var passedSeconds = parseInt((nowTime - parkedDate.getTime()) / 1000);
    var hour = parseInt(passedSeconds / 3600);
    var min = parseInt((passedSeconds / 60) % 60);
    var sec = passedSeconds % 60;

    // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
    if(hour < 10) { hour = "0" + hour; }
    if(min < 10) { min = "0" + min; }
    if(sec < 10) { sec = "0" + sec; }
    
    return hour + ":" + min + ":" + sec;
}
*/

function refreshCurrentDateTime() {
    var now = new Date();
//    var nowString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
//    document.getElementById("refreshCurrentDateTime").innerHTML = nowString;
    document.getElementById("refreshCurrentDateTime").innerHTML = getFullYearMonthDate(now) + " " + getFullHourMinSec(now);
    setTimeout(refreshCurrentDateTime, 1000);    
}

function refreshParkingTime() {
//    document.getElementById("parkingTimeForInput").innerHTML = getParkingTimeString();
    document.getElementById("parkingTimeForInput").innerHTML = getPassingHourMinSec(parkedDate);
    
    setTimeout(refreshParkingTime, 1000);
}

function refreshParkInfo() {
    if (storage.length > 0) {
        document.getElementById("parkingNumber").innerHTML = storage.getItem(storage.key(0));
        var parkedTime = parseInt(storage.key(0));
        var parkedDate = new Date(parkedTime);
        
        /*
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
        */
        document.getElementById("parkingTime").innerHTML = getPassingHourMinSec(parkedDate);
        document.getElementById("parkedTime").innerHTML = getFullYearMonthDate(parkedDate) + " " + getFullHourMinSec(parkedDate);

        setTimeout(refreshParkInfo, 1000);
    }
}

/**
 * home page用
 */
function displayHomePage() {
    
        
    /* 既に記録されたデータがあれば、駐車情報ページを表示させる */
    if (storage.length > 0) {
        $("body").pagecontainer("change", "#parkInfo");
    }
    
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
    var parkNum = "";
    if (storage.length > 0) {
        parkNum = storage.getItem(storage.key(0));
        alert("key was found");
    }
    document.getElementById("parkingNumberInput").value = parkNum;
    
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
    
//    document.getElementById("parkedDateInput").value = dateValue;
//    document.getElementById("parkedTimeInput").value = timeValue;
    document.getElementById("parkedDateInput").value = getFullYearMonthDate(parkedDate);
    document.getElementById("parkedTimeInput").value = getFullHourMin(parkedDate);
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

function submitParkFinish() {
    storage.clear();
    document.getElementById("parkingNumberInput").value = "";
}




/** Utility **/

function getFullYearMonthDate(date) {
    if (date instanceof Date == false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    mm = mm < 10 ? "0" + mm : mm;
    dd = dd < 10 ? "0" + dd : dd;

    return yyyy + "-" + mm + "-" + dd;
}

function getFullHourMin(date) {
    if (date instanceof Date == false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var hh = date.getHours();
    var mm = date.getMinutes();
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;

    return hh + ":" + mm;
}

function getFullHourMinSec(date) {
    if (date instanceof Date == false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;

    return hh + ":" + mm + ":" + ss;
}

function getPassingHourMinSec(date) {
    var nowTime = new Date().getTime();

    var passedSeconds = parseInt((nowTime - date.getTime()) / 1000);
    var hour = parseInt(passedSeconds / 3600);
    var min = parseInt((passedSeconds / 60) % 60);
    var sec = passedSeconds % 60;

    // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
    if(hour < 10) { hour = "0" + hour; }
    if(min < 10) { min = "0" + min; }
    if(sec < 10) { sec = "0" + sec; }
    
    return hour + ":" + min + ":" + sec;}