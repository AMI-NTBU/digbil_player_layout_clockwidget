 var config, container, viewPort, updateInterval, colorRe = /^#([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/;

    /* simulate layout interface: for testing purpose only */
// el = {
// "select" : function(cfg) {
// return document.querySelector(cfg);
// },
// "selectAll" : function(cfg) {
// return document.querySelectorAll(cfg);
// },
// "onResize" : function(cfg) {
// window.onresize = cfg;
// }
// };

    var defaults = {
        fontSize : 'large'
    };

    var fontSizeMap = {
        full : 0.85,
        large : 0.73,
        medium : 0.55,
        small : 0.4
    };
    var fontSizeMapH = {
        full : 0.18,
        large : 0.14,
        medium : 0.12,
        small : 0.10
    };

    var borderRadiusMap = {
        'light' : 0.15,
        'heavy' : 0.35,
        'rounded' : 0.5
    };

    var widget = {
        _initAnalog : function(config) {
            var analogic = el.select('.analogic');
            el.select('.numeric').style.visibility = 'hidden';
            analogic.style.visibility = 'visible';

            var hour = el.select('.hour');
            var minute = el.select('.minute');
            var second = el.select('.second');

            /* change color */
            if (config.param['text_color'] && config.param['text_color'].match(colorRe).length === 4) {
                second.style['border-color'] = config.param['text_color'];
                minute.style.background = config.param['text_color'];
                hour.style.background = config.param['text_color'];
            }

            /* set date size */
            var date;
            if (config.param['display-date']) {
                date = el.select('.date');
                date.style.visibility = "visible";
                date.style.fontSize = (fontSizeMap[config.param['font-size'] || defaults.fontSize]) * 30 + 'px';
            }

            /* adjust to clock to the viewport */
            analogic.style['-webkit-transform'] = 'scale(' + (viewPort.clientWidth / analogic.clientWidth) + ',' + (viewPort.clientHeight / analogic.clientHeight) + ')';

            var update = function() {
                var curdate = new Date();
                var hour_as_degree = curdate.getHours() * 30 + curdate.getMinutes() * 0.5;
                var minute_as_degree = curdate.getMinutes() * 6;// / 60 * 360;
                var second_as_degree = curdate.getSeconds() * 6;
                hour.style['transform'] = 'rotate(' + hour_as_degree + 'deg)';
                hour.style['-webkit-transform'] = 'rotate(' + hour_as_degree + 'deg)';
                minute.style['transform'] = 'rotate(' + minute_as_degree + 'deg)';
                minute.style['-webkit-transform'] = 'rotate(' + minute_as_degree + 'deg)';
                second.style['transform'] = 'rotate(' + second_as_degree + 'deg)';
                second.style['-webkit-transform'] = 'rotate(' + second_as_degree + 'deg)';
                if (date)
                    date.innerHTML = curdate.toLocaleDateString();// '<span style="font-family: monospace;">'+'</span>';
            };

            update();
            if(updateInterval)
                clearInterval(updateInterval);
            updateInterval = setInterval(update, 1000); 
        },
        _initNumeric : function(config) {
            el.select('.numeric').style.visibility = 'visible';
            el.select('.analogic').style.visibility = 'hidden';

            // initialize
            if (container === undefined)
                container = el.select('.contentContainer');

            /* to display the date we have to cut the date in half */
            var divider = (config.param['display-date']) ? 0.5 : 1;

            /* 7 correspond to the ratio between char height and the length of the string hh:mm::ss pm */
            var orientation = container.clientHeight * 7.8 < container.clientWidth;
            console.log(orientation);
            if (orientation)
                container.style.fontSize = (container.clientHeight * fontSizeMap[config.param['font-size'] || defaults.fontSize]) + 'px';
            else
                container.style.fontSize = (container.clientWidth * fontSizeMapH[config.param['font-size'] || defaults.fontSize]) * (divider) + 'px';

            container.style.lineHeight = container.clientHeight * (orientation? 1 : divider) + 'px';

            if(updateInterval)
                clearInterval(updateInterval);
            
            /* setup clock refresh */
            var now = new Date();
            container.innerHTML = now.toLocaleTimeString() + ((config.param['display-date']) ? ((orientation ? '' : '<br/>') + '<span style="font-size: ' + (container.style.fontSize * 0.7) + 'px ;">' + now.toLocaleDateString() + '</span>') : '');
            updateInterval = setInterval(function() {
                now = new Date();
                container.innerHTML = now.toLocaleTimeString() + ((config.param['display-date']) ? ((orientation ? '' : '<br/>') + '<span style="font-size: ' + (container.style.fontSize * 0.7) + 'px ;">' + now.toLocaleDateString()) + '</span>' : '');
            }, 500);
        },
        update : function(cfg) {
            config = cfg || config || {
                'param' : {}
            };

            if (viewPort === undefined)
                viewPort = el.select('.clockWidget');

            /* back ground color */
            var bg_color = {
                'match' : config.param['bg_color'] && config.param['bg_color'].match(colorRe) || undefined,
                'alpha' : Number(config.param['bg_color.alpha'])
            };
            if (bg_color.match && bg_color.match.length === 4) {
                if (!bg_color.alpha || bg_color.alpha > 1)
                    bg_color.alpha = 1;
                bg_color.color = 'rgba(' + parseInt(bg_color.match[1], 16) + ',' + parseInt(bg_color.match[2], 16) + ',' + parseInt(bg_color.match[3], 16) + ',' + bg_color.alpha + ')';
            }

            /* border radius : round or square */
            var elems = el.selectAll('.background');
            for ( var i = 0, len = elems.length; i < len; i++) {
                if (borderRadiusMap[config.param['border-radius']])
                    elems[i].style['border-radius'] = (borderRadiusMap[config.param['border-radius']]) * viewPort.clientHeight + 'px';
                elems[i].style['background-color'] = bg_color.color || 'white';
            }

            /* init text style */
            var elems = el.selectAll('.text');
            if (config.param['font-family'])
                for ( var i = 0, len = elems.length; i < len; i++)
                    elems[i].style['font-family'] = config.param['font-family'];
            
            if (config.param['text_color'] && config.param['text_color'].match(colorRe).length === 4)
                for ( var i = 0, len = elems.length; i < len; i++)
                    elems[i].style.color = config.param['text_color'];

            if (config.param.type == 'analogic')
                widget._initAnalog(config);
            else
                widget._initNumeric(config);
        }
    };

    if (el.onResize)
        el.onResize(function(event) {
            widget.update();
        });

    function suffixScript() {
        el.setWidget(widget);
    }