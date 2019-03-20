import moment from 'moment';

export default ()=> {
    return moment().utc().format('YYYY-MM-DD HH:mm:ss');
};