(function($){
$.fn.extend({
    createRepeater: function (options = {}) {

        var getFontWeight = function () {
            $value = 'normal';
            $('.bsf-custom-fonts-file-wrap .font-weight').on("change", function ( e ) {
                $value =  $(this).val();
                $(this).attr( 'value', $value );
            });
            return $value;
        };
        var hasOption = function (optionKey) {
            return options.hasOwnProperty(optionKey);
        };
        var option = function (optionKey) {
            return options[optionKey];
        };
        var addItem = function (items, key, fresh = true) {
            var itemContent = items;
            var group = itemContent.data("group");
            var item = itemContent;
            var input = item.find('input,select');
            input.each(function (index, el) {
                var attrName = $(el).data('name');
                var skipName = $(el).data('skip-name');
                // console.log( $(el).val() );
                // console.log( getFontWeight() );
                if (skipName != true) {
                    if( attrName == '[font-weight]' ) {
                        $(el).attr("name", 'bsf_custom_fonts[repeater_fields]' + attrName);
                    }
                    else{
                        $(el).attr("name", 'bsf_custom_fonts' + "[repeater_fields]["+getFontWeight()+"]" + attrName);
                    }
                } else {
                    if (attrName != 'undefined') {
                        $(el).attr("name", attrName);
                    }
                }
                if (fresh == true) {
                    $(el).attr('value', '');
                }
            })
            var itemClone = items;

            /* Handling remove btn */
            var removeButton = itemClone.find('.remove-btn');

            if (key == 0) {
                removeButton.attr('disabled', true);
            } else {
                removeButton.attr('disabled', false);
            }

            removeButton.attr('onclick', '$(this).parents(\'.items\').remove()');

            $("<div class='items'>" + itemClone.html() + "<div/>").appendTo(repeater);
        };
        /* find elements */
        var repeater = this;
        var items = repeater.find(".items");
        var key = 0;
        var addButton = repeater.find('.repeater-add-btn');

        items.each(function (index, item) {
            items.remove();
            if (hasOption('showFirstItemToDefault') && option('showFirstItemToDefault') == true) {
                addItem($(item), key);
                key++;
            } else {
                if (items.length > 1) {
                    addItem($(item), key);
                    key++;
                }
            }
        });

        $('.bsf-custom-fonts-file-wrap .font-weight').on("change", function ( e ) {
            $value =  $(this).val();
            $(this).attr( 'value', $value );
            $name = $( '.term-font_woff_2-wrap .font_woff_2' ).attr( 'name' );
            $name = $name.replace("normal", $value );
            $( '.term-font_woff_2-wrap .font_woff_2' ).attr( 'name', $name );
            $( '.term-font_woff-wrap .font_woff' ).attr( 'name', $name );
            $( '.term-font_ttf-wrap .font_ttf' ).attr( 'name', $name );
            $( '.term-font_eot-wrap .font_eot' ).attr( 'name', $name );
            $( '.term-font_svg-wrap .font_svg' ).attr( 'name', $name );
            $( '.term-font_otf-wrap .font_otf' ).attr( 'name', $name );

        }); 

        /* handle click and add items */
        addButton.on("click", function () {
            addItem($(items[0]), key);
            key++;
        });
    }
});
})(jQuery);