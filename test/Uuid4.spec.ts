import {expect} from 'chai';
import 'mocha';
import {Uuid4} from '../src/Uuid4.js';
import {Uuid4DecodingError, Uuid4InvalidUuidError, Uuid4RangeError} from '../src/errors.js';
import {RandomSourceFunction} from '../src/types.js';

type MockData = {
    base64: string,
    bin: string,
    hex: string,
    uint?: Uint8Array,
    uuid: string,
};
describe(
    'Uuid4 encode tests',
    () => {
        const mockData: MockData[] = [
            {
                base64: 'AAAAAAAABAAIAAAAAAAAAA',
                bin: '00000000000000000000000000000000000000000000000001000000000000001000000000000000000000000000000000000000000000000000000000000000',
                hex: '00000000000040008000000000000000',
                uint: new Uint8Array([
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                ]),
                uuid: '00000000-0000-4000-8000-000000000000',
            },
            {
                base64: 'D_______9P_7__________',
                bin: '11111111111111111111111111111111111111111111111101001111111111111011111111111111111111111111111111111111111111111111111111111111',
                hex: 'ffffffffffff4fffbfffffffffffffff',
                uint: new Uint8Array([
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                ]),
                uuid: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
            },
            {
                base64: 'APDw8PDw9PD48PDw8PDw8P',
                bin: '00001111000011110000111100001111000011110000111101001111000011111000111100001111000011110000111100001111000011110000111100001111',
                hex: '0f0f0f0f0f0f4f0f8f0f0f0f0f0f0f0f',
                uint: new Uint8Array([
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                    0x0f,
                ]),
                uuid: '0f0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f0f',
            },
            {
                base64: 'Dw8PDw8PBA8LDw8PDw8PDw',
                bin: '11110000111100001111000011110000111100001111000001000000111100001011000011110000111100001111000011110000111100001111000011110000',
                hex: 'f0f0f0f0f0f040f0b0f0f0f0f0f0f0f0',
                uint: new Uint8Array([
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                    0xf0,
                ]),
                uuid: 'f0f0f0f0-f0f0-40f0-b0f0-f0f0f0f0f0f0',
            },
            {
                base64: 'CgoKCgoKBAoKCgoKCgoKCg',
                bin: '10100000101000001010000010100000101000001010000001000000101000001010000010100000101000001010000010100000101000001010000010100000',
                hex: 'a0a0a0a0a0a040a0a0a0a0a0a0a0a0a0',
                uint: new Uint8Array([
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                    0xa0,
                ]),
                uuid: 'a0a0a0a0-a0a0-40a0-a0a0-a0a0a0a0a0a0',
            },
            {
                base64: 'AKCgoKCgpKCooKCgoKCgoK',
                bin: '00001010000010100000101000001010000010100000101001001010000010101000101000001010000010100000101000001010000010100000101000001010',
                hex: '0a0a0a0a0a0a4a0a8a0a0a0a0a0a0a0a',
                uint: new Uint8Array([
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                    0x0a,
                ]),
                uuid: '0a0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a0a',
            },
        ];
        it('should correctly encode base64', () => {
            for (const {base64: expected, uint: inp} of mockData) {
                const pump = ((_: number) => inp) as RandomSourceFunction;
                const sut = (new Uuid4(pump)).asBase64();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
            for (let i = 0; i < 5; i++) {
                const sut = (new Uuid4()).asBase64();
                expect(sut).to.be.a('string')
                    .and.to.have.lengthOf(22);
            }
        });
        it('should correctly encode binary', () => {
            for (const {bin: expected, uint: inp} of mockData) {
                const pump = ((_: number) => inp) as RandomSourceFunction;
                const sut = (new Uuid4(pump)).asBinString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
            for (let i = 0; i < 5; i++) {
                const sut = (new Uuid4()).asBinString();
                expect(sut).to.be.a('string')
                    .and.to.have.lengthOf(128);
            }
        });
        it('should correctly encode hexadecimal', () => {
            for (const {hex: expected, uint: inp} of mockData) {
                const pump = ((_: number) => inp) as RandomSourceFunction;
                const sut = (new Uuid4(pump)).asHexString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
            for (let i = 0; i < 5; i++) {
                const sut = (new Uuid4()).asHexString();
                expect(sut).to.be.a('string')
                    .and.to.have.lengthOf(32);
            }
        });
        it('should correctly encode uuid', () => {
            for (const {uuid: expected, uint: inp} of mockData) {
                const pump = ((_: number) => inp) as RandomSourceFunction;
                const sut = (new Uuid4(pump)).asUuid();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
            for (let i = 0; i < 5; i++) {
                const sut = (new Uuid4()).asUuid();
                expect(sut).to.be.a('string')
                    .and.to.have.lengthOf(36);
            }
        });
    },
);
// noinspection DuplicatedCode
describe(
    'Uuid4 conversion tests',
    () => {
        let mock: InstanceType<typeof Uuid4>;
        const mockData: MockData[] = [
            {
                base64: 'AAAAAAAABAAIAAAAAAAAAA',
                bin: '00000000000000000000000000000000000000000000000001000000000000001000000000000000000000000000000000000000000000000000000000000000',
                hex: '00000000000040008000000000000000',
                uuid: '00000000-0000-4000-8000-000000000000',
            },
            {
                base64: 'D_______9P_7__________',
                bin: '11111111111111111111111111111111111111111111111101001111111111111011111111111111111111111111111111111111111111111111111111111111',
                hex: 'ffffffffffff4fffbfffffffffffffff',
                uuid: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
            },
            {
                base64: 'APDw8PDw9PD48PDw8PDw8P',
                bin: '00001111000011110000111100001111000011110000111101001111000011111000111100001111000011110000111100001111000011110000111100001111',
                hex: '0f0f0f0f0f0f4f0f8f0f0f0f0f0f0f0f',
                uuid: '0f0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f0f',
            },
            {
                base64: 'Dw8PDw8PBA8LDw8PDw8PDw',
                bin: '11110000111100001111000011110000111100001111000001000000111100001011000011110000111100001111000011110000111100001111000011110000',
                hex: 'f0f0f0f0f0f040f0b0f0f0f0f0f0f0f0',
                uuid: 'f0f0f0f0-f0f0-40f0-b0f0-f0f0f0f0f0f0',
            },
            {
                base64: 'CgoKCgoKBAoKCgoKCgoKCg',
                bin: '10100000101000001010000010100000101000001010000001000000101000001010000010100000101000001010000010100000101000001010000010100000',
                hex: 'a0a0a0a0a0a040a0a0a0a0a0a0a0a0a0',
                uuid: 'a0a0a0a0-a0a0-40a0-a0a0-a0a0a0a0a0a0',
            },
            {
                base64: 'AKCgoKCgpKCooKCgoKCgoK',
                bin: '00001010000010100000101000001010000010100000101001001010000010101000101000001010000010100000101000001010000010100000101000001010',
                hex: '0a0a0a0a0a0a4a0a8a0a0a0a0a0a0a0a',
                uuid: '0a0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a0a',
            },
        ];
        beforeEach(() => {
            mock = new Uuid4();
        });
        it('should convert from base64 to binary', () => {
            for (const {base64: inp, bin: expected} of mockData) {
                mock.fromBase64(inp);
                const sut = mock.asBinString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from base64 to hexadecimal', () => {
            for (const {base64: inp, hex: expected} of mockData) {
                mock.fromBase64(inp);
                const sut = mock.asHexString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from base64 to uuid', () => {
            for (const {base64: inp, uuid: expected} of mockData) {
                mock.fromBase64(inp);
                const sut = mock.asUuid();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from binary to base64', () => {
            for (const {bin: inp, base64: expected} of mockData) {
                mock.fromBinString(inp);
                const sut = mock.asBase64();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from binary to hexadecimal', () => {
            for (const {bin: inp, hex: expected} of mockData) {
                mock.fromBinString(inp);
                const sut = mock.asHexString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from binary to uuid', () => {
            for (const {bin: inp, uuid: expected} of mockData) {
                mock.fromBinString(inp);
                const sut = mock.asUuid();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from hexadecimal to base64', () => {
            for (const {hex: inp, base64: expected} of mockData) {
                mock.fromHexString(inp);
                const sut = mock.asBase64();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from hexadecimal to binary', () => {
            for (const {hex: inp, bin: expected} of mockData) {
                mock.fromHexString(inp);
                const sut = mock.asBinString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from hexadecimal to uuid', () => {
            for (const {hex: inp, uuid: expected} of mockData) {
                mock.fromHexString(inp);
                const sut = mock.asUuid();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from uuid to base64', () => {
            for (const {uuid: inp, base64: expected} of mockData) {
                mock.fromUuid4(inp);
                const sut = mock.asBase64();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from uuid to binary', () => {
            for (const {uuid: inp, bin: expected} of mockData) {
                mock.fromUuid4(inp);
                const sut = mock.asBinString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should convert from uuid to hexadecimal', () => {
            for (const {uuid: inp, hex: expected} of mockData) {
                mock.fromUuid4(inp);
                const sut = mock.asHexString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
    },
);
// noinspection DuplicatedCode
describe(
    'Uuid4 error tests',
    () => {
        let mock: InstanceType<typeof Uuid4>;
        const mockData: MockData[] = [
            {
                base64: 'AAAAAAAABAAIAAAAAAAAAA',
                bin: '00000000000000000000000000000000000000000000000001000000000000001000000000000000000000000000000000000000000000000000000000000000',
                hex: '00000000000040008000000000000000',
                uuid: '00000000-0000-4000-8000-000000000000',
            },
            {
                base64: 'D_______9P_7__________',
                bin: '11111111111111111111111111111111111111111111111101001111111111111011111111111111111111111111111111111111111111111111111111111111',
                hex: 'ffffffffffff4fffbfffffffffffffff',
                uuid: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
            },
            {
                base64: 'APDw8PDw9PD48PDw8PDw8P',
                bin: '00001111000011110000111100001111000011110000111101001111000011111000111100001111000011110000111100001111000011110000111100001111',
                hex: '0f0f0f0f0f0f4f0f8f0f0f0f0f0f0f0f',
                uuid: '0f0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f0f',
            },
            {
                base64: 'Dw8PDw8PBA8LDw8PDw8PDw',
                bin: '11110000111100001111000011110000111100001111000001000000111100001011000011110000111100001111000011110000111100001111000011110000',
                hex: 'f0f0f0f0f0f040f0b0f0f0f0f0f0f0f0',
                uuid: 'f0f0f0f0-f0f0-40f0-b0f0-f0f0f0f0f0f0',
            },
            {
                base64: 'CgoKCgoKBAoKCgoKCgoKCg',
                bin: '10100000101000001010000010100000101000001010000001000000101000001010000010100000101000001010000010100000101000001010000010100000',
                hex: 'a0a0a0a0a0a040a0a0a0a0a0a0a0a0a0',
                uuid: 'a0a0a0a0-a0a0-40a0-a0a0-a0a0a0a0a0a0',
            },
            {
                base64: 'AKCgoKCgpKCooKCgoKCgoK',
                bin: '00001010000010100000101000001010000010100000101001001010000010101000101000001010000010100000101000001010000010100000101000001010',
                hex: '0a0a0a0a0a0a4a0a8a0a0a0a0a0a0a0a',
                uuid: '0a0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a0a',
            },
        ];
        beforeEach(() => {
            mock = new Uuid4();
        });
        it('should throw range error for incorrect size input given to fromBase64', () => {
            const deltas = [20, 21, 23, 24];
            for (const delta of deltas) {
                for (const {base64: src} of mockData) {
                    const inp = (src.substring(0, 20)).padEnd(delta, '0');
                    const mess = `'inp' must be 22 characters long, but was '${delta}' long instead`;
                    expect(() => mock.fromBase64(inp))
                        .to.throw(Uuid4RangeError, mess);
                }
            }
        });
        it('should throw range error for incorrect size input given to fromBinString', () => {
            const deltas = [126, 127, 129, 130];
            for (const delta of deltas) {
                for (const {bin: src} of mockData) {
                    const inp = (src.substring(0, 126)).padEnd(delta, '0');
                    const mess = `'inp' must be 128 characters long, but was '${delta}' long instead`;
                    expect(() => mock.fromBinString(inp))
                        .to.throw(Uuid4RangeError, mess);
                }
            }
        });
        it('should throw range error for incorrect size input given to fromHexString', () => {
            const deltas = [30, 31, 33, 34];
            for (const delta of deltas) {
                for (const {hex: src} of mockData) {
                    const inp = (src.substring(0, 30)).padEnd(delta, '0');
                    const mess = `'inp' must be 32 characters long, but was '${delta}' long instead`;
                    expect(() => mock.fromHexString(inp))
                        .to.throw(Uuid4RangeError, mess);
                }
            }
        });
        it('should throw range error for incorrect size input given to fromUuid4', () => {
            const deltas = [34, 35, 37, 39];
            for (const delta of deltas) {
                for (const {hex: src} of mockData) {
                    const inp = (src.substring(0, 34)).padEnd(delta, '0');
                    const mess = `'inp' must be 36 characters long, but was '${delta}' long instead`;
                    expect(() => mock.fromUuid4(inp))
                        .to.throw(Uuid4RangeError, mess);
                }
            }
        });
        it('should throw decoding error for invalid input given to fromBase64', () => {
            const message = '\'inp\' is not a base64 UUID as it contains invalid characters';
            const deltas = ['^', '@', '#', '$'];
            for (const delta of deltas) {
                for (const {base64: src} of mockData) {
                    const inp = delta + src.substring(1);
                    expect(() => mock.fromBase64(inp))
                        .to.throw(Uuid4DecodingError, message);
                }
            }
        });
        it('should throw decoding error for invalid input given to fromBinString', () => {
            const message = '\'inp\' is not a binary UUID as it contains something other than \'1\'s and \'0\'s';
            const deltas = ['^', '@', '#', '$'];
            for (const delta of deltas) {
                for (const {bin: src} of mockData) {
                    const inp = delta + src.substring(1);
                    expect(() => mock.fromBinString(inp))
                        .to.throw(Uuid4DecodingError, message);
                }
            }
        });
        it('should throw decoding error for invalid input given to fromHexString', () => {
            const message = '\'inp\' is not a hexadecimal UUID as it contains invalid characters';
            const deltas = ['^', '@', '#', '$'];
            for (const delta of deltas) {
                for (const {hex: src} of mockData) {
                    const inp = delta + src.substring(1);
                    expect(() => mock.fromHexString(inp))
                        .to.throw(Uuid4DecodingError, message);
                }
            }
        });
        it('should throw decoding error for invalid input given to fromUuid4', () => {
            const message = '\'inp\' is not a standard UUID as it contains invalid characters';
            const deltas = ['^', '@', '#', '$'];
            for (const delta of deltas) {
                for (const {uuid: src} of mockData) {
                    const inp = delta + src.substring(1);
                    expect(() => mock.fromUuid4(inp))
                        .to.throw(Uuid4DecodingError, message);
                }
            }
            const message2 = '\'inp\' is not a standard UUID as it is missing \'-\'s or they are misplaced';
            const deltas2 = [8, 13, 18, 23];
            for (const delta of deltas2) {
                for (const {uuid: src} of mockData) {
                    const inp = src.substring(0, delta) + '#' + src.substring(delta + 1);
                    expect(() => mock.fromUuid4(inp))
                        .to.throw(Uuid4DecodingError, message2);
                }
            }
        });
        it('should throw invalid error for non-v4 uuid input given to fromBase64 when validating', () => {
            const message = '\'inp\' is not a valid v4 (random) UUID';
            let deltas = ['CP', 'DP', 'EP', 'B_'];
            for (const delta of deltas) {
                for (const {base64: src} of mockData) {
                    const inp = src.substring(0, 8) + delta + src.substring(10);
                    expect(() => mock.fromBase64(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
            deltas = ['A', 'Q', 'w'];
            for (const delta of deltas) {
                for (const {base64: src} of mockData) {
                    const inp = src.substring(0, 11) + delta + src.substring(12);
                    expect(() => mock.fromBase64(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
        });
        it('should throw invalid error for non-v4 uuid input given to fromBinString when validating', () => {
            const message = '\'inp\' is not a valid v4 (random) UUID';
            const deltas = [48, 50, 51, 65];
            for (const delta of deltas) {
                for (const {bin: src} of mockData) {
                    const inp = src.substring(0, delta) + '1' + src.substring(delta + 1);
                    expect(() => mock.fromBinString(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
        });
        it('should throw invalid error for non-v4 uuid input given to fromHexString when validating', () => {
            const message = '\'inp\' is not a valid v4 (random) UUID';
            // 1100 1000 0110 0101
            let deltas = ['c', '8', '6', '5'];
            for (const delta of deltas) {
                for (const {hex: src} of mockData) {
                    const inp = src.substring(0, 12) + delta + src.substring(13);
                    expect(() => mock.fromHexString(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
            // 1100 0100 0000
            deltas = ['c', '4', '0'];
            for (const delta of deltas) {
                for (const {hex: src} of mockData) {
                    const inp = src.substring(0, 16) + delta + src.substring(17);
                    expect(() => mock.fromHexString(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
        });
        it('should throw invalid error for non-v4 uuid input given to fromUuid4 when validating', () => {
            const message = '\'inp\' is not a valid v4 (random) UUID';
            // 1100 1000 0110 0101
            let deltas = ['c', '8', '6', '5'];
            for (const delta of deltas) {
                for (const {uuid: src} of mockData) {
                    const inp = src.substring(0, 14) + delta + src.substring(15);
                    expect(() => mock.fromUuid4(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
            // 1100 0100 0000
            deltas = ['c', '4', '0'];
            for (const delta of deltas) {
                for (const {uuid: src} of mockData) {
                    const inp = src.substring(0, 19) + delta + src.substring(20);
                    expect(() => mock.fromUuid4(inp, true))
                        .to.throw(Uuid4InvalidUuidError, message);
                }
            }
        });
    },
);
