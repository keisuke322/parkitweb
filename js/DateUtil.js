function DateUtil() {
    function getFullDateTime(date) {
        if (date instanceof Date == false) {
            console.error("引数がDateオブジェクトではありません。");
            return;
        }

        return getFullYearMonthDate() + " " + getFullHourMin();
    }

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
}

