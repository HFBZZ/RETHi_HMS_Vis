import DateDict from './delay_data.json';

function dateToString(date) {
    const yr = date.getFullYear();
    const month = date.getMonth() + 1;
    var mo = "/";
    if (month < 10) {
        mo += "0"
    }
    mo += month;
    const day = date.getDate();
    var da = "/";
    if (day < 10) {
        da += "0"
    }
    da += day;
    return yr + mo + da;
}

function getDelay(date) {
    const AU_to_s = 499.00478384;
            
    var string_date = dateToString(date);
    console.log(string_date);
    var dist = 0;
    console.log(DateDict.date_data);
    if (string_date in DateDict.date_data) {
        console.log("IN");
        var todays_data = DateDict.date_data[string_date];
        console.log(todays_data);
        dist = todays_data[1];
    }
    else {
        console.log("OUT");
        var prevDate = new Date(date.valueOf());
        var nextDate = new Date(date.valueOf());
        prevDate.setDate(date.getDate() - 1);
        nextDate.setDate(date.getDate() + 1);
        var string_prev = dateToString(prevDate);
        var string_next = dateToString(nextDate);
        var prev_data = DateDict.date_data[string_prev];
        var next_data = DateDict.date_data[string_next];
        dist = (prev_data[1] + next_data[1]) / 2
    }
    console.log(dist);
    return dist * AU_to_s;
}

function formatDelay(format, delay) {
    var formatted = " seconds"
    if (format == "m:s") {
        const min = Math.floor(delay / 60);
        const sec = Math.round(delay % 60);
        formatted = min + ":" + sec;
    } 
    else if (format == "m,s") {
        const min = Math.floor(delay / 60);
        const sec = Math.round(delay % 60);
        formatted = min + " minutes, " + sec + formatted;
    }
    else {
        formatted = Math.round(delay * 100)/100 + formatted;
    }
    return formatted;
}

function stringToDate(date_string) {
    var parts = date_string.split('/');
    var date = new Date();
    date.setFullYear(parseInt(parts[2]));
    date.setMonth(parseInt(parts[0]) - 1);
    date.setDate(parseInt(parts[1]));
    return date;
}

export default function FormatDateDelay(format, dateType, date_str) {
    var my_date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    if(dateType == "Custom") {
        my_date = stringToDate(date_str);
    }
    return dateType + " Delay (" + my_date.toLocaleDateString(undefined, options) + "): " + formatDelay(format, getDelay(my_date));
}