import {expect} from 'chai';
import 'mocha';
import {randomPump, Uuid4RangeError, Uuid4TypeError} from '../src/Uuid4';

describe(
    'randomPump buckets tests',
    () => {
        it('should return requested number of buckets', function () {
            const deltas = [1, 2, 16, 23];
            for (const delta of deltas) {
                const sut = randomPump(delta);
                expect(sut).to.be.a('Uint8Array')
                           .and.to.have.lengthOf(delta * 16);
            }
        });
    },
);
describe(
    'randomPump error tests',
    () => {
        it('should throw type error when buckets is not an integer', function () {
            const deltas = [1.5, 5.25];
            for (const delta of deltas) {
                const message =
                    `Pumping guild rules limit me to delivering only full buckets but received one for "${delta}" buckets instead`;
                expect(() => randomPump(delta))
                    .to.throw(Uuid4TypeError, message);
            }
        });
        it('should throw a range error when buckets is out of range', function () {
            const deltas = [-2, 0, 10000];
            for (const delta of deltas) {
                const message = `Pumping guild rules limit me to delivering between 1 and 8191 buckets but received one for "${delta}" buckets instead`;
                expect(() => randomPump(delta))
                    .to.throw(Uuid4RangeError, message);
            }
        });
    },
);
