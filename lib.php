<?php
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

defined('MOODLE_INTERNAL') || die('Must access from moodle');

global $CFG;
require_once($CFG->dirroot . '/local/yuja/classes/local_yuja/yuja_client.class.php');

/**
 * TinyMce Plugin for Yuja
 */
class tinymce_yuja extends editor_tinymce_plugin {
    /** @var array list of buttons defined by this plugin */
    protected $buttons = array('yuja');
    /**
     * Update parameters
     * @param array $params
     * @param context $context
     * @param array $options
     * @return void
     */
    protected function update_init_params(array &$params, context $context, array $options = null) {
        $yujaclient = new yuja_client();
        $params = $params + $yujaclient->get_texteditor_params();

        // Add button after 'spellchecker' in advancedbuttons3.
        $this->add_button_after($params, 3, 'yuja', 'spellchecker');

        // Add JS file, which uses default name.
        $this->add_js_plugin($params);
    }
}
