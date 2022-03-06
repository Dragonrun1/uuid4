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
import {Uuid4RangeError, Uuid4TypeError} from './errors.js';
import {randomPump} from './utils.js';
import {RandomSourceFunction} from './types.js';

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
    /* c8 ignore next 3 */
    public get [Symbol.toStringTag]() {
        return 'Uuid4Gen';
    }
    private __currentBucket: number;
    private readonly __depth: number;
    private readonly __randomSource: RandomSourceFunction;
    private __tank: Uint8Array;
}
