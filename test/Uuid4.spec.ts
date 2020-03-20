import {expect} from 'chai';
import 'mocha';
import {Uuid4} from '../src/Uuid4';

type arrayString = [number[], string];
type stringString = [string, string];
type stringNumber = [string, number];
describe(
    'Uuid4 class',
    () => {
        it('should convert from base64 to hexadecimal', () => {
            let data: stringString[] = [
                ['AAYmNkZWZHaKlqMDEyMzQ1', '0062636465664768a96a303132333435'],
                ['BhYmNkZWZHaKlqMDEyMzQ1', '6162636465664768a96a303132333435'],
                ['AAAGNkZWZHaKlqMDEyMzQ1', '0000636465664768a96a303132333435'],
                ['D_YmNkZWZHaKlqMDEyMzQ1', 'ff62636465664768a96a303132333435'],
                ['BhYmNkZWZHaKlqMDEyMzT_', '6162636465664768a96a3031323334ff'],
                ['D__2NkZWZHaKlqMDEyMzQ1', 'ffff636465664768a96a303132333435'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromBase64ToHexString(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should convert from base64 to uuid', () => {
            let data: stringString[] = [
                ['AAYmNkZWZHaKlqMDEyMzQ1', '00626364-6566-4768-a96a-303132333435'],
                ['BhYmNkZWZHaKlqMDEyMzQ1', '61626364-6566-4768-a96a-303132333435'],
                ['AAAGNkZWZHaKlqMDEyMzQ1', '00006364-6566-4768-a96a-303132333435'],
                ['D_YmNkZWZHaKlqMDEyMzQ1', 'ff626364-6566-4768-a96a-303132333435'],
                ['BhYmNkZWZHaKlqMDEyMzT_', '61626364-6566-4768-a96a-3031323334ff'],
                ['D__2NkZWZHaKlqMDEyMzQ1', 'ffff6364-6566-4768-a96a-303132333435'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromBase64ToUuid(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should convert from hexadecimal to base64', () => {
            let data: stringString[] = [
                ['0062636465664768a96a303132333435', 'AAYmNkZWZHaKlqMDEyMzQ1'],
                ['6162636465664768a96a303132333435', 'BhYmNkZWZHaKlqMDEyMzQ1'],
                ['0000636465664768a96a303132333435', 'AAAGNkZWZHaKlqMDEyMzQ1'],
                ['ff62636465664768a96a303132333435', 'D_YmNkZWZHaKlqMDEyMzQ1'],
                ['6162636465664768a96a3031323334ff', 'BhYmNkZWZHaKlqMDEyMzT_'],
                ['ffff636465664768a96a303132333435', 'D__2NkZWZHaKlqMDEyMzQ1'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromHexStringToBase64(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should convert from hexadecimal to uuid', () => {
            let data: stringString[] = [
                ['0062636465664768a96a303132333435', '00626364-6566-4768-a96a-303132333435'],
                ['6162636465664768a96a303132333435', '61626364-6566-4768-a96a-303132333435'],
                ['0000636465664768a96a303132333435', '00006364-6566-4768-a96a-303132333435'],
                ['ff62636465664768a96a303132333435', 'ff626364-6566-4768-a96a-303132333435'],
                ['6162636465664768a96a3031323334ff', '61626364-6566-4768-a96a-3031323334ff'],
                ['ffff636465664768a96a303132333435', 'ffff6364-6566-4768-a96a-303132333435'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromHexStringToUuid(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should convert from uuid to base64', () => {
            let data: stringString[] = [
                ['00626364-6566-4768-a96a-303132333435', 'AAYmNkZWZHaKlqMDEyMzQ1'],
                ['61626364-6566-4768-a96a-303132333435', 'BhYmNkZWZHaKlqMDEyMzQ1'],
                ['00006364-6566-4768-a96a-303132333435', 'AAAGNkZWZHaKlqMDEyMzQ1'],
                ['ff626364-6566-4768-a96a-303132333435', 'D_YmNkZWZHaKlqMDEyMzQ1'],
                ['61626364-6566-4768-a96a-3031323334ff', 'BhYmNkZWZHaKlqMDEyMzT_'],
                ['ffff6364-6566-4768-a96a-303132333435', 'D__2NkZWZHaKlqMDEyMzQ1'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromUuidToBase64(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should convert from uuid to hexadecimal', () => {
            let data: stringString[] = [
                ['00626364-6566-4768-a96a-303132333435', '0062636465664768a96a303132333435'],
                ['61626364-6566-4768-a96a-303132333435', '6162636465664768a96a303132333435'],
                ['00006364-6566-4768-a96a-303132333435', '0000636465664768a96a303132333435'],
                ['ff626364-6566-4768-a96a-303132333435', 'ff62636465664768a96a303132333435'],
                ['61626364-6566-4768-a96a-3031323334ff', '6162636465664768a96a3031323334ff'],
                ['ffff6364-6566-4768-a96a-303132333435', 'ffff636465664768a96a303132333435'],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.fromUuidToHexString(input);
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly base64 encode input', () => {
            let data = new Uint8Array([97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53]);
            let expected = 'BhYmNkZWZHaKlqMDEyMzQ1';
            let sut = Uuid4.asBase64(data);
            expect(sut).to.be.a(typeof expected)
                       .and.to.have.lengthOf(expected.length)
                       .and.to.equal(expected);
            sut = Uuid4.asBase64();
            expect(sut).to.be.a('string')
                       .and.to.have.lengthOf(22);
        });
        it('should correctly base64 encode 0 inputs', () => {
            let data: arrayString[] = [
                [
                    [0, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'AAYmNkZWZHaKlqMDEyMzQ1',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 0],
                    'BhYmNkZWZHaKlqMDEyMzQA',
                ],
                [
                    [0, 0, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'AAAGNkZWZHaKlqMDEyMzQ1',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asBase64(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly base64 encode 255 inputs', () => {
            let data: arrayString[] = [
                [
                    [255, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'D_YmNkZWZHaKlqMDEyMzQ1',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 255],
                    'BhYmNkZWZHaKlqMDEyMzT_',
                ],
                [
                    [255, 255, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'D__2NkZWZHaKlqMDEyMzQ1',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asBase64(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly encode uuid', () => {
            let data = new Uint8Array([97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53]);
            let expected = '61626364-6566-4768-a96a-303132333435';
            let sut = Uuid4.asUuid(data);
            expect(sut).to.be.a(typeof expected)
                       .and.to.have.lengthOf(expected.length)
                       .and.to.equal(expected);
            sut = Uuid4.asUuid();
            expect(sut).to.be.a('string')
                       .and.to.have.lengthOf(36);
        });
        it('should correctly encode 0 inputs', () => {
            let data: arrayString[] = [
                [
                    [0, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    '00626364-6566-4768-a96a-303132333435',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 0],
                    '61626364-6566-4768-a96a-303132333400',
                ],
                [
                    [0, 0, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    '00006364-6566-4768-a96a-303132333435',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asUuid(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly encode 255 inputs', () => {
            let data: arrayString[] = [
                [
                    [255, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'ff626364-6566-4768-a96a-303132333435',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 255],
                    '61626364-6566-4768-a96a-3031323334ff',
                ],
                [
                    [255, 255, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'ffff6364-6566-4768-a96a-303132333435',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asUuid(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly hexadecimal encode input', () => {
            let data = new Uint8Array([97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53]);
            let expected = '6162636465664768a96a303132333435';
            let sut = Uuid4.asHexString(data);
            expect(sut).to.be.a(typeof expected)
                       .and.to.have.lengthOf(expected.length)
                       .and.to.equal(expected);
            sut = Uuid4.asHexString();
            expect(sut).to.be.a('string')
                       .and.to.have.lengthOf(32);
        });
        it('should correctly hexadecimal encode 0 inputs', () => {
            let data: arrayString[] = [
                [
                    [0, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    '0062636465664768a96a303132333435',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 0],
                    '6162636465664768a96a303132333400',
                ],
                [
                    [0, 0, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    '0000636465664768a96a303132333435',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asHexString(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should correctly hexadecimal encode 255 inputs', () => {
            let data: arrayString[] = [
                [
                    [255, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'ff62636465664768a96a303132333435',
                ],
                [
                    [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 255],
                    '6162636465664768a96a3031323334ff',
                ],
                [
                    [255, 255, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53],
                    'ffff636465664768a96a303132333435',
                ],
            ];
            for (const [input, expected] of data) {
                let sut = Uuid4.asHexString(new Uint8Array(input));
                expect(sut).to.be.a(typeof expected)
                           .and.to.have.lengthOf(expected.length)
                           .and.to.equal(expected);
            }
        });
        it('should have an object name of Uuid4', () => {
            return expect(Object.prototype.toString.call(new Uuid4())).to.equal('[object Uuid4]');
        });
        it('should throw range error for incorrect convert base64 to hexadecimal input', () => {
            let data: stringNumber[] = [
                ['AAYmNkZWZHaKlqMDEyMzQ', 21],
                ['BhYmNkZWZHaKlqMDEyMzQ11', 23],
                ['AAAGNkZWZHaKlqMDEyMz', 20],
                ['D_YmNkZWZHaKlqMDEyMzQ111', 24],
            ];
            for (const [input, len] of data) {
                let mess = `Expected base 64 number length of 22 characters but was given length: ${len}`;
                expect(() => Uuid4.fromBase64ToHexString(input))
                    .to.throw(RangeError, mess);
            }
        });
        it('should throw range error for incorrect convert hexadecimal to base64 input', () => {
            let data: stringNumber[] = [
                ['0062636465664768a96a30313233343', 31],
                ['6162636465664768a96a3031323334353', 33],
                ['0000636465664768a96a3031323334', 30],
                ['ff62636465664768a96a30313233343535', 34],
            ];
            for (const [input, len] of data) {
                let mess = `Expected hex string length of 32 characters but was given length: ${len}`;
                expect(() => Uuid4.fromHexStringToBase64(input))
                    .to.throw(RangeError, mess);
            }
        });
        it('should throw range error for incorrect convert hexadecimal to uuid input', () => {
            let data: stringNumber[] = [
                ['0062636465664768a96a30313233343', 31],
                ['6162636465664768a96a3031323334353', 33],
                ['0000636465664768a96a3031323334', 30],
                ['ff62636465664768a96a30313233343535', 34],
            ];
            for (const [input, len] of data) {
                let mess = `Expected hex string length of 32 characters but was given length: ${len}`;
                expect(() => Uuid4.fromHexStringToUuid(input))
                    .to.throw(RangeError, mess);
            }
        });
        it('should throw range error for long input', () => {
            let data = new Uint8Array([96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53]);
            expect(() => Uuid4.asBase64(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 17');
            expect(() => Uuid4.asHexString(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 17');
            expect(() => Uuid4.asUuid(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 17');
        });
        it('should throw range error for short input', () => {
            let data = new Uint8Array([98, 99, 100, 101, 102, 103, 104, 105, 106, 48, 49, 50, 51, 52, 53]);
            expect(() => Uuid4.asBase64(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 15');
            expect(() => Uuid4.asHexString(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 15');
            expect(() => Uuid4.asUuid(data))
                .to.throw(RangeError, 'Expected data array length of 16 but was given length: 15');
        });
    }
);
