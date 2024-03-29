/**
 * BlobCache.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Hold blob info objects where a blob has extra internal information.
 *
 * @private
 * @class tinymce.file.BlobCache
 */
define("tinymce/file/BlobCache", [
    "tinymce/util/Tools"
], function(Tools) {
    return function() {
        var cache = [], constant = Tools.constant;

        function create(id, blob, base64) {
            return {
                id: constant(id),
                blob: constant(blob),
                base64: constant(base64),
                blobUri: constant(URL.createObjectURL(blob))
            };
        }

        function add(blobInfo) {
            if (!get(blobInfo.id())) {
                cache.push(blobInfo);
            }
        }

        function get(id) {
            return findFirst(function(cachedBlobInfo) {
                return cachedBlobInfo.id() === id;
            });
        }

        function findFirst(predicate) {
            return Tools.grep(cache, predicate)[0];
        }

        function getByUri(blobUri) {
            return findFirst(function(blobInfo) {
                return blobInfo.blobUri() == blobUri;
            });
        }

        function destroy() {
            Tools.each(cache, function(cachedBlobInfo) {
                URL.revokeObjectURL(cachedBlobInfo.blobUri());
            });

            cache = [];
        }

        return {
            create: create,
            add: add,
            get: get,
            getByUri: getByUri,
            findFirst: findFirst,
            destroy: destroy
        };
    };
});