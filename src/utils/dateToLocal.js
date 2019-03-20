import moment from 'moment';

export default (d)=> {
    let dDate = moment(moment.utc(moment(new Date(d)).format('YYYY-MM-DD HH:mm:ss')).toDate()).local(),
        cDate = moment(),
        dObj = {
            small: dDate.format('DD MMM, YY'),
            long: dDate.format('DD MMM, YY @ HH:mm:ss')
        };
    if (cDate.format('YYYYMMDD') === dDate.format('YYYYMMDD')) { // Today;
        if (cDate.format('mm') === dDate.format('mm')) { // same minutes;
            dObj.small = 'Now';
        } else  if (cDate.format('HH') === dDate.format('HH')) { // same hour;
            dObj.small = cDate.format('mm') - dDate.format('mm') + ' min';
        } else {
            dObj.small = cDate.format('HH') - dDate.format('HH') + ' hour';
        }
    }
    return dObj;
};