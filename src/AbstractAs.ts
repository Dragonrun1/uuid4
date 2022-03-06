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

import {Uuid4As} from './interfaces.js';

/** */
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
