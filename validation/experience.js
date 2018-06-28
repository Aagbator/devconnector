/**
 * Created by Anthony on 27/06/2018.
 */

/**
 * Created by Anthony on 24/06/2018.
 */

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    if(Validator.isEmpty(data.title)){
        errors.title = 'Job title field is required';
    }


    if(Validator.isEmpty(data.company))
    {
        errors.company = 'Company field is required';
    }

    if(Validator.isEmpty(data.from))
    {
        errors.from = 'From date is required';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}