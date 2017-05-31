<?php

namespace Craft;

use Twig_Extension;
use Twig_Filter_Method;

class welancegridTwigExtension extends \Twig_Extension
{

    public function getName()
    {
        return 'Unserialize';
    }

    public function getFilters()
    {
        $returnArray = array();
        $methods = array(
            'new_row',
            'full_width',
            'v_align',
            'mobile_class',
            'desktop_class',
            'tablet_class',
            'wide_class',
        );

        foreach ($methods as $methodName) {
            $returnArray[$methodName] = new \Twig_Filter_Method($this, $methodName);
        }

        return $returnArray;
    }


    public function v_align($content)
    {
        if(!unserialize($content)){
            return false;
        }else{
            return json_decode(unserialize($content))->v_align ? json_decode(unserialize($content))->v_align : "top";
        }
    }

    public function full_width($content)
    {
        if(!unserialize($content)){
            return false;
        }else{
            return json_decode(unserialize($content))->full_width ? true : false;
        }
    }

    public function new_row($content)
    {
        if(!unserialize($content)){
            return false;
        }else{
            return json_decode(unserialize($content))->new_row ? true : false;
        }
    }

    public function mobile_class($content, $bp)
    {
        if(json_decode(unserialize($content))){
            $offset = (int)json_decode(unserialize($content))->mobile->offset;
            $width  = (int)json_decode(unserialize($content))->mobile->width;
            $active = json_decode(unserialize($content))->mobile->active;

            if($active){
                return $this->_generateClass($offset,$width,$bp);
            }else{
                return "";
            }
        }else{
            return "col col--12-12";
        }
    }

    public function desktop_class($content, $bp)
    {
        if(json_decode(unserialize($content))){
            $offset = (int)json_decode(unserialize($content))->desktop->offset;
            $width  = (int)json_decode(unserialize($content))->desktop->width;
            $active = json_decode(unserialize($content))->desktop->active;

            if($active){
                return $this->_generateClass($offset,$width,$bp);
            }else{
                return "";
            }
        }else{
            return "col col--12-12";
        }
    }

    public function tablet_class($content, $bp)
    {
        if(json_decode(unserialize($content))){
            $offset = (int)json_decode(unserialize($content))->tablet->offset;
            $width  = (int)json_decode(unserialize($content))->tablet->width;
            $active = json_decode(unserialize($content))->tablet->active;

            if($active){
                return $this->_generateClass($offset,$width,$bp);
            }else{
                return "";
            }
        }else{
            return "col col--12-12";
        }
    }

    public function wide_class($content, $bp)
    {
        if(json_decode(unserialize($content))){
            $offset = (int)json_decode(unserialize($content))->wide->offset;
            $width  = (int)json_decode(unserialize($content))->wide->width;
            $active = json_decode(unserialize($content))->wide->active;


            if($active){
                return $this->_generateClass($offset,$width,$bp);
            }else{
                return "";
            }
        }else{
            return "col col--12-12";
        }
    }

    private static function _generateClass($offset, $width, $bp){

        //return "col-" . ($offset - $width) . "-12@" . $bp .  " col--offset-" . $offset . "-12@" . $bp;
        if(static::_isHidden($offset, $width)){
            return "hide@" . $bp;
        }else{
            $class = "col col-" . ($offset - $width) . "-12@" . $bp . " col--offset-" . $offset . "-12@" . $bp;
            return $class;
        }
    }

	/**
	 *
	 * @return boolean
	 */
	private static function _isHidden($offset, $width)
	{
        $hidden = ($offset - $width) === 0 ? true : false;
        return $hidden;
	}

}