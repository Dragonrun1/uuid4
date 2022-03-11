/**
 * @script
 *
 * This is left as a JavaScript file since it should be called before any
 * packages have been installed. It only has access to the `node` internals.
 *
 * __NOTE:__ on Windows system this script must be run with Administrator
 * permissions to be able to create the symlinks used.
 *
 * Original idea stolen from script in
 * {@link monots https://github.com/monots/monots}
 */

import { lstatSync, readdirSync, readlinkSync, rmdirSync, symlinkSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(
    import.meta.url));

/**
 * Resolve a path relative to the base directory.
 *
 * @param {string[]} paths
 */
function baseDir(...paths) {
    return resolve(__dirname, '../..', ...paths);
}

/**
 * Safely get the stats for a file.
 *
 * @param {string} target
 */
function getFileStatSync(target) {
    try {
        return lstatSync(target);
    } catch {
        return;
    }
}

/**
 * Delete a file or folder recursively.
 *
 * @param {string} path
 *
 * @returns {void}
 */
function deletePath(path) {
    const stat = getFileStatSync(path);
    if (!stat) {
        return;
    }
    if (stat.isFile() || stat.isSymbolicLink()) {
        console.log('Deleting file', path);
        unlinkSync(path);
    }
    if (!stat.isDirectory()) {
        return;
    }
    // Delete all nested paths
    for (const file of readdirSync(path)) {
        deletePath(join(path, file));
    }
    // Delete the directory
    rmdirSync(path);
}

/**
 * Check that the path is linked to the target.
 *
 * @param {string} path
 * @param {string} target
 */
function isLinkedTo(path, target) {
    try {
        const checkTarget = readlinkSync(path);
        return checkTarget === target;
    } catch {
        return false;
    }
}

console.log('Symlink the misc config files into the root directory.');
const targets = readdirSync(baseDir('.config', 'symlinks'))
    .filter((filename) => !filename.endsWith('.md'))
    .map(
        (filename) => ({
            original: baseDir('.config', 'symlinks', filename),
            target: baseDir(filename),
        })
    );
for (const { original, target }
    of targets) {
    const targetStat = getFileStatSync(target);
    if (isLinkedTo(target, original)) {
        continue;
    }
    if (targetStat) {
        console.log('deleting path', target);
        deletePath(target);
    }
    symlinkSync(original, target);
}
console.log('Successfully symlinked all the misc config files into the root directory.');