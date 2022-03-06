import {expect} from 'chai';
import 'mocha';
import {Uuid4Gen} from '../src/Uuid4Gen';
import {Uuid4RangeError, Uuid4TypeError} from '../src/errors';

type MockData = {
    base64: string,
    bin: string,
    hex: string,
    uuid: string,
};
describe(
    'Uuid4Gen encode tests',
    () => {
        let mock: InstanceType<typeof Uuid4Gen>;
        const mockTank = new Uint8Array(
            [
                0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a,
                0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0, 0xa0,
                0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0,
                0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ],
        );
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
        const mockPump = (_: number) => mockTank;
        beforeEach(() => {
            mock = new Uuid4Gen(6, mockPump);
        });
        it('should correctly encode base64', () => {
            for (const {base64: expected} of mockData) {
                const sut = mock.asBase64();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should correctly encode binary', () => {
            for (const {bin: expected} of mockData) {
                const sut = mock.asBinString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
        it('should correctly encode hexadecimal', () => {
            for (const {hex: expected} of mockData) {
                const sut = mock.asHexString();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
            for (let i = 0; i < 5; i++) {
                const sut = (new Uuid4Gen()).asHexString();
                expect(sut).to.be.a('string')
                    .and.to.have.lengthOf(32);
            }
        });
        it('should correctly encode uuid', () => {
            for (const {uuid: expected} of mockData) {
                const sut = mock.asUuid();
                expect(sut).to.be.a(typeof expected)
                    .and.to.have.lengthOf(expected.length)
                    .and.to.equal(expected);
            }
        });
    },
);
describe(
    'Uuid4Gen tank tests',
    () => {
        it('should correctly refill tank with new random data when empty', function () {
            let ids: string[] = [];
            const source = new Uuid4Gen();
            for (let i = 0; i < 16; i++) {
                ids[i] = source.asBase64();
            }
            for (let i = 0; i < 16; i++) {
                const sut = source.asBase64();
                expect(ids).to.not.contain(sut);
            }
        });
    },
);
describe(
    'Uuid4Gen constructor error tests',
    () => {
        it('should throw type error when buckets is not an integer', function () {
            const deltas = [1.5, 5.25];
            for (const delta of deltas) {
                const message = `Depth must be an integer but received "${delta}" instead`;
                expect(() => new Uuid4Gen(delta))
                    .to.throw(Uuid4TypeError, message);
            }
        });
        it('should throw a range error when buckets is out of range', function () {
            const deltas = [-2, 0, 10000];
            for (const delta of deltas) {
                const message = `Depth must be between 4 and 8191 but received "${delta}" instead`;
                expect(() => new Uuid4Gen(delta))
                    .to.throw(Uuid4RangeError, message);
            }
        });
    },
);
