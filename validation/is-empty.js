/**
 * Created by Anthony on 24/06/2018.
 */

const isEmpty = value =>
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0);


module.exports =  isEmpty;
