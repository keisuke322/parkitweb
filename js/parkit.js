/*global $, console, init */
/*jslint nomen: true */

var _storage = localStorage;
var _parkedDate = new Date(0);
var _tempParkedDate = new Date(0);
var _parkingNumber = "";
var _refreshCurrentDateTimeTimer;
var _refreshParkingTimeTimer;
var _refreshParkInfoTimer;

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

/*
function setLocalStorage() {
    "use strict";
    
    var key = _tempParkedDate.getTime() == 0 ? _parkedDate.getTime() : _tempParkedDate.getTime(),
        value = document.getElementById("parkingNumberInput").value;

    if (key && value) {
        _storage.clear();
        _storage.setItem(key, value);
    }
}
*/

function setTempParkedDate() {
    "use strict";
    console.log("parked date has been changed.");

    var ymd = document.getElementById("parkedDateInput").value,
        hm = document.getElementById("parkedTimeInput").value;
    _tempParkedDate = new Date(ymd + " " + hm + ":" + _parkedDate.getSeconds());
}

function getDate(yyyymmddString, hhmmString) {
    "use strict";
    
    return new Date(dateString + " " + timeString);
}

function refreshCurrentDateTime() {
    "use strict";

    var now = new Date();
    document.getElementById("refreshCurrentDateTime").innerHTML = getFullYearMonthDate(now) + " " + getFullHourMinSec(now);
    _refreshCurrentDateTimeTimer = setTimeout(refreshCurrentDateTime, 1000);
}

function refreshParkingTime() {
    "use strict";
    document.getElementById("parkingTimeForInput").innerHTML = getPassingHourMinSec(_parkedDate);
    _refreshParkingTimeTimer = setTimeout(refreshParkingTime, 1000);
}

function refreshParkInfo() {
    "use strict";
    document.getElementById("parkingTime").innerHTML = getPassingHourMinSec(_parkedDate);
    document.getElementById("parkedTime").innerHTML = getFullYearMonthDate(_parkedDate) + " " + getFullHourMinSec(_parkedDate);
    _refreshParkInfoTimer = setTimeout(refreshParkInfo, 1000);
}

/**
 * home page用
 */
function displayHomePage() {
    "use strict";
        
    /* 既に記録されたデータがあれば、駐車情報ページを表示させる */
    if (_storage.length > 0) {
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
    if (_parkingNumber === "" && _storage.length > 0) {
        _parkingNumber = _storage.getItem(_storage.key(0));
    }
    document.getElementById("parkingNumberInput").value = _parkingNumber;
    
    /* 駐車時刻をフォームにセットする */
    document.getElementById("parkedDateInput").value = getFullYearMonthDate(_parkedDate);
    document.getElementById("parkedTimeInput").value = getFullHourMin(_parkedDate);
}

/**
 * park info用
 */
function displayParkInfoPage() {
    "use strict";
    console.log("displayParkInfoPage()");
    /* 駐車情報を表示する */
    if (_storage.length > 0) {
        document.getElementById("parkingNumber").innerHTML = _storage.getItem(_storage.key(0));
        if (_parkedDate.getTime() === 0) {
            var parkedTime = parseInt(_storage.key(0), 10);
            _parkedDate = new Date(parkedTime);
        }
        
        refreshParkInfo();
    }
}

/**
 * 入庫された時
 */
function submitPark() {
    "use strict";
    
    _parkedDate = new Date();
    //clearTimeout(_refreshCurrentDateTimeTimer);
    displayParkInfoInputPage();
}

/**
 * 駐車情報が更新された時
 */
function submitParkInfo() {
    "use strict";
    
    /* Web Storageに記録する */
    //setLocalStorage();
    _parkedDate = _tempParkedDate.getTime() == 0 ? _parkedDate : _tempParkedDate;
    _parkingNumber = document.getElementById("parkingNumberInput").value;
    
    if (_parkedDate && _parkingNumber) {
        _storage.clear();
        _storage.setItem(_parkedDate.getTime(), _parkingNumber);
    }
    
    
    /* 駐車時刻アコーディオンを閉じる */
    $("#parkedDateTimeFieldSet").collapsible("option", "collapsed", true);
    
    clearTimeout(_refreshParkingTimeTimer);
    displayParkInfoPage();
}

function submitParkFinish() {
    "use strict";
    
    /* リセット */
    _storage.clear();
    _parkedDate = new Date(0);
    _parkingNumber = "";
    _tempParkedDate = new Date(0);
    clearTimeout(_refreshParkInfoTimer);
    document.getElementById("parkingNumberInput").value = "";
    
    displayHomePage();
}

function editParkInfo() {
    "use strict";
    
    displayParkInfoInputPage();
}

function cancelParkInfoInput() {
    "use strict";
    
    _tempParkedDate = new Date(0);
    //displayHomePage();
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