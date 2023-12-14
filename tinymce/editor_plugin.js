// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * YuJa Plugin for Moodle Tinymce
 * @package    tinymce_yuja
 * @subpackage yuja
 * @copyright  2016 YuJa
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

(function() {

	var handlerLoaded = false;
    /**
     * Load script
     * @param {*} url
     */
    function loadScript(url) {
        var script = document.createElement('script');
        script.src = url;
        (document.body || document.head || document.documentElement).appendChild(script);
    }

    function loadIframe(url, ed) {
        var script = document.createElement('script');
        script.onload = function () {
            require(['jquery'], function($) {
                $("#yujaVideoChooserIFrame").attr('src',url);
                
                if (!handlerLoaded) {
                    if (window.addEventListener) {  // all browsers except IE before version 9
                        window.addEventListener ("message", OnMessage, false);
                    } else {
                        if (window.attachEvent) {   // IE before version 9
                            window.attachEvent("onmessage", OnMessage);
                        }
                    }
                    
                    function OnMessage(event) {
                        if(event.data.type == "getVideo") {
            
                            function embedHandler(embedString) {
                                ed.execCommand('mceInsertContent', false, embedString);
                            }
            
                            var embedString = event.data.embed;
                            embedHandler(embedString);
                            
                            require(['jquery'], function($) {
                                $(".yuja-overlay").removeClass('yuja-overlay-visible');
                                $("#yujaVideoChooserIFrame").attr('src',"");
                            });
                        }
                    }

                    handlerLoaded = true;
                }
            });
        };
        script.src = location.origin + "/local/yuja/media_selection.js";
        (document.body || document.head || document.documentElement).appendChild(script);
    }

    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('yuja');

    /**
     * Create a collapseable, stackable toast message by:
     *      1. creating a container to hold toast messages
     *      2. appending to that toast message container
     * To avoid scope leak and encourage modularity, the helper functions are localized in the definition of this function
     * Goal is to keep this toast library simple as libraries would add too much overhead
     * @param {*} title
     * @param {*} message
     */
    function showAlertMessage(title, message) {
        // ---------constants and definitions----------
        var $ = $ || jQuery;
        var ID_TOAST_CONTAINER = "toastMessageContainer";
        var ID_TOAST_STYLES = "yujaToastMessageStyles";
        var CLASS_YUJA_TOASTS = "yuja-toast-message";
        var TOAST_MESSAGE_LIFETIME_MS = 3000;
        var TOAST_FADE_OUT_DURATION_MS = 1000;
        // Reuse the class as the ID for simplicity
        var ID_YUJA_TOAST = CLASS_YUJA_TOASTS;

        /**
         * Preprocess the ID in case suffixes/prefixes need to be added
         * @param {*} id
         * @returns {*}
         */
        function helperIdToCssSelector(id) {
            return "#" + (id || "");
        }

        /**
         * JQuery helper to convert
         * @param {*} id
         * @returns {boolean}
         */
        function helperIDExists(id) {
            return $(helperIdToCssSelector(id)).length === 1;
        }

        /**
         * Create empty toast message container
         */
        function createSingletonToastMessageContainer() {
            if (!helperIDExists(ID_TOAST_CONTAINER)) {
                var $idToastContainer = $("<div>")
                    .attr("id", ID_TOAST_CONTAINER);
                $(document.body).append($idToastContainer);
            }
        }

        /**
         * Create toast message styles
         */
        function createSingletonToastMessageStyles() {
            if (!helperIDExists(ID_TOAST_STYLES)) {
                var styles = [];
                styles.push("" +
                    "#toastMessageContainer{\n" +
                    // Center the toast message container
                    "    position: absolute;\n" +
                    "    left: 0;\n" +
                    "    right: 0;\n" +
                    "    margin: 0 auto;\n" +
                    // Ensure it is in front of everything
                    "    z-index: 9999;\n" +
                    // Set the width to match YuJa
                    "    width: 420px;\n" +
                    // Offset the top bar
                    "    top: 50px;\n" +
                    "}\n"
                );
                styles.push("" +
                    ".yuja-toast-message {\n" +
                    // Star logo positioning
                    "    background-image: " +
                    "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNC" +
                    "SVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBl" +
                    "Lm9yZ5vuPBoAAARkSURBVEiJhZZNbFRVFMd/577XDwTiQg3YvuEjRYMLo6nsWAmRGJB2Os82CExbMVEx" +
                    "UVGhdWEMLEzAamtiNLoQ6BRYNDMtI9YFiZJA3GHEGKMxpLbMTGvCwg+0rZ1597h4b0o/pniSSW7u+d//" +
                    "/5zzv7lvhDtEarBunTqmWWAXwgYUDwAhjzImyhdF12YPxCdyy3FIpc3+Qa9eHN4GngOcOxUBWJBMYJyu" +
                    "Z1vGxv5XYCAdi6voALAKmAUdRsx5KQXf6UyQB5Bax8M4jdYQF9U4UA3cEmR/0s99vqzAQNp7VYVewAik" +
                    "DaZ7n39j9E7lnx6ONThWexRaAKtwqMPPf7hEIKo8A6iqdHU8netd0t2Q1w2QTORPLM71p70jIhwPSaWl" +
                    "3IkAnMnUexb5KRyLHG73c+8vJa9/RFWuAYjoo8lE4fvFmFTG6wJOALeqXNn8THNuwgBYkWPAKoF0JfIw" +
                    "zGvllSqHKiHa/fy7wHlgdbGoRwEkNVi3DseMAoGDeajSzAcy6+9Xgl8BN9oqCc7GpD8+uQQ76G1Shx8B" +
                    "x6Ab3OieO6Dpff6N0VODG9Y6bmm36G1/lNLjIDVAJtrylVLvQMa7NIcRNCi5F5JtY9dTmVgWtNWKaXYF" +
                    "dgKImiyA6wbHVenQBXWFWhbbB2AwPsgehT1zEAXXDfqBThHNqtKK6k4X2BQe0qsAgXLSQCtwF/APyjkE" +
                    "RfTnzsTENwCpofrXUdms4XXeG2GnAuVkOEB7FceA0GCAtQBV9t9JgE4/d1msPAn8DazE4Iz+kD/Ynij0" +
                    "zZmZKPQlE/kXBS2WyY3Vpk4/dxmghmIh6qreLDYJINmau4JoMzCFcqDh4djHS8wc8j4BOQhMKfrU/tbC" +
                    "V+Xc7OzdJhKwBpgAmHar6+YTtCcKXxurTSFOX+gfqr+nnDt3oe5e4HkAY7Wpwy9cmn+2WDtVF1k34QKj" +
                    "wIPGmseAX+YD1ejvocE6tqJU+GNgKHYYwJ3O9ZUcbxxYH2IWhsFsiZajRpQRAGuILwaqmh3hSq7NON5F" +
                    "Ve1R1Z4Zx7uIci1MmSeWCAjNYecyYoquzQKBqMZPD8caFiCF8uFmYBvwW/TbhhCOT9kx/8jZtPeAhvgS" +
                    "gWbNgfhETuEUUO1Y7SkDU6k1K4Gtc1LCFcFpFJxGhCvcfii3RlhUkQB6gCpBPutoyxdCtwOOArcUWvrT" +
                    "3hEAVlVtAWrCWUnf9M0125P++GTSH5+cvrlmOyrla1sTYRnIeN2E4/kTzDGY/1xnYk2KDkeVvOnM1H5q" +
                    "V8z0InzZnsgPLZ4zQGrIS6DsrA2q35gxswcR3glJtSnpF0YWCAD0Z7yXBT4IfWKYgK5kW/56JfL5My+J" +
                    "vidIE2AReaU9kfuonF/yyUyl63Yj5iywGiiCnBfRbMnab1faYh5gxnVjgtOIEo8MrUL5S0T3litfVgDg" +
                    "5ODa+1zjvoXwEref6OXCAmcFp7vS811RoBxnMvWeFdMsVnepsBGivy2QB0YVGSHQbEdbvrAcx3+/BcsB" +
                    "IawLQwAAAABJRU5ErkJggg==\") !important;\n" +
                    "    background-repeat: no-repeat;\n" +
                    "    background-position: 15px center;\n" +
                    "    background-color: white;\n" +
                    "    padding: 15px;\n" +
                    // Round borders
                    "    -moz-border-radius: 3px 3px 3px 3px;\n" +
                    "    -webkit-border-radius: 3px 3px 3px 3px;\n" +
                    "    border-radius: 3px 3px 3px 3px;\n" +
                    // Add a drop/background hsadow
                    "    -moz-box-shadow: 0 0 12px #999999;\n" +
                    "    -webkit-box-shadow: 0 0 12px #999999;\n" +
                    "    box-shadow: 0 0 12px #999999;\n" +
                    "    opacity: 0.95;\n" +
                    "    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\n" +
                    "    filter: alpha(opacity=80);\n" +
                    // Ensure the progress bars align to this reference point
                    "    position: relative;\n" +
                    // Indicate it is killable with a click
                    "    cursor: pointer;\n" +
                    "}");
                styles.push("" +
                    ".message-container {\n" +
                    // Offset the star above
                    "    padding-left: 25px;\n" +
                    "}"
                );
                styles.push("" +
                    ".message-content {\n" +
                    // Space for the side bar
                    "    padding-left: 15px;\n" +
                    "}"
                );
                styles.push("" +
                    ".header {\n" +
                    "    font-weight: bold;\n" +
                    "    font-size: 15px;\n" +
                    "    color: #A2AD1C;\n" +
                    "}\n"
                );
                styles.push("" +
                    ".left-side-border{\n" +
                    // Add the vertical rainbow bar
                    "    content: url(\"data:image/png;base64," +
                    "/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAAAAD/4QMxaHR0cDovL25zLmFkb2Jl" +
                    "LmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/" +
                    "PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYt" +
                    "YzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0i" +
                    "aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRm" +
                    "OmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0" +
                    "dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hh" +
                    "cC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3" +
                    "IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU1MTM3NzE3QkE4MzExRTc5RDFBQ0QzQTA5" +
                    "NDIwQkI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU1MTM3NzE4QkE4MzExRTc5RDFBQ0QzQTA5NDIwQkI2" +
                    "Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTUxMzc3MTVCQTgzMTFFNzlE" +
                    "MUFDRDNBMDk0MjBCQjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTUxMzc3MTZCQTgzMTFFNzlEMUFDRDNB" +
                    "MDk0MjBCQjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBl" +
                    "bmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAbGhopHSlBJiZBQi8vL0JHPz4+P0dHR0dHR0dHR0dHR0dHR0dH" +
                    "R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHAR0pKTQmND8oKD9HPzU/R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dH" +
                    "R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCABKAAUDASIAAhEBAxEB/8QAZwABAAMBAAAAAAAAAAAAAAAA" +
                    "AAMEBQIBAQEBAQAAAAAAAAAAAAAAAAQCAwUQAQACAQUBAAAAAAAAAAAAAAABYRORoQISUhQRAAECBQUBAAAAAAAA" +
                    "AAAAAAABEyFhAhJS8JGh4SIU/9oADAMBAAIRAxEAPwDUGbk4+o1gR8qZcdhXqsdbGZ0kXfl50F3Dm0ma+KaEmSBy" +
                    "Hq5GsSlnrcUM1CmxNqEHao3HIZAn1M//2Q==\");\n" +
                    "    width: 5px;\n" +
                    // Ensure it is the size of the parent
                    "    height: 100%;\n" +
                    // Left align it
                    "    position: absolute;\n" +
                    "    top: 0;\n" +
                    "    left: 0;" +
                    "}\n"
                );
                styles.push("" +
                    ".toast-lifetime-progress {\n" +
                    "    position: absolute;\n" +
                    "    top: 0;\n" +
                    "    left: 0;\n" +
                    "    width: 0;\n" +
                    "    transition: width 3s, background-color 3s;\n" +
                    "    height: 5px;\n" +
                    "    background-color: #73ff04;\n" +
                    "}"
                );
                styles.push("" +
                    ".toast-lifetime-progress.start-animation {\n" +
                    "    background-color: #ff0005;\n" +
                    "    width: 100%;\n" +
                    "}"
                );
                var $toastMesageStyles = $("<style>")
                    .attr("id", ID_TOAST_STYLES)
                    // Add the styles as an array, making it inline text and thus apply to the browser
                    .append(styles);
                $(document.head).append($toastMesageStyles);
            }
        }

        /**
         * Toast messages are stackable and each needs to be unique.
         * The uniqueness can be guaranteed with the jquery instance of classes count + 1
         * @returns {*}
         */
        function getNextAvailableToastMessageUniqueID() {
            var nextUniqueId = $("." + CLASS_YUJA_TOASTS).length + 1;
            return ID_YUJA_TOAST + "-" + nextUniqueId;
        }

        /**
         * Helper to Construct Message
         * @returns {*}
         */
        function helperConstructMessage() {
            var $leftSideBar = $("<div>")
                .attr("class", "left-side-border");
            var $progressBar = $("<div>")
                .attr("class", "toast-lifetime-progress");
            var $header = $("<div>")
                .attr("class", "message-content header")
                .append(title);
            var $body = $("<div>")
                .attr("class", "message-content body")
                .append(message);

            return $("<div>")
                .attr("class", "message-container")
                .append($progressBar)
                .append($leftSideBar)
                .append($header)
                .append($body);
        }

        /**
         * Hide toast message
         * @param {*} $toast
         * @returns {*}
         */
        function killToastMessage($toast) {
            return function() {
                if ($toast.length === 1) {
                    // Only hide the toast messages since the other ones may reuse the ID and that
                    // will cause old-style reuse (id 1 -> gets deleted -> new toast takes id->1 progress)
                    $toast
                        .css({display: "none"});
                }
            };
        }

        /**
         * Fade out toast message before hiding it
         * @param {*} newToastId
         * @returns {*}
         */
        function fadeAndKillToastMessage(newToastId) {
            return function() {
                var $toast = $(helperIdToCssSelector(newToastId));
                if ($toast.length === 1) {
                    // Fade out the toast
                    $toast
                        .css({
                            "transition": "opacity " + TOAST_FADE_OUT_DURATION_MS + "ms",
                            opacity: "0"
                        });
                    // Delete it
                    setTimeout(killToastMessage($toast), TOAST_FADE_OUT_DURATION_MS);
                }
            };
        }

        /**
         * Create toast message
         */
        function createToastMessage() {
            createSingletonToastMessageContainer();
            createSingletonToastMessageStyles();
            var newToastId = getNextAvailableToastMessageUniqueID();
            var $toastContainer = $(helperIdToCssSelector(ID_TOAST_CONTAINER));
            if ($toastContainer.length === 1) {
                $toastContainer
                    .append(
                        $("<div>")
                            .attr("id", newToastId)
                            // Toast class adds the progress bar above the message
                            .attr("class", CLASS_YUJA_TOASTS)
                            .on("click", function() {
                                killToastMessage($(helperIdToCssSelector(newToastId)));
                            })
                            .append(helperConstructMessage())
                    );
                // Start the animations on  delay
                setTimeout(function() {
                    if ($toastContainer.length === 1) {
                        $toastContainer
                            .find(helperIdToCssSelector(newToastId))
                            .find(".toast-lifetime-progress")
                            .addClass("start-animation");
                    }
                }, 25);
                // Kill the toast message in X seconds
                setTimeout(fadeAndKillToastMessage(newToastId), TOAST_MESSAGE_LIFETIME_MS);
            }
        }
        // ---------end constants and definitions----------
        createToastMessage();
    }

    tinymce.create('tinymce.plugins.Yuja', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init: function(ed, url) {

            var mediaSelector = null;
            var params = {
                ltiVersion: ed.getParam('ltiVersion', undefined),
                videosUrl: ed.getParam('yujaVideosUrl', undefined),
                jsUrl: ed.getParam('yujaJsUrl', undefined),
                lti3LoginInitiationUrl: ed.getParam('lti3LoginInitUrl', undefined),
                error: ed.getParam('yujaError', undefined)
            };


            /**
             * This request written without JQuery for backwards compatability with Moodle < 2.9
             */
            var xmlhttp;

            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest(); // Code for IE7+, Firefox, Chrome, Opera, Safari
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // Code for IE6, IE5
            }

            // Delay the connection to YuJa until the button is clicked
            var isYujaConnected = false;
            // If the button is clicked, execute a callback that is just the mce command
            var yujaConnectedCallback = null;
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        try {
                            params.videos = JSON.parse(xmlhttp.responseText);
                        } catch (err) {
                            params.videos = {success: false};
                        }
                    } else {
                        params.videos = {success: false};
                    }
                    if (typeof yujaConnectedCallback === "function") {
                        // Call the mceYuja function
                        yujaConnectedCallback();
                        yujaConnectedCallback = null;
                    }
                }
            };

            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
            ed.addCommand('mceYuja', function() {

                if (params.ltiVersion == "1.3") {
                    loadIframe(params.lti3LoginInitiationUrl, ed);
                    return;
                }

                var error = false;
                if (!isYujaConnected) {
                    isYujaConnected = true;
                    // Mount the script that will load the common yuja variables
                    loadScript(params.jsUrl);
                    // Load the videos
                    xmlhttp.open("GET", params.videosUrl, true);
                    xmlhttp.send();
                    error = true;
                    // Call this function again once complete
                    yujaConnectedCallback = this.execCommands['mceYuja'].func.bind(this, this, false);

                } else if (params.error !== undefined) {
                    showAlertMessage("Error", ed.getLang('yuja.phperror'));
                    error = true;
                } else if (params.videos !== undefined && params.videos.success === false) {
                    showAlertMessage("Loading...", ed.getLang('yuja.loadingerror'));
                    error = true;
                } else if (params.videos === undefined || (typeof yuja === "undefined" || yuja === undefined)) {
                    showAlertMessage("Loading...", ed.getLang('yuja.notready'));
                    error = true;
                }

                if (error) {
                    return;
                }

                if (mediaSelector === null) {
                    mediaSelector = yuja.createMediaSelector(params.videos.data);
                }

                mediaSelector.onSelect(function(embedString) {
                    ed.execCommand('mceInsertContent', false, embedString);
                });

                mediaSelector.open();
            });

            // Register example button
            ed.addButton('yuja', {
                title: 'YuJa Media Selector',
                cmd: 'mceYuja',
                image: url + '/img/yuja.gif'
            });
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo: function() {
            return {
                longname: 'YuJa for Tinymce',
                author: 'YuJa',
                authorurl: '',
                infourl: 'http://www.yuja.com',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('yuja', tinymce.plugins.Yuja);
})();