/**
 * This function mimics format functionality to turn a date into a 'DD MMM YYYY' format string
 * It is used instead of the format functions provided by the popular javascript 
 * date manipulation libraries to reduce the bundle size
 * 
 * @param date The date to be formatted
 * @returns A formatted string ('DD MMM YYYY') 
 */
export const formatDate: (date: Date) => string = (date) => {
    if (!date) {
        return '';
    }
    // e.g. Sat Mar 28 2020 22:11:13 GMT+0000 (Greenwich Mean Time)
    const dateStrings = date.toString().substr(4, 20).split(' ');
    // Mar 28 2020 -> 28 Mar 2020 
    [dateStrings[0], dateStrings[1]] = [dateStrings[1], dateStrings[0]];
    let formattedString = dateStrings.join(' ');

    // remove leading zero
    if (formattedString.indexOf('0') === 0) {
        formattedString = formattedString.substr(1);
    }

    return formattedString;
};
