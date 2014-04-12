/*global $, console, init */

var storage = localStorage;
var parkedDate = new Date();
var parkingNumber = "";

init();



function init() {
    "use strict";
    
    // Web Storage機能が利用可能かチェック
    if (typeof localStorage === 'undefined') {
        window.alert("ご利用の端末ではWeb Storage機能がサポートされていないため、本アプリを利用できません");
    }
    
    // 各ページがDOMに追加されてからの処理
    $(document).delegate("#home", "pagecreate", displayHomePage);
    $(document).delegate("#parkInfoInput", "pagecreate", displayParkInfoInputPage);
    $(document).delegate("#parkInfo", "pagecreate", displayParkInfoPage);
}

function setSessionStorage() {
    "use strict";
    
    var key = parkedDate.getTime(),
        value = document.getElementById("parkingNumberInput").value;

    if (key && value) {
        storage.clear();
        storage.setItem(key, value);
    }
}

function refreshCurrentDateTime() {
    "use strict";

    var now = new Date();
    document.getElementById("refreshCurrentDateTime").innerHTML = getFullYearMonthDate(now) + " " + getFullHourMinSec(now);
    setTimeout(refreshCurrentDateTime, 1000);
}

function refreshParkingTime() {
    "use strict";
    document.getElementById("parkingTimeForInput").innerHTML = getPassingHourMinSec(parkedDate);
    setTimeout(refreshParkingTime, 1000);
}

function refreshParkInfo() {
    "use strict";
    document.getElementById("parkingTime").innerHTML = getPassingHourMinSec(parkedDate);
    document.getElementById("parkedTime").innerHTML = getFullYearMonthDate(parkedDate) + " " + getFullHourMinSec(parkedDate);
    setTimeout(refreshParkInfo, 1000);
}

/**
 * home page用
 */
function displayHomePage() {
    "use strict";
        
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
    "use strict";

    /* 経過時間を表示する */
    refreshParkingTime();
    
    /* 駐車番号をフォームにセットする */
//    var parkNum = "";
    if (parkingNumber === "" && storage.length > 0) {
        parkingNumber = storage.getItem(storage.key(0));
    }
    document.getElementById("parkingNumberInput").value = parkingNumber;
    
    /* 駐車時刻をフォームにセットする */
    document.getElementById("parkedDateInput").value = getFullYearMonthDate(parkedDate);
    document.getElementById("parkedTimeInput").value = getFullHourMin(parkedDate);
}

/**
 * park info用
 */
function displayParkInfoPage() {
    "use strict";
    
    /* 駐車情報を表示する */
    if (storage.length > 0) {
        document.getElementById("parkingNumber").innerHTML = storage.getItem(storage.key(0));
        if (parkedDate === null) {
            parkedTime = parseInt(storage.key(0), 10);
            parkedDate = new Date(parkedTime);
        }
        
        refreshParkInfo();
    }
}

/**
 * 入庫された時
 */
function submitPark() {
    "use strict";
    
    parkedDate = new Date();
}

/**
 * 駐車情報が更新された時
 */
function submitParkInfo() {
    "use strict";
    
    /* Web Storageに記録する */
    setSessionStorage();
    
    /* 駐車時刻アコーディオンを閉じる */
    $("#parkedDateTimeFieldSet").collapsible("option", "collapsed", true);
}

function submitParkFinish() {
    "use strict";
    
    storage.clear();
    parkedDate = null;
    parkingNumber = "";
    document.getElementById("parkingNumberInput").value = "";
}




/** Utility **/

function getFullYearMonthDate(date) {
    "use strict";
    
    if (date instanceof Date === false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var yyyy = date.getFullYear(),
        mm = date.getMonth() + 1,
        dd = date.getDate();
    mm = mm < 10 ? "0" + mm : mm;
    dd = dd < 10 ? "0" + dd : dd;

    return yyyy + "-" + mm + "-" + dd;
}

function getFullHourMin(date) {
    "use strict";

    if (date instanceof Date === false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var hh = date.getHours(),
        mm = date.getMinutes();
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;

    return hh + ":" + mm;
}

function getFullHourMinSec(date) {
    "use strict";

    if (date instanceof Date === false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var hh = date.getHours(),
        mm = date.getMinutes(),
        ss = date.getSeconds();
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;

    return hh + ":" + mm + ":" + ss;
}

function getPassingHourMinSec(date) {
    "use strict";
    
    if (date instanceof Date === false) {
        console.error("引数がDateオブジェクトではありません。");
        return;
    }
    var nowTime = new Date().getTime(),
        passedSeconds = parseInt((nowTime - date.getTime()) / 1000, 10),
        hh = parseInt(passedSeconds / 3600, 10),
        mm = parseInt((passedSeconds / 60) % 60, 10),
        ss = passedSeconds % 60;

    // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    
    return hh + ":" + mm + ":" + ss;
}