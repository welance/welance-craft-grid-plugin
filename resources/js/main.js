$(function() {
    //layout mode flag (to toggle "layout mode")
    var layoutMode = false;
    //array to contain all slider objs
    var allSliders = [];
    //set main (global) OBJ for position
    var pos;
    //set OBJ for position from DB
    var posFromDB = null;
    //set default OBJ for position
    var defaultPos =   {
                            "mobile": {"offset"     : null, "width" : null},
                            "desktop": {"offset"    : null, "width" : null},
                            "tablet": {"offset"     : null, "width" : null},
                            "wide": {"offset"       : null, "width" : null},
                            "new_row"               : false,
                            "full_height"           : false,
                            "full_width"            : false
                        };


    //layout mode toggle
    $('.wg-layout-mode').on('click', function(ev){
        if(layoutMode === false){
            $('.fields .field').siblings().not('*[id*=colWidth]').hide();
            layoutMode = true;
        }else{
            $('.fields .field').siblings().show();
            layoutMode = false;
        }
    });

    //open all tabs relative to the clicked tab on a "content block" from Matrix field
    $('*[class*=-check]').on('click', function(ev){
        if($(ev.target).hasClass('desktop-check')){
            _hideAllBreakpoints();
            $('.desktop-content').show();
            $('.wg-tab-label.desktop-check').addClass('wg-tab-label--selected');
        }else if($(ev.target).hasClass('mobile-check')){
            _hideAllBreakpoints();
            $('.mobile-content').show();
            $('.wg-tab-label.mobile-check').addClass('wg-tab-label--selected');
        }else if($(ev.target).hasClass('tablet-check')){
            _hideAllBreakpoints();
            $('.tablet-content').show();
            $('.wg-tab-label.tablet-check').addClass('wg-tab-label--selected');
        }else if($(ev.target).hasClass('wide-check')){
            _hideAllBreakpoints();
            $('.wg-tab-label.wide-check').addClass('wg-tab-label--selected');
            $('.wide-content').show();
        }
    });
    //trigger default click on "open"
    $('.desktop-check').trigger('click');

    $('.sel-row').on('change', function(ev){
        //get Position from the right place!
        pos = _getPosFromCloseEl($(ev.target));

        if($(ev.target).hasClass('row-new')){
            if($(ev.target).is(':checked')){
                pos.new_row = true;
            }else{
                pos.new_row = false;
            }
        }else if($(ev.target).hasClass('row-full-width')){
            if($(ev.target).is(':checked')){
                pos.full_width = true;
            }else{
                pos.full_width = false;
            }

        }else if($(ev.target).hasClass('row-full-height')){
            if($(ev.target).is(':checked')){
                pos.full_height = true;
            }else{
                pos.full_height = false;
            }
        }

        //write obj inside "closest" textarea (textarea of current position block)
        $(ev.target).closest('.welance-grid').find('.wg-data').val(JSON.stringify(pos));
    });

    //go through all the sliders of the (admin) page and set a noUIslider.js instance
    var sliders = $('.slider');
    for ( var i = 0; i < sliders.length; i++ ) {
        allSliders.push(noUiSlider.create($(sliders[i])[0], {
            start: [ $(sliders[i]).data('from'), $(sliders[i]).data('to') ],
            step: 1,
            behaviour: 'drag',
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min':  0,
                'max':  12
            }
        }));

        //get latest added slider (current)
        var thisSlider = allSliders[allSliders.length-1];
        //assign to current slider the action to change the OBJ "pos" (position)
        thisSlider.on('change', function(val){
            setObjVals(val, $(this));
        });
    }

    function setObjVals(val, slider){
        //get target and create a jquery element out of it (to quickly get properties and helpers w/ jquery)
        var $sliderEl = $(slider[0].target);
        //get Position from the right place!
        pos = _getPosFromCloseEl($sliderEl);

        try{
            //find out which breakpoint is related to the slider and set values
            if($sliderEl.hasClass('desktop')){
                pos.desktop.offset = val[0];
                pos.desktop.width = val[1];
            }else if($sliderEl.hasClass('mobile')){
                pos.mobile.offset = val[0];
                pos.mobile.width = val[1];
            }else if($sliderEl.hasClass('tablet')){
                pos.tablet.offset = val[0];
                pos.tablet.width = val[1];
            }else if($sliderEl.hasClass('wide')){
                pos.wide.offset = val[0];
                pos.wide.width = val[1];
            }
        }catch(err){
            console.error("Something went wrong modifying main JSON position:", pos);
        }

        //write obj inside "closest" textarea (textarea of current position block)
        $sliderEl.closest('.welance-grid').find('.wg-data').val(JSON.stringify(pos));
    }

    function _hideAllBreakpoints(){
        $('.wg-tab-label').removeClass('wg-tab-label--selected');
        $('.desktop-content, .mobile-content, .tablet-content, .wide-content').hide();
    }

    //this function requires closeElement which is an element inside the right welance-grid context (right block)
    function _getPosFromCloseEl($closeElement){
        //globalposFromDB
        if($closeElement.closest('.welance-grid').find('.wg-data').val()){
            posFromDB = JSON.parse($closeElement.closest('.welance-grid').find('.wg-data').val());
        }
        pos = posFromDB ? posFromDB : defaultPos;
        return pos;
    }

});