<?php
namespace Craft;

class WelanceGridPlugin extends BasePlugin
{
    /**
	 * @return string
	 */
    function getName()
    {
         return Craft::t('welance-bs Grid Types');
    }

	/**
	 * @return string
	 */
    function getVersion()
    {
        return '0.1';
    }

	/**
	 * @return string
	 */
	public function getDocumentationUrl()
	{
		return 'https://welance.github.io/welance-bs/';
	}

	/**
	 * @return string
	 */
	public function getDescription()
	{
		return Craft::t('Add datatypes to use welance-bs Grid within Matrix Blocks.');
	}

    /**
	 * @return string
	 */
    function getDeveloper()
    {
        return 'welance.de';
    }

    /**
	 * @return string
	 */
    function getDeveloperUrl()
    {
        return 'http://welance.de';
    }
}