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
export declare class Uuid4 {
    /**
     * Generate a custom base 64 encoded UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a custom base 64 encoded UUID v4.
     */
    static asBase64(data?: Uint8Array): string;
    /**
     * Generate a hexadecimal encoded UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a hexadecimal encoded UUID v4.
     */
    static asHexString(data?: Uint8Array): string;
    /**
     * Generate a standard UUID v4 (random).
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns a standard UUID v4.
     */
    static asUuid(data?: Uint8Array): string;
    /**
     * Convert from a base 64 encoded to a hexadecimal encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data A base 64 encoded UUID.
     * @returns {string} Returns a hexadecimal encoded UUID.
     */
    static fromBase64ToHexString(data: string): string;
    /**
     * Convert from a base 64 encoded to a standard UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The base 64 encoded UUID.
     * @returns {string} Returns a standard UUID.
     */
    static fromBase64ToUuid(data: string): string;
    /**
     * Convert from a hexadecimal encoded to a base 64 encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The hexadecimal encoded UUID.
     * @returns {string} Returns base 64 encoded UUID.
     */
    static fromHexStringToBase64(data: string): string;
    /**
     * Convert from a hexadecimal encoded to a standard UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The hexadecimal encoded UUID.
     * @returns {string} Returns a standard UUID.
     */
    static fromHexStringToUuid(data: string): string;
    /**
     * Convert from a standard UUID to a base 64 encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The standard UUID.
     * @returns {string} Returns base 64 encoded UUID.
     */
    static fromUuidToBase64(data: string): string;
    /**
     * Convert from a standard UUID to a hexadecimal encoded UUID.
     *
     * NOTE: This method does not verify input is valid UUID.
     *
     * @param {string} data The standard UUID.
     * @returns {string} Returns a hexadecimal encoded UUID.
     */
    static fromUuidToHexString(data: string): string;
    get [Symbol.toStringTag](): string;
    /**
     * Helper method for the common parts of creating new UUID encoded as a binary string.
     *
     * @param {Uint8Array} [data] Should normally be `undefined` to create a
     *                            truly random v4 UUID.
     * @returns {string} Returns an UUID encoded as a binary string.
     * @private
     */
    protected static _asBinString(data?: Uint8Array): string;
    /**
     * Used to paste over differences in browser vs node secure random number generation.
     *
     * @returns {Uint8Array} Returns a new random number filled Uint8Array.
     * @private
     */
    protected static _getRandomArray(): Uint8Array;
    /**
     * Used in mapping from binary to base 64 during encoding.
     *
     * @type {object}
     * @private
     */
    protected static _base64: {
        [key: string]: string;
    };
}
