module.exports.getdate = getdate; //activating function
module.exports.getday=getday;
function getdate() {
    let today = new Date();
    let currentDay = today.getDay()

    let option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-us", option);
    return day;
}

function getday() {
    let today = new Date();
    let currentDay = today.getDay()

    let option = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-us", option);
}