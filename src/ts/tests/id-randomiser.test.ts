import { generateRandomId } from '../util/id-randomiser';
import 'jest-extended';
test('should return a random number', () => {
    expect(generateRandomId()).toBeNumber();
})
