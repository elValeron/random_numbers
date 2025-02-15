function calculateAverages(data) {
    const result = {};
    data.forEach(item => {
        if (item && item.maxNumber !== undefined && Array.isArray(item.value)) {
            const maxNumber = Number(item.maxNumber);
            const values = item.value.map(Number);

            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = sum / values.length;

            result[maxNumber] = +average.toPrecision(2);
        }
    });

    return result;
}

function createRandomNumbersArray(len, maxNumber) {
    return Array.from({ length: len }, () => Math.floor(Math.random() * maxNumber) + 1)
}

module.exports = {calculateAverages, createRandomNumbersArray}
