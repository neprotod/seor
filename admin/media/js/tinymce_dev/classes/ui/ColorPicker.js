/**
 * ColorPicker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Color picker widget lets you select colors.
 *
 * @-x-less ColorPicker.less
 * @class tinymce.ui.ColorPicker
 * @extends tinymce.ui.Widget
 */
define("tinymce/ui/ColorPicker", [
    "tinymce/ui/Widget",
    "tinymce/ui/DragHelper",
    "tinymce/ui/DomUtils",
    "tinymce/util/Color"
], function(Widget, DragHelper, DomUtils, Color) {
    "use strict";

    return Widget.extend({
        Defaults: {
            classes: "widget colorpicker"
        },

        /**
         * Constructs a new colorpicker instance with the specified settings.
         *
         * @constructor
         * @param {Object} settings Name/value object with settings.
         * @setting {String} color Initial color value.
         */
        init: function(settings) {
            this._super(settings);
        },

        postRender: function() {
            var self = this, color = self.color(), hsv, hueRootElm, huePointElm, svRootElm, svPointElm;

            hueRootElm = self.getEl('h');
            huePointElm = self.getEl('hp');
            svRootElm = self.getEl('sv');
            svPointElm = self.getEl('svp');

            function getPos(elm, event) {
                var pos = DomUtils.getPos(elm), x, y;

                x = event.pageX - pos.x;
                y = event.pageY - pos.y;

                x = Math.max(0, Math.min(x / elm.clientWidth, 1));
                y = Math.max(0, Math.min(y / elm.clientHeight, 1));

                return {
                    x: x,
                    y: y
                };
            }

            function updateColor(hsv, hueUpdate) {
                var hue = (360 - hsv.h) / 360;

                DomUtils.css(huePointElm, {
                    top: (hue * 100) + '%'
                });

                if (!hueUpdate) {
                    DomUtils.css(svPointElm, {
                        left: hsv.s + '%',
                        top: (100 - hsv.v) + '%'
                    });
                }

                svRootElm.style.background = new Color({s: 100, v: 100, h: hsv.h}).toHex();
                self.color().parse({s: hsv.s, v: hsv.v, h: hsv.h});
            }

            function updateSaturationAndValue(e) {
                var pos;

                pos = getPos(svRootElm, e);
                hsv.s = pos.x * 100;
                hsv.v = (1 - pos.y) * 100;

                updateColor(hsv);
                self.fire('change');
            }

            function updateHue(e) {
                var pos;

                pos = getPos(hueRootElm, e);
                hsv = color.toHsv();
                hsv.h = (1 - pos.y) * 360;
                updateColor(hsv, true);
                self.fire('change');
            }

            self._repaint = function() {
                hsv = color.toHsv();
                updateColor(hsv);
            };

            self._super();

            self._svdraghelper = new DragHelper(self._id + '-sv', {
                start: updateSaturationAndValue,
                drag: updateSaturationAndValue
            });

            self._hdraghelper = new DragHelper(self._id + '-h', {
                start: updateHue,
                drag: updateHue
            });

            self._repaint();
        },

        rgb: function() {
            return this.color().toRgb();
        },

        value: function(value) {
            var self = this;

            if (arguments.length) {
                self.color().parse(value);

                if (self._rendered) {
                    self._repaint();
                }
            } else {
                return self.color().toHex();
            }
        },

        color: function() {
            if (!this._color) {
                this._color = new Color();
            }

            return this._color;
        },

        /**
         * Renders the control as a HTML string.
         *
         * @method renderHtml
         * @return {String} HTML representing the control.
         */
        renderHtml: function() {
            var self = this, id = self._id, prefix = self.classPrefix, hueHtml;
            var stops = '#ff0000,#ff0080,#ff00ff,#8000ff,#0000ff,#0080ff,#00ffff,#00ff80,#00ff00,#80ff00,#ffff00,#ff8000,#ff0000';

            function getOldIeFallbackHtml() {
                var i, l, html = '', gradientPrefix, stopsList;

                gradientPrefix = 'filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=';
                stopsList = stops.split(',');
                for (i = 0, l = stopsList.length - 1; i < l; i++) {
                    html += (
                        '<div class="' + prefix + 'colorpicker-h-chunk" style="' +
                            'height:' + (100 / l) + '%;' +
                            gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ');' +
                            '-ms-' + gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ')' +
                        '"></div>'
                    );
                }

                return html;
            }

            var gradientCssText = (
                'background: -ms-linear-gradient(top,' + stops + ');' +
                'background: linear-gradient(to bottom,' + stops + ');'
            );

            hueHtml = (
                '<div id="' + id + '-h" class="' + prefix + 'colorpicker-h" style="' + gradientCssText + '">' +
                    getOldIeFallbackHtml() +
                    '<div id="' + id + '-hp" class="' + prefix + 'colorpicker-h-marker"></div>' +
                '</div>'
            );

            return (
                '<div id="' + id + '" class="' + self.classes + '">' +
                    '<div id="' + id + '-sv" class="' + prefix + 'colorpicker-sv">' +
                        '<div class="' + prefix + 'colorpicker-overlay1">' +
                            '<div class="' + prefix + 'colorpicker-overlay2">' +
                                '<div id="' + id + '-svp" class="' + prefix + 'colorpicker-selector1">' +
                                    '<div class="' + prefix + 'colorpicker-selector2"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    hueHtml +
                '</div>'
            );
        }
    });
});