<?php
namespace Craft;

class WelanceGrid_BlockPositionFieldType extends BaseFieldType
{
    /**
	 * @return string
	 */
    public function getName()
    {
        return Craft::t('Block Position');
    }

    /**
	 * @return AttributeType
	 */
    public function defineContentAttribute()
    {
        return AttributeType::Mixed;
    }

    public function prepValue($value)
    {
        // Modify $value here...
        // var_dump($value);exit;
        return $value;
    }

    public function prepValueFromPost($value)
    {
        // Modify $value here...
        //print_r(json_decode($value, true));
        return serialize($value);
    }

    /**
	 * @return rendered HTML
	 */
    public function getInputHtml($name, $value)
    {

        craft()->templates->includeJsResource('welancegrid/js/main.js');
        craft()->templates->includeJsResource('welancegrid/js/nouislider.min.js');
		craft()->templates->includeCssResource('welancegrid/css/main.css');

		$breakpointOptions = $this->getSettings()->breakpointOptions;
        $missingBreakpoints = array_diff($this->_getBreakpoints(), $breakpointOptions);

        return craft()->templates->render('welancegrid/input', array(
            'name'  => $name,
            'value'  => unserialize($value),
            'breakpointOptions' => $breakpointOptions,
            'allBreakpoints' => $this->_getBreakpoints(),
            'missingBreakpoints' => $missingBreakpoints
        ));
    }

    // Settings
    /**
	 * @return array of settings with default value
	 */
    protected function defineSettings()
    {
        return array(
            'breakpointOptions' => array(AttributeType::Mixed, 'default' => array_keys(static::_getBreakpoints())),
        );
    }

    /**
	 * @return rendered HTML for fieldtype settings
	 */
    public function getSettingsHtml()
    {
		return craft()->templates->render('welancegrid/settings', array(
            'settings'   => $this->getSettings(),
            'allBreakpoints' => array_keys(static::_getBreakpoints()),
        ));
    }

    /**
	 * @return array of preprocessed settings
	 */
    public function prepSettings($settings)
    {
        $settings['breakpointOptions'] = array_keys(array_filter($settings['breakpointOptions']));
		return $settings;
    }

	// Private Methods
	// =========================================================================

	/**
	 * Returns the position options.
	 *
	 * @return array
	 */
	private static function _getBreakpoints()
	{
		return array(
			'desktop' => Craft::t('Desktop'),
			'mobile' => Craft::t('Mobile'),
			'tablet' => Craft::t('Tablet'),
			'wide' => Craft::t('Wide'),
		);
	}

}