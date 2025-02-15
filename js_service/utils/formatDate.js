const { checkISOFormat } = require('../validators/fieldValidators')

function parseDateToUnix (dateStr) {
    let formattedDate = dateStr
    if (checkISOFormat(formattedDate)){
        formattedDate = formatISOToCustom(formattedDate)
    }
    const [day, month, year] = formattedDate.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1000000;
    
    return {
        seconds: seconds.toString(),
        nanos: nanos
    };
}

function formatISOToCustom (dateFromString) {
    const date = new Date(dateFromString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
    }


module.exports = { parseDateToUnix }