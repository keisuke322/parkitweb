init();

function init() {
    // homeページがDOMに追加されてからの処理
    $(document).delegate("#home", "pagecreate", displayDateTime);
}

function displayDateTime() {
    var now = new Date();
    var nowString = now.toLocaleDateString() + " " + now.toLocaleTimeString();

    // homeページがDOMに追加されてからの処理
    document.getElementById("timestampButton").innerHTML = nowString + "<br/>入庫";
    document.getElementById("refreshTimestamp").innerHTML = nowString;
    
    setTimeout(displayDateTime, 1000);
}

