/**
 * Copyright (c) 2020 Michael Cummings. All rights reserved.
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
 * @copyright 2020 Michael Cummings
 * @license   BSD-3-Clause
 */
/**
 * Main UUID v4 (random) class.
 */
export class Uuid4 {
    /**
     * Generate a custom base 64 encoded UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a custom base 64 encoded UUID v4.
     */
    public static asBase64(data?: Uint8Array): string {
        // Add an initial 4 bit zero pad so result is always 22 chars long.
        const binString = '0000' + Uuid4._asBinString(data);
        let result = '';
        let pieces = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126];
        for (const piece of pieces) {
            result += Uuid4._base64[binString.substr(piece, 6)];
        }
        return result;
    }
    /**
     * Generate a hexadecimal encoded UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a hexadecimal encoded UUID v4.
     */
    public static asHexString(data?: Uint8Array): string {
        const binString = Uuid4._asBinString(data);
        let hexString = '';
        const pieces = [0, 16, 32, 48, 64, 80, 96, 112];
        for (const piece of pieces) {
            hexString += parseInt(binString.substr(piece, 16), 2)
                .toString(16)
                .padStart(4, '0');
        }
        return hexString;
    }
    /**
     * Generate a standard UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a standard UUID v4.
     */
    public static asUuid(data?: Uint8Array): string {
        const hex = Uuid4.asHexString(data);
        return Uuid4.fromHexStringToUuid(hex);
    }
    /**
     * Convert from a base 64 encoded to a hexadecimal encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data A base 64 encoded UUID.
     * @returns {string} Returns a hexadecimal encoded UUID.
     */
    public static fromBase64ToHexString(data: string): string {
        if (22 !== data.length) {
            const mess = `Expected base 64 number length of 22 characters but was given length: ${data.length}`;
            throw new RangeError(mess);
        }
        // Need switched keys and values so reverse lookups can be done.
        let flipped: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(Uuid4._base64)) {
            flipped[value] = key;
        }
        let binString = '';
        for (let i = 0, len = data.length; i < len; ++i) {
            binString += flipped[data[i]];
        }
        // Cut off 4 bit zero padding.
        binString = binString.substr(-128);
        let hexString = '';
        const pieces = [0, 32, 64, 96];
        for (const piece of pieces) {
            hexString += parseInt(binString.substr(piece, 32), 2)
                .toString(16)
                .padStart(8, '0');
        }
        return hexString;
    }
    /**
     * Convert from a base 64 encoded to a standard UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The base 64 encoded UUID.
     * @returns {string} Returns a standard UUID.
     */
    public static fromBase64ToUuid(data: string): string {
        const hexString = Uuid4.fromBase64ToHexString(data);
        return Uuid4.fromHexStringToUuid(hexString);
    }
    /**
     * Convert from a hexadecimal encoded to a base 64 encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The hexadecimal encoded UUID.
     * @returns {string} Returns base 64 encoded UUID.
     */
    public static fromHexStringToBase64(data: string): string {
        if (32 !== data.length) {
            const mess = `Expected hex string length of 32 characters but was given length: ${data.length}`;
            throw new RangeError(mess);
        }
        let pieces = [0, 4, 8, 12, 16, 20, 24, 28];
        let binString = '0000';
        for (const piece of pieces) {
            binString += parseInt(data.substr(piece, 4), 16)
                .toString(2)
                .padStart(16, '0');
        }
        let result = '';
        pieces = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126];
        for (const piece of pieces) {
            result += Uuid4._base64[binString.substr(piece, 6)];
        }
        return result;
    }
    /**
     * Convert from a hexadecimal encoded to a standard UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The hexadecimal encoded UUID.
     * @returns {string} Returns a standard UUID.
     */
    public static fromHexStringToUuid(data: string): string {
        if (32 !== data.length) {
            const mess = `Expected hex string length of 32 characters but was given length: ${data.length}`;
            throw new RangeError(mess);
        }
        const pieces = [8, 4, 4, 4, 12];
        let start = 0;
        let hexArray: string[] = [];
        for (const piece of pieces) {
            hexArray.push(data.substr(start, piece));
            start += piece;
        }
        return hexArray.join('-');
    }
    /**
     * Convert from a standard UUID to a base 64 encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The standard UUID.
     * @returns {string} Returns base 64 encoded UUID.
     */
    public static fromUuidToBase64(data: string): string {
        const hexString = data.replace(/-/g, '');
        return Uuid4.fromHexStringToBase64(hexString);
    }
    /**
     * Convert from a standard UUID to a hexadecimal encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The standard UUID.
     * @returns {string} Returns a hexadecimal encoded UUID.
     */
    public static fromUuidToHexString(data: string): string {
        return data.replace(/-/g, '');
    }
    public get [Symbol.toStringTag]() {
        return 'Uuid4';
    }
    /**
     * Helper method for the common parts of creating new UUID encoded as a binary string.
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns an UUID encoded as a binary string.
     * @private
     */
    protected static _asBinString(data?: Uint8Array): string {
        let binArray = data ?? Uuid4._getRandomArray();
        if (16 !== binArray.length) {
            const mess = `Expected data array length of 16 but was given length: ${binArray.length}`;
            throw new RangeError(mess);
        }
        binArray[6] = binArray[6] & 0x0f | 0x40;
        binArray[8] = binArray[8] & 0x3f | 0x80;
        let binary = '';
        for (const piece of binArray) {
            binary += piece.toString(2).padStart(8, '0');
        }
        return binary;
    }
    /**
     * Used to paste over differences in browser vs node secure random number generation.
     *
     * @returns {Uint8Array} Returns a new random number filled Uint8Array.
     * @private
     */
    protected static _getRandomArray(): Uint8Array {
        if (typeof window === 'undefined') {
            let crypto = require('crypto');
            return Uint8Array.from(crypto.randomBytes(16));
        }
        // `result` is modified in place.
        let result = new Uint8Array(16);
        window.crypto.getRandomValues(result);
        return result;
    }
    /**
     * Used in mapping from binary to base 64 during encoding.
     *
     * @type {object}
     * @private
     */
    protected static _base64: { [key: string]: string } = {
        '000000': 'A',
        '000001': 'B',
        '000010': 'C',
        '000011': 'D',
        '000100': 'E',
        '000101': 'F',
        '000110': 'G',
        '000111': 'H',
        '001000': 'I',
        '001001': 'J',
        '001010': 'K',
        '001011': 'L',
        '001100': 'M',
        '001101': 'N',
        '001110': 'O',
        '001111': 'P',
        '010000': 'Q',
        '010001': 'R',
        '010010': 'S',
        '010011': 'T',
        '010100': 'U',
        '010101': 'V',
        '010110': 'W',
        '010111': 'X',
        '011000': 'Y',
        '011001': 'Z',
        '011010': 'a',
        '011011': 'b',
        '011100': 'c',
        '011101': 'd',
        '011110': 'e',
        '011111': 'f',
        '100000': 'g',
        '100001': 'h',
        '100010': 'i',
        '100011': 'j',
        '100100': 'k',
        '100101': 'l',
        '100110': 'm',
        '100111': 'n',
        '101000': 'o',
        '101001': 'p',
        '101010': 'q',
        '101011': 'r',
        '101100': 's',
        '101101': 't',
        '101110': 'u',
        '101111': 'v',
        '110000': 'w',
        '110001': 'x',
        '110010': 'y',
        '110011': 'z',
        '110100': '0',
        '110101': '1',
        '110110': '2',
        '110111': '3',
        '111000': '4',
        '111001': '5',
        '111010': '6',
        '111011': '7',
        '111100': '8',
        '111101': '9',
        '111110': '-',
        '111111': '_',
    };
}
