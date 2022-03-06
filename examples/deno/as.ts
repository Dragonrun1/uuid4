// @ts-ignore
import {Uuid4} from '../../deno_dist/Uuid4.ts';
const MyUuid4 = new Uuid4();
const base64 = MyUuid4.asBase64();
const bin = MyUuid4.asBinString();
const hex = MyUuid4.asHexString();
const uuid = MyUuid4.asUuid();
console.log('base64:');
console.log(base64);
console.log('bin:');
console.log(bin);
console.log('hex:');
console.log(hex);
console.log('uuid:');
console.log(uuid);
