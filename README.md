# uuid4

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![CI](https://github.com/Dragonrun1/uuid64ts/actions/workflows/main.yml/badge.svg)](https://github.com/Dragonrun1/uuid64ts/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/Dragonrun1/uuid64ts/badge.svg?branch=main)](https://coveralls.io/github/Dragonrun1/uuid64ts?branch=main)
![GitHub release](https://img.shields.io/github/v/release/Dragonrun1/uuid64ts?display_name=tag&sort=semver)

UUID v4 (random) Typescript/Javascript package with a custom base 64 encoding added.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install uuid4.

```bash
npm i @dragonrun1/uuid64ts
```

## Usage

```typescript
import {Uuid4} from 'Uuid4';

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
```

## Why make this project?

If this project was just another UUID v4 (random) library there would be
little point as there are already several fine ones out there for Typescript and
Javascript, but where they just do UUIDs this project targets being used with
databases as a primary key. To really understand the fuller background without
me having to reproduce it all here I'll just direct you to the PHP project that
inspired this one to be created:

[uuid64type](https://github.com/Dragonrun1/uuid64type)

There you will find a few paragraphs on why I started it and why I think a base
64 encoded UUID v4 has many benefits.

## Related Projects

[https://github.com/Dragonrun1/uuid64type](https://github.com/Dragonrun1/uuid64type)
The project that this project was made to be a translation of but ended up
causing a large re-write which became __uuid64type__'s version 2.0.

## Contributing

Please note that this project is released with a
[Contributor Code of Conduct](CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update or add tests as appropriate.

## License

[BSD-3-Clause](https://spdx.org/licenses/BSD-3-Clause.html)

Copyright © 2020-2022 Michael Cummings. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its
contributors may be used to endorse or promote products derived from this
software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
