/**
 * Copyright (c) 2020-2022 Michael Cummings. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation and/or
 * other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * You should have received a copy of the BSD-3 Clause License along with
 * this program. If not, see
 * <https://spdx.org/licenses/BSD-3-Clause.html>.
 *
 * You should be able to find a copy of this license in the LICENSE file.
 *
 * @author    Michael Cummings <dragonrun1@gmail.com>
 * @copyright 2020-2022 Michael Cummings
 * @license   BSD-3-Clause
 */

import {AbstractAs} from './AbstractAs.js';
import {Uuid4DecodingError, Uuid4InvalidUuidError, Uuid4RangeError} from './errors.js';
import {Uuid4From} from './interfaces.js';
import {RandomSourceFunction} from './types.js';
import {randomPump} from './utils.js';
/**
 * Provides a single UUIDv4 in multiple formats.
 *
 * @remarks
 * Should **not** be used in most cases if you are needing multiple UUIDs as it
 * does a fair amount of extra work in addition to the overhead from spinning up
 * the new class instance. In most cases the {@link Uuid4Gen} class makes
 * better sense when you just need to generate (source) several UUIDs especially
 * in groups.
 */
export class Uuid4 extends AbstractAs implements Uuid4From {
    /**
     * Constructor
     *
     * @param {RandomSourceFunction} source - Optional function to be used as a
     * source of random unsigned integers in a typed array. If not given
     * defaults to randomPump().
     */
    public constructor(source?: RandomSourceFunction) {
        super();
        this.__uuid0Source = source ?? randomPump;
    }
    public asBinString(): string {
        if (this.__uuid0 === undefined) {
            this.__uuid0 = this._toUuidBinString(this.__uuid0Source(1));
        }
        return this.__uuid0;
    }
    fromBase64(inp: string, validate: boolean = false): void {
        if (22 !== inp.length) {
            const message =
                `'inp' must be 22 characters long, but was '${inp.length}' long instead`;
            throw new Uuid4RangeError(message);
        }
        let binString = '';
        for (let i = 0, len = inp.length; i < len; ++i) {
            const index = this._base64.indexOf(inp[i]);
            if (index === -1) {
                const message =
                    "'inp' is not a base64 UUID as it contains invalid characters";
                throw new Uuid4DecodingError(message);
            }
            binString += index.toString(2).padStart(6, '0');
        }
        // Cut off leading 4 bit zero padding.
        binString = binString.substring(4);
        if (
            validate &&
            !(binString.slice(48, 52) === '0100' && binString.slice(64, 66) === '10')
        ) {
            const message = "'inp' is not a valid v4 (random) UUID";
            throw new Uuid4InvalidUuidError(message);
        }
        this.__uuid0 = binString;
    }
    fromBinString(inp: string, validate: boolean = false): void {
        if (inp.length !== 128) {
            const message =
                `'inp' must be 128 characters long, but was '${inp.length}' long instead`;
            throw new Uuid4RangeError(message);
        }
        const binString = inp.replace(/[^10]/g, '');
        if (binString.length !== 128) {
            const message =
                "'inp' is not a binary UUID as it contains something other than '1's and '0's";
            throw new Uuid4DecodingError(message);
        }
        if (
            validate &&
            !(binString.slice(48, 52) === '0100' && binString.slice(64, 66) === '10')
        ) {
            const message = "'inp' is not a valid v4 (random) UUID";
            throw new Uuid4InvalidUuidError(message);
        }
        this.__uuid0 = binString;
    }
    fromHexString(inp: string, validate: boolean = false): void {
        if (inp.length !== 32) {
            const message =
                `'inp' must be 32 characters long, but was '${inp.length}' long instead`;
            throw new Uuid4RangeError(message);
        }
        const hexString = inp.replace(/[^a-zA-Z0-9]/g, '');
        if (hexString.length !== 32) {
            const message =
                "'inp' is not a hexadecimal UUID as it contains invalid characters";
            throw new Uuid4DecodingError(message);
        }
        let pieces = [0, 4, 8, 12, 16, 20, 24, 28];
        let binString = '';
        for (const piece of pieces) {
            binString += parseInt(hexString.substring(piece, piece + 4), 16)
                .toString(2)
                .padStart(16, '0');
        }
        if (
            validate &&
            !(binString.slice(48, 52) === '0100' && binString.slice(64, 66) === '10')
        ) {
            const message = "'inp' is not a valid v4 (random) UUID";
            throw new Uuid4InvalidUuidError(message);
        }
        this.__uuid0 = binString;
    }
    fromUuid4(inp: string, validate: boolean = false): void {
        if (inp.length !== 36) {
            const message =
                `'inp' must be 36 characters long, but was '${inp.length}' long instead`;
            throw new Uuid4RangeError(message);
        }
        if (
            inp[8] !== '-' || inp[13] !== '-' || inp[18] !== '-' || inp[23] !== '-'
        ) {
            const message =
                "'inp' is not a standard UUID as it is missing '-'s or they are misplaced";
            throw new Uuid4DecodingError(message);
        }
        try {
            this.fromHexString(inp.replace(/-/g, ''), validate);
        } catch (err) {
            if (err instanceof Uuid4DecodingError) {
                const message =
                    "'inp' is not a standard UUID as it contains invalid characters";
                throw new Uuid4DecodingError(message);
            } else {
                throw err;
            }
        }
    }
    /* c8 ignore next 3 */
    public get [Symbol.toStringTag]() {
        return 'Uuid4';
    }
    private __uuid0?: string;
    private readonly __uuid0Source: RandomSourceFunction;
}
