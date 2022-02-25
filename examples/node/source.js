const {Uuid4Gen} = require('../../dist/Uuid4');
const MyUuid4 = new Uuid4Gen();
// noinspection DuplicatedCode
for (let i = 0; i < 8; i++) {
    const base64 = MyUuid4.asBase64();
    const bin = MyUuid4.asBinString();
    const hex = MyUuid4.asHexString();
    const uuid = MyUuid4.asUuid();
    console.log();
    console.log(`Group #${i + 1}:`);
    console.log('base64:');
    console.log(base64);
    console.log('bin:');
    console.log(bin);
    console.log('hex:');
    console.log(hex);
    console.log('uuid:');
    console.log(uuid);
}
