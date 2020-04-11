import { formatDate } from '../util/date-formatter';
import 'jest-extended';

describe('testing date formatter', () => {
    it('should format a date in DD MMM YYYY format', () => {
        const date = new Date('2020-02-02');
        expect(formatDate(date)).toStrictEqual('2 Feb 2020 00:00:00');
    })
})
