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
export abstract class AbstractAs implements Uuid4As {
    public abstract asBinString(): string;
    public asBase64(): string {
        /**
         * Needs extra zero prefix so output is always 22 characters long.
         * @type {string} binString
         */
        const binString: string = '0000' + this.asBinString();
        let result = '';
        let pieces = [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            42,
            48,
            54,
            60,
            66,
            72,
            78,
            84,
            90,
            96,
            102,
            108,
            114,
            120,
            126,
        ];
        for (const piece of pieces) {
            const index = parseInt(binString.substring(piece, piece + 6), 2);
            result += this._base64[index];
        }
        return result;
    }
    public asHexString(): string {
        const binString = this.asBinString();
        let result = '';
        const pieces = [0, 16, 32, 48, 64, 80, 96, 112];
        for (const piece of pieces) {
            result += parseInt(binString.substring(piece, piece + 16), 2)
                .toString(16)
                .padStart(4, '0');
        }
        return result;
    }
    public asUuid(): string {
        const hexString = this.asHexString();
        const pieces = [8, 4, 4, 4, 12];
        let start = 0;
        let hexArray: string[] = [];
        for (const piece of pieces) {
            hexArray.push(hexString.substring(start, start + piece));
            start += piece;
        }
        return hexArray.join('-');
    }
    /**
     * Helper method to convert typed array of random data into a v4 UUID binary
     * string.
     *
     * @param binArray - 16 random unsigned integers to be converted.
     * @returns The newly minted UUID as a binary string.
     * @protected
     */
    protected _toUuidBinString(binArray: Uint8Array): string {
        binArray[6] = binArray[6] & 0x0f | 0x40;
        binArray[8] = binArray[8] & 0x3f | 0x80;
        let binary = '';
        for (const piece of binArray) {
            binary += piece.toString(2).padStart(8, '0');
        }
        return binary;
    }
    // noinspection SpellCheckingInspection
    /**
     * Used in mapping binary to/from base 64 during encoding.
     *
     * @type {string}
     * @protected
     */
    protected readonly _base64: string =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
}

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
    public get [Symbol.toStringTag]() {
        return 'Uuid4';
    }
    private __uuid0?: string;
    private readonly __uuid0Source: RandomSourceFunction;
}

/**
 * Acts as a common source of new UUID4s in many string forms.
 *
 * Meant to be use when several UUIDs are needed quickly in groups with minimal
 * delay caused by waiting for the random source entropy to refill.
 *
 * A common use would be as a random ID generator for a database.
 */
export class Uuid4Gen extends AbstractAs {
    /**
     * Constructor
     *
     * @remarks
     * The default depth of 16 was chosen as a best 'guess-estimate' trade off
     * between memory use and random data entropy delay amortization which is
     * expect with most workloads.
     *
     * If used as a source of UUIDs for tasks like frequent bulk database
     * inserts etc. then testing with larger values is recommended to find the
     * best trade off for your work load.
     *
     * @param depth - Maximum number of UUIDs to reserve for quick access.
     * @param source - Optional function to be used as a source of random
     * unsigned integers in a typed array. If not given it will default to
     * {@link randomPump()}.
     *
     * @throws {@link Uuid4RangeError}
     * when depth is not between 4 and 8191.
     * @throws {@link Uuid4TypeError}
     * when depth is not an integer.
     */
    public constructor(depth: number = 16, source?: RandomSourceFunction) {
        super();
        // noinspection SuspiciousTypeOfGuard
        if (typeof depth !== 'number' || depth !== Math.floor(depth)) {
            const message =
                `Depth must be an integer but received "${depth}" instead`;
            throw new Uuid4TypeError(message);
        }
        if (depth < 4 || depth > 8191) {
            const message =
                `Depth must be between 4 and 8191 but received "${depth}" instead`;
            throw new Uuid4RangeError(message);
        }
        this.__depth = depth;
        this.__randomSource = source ?? randomPump;
        this.__tank = this.__randomSource(depth);
        this.__currentBucket = this.__tank.length / 16 - 1;
    }
    public asBinString(): string {
        if (this.__currentBucket < 0) {
            // Need to refill the tank.
            this.__tank = this.__randomSource(this.__depth);
            this.__currentBucket = this.__tank.length / 16 - 1;
        }
        const start = this.__currentBucket * 16;
        const end = (this.__currentBucket + 1) * 16;
        // Move on to a new bucket for next call.
        this.__currentBucket -= 1;
        const binArray = this.__tank.subarray(start, end);
        return this._toUuidBinString(binArray);
    }
    public get [Symbol.toStringTag]() {
        return 'Uuid4Gen';
    }
    private __currentBucket: number;
    private readonly __depth: number;
    private readonly __randomSource: RandomSourceFunction;
    private __tank: Uint8Array;
}

/**
 * Used when the given input v4 UUID can not be decoded correctly.
 */
export class Uuid4DecodingError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Used when the given input is not a valid v4 UUID value.
 */
export class Uuid4InvalidUuidError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Used when a given parameter value is outside it's allowed range.
 */
export class Uuid4RangeError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Used when a known random source can not be found.
 */
export class Uuid4SourceMissingError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Used when a given parameter has the wrong type.
 */
export class Uuid4TypeError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Delivers a limited number of (pseudo-)random unsigned 8 bit integers in a typed array.
 *
 * @remarks
 * **Note**: As a pumping guild member I promise to only use the best source of
 * (pseudo-)random integers available and will refuse to deliver from any
 * unknown sources.
 *
 * @param {number} buckets - Each 'bucket' consists of 16 unsigned integers in
 * the returned array.
 *
 * @returns {Uint8Array} - Returns buckets * 16 unsigned integers in a typed array.
 *
 * @throws {@link Uuid4RangeError}
 * when requested number of buckets is not between 1 and 8191.
 * @throws {@link Uuid4SourceMissingError}
 * when no known (pseudo-)random source is found.
 * @throws {@link Uuid4TypeError}
 * when buckets is not an integer.
 */
