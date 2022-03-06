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

/**
 * Interface for the asBase64 function.
 */
export interface AsBase64 {
    /**
     * Provides a v4 (random) UUID as a custom base 64 encoded string.
     *
     * @returns A UUIDv4 in a custom base 64 encoded string that is 22
     * characters long.
     */
    asBase64(): string;
}

/**
 * Interface for the asBinString function.
 */
export interface AsBinString {
    /**
     * Provides a v4 (random) UUID as a binary string.
     *
     * @returns A UUIDv4 as a binary string ('0's and '1's only) that is 128
     * characters long.
     */
    asBinString(): string;
}

/**
 * Interface for for all of the `as` functions.
 */
export interface Uuid4As extends AsBase64, AsBinString {
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

/**
 * Interface for for all of the `from` functions.
 */
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
