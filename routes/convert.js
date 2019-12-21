const express = require('express');
const { evaluate } = require('mathjs');

const router = express.Router();

const conversions = {
    gal: 'l',
    l: 'gal',

    lbs: 'kg',
    kg: 'lbs',

    mi: 'km',
    km: 'mi'
};

const unitsFullForm = {
    gal: 'gallons',
    l: 'litres',

    lbs: 'pounds',
    kg: 'kilograms',

    mi: 'miles',
    km: 'kilometers'
};

router.get('/', (req, res) => {
    const { input } = req.query;
    const firstIndexOfCharacter = input.indexOf(input.match(/[a-zA-Z]/));

    let { value, unit } = getValueAndUnit(input, firstIndexOfCharacter);

    let evaluatedValue;

    try {
        evaluatedValue = eval(value);
        console.log(evaluatedValue);
    } catch (err) {
        console.error(err.message);
    }

    const isValidUnit = conversions.hasOwnProperty(unit.toLowerCase());

    if (!evaluatedValue && !isValidUnit)
        return res.send('invalid number and unit');

    if (!isValidUnit) return res.send('invalid unit');
    if (!evaluatedValue) return res.send('invalid number');

    const returnNum = getReturnValue(unit, evaluatedValue);
    const returnUnit = conversions[unit];
    const initNum = value;
    const initUnit = unit;
    const string = `${initNum} ${unitsFullForm[initUnit]} converts to ${returnNum} ${unitsFullForm[returnUnit]}`;

    res.send({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string
    });
});

module.exports = router;

function getReturnValue(unit, evaluatedValue) {
    switch (unit) {
        case 'gal':
            return evaluatedValue * 3.78541;
        case 'l':
            return evaluatedValue / 3.78541;
        case 'lbs':
            return evaluatedValue / 0.453592;
        case 'kg':
            return evaluatedValue * 0.453592;
        case 'mi':
            return evaluatedValue * 1.60934;
        case 'km':
            return evaluatedValue / 1.60934;
        default:
            return null;
    }
}

function getValueAndUnit(input, firstIndexOfCharacter) {
    let value = '';
    let unit = '';
    input.split('').forEach((char, index) => {
        if (index < firstIndexOfCharacter) {
            value += char;
        } else {
            unit += char;
        }
    });

    value = value ? value : 1;
    unit = unit.toLowerCase();

    return { value, unit };
}
