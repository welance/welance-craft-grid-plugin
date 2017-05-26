$(function() {
    // layout mode flag (to toggle "layout mode")
    var layoutMode = false;
    // array to contain all slider objs
    var allSliders = [];
    // set main (global) OBJ for position
    var pos;
    // set OBJ for position from DB
    var posFromDB = null;
    // set default OBJ for position
    var defaultPos =   {
                            "mobile":       {"offset"    : 0, "width" : 12},
                            "desktop":      {"offset"    : 0, "width" : 12},
                            "tablet":       {"offset"    : 0, "width" : 12},
                            "wide":         {"offset"    : 0, "width" : 12},
                            "new_row"               : false,
                            "full_height"           : false,
                            "full_width"            : false
                        };

    initLayoutButton();
    initTabs();
    initSliders();
    initCheckBoxes();

    // trigger default click on "open"
    $('.desktop-check').trigger('click');

    $('.btn.add.icon').on('click', function(ev){
        initLayoutButton();
        initTabs();
        initSliders();
        initCheckBoxes();
        $('.desktop-check').trigger('click');
    });

    // layout mode toggle
    // this is to view all the sliders closer to each other
    // and better play with the layout of the webpage
    function initLayoutButton(){
        $('.wg-layout-mode').on('click', function(ev){
            if(layoutMode === false){
                $('.fields .field').siblings().not('*[id*=colWidth]').hide();
                layoutMode = true;
            }else{
                $('.fields .field').siblings().show();
                layoutMode = false;
            }
        });
    }


    function initCheckBoxes(){
        // get all checkboxes with sel-row class
        $('.sel-row').on('change', function(ev){
            // get Position from the right place!
            pos = _getPosFromCloseEl($(ev.target));

            // "new row"" checkbox
            if($(ev.target).hasClass('row-new')){
                if($(ev.target).is(':checked')){
                    pos.new_row = true;
                }else{
                    pos.new_row = false;
                }
            // "full width"" checkbox
            }else if($(ev.target).hasClass('row-full-width')){
                if($(ev.target).is(':checked')){
                    pos.full_width = true;
                }else{
                    pos.full_width = false;
                }
            // "full height"" checkbox
            }else if($(ev.target).hasClass('row-full-height')){
                if($(ev.target).is(':checked')){
                    pos.full_height = true;
                }else{
                    pos.full_height = false;
                }
            }

            if(pos.full_height){
                $(ev.target).closest('.welance-grid').find('.noUi-connect').addClass('noUi-connect--hi');
            }else{
                $(ev.target).closest('.welance-grid').find('.noUi-connect').removeClass('noUi-connect--hi');
            }
            if(pos.full_width){
                $(ev.target).closest('.welance-grid').find('.wrap-slider').addClass('wrap-slider--full');
                $(ev.target).closest('.welance-grid').find('.slider').addClass('slider--full');
            }else{
                $(ev.target).closest('.welance-grid').find('.wrap-slider').removeClass('wrap-slider--full');
                $(ev.target).closest('.welance-grid').find('.slider').removeClass('slider--full');
            }
            if(pos.new_row){
                $(ev.target).closest('.welance-grid').find('.noUi-connect').addClass('noUi-connect--new');
            }else{
                $(ev.target).closest('.welance-grid').find('.noUi-connect').removeClass('noUi-connect--new');
            }


            // write obj inside "closest" textarea (textarea of current position block)
            $(ev.target).closest('.welance-grid').find('.wg-data').val(JSON.stringify(pos));
        });
    }

    function initSliders(){
        // go through all the sliders of the (admin) page and set a noUIslider.js instance
        var sliders = $('.slider').not('.slider-created');
        for ( var i = 0; i < sliders.length; i++ ) {
            // remove the not-initiated class and add the initiated
            // to let the system know this has already been created
            // and shouldn't create this anymore
            console.log(($(sliders[i]).removeClass('slider-not-created')).addClass('slider-created'));

            // push every slider inside array to then have a reference to them
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

            // get latest added slider (current)
            var thisSlider = allSliders[allSliders.length-1];
            // assign to current slider the action to change the OBJ "pos" (position)
            thisSlider.on('change', function(val){
                // set new values and change DOM accordingly
                setObjVals(val, $(this));
            });
            // get values
            var initPos = getInitVals($(thisSlider));
            // and set the slider handles accordingly
            thisSlider.set([initPos.offset,initPos.width]);
        }
    }

    function initTabs(){
        // open all tabs relative to the clicked tab on a "content block" from Matrix field
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
    }

    // set new values and change DOM accordingly
    function setObjVals(val, slider){
        // get target and create a jquery element out of it (to quickly get properties and helpers w/ jquery)
        var $sliderEl = $(slider[0].target);
        // get Position from the right place!
        pos = _getPosFromCloseEl($sliderEl);

        try{
            // find out which breakpoint is related to the slider and set values
            if($sliderEl.hasClass('desktop')){
                // set changes to global var "pos" (the global source of truth)
                pos.desktop.offset = val[0];
                pos.desktop.width = val[1];
                // set the small numbers next to the right tab with the new value
                $sliderEl.closest('.welance-grid').find('.wg-desktop-offset').html(pos.desktop.offset);
                $sliderEl.closest('.welance-grid').find('.wg-desktop-width').html(pos.desktop.width);
            }else if($sliderEl.hasClass('mobile')){
                // set changes to global var "pos" (the global source of truth)
                pos.mobile.offset = val[0];
                pos.mobile.width = val[1];
                // set the small numbers next to the right tab with the new value
                $sliderEl.closest('.welance-grid').find('.wg-mobile-offset').html(pos.mobile.offset);
                $sliderEl.closest('.welance-grid').find('.wg-mobile-width').html(pos.mobile.width);
            }else if($sliderEl.hasClass('tablet')){
                // set changes to global var "pos" (the global source of truth)
                pos.tablet.offset = val[0];
                pos.tablet.width = val[1];
                // set the small numbers next to the right tab with the new value
                $sliderEl.closest('.welance-grid').find('.wg-tablet-offset').html(pos.tablet.offset);
                $sliderEl.closest('.welance-grid').find('.wg-tablet-width').html(pos.tablet.width);
            }else if($sliderEl.hasClass('wide')){
                // set changes to global var "pos" (the global source of truth)
                pos.wide.offset = val[0];
                pos.wide.width = val[1];
                // set the small numbers next to the right tab with the new value
                $sliderEl.closest('.welance-grid').find('.wg-wide-offset').html(pos.wide.offset);
                $sliderEl.closest('.welance-grid').find('.wg-wide-width').html(pos.wide.width);
            }

            // write obj inside "closest" textarea (textarea of current position block)
            $sliderEl.closest('.welance-grid').find('.wg-data').val(JSON.stringify(pos));

        }catch(err){
            console.error("Something went wrong modifying main JSON position:", pos);
        }
    }

    function getInitVals(slider){
        // get target and create a jquery element out of it (to quickly get properties and helpers w/ jquery)
        var $sliderEl = $(slider[0].target);
        // get Position from the right place!
        pos = _getPosFromCloseEl($sliderEl);
        var data = {"offset": null, "width": null};

        try{
            // find out which breakpoint is related to the slider and set values
            if($sliderEl.hasClass('desktop')){
                // define data to return, to set the correct slider in the right position
                data.offset = pos.desktop.offset;
                data.width = pos.desktop.width;
                // set the small numbers next to the right tab with the new value coming from pos (source of truth)
                $sliderEl.closest('.welance-grid').find('.wg-desktop-offset').html(pos.desktop.offset);
                $sliderEl.closest('.welance-grid').find('.wg-desktop-width').html(pos.desktop.width);
            }else if($sliderEl.hasClass('mobile')){
                // define data to return, to set the correct slider in the right position
                data.offset = pos.mobile.offset;
                data.width = pos.mobile.width;
                // set the small numbers next to the right tab with the new value coming from pos (source of truth)
                $sliderEl.closest('.welance-grid').find('.wg-mobile-offset').html(pos.mobile.offset);
                $sliderEl.closest('.welance-grid').find('.wg-mobile-width').html(pos.mobile.width);
            }else if($sliderEl.hasClass('tablet')){
                // define data to return, to set the correct slider in the right position
                data.offset = pos.tablet.offset;
                data.width = pos.tablet.width;
                // set the small numbers next to the right tab with the new value coming from pos (source of truth)
                $sliderEl.closest('.welance-grid').find('.wg-tablet-offset').html(pos.tablet.offset);
                $sliderEl.closest('.welance-grid').find('.wg-tablet-width').html(pos.tablet.width);
            }else if($sliderEl.hasClass('wide')){
                // define data to return, to set the correct slider in the right position
                data.offset = pos.wide.offset;
                data.width = pos.wide.width;
                // set the small numbers next to the right tab with the new value coming from pos (source of truth)
                $sliderEl.closest('.welance-grid').find('.wg-wide-offset').html(pos.wide.offset);
                $sliderEl.closest('.welance-grid').find('.wg-wide-width').html(pos.wide.width);
            }
            // set "global" (to context "block") checkboxes for row: width, height, new
            $sliderEl.closest('.welance-grid').find('.row-new').prop('checked', pos.new_row);
            $sliderEl.closest('.welance-grid').find('.row-full-width').prop('checked', pos.full_width);
            $sliderEl.closest('.welance-grid').find('.row-full-height').prop('checked', pos.full_height);

            if(pos.full_height){
                $sliderEl.closest('.welance-grid').find('.noUi-connect').addClass('noUi-connect--hi');
            }else{
                $sliderEl.closest('.welance-grid').find('.noUi-connect').removeClass('noUi-connect--hi');
            }
            if(pos.full_width){
                $sliderEl.closest('.welance-grid').find('.wrap-slider').addClass('wrap-slider--full');
                $sliderEl.closest('.welance-grid').find('.slider').addClass('slider--full');
            }else{
                $sliderEl.closest('.welance-grid').find('.wrap-slider').removeClass('wrap-slider--full');
                $sliderEl.closest('.welance-grid').find('.slider').removeClass('slider--full');
            }
            if(pos.new_row){
                $sliderEl.closest('.welance-grid').find('.noUi-connect').addClass('noUi-connect--new');
            }else{
                $sliderEl.closest('.welance-grid').find('.noUi-connect').removeClass('noUi-connect--new');
            }

            // return the data offset and width (flattened) to the right slider
            return data;

        }catch(err){
            console.error("Something went wrong giving initial values to sliders:", data);
        }
    }

    function _hideAllBreakpoints(){
        $('.wg-tab-label').removeClass('wg-tab-label--selected');
        $('.desktop-content, .mobile-content, .tablet-content, .wide-content').hide();
    }

    // this function requires closeElement which is an element inside the right welance-grid context (right block)
    function _getPosFromCloseEl($closeElement){
        // globalposFromDB
        if($closeElement.closest('.welance-grid').find('.wg-data').val()){
            posFromDB = JSON.parse($closeElement.closest('.welance-grid').find('.wg-data').val());
        }
        pos = posFromDB ? posFromDB : defaultPos;
        return pos;
    }

});