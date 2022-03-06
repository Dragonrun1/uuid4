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

import {isBrowser, isDeno, isNode, isWebWorker} from './constants.js';
import {Uuid4RangeError, Uuid4SourceMissingError, Uuid4TypeError} from './errors.js';

let cry: Crypto;
/* c8 ignore next 3 */
if (isBrowser || isWebWorker) {
    // @ts-ignore
    cry = (crypto || msCrypto);
} else if (isNode) {
    const {webcrypto} = await import('node:crypto');
    cry = webcrypto as unknown as Crypto;
    /* c8 ignore next 3 */
} else if (isDeno) {
    cry = crypto;
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
 * @returns {Uint8Array} Returns buckets * 16 unsigned integers in a typed array.
 *
 * @throws {@link Uuid4RangeError} when requested number of buckets is not between 1 and 8191.
 * @throws {@link Uuid4SourceMissingError} when no known (pseudo-)random source is found.
 * @throws {@link Uuid4TypeError} when buckets is not an integer.
 */
export function randomPump(buckets: number): Uint8Array {
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
    /* c8 ignore next 4 */
    if (cry === undefined) {
        const message = 'Could not find a known random bucket pumping source';
        throw new Uuid4SourceMissingError(message);
    }
    const uint = new Uint8Array(size);
    cry.getRandomValues(uint);
    return uint;
}