export function randomPump(buckets: number): Uint8Array {
    // noinspection SuspiciousTypeOfGuard
    if (typeof buckets !== 'number' || buckets !== Math.floor(buckets)) {
        const message =
            `Pumping guild rules limit me to delivering only full buckets but received one for "${buckets}" buckets instead`;
        throw new Uuid4TypeError(message);
    }
    if (buckets < 1 || buckets > 8191) {
        const message =
            `Pumping guild rules limit me to delivering between 1 and 8191 buckets but received one for "${buckets}" buckets instead`;
        throw new Uuid4RangeError(message);
    }
    const size = buckets * 16;
    let uint: Uint8Array;
    if (isBrowser || isWebWorker) {
        uint = new Uint8Array(size);
        // @ts-ignore
        (crypto || msCrypto).getRandomValues(uint);
    } else if (isNode) {
        const crypto = require('crypto');
        uint = Uint8Array.from(crypto.randomBytes(size));
    } else if (isDeno) {
        uint = new Uint8Array(size);
        crypto.getRandomValues(uint);
    } else {
        const message = 'Could not find a known random bucket pumping source';
        throw new Uuid4SourceMissingError(message);
    }
    return uint;
}

export interface AsBinString {
    /**
     * Provides a v4 (random) UUID as a binary string.
     *
     * @returns A UUIDv4 as a binary string ('0's and '1's only) that is 128
     * characters long.
     */
    asBinString(): string;
}

export interface Uuid4As extends AsBinString {
    /**
     * Provides a v4 (random) UUID as a custom base 64 encoded string.
     *
     * @returns A UUIDv4 in a custom base 64 encoded string that is 22
     * characters long.
     */
    asBase64(): string;
    /**
     * Provides a v4 (random) UUID as a hexadecimal string.
     *
     * @returns A UUIDv4 as a hexadecimal (base 16) string that is 32 characters
     * long and contains no '-'s.
     */
    asHexString(): string;
    /**
     * Provides a v4 (random) UUID as a hexadecimal string with dashes.
     *
     * @returns A UUIDv4 as a hexadecimal (base 16) string that is 36 characters
     * long and contains '-'s in the standard 8-4-4-4-12 digits format.
     */
    asUuid(): string;
}

export interface Uuid4From {
    /**
     * Receives a v4 (random) UUID as a custom base 64 encoded string.
     *
     * @param inp - A 22 character long string containing the custom encoding
     * UUID.
     * @param validate - Determines if the inp parameter should be validate as a
     * v4 (random) UUID.
     *
     * @throws {@link Uuid4DecodingError}
     * when inp contains any characters that are not valid for the custom base
     * 64 used.
     * @throws {@link Uuid4InvalidUuidError}
     * when validate = true and inp is not a valid v4 UUID value.
     * @throws {@link Uuid4RangeError}
     * when inp is not 22 characters long.
     */
    fromBase64(inp: string, validate: boolean): void;
    /**
     * Receives a v4 (random) UUID as a binary string.
     *
     * @param inp - A 128 character long string containing the binary encoding
     * UUID.
     * @param validate - Determines if the inp parameter should be validate as a
     * v4 (random) UUID.
     *
     * @throws {@link Uuid4DecodingError}
     * when inp contains anything but '1's and '0's.
     * @throws {@link Uuid4InvalidUuidError}
     * when validate = true and inp is not a valid v4 UUID value.
     * @throws {@link Uuid4RangeError}
     * when inp is not 128 characters long.
     */
    fromBinString(inp: string, validate: boolean): void;
    /**
     * Receives a v4 (random) UUID as a hexadecimal string.
     *
     * @param inp - A 32 character long string containing the hexadecimal
     * encoding UUID. The digits 'A-F' are not case-insensitive.
     * @param validate - Determines if the inp parameter should be validate as a
     * v4 (random) UUID.
     *
     * @throws {@link Uuid4DecodingError}
     * when inp contains anything but hexadecimal digits.
     * @throws {@link Uuid4InvalidUuidError}
     * when validate = true and inp is not a valid v4 UUID value.
     * @throws {@link Uuid4RangeError}
     * when inp is not 32 characters long.
     */
    fromHexString(inp: string, validate: boolean): void;
    /**
     * Receives a v4 (random) UUID as a hexadecimal string with dashes.
     *
     * @param inp - A 36 character long string containing a hexadecimal UUID.
     * The digits 'A-F' are not case-insensitive.
     * @param validate - Determines if the inp parameter should be validate as a
     * v4 (random) UUID.
     *
     * @throws {@link Uuid4DecodingError}
     * when inp contains anything but hexadecimal digits or if dashes are
     * missing or misplaced.
     * @throws {@link Uuid4InvalidUuidError}
     * when validate = true and inp is not a valid v4 UUID value.
     * @throws {@link Uuid4RangeError}
     * when inp is not 36 characters long.
     */
    fromUuid4(inp: string, validate: boolean): void;
}

export type RandomSourceFunction = typeof randomPump;
export const isBrowser = typeof window !== 'undefined' &&
    typeof window.document !== 'undefined';
export const isNode = typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;
export const isWebWorker = typeof self === 'object' &&
    self.constructor &&
    self.constructor.name === 'DedicatedWorkerGlobalScope';
export const isDeno =
    // @ts-ignore
    typeof Deno !== 'undefined' &&
    // @ts-ignore
    typeof Deno.core !== 'undefined';
