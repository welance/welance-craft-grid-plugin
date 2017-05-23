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

    /**
	 * @return value
	 */
    public function prepValue($value)
    {
        return $value;
    }

    /**
	 * @return value
	 */
    public function prepValueFromPost($value)
    {
        // serialise before storing it on DB
        return serialize($value);
    }

    /**
	 * @return rendered HTML
	 */
    public function getInputHtml($name, $value)
    {
        // include assets (present in plugin_name/resources)
        craft()->templates->includeJsResource('welancegrid/js/main.js');
        craft()->templates->includeJsResource('welancegrid/js/nouislider.min.js');
		craft()->templates->includeCssResource('welancegrid/css/main.css');

		$breakpointOptions = $this->getSettings()->breakpointOptions;
        // flatten options array to easily _diff the 2 arrays
        foreach ($this->_getBreakpoints() as $arrkey => $arrval) {
            $allBreakpoints[] = $arrkey;
        }
        $missingBreakpoints = array_diff($allBreakpoints, $breakpointOptions);

        return craft()->templates->render('welancegrid/input', array(
            'name'  => $name,
            'value'  => unserialize($value), // unserialise while passing it to the view (twig template)
            'breakpointOptions' => $breakpointOptions,
            'allBreakpoints' => $this->_getBreakpoints(),
            'missingBreakpoints' => $missingBreakpoints
        ));
    }


    //  ----------------------------------------------------------------------------------
    //  ----------------------------------------------------------------------- Settings -
    //  ----------------------------------------------------------------------------------

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

    //  ----------------------------------------------------------------------------------
    //  ------------------------------------------------------ Private Methods / Helpers -
    //  ----------------------------------------------------------------------------------


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