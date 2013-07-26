/**
 * Color Picker and Utility
 * @namespace nodedit.plugin.colorutil
 */
nodedit.plugin.colorutil = {

    // Define template(s) to load
    templates: {
        dialog: 'dialog.tpl'
    },
    
    dependencies: [
        'deps/colorutil.css'
    ],
    
    // Define icon associated with plugin (http://fortawesome.github.io/Font-Awesome/icons/)
    icon: 'icon-pencil',
    
    /**
     * Define handling of open from plugin menu
     * @method nodedit.plugin.colorutil.onMenu
     */
    onMenu: function () {
        var _this = this;
        nodedit.modal.open(500, 'Color Utility', _this.templates.dialog, {}, function() {
            _this.bindInputs();
        });
    },
    
    /**
     * Binds the 3 input to modificatio and blur events
     * @method nodedit.plugin.colorutil.bindInputs
     */
    bindInputs: function () {
        var _this = this;
        $('#colorutil-picker input, #colorutil-hex input, #colorutil-rgb input').on('keyup change blur', function (e) {
            _this.updateVals($(this).attr('name'), $(this).val(), e.type);
        });
    },
    
    /**
     * When a bound field value changes, update the other fields
     * @method nodedit.plugin.colorutil.updateVals
     * @param {string} source The input that was changed
     * @param {string} value The value of the source field
     * @param {string} trigger The event triggering the update
     */
    updateVals: function (source, value, trigger) {
        var _this = this,
            vals = [],
            rgb, hex, 
            err = false;
        if (source==='picker' || source==='hex') {
            // Format is hex, convert vals
            hex = value;
            rgb = _this.convertColor(value);
            if (rgb) {
                // No error on conversion, set array
                vals = [hex, rgb];
            } else {
                // Error returned on conversion
                err = true;
            }
        } else {
            // Format is rgb, convert vals
            rgb = value;
            hex = _this.convertColor(value);
            if (hex) {
                // No error on conversion, set array
                vals = [hex, rgb];
            } else {
                // Error returned on conversion
                err = true;
            }
        }
        
        if (!err) {
            // No errors, update fields
            $('#colorutil-picker input, #colorutil-hex input').val(vals[0]);
            $('#colorutil-rgb input').val(vals[1]);
        } else if (err && trigger==='blur') {
            // Error on blur, send error message
            nodedit.message.error('Please correct the '+source+' format');
        } 
    },
    
    /**
     * Converts color between hex and rgb based on format
     * @method nodedit.plugin.colorutil.convertColor
     * @param {string} color The color value (hex or rgb)
     */
    convertColor: function (color) {

        var rgbToHex = function (rgb) {
            var arrRGB = rgb.split(','),
                output = '',
                i, z;
            
            // Loop through each value
            for (i=0, z=arrRGB.length; i<z; i++) {
                var n = parseInt(arrRGB[i].trim(),10);
                if (isNaN(n)) {
                    // If NaN, assume 00
                    output += "00";
                } else {
                    // Determing hex value and concatenate output
                    n = Math.max(0,Math.min(n,255));
                    output += "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
                }
            }
            
            // Return hex-formatted output
            return '#' + output;
            
        };
        
        var hexToRGB = function (hex) {
            var r, g, b;
            
            // Remove #
            hex = hex.replace('#','');
            
            // Determing R, G, & B
            r = parseInt((hex).substring(0,2),16);
            g = parseInt((hex).substring(2,4),16);
            b = parseInt((hex).substring(4,6),16);
            
            // Return converted value
            return r + ',' + g + ',' + b;
            
        };
        
        // Determine conversion
        if (color.indexOf('#')===0) {
            // color is hex
            return hexToRGB(color);
        } else if (color.indexOf(',')>0) {
            // color is rgb
            return rgbToHex(color);
        } else {
            // Unsure, return false
            return false;
        }
        
    }
  
};