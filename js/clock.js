var config, timeField, dateField, viewPort, updateInterval, colorRe = /^#([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/;

var defaults = {
    "fontSize" : "large"
};

var fontSizeMap = {
    "full" : 0.85,
    "large" : 0.73,
    "medium" : 0.55,
    "small" : 0.4
};
var fontSizeMapH = {
    "full" : 0.18,
    "large" : 0.14,
    "medium" : 0.12,
    "small" : 0.10
};

var borderRadiusMap = {
    "light" : 0.15,
    "heavy" : 0.35,
    "rounded" : 0.5
};

var borderSizeMap = {
    "none" : 0,
    "small" : 0.2,
    "large" : 0.4
};

var dayStr = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
var monthStr = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

var widget = {
    _initAnalog : function(config) {
        var analogic = el.select('.analogic');
        el.select('.numeric').style.display = 'none';
        analogic.style.display = 'block';

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
            // date.style.fontSize = (fontSizeMap[config.param['font-size'] || defaults.fontSize]) * 30 + 'px';
        }

        /* adjust to clock to the viewport */
        if (config.param['fixe-ratio'] && config.param['fixe-ratio'] !== "false") {
            var size = Math.min(viewPort.clientHeight, viewPort.clientWidth);
            analogic.style['-webkit-transform'] = 'scale(' + (size / analogic.clientWidth) + ',' + (size / analogic.clientHeight) + ')';
        } else
            analogic.style['-webkit-transform'] = 'scale(' + (viewPort.offsetWidth / analogic.clientWidth) + ',' + (viewPort.offsetHeight / analogic.clientHeight) + ')';

        var today;
        var update = function() {
            var now = new Date();
            var hour_as_degree = now.getHours() * 30 + now.getMinutes() * 0.5;
            var minute_as_degree = now.getMinutes() * 6;// / 60 * 360;
            var second_as_degree = now.getSeconds() * 6;
            hour.style['transform'] = 'rotate(' + hour_as_degree + 'deg)';
            hour.style['-webkit-transform'] = 'rotate(' + hour_as_degree + 'deg)';
            minute.style['transform'] = 'rotate(' + minute_as_degree + 'deg)';
            minute.style['-webkit-transform'] = 'rotate(' + minute_as_degree + 'deg)';
            second.style['transform'] = 'rotate(' + second_as_degree + 'deg)';
            second.style['-webkit-transform'] = 'rotate(' + second_as_degree + 'deg)';
            if (date && now.getDate() != today) {
                today = now.getDate();
                date.innerHTML = dayStr[now.getDay()] + ', ' + monthStr[now.getMonth()] + ' ' + today;// '<span style="font-family: monospace;">'+'</span>';
            }
        };

        update();
        if (updateInterval)
            clearInterval(updateInterval);
        updateInterval = setInterval(update, 1000);
    },
    _initNumeric : function(config) {
        el.select('.numeric').style.display = 'block';
        el.select('.analogic').style.display = 'none';

        // initialize
        if (timeField === undefined)
            timeField = el.select('.numericTime');

        if (dateField === undefined)
            dateField = el.select('.numericDate');

        var timeContainer = el.select('.timeContainer');

        if (config.param['display-date'])
            /* check the widget orientation */
            if (viewPort.clientHeight > viewPort.clientWidth / 4) {
                timeContainer.style.height = "60%";
                timeContainer.style.width = "100%";
                el.select('.dateContainer').style.height = "40%";
                el.select('.dateContainer').style.width = "100%";
            } else {
                timeContainer.style.display = "inline-block";
                timeContainer.style.width = "55%";
                timeContainer.style.height = "100%";

                el.select('.dateContainer').style.display = "inline-block";
                el.select('.dateContainer').style.width = "40%";
                el.select('.dateContainer').style.height = "100%";
            }

        if (updateInterval)
            clearInterval(updateInterval);

        /* setup clock refresh */
        var now = new Date();
        var today = now.getDate();
        timeField.innerHTML = now.getHours() + ":" + ((now.getMinutes() < 10) ? '0' : '') + now.getMinutes();
        if (config.param['display-date'])
            dateField.innerHTML = '<small>' + dayStr[now.getDay()] + ',' + monthStr[now.getMonth()] + ' ' + today + '</small>';

        updateInterval = setInterval(function() {
            now = new Date();
            timeField.innerHTML = now.getHours() + ":" + ((now.getMinutes() < 10) ? '0' : '') + now.getMinutes();
            /* just avoid reconstructing the string for the date every time.. */
            if (config.param['display-date'] && now.getDate() != today) {
                today = now.getDate();
                dateField.innerHTML = '<small>' + dayStr[now.getDay()] + ',' + monthStr[now.getMonth()] + ' ' + today + '</small>';
            }
        }, 10000);
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
            if (bg_color.alpha === undefined || isNaN(bg_color.alpha) || bg_color.alpha > 1)
                bg_color.alpha = 1;
            bg_color.color = 'rgba(' + parseInt(bg_color.match[1], 16) + ',' + parseInt(bg_color.match[2], 16) + ',' + parseInt(bg_color.match[3], 16) + ',' + bg_color.alpha + ')';
        }

        /* border radius : round or square */
        var elems = el.selectAll('.background');
        for ( var i = 0, len = elems.length; i < len; i++) {
            elems[i].style['box-shadow'] = 'inset 0 0 ' + (borderSizeMap[config.param['border'] || 'small'] * Math.min(elems[i].offsetHeight, elems[i].offsetWidth)) + 'px ' + (config.param['text_color'] || 'gray');
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

        var elems = el.selectAll('.text');
        for ( var i = 0, len = elems.length; i < len; i++) {
            /* get the ratio to fit the container either H or W */
            if (!elems[i].style.fontSize)
                elems[i].style.fontSize = '10px';// just used to calculate text ratio

            /* get the smallet ratio than shoud apply to the text */
            var ratio = Math.min(elems[i].parentNode.clientWidth / elems[i].offsetWidth, elems[i].parentNode.clientHeight / elems[i].offsetHeight);
            /* apply the ratio on the current font size + modifier */
            var size = (Number(elems[i].style.fontSize.replace('px', '')) * ratio * fontSizeMap[config.param['font-size'] || defaults.fontSize]);
            elems[i].style['font-size'] = size + 'px';
            elems[i].style['line-height'] = elems[i].parentNode.clientHeight + 'px';
            elems[i].style['text-shadow'] = size * 0.05 + 'px ' + size * 0.05 + 'px ' + size * 0.05 + 'px rgba(0, 0, 0, 0.5)';
        }
    }
};

if (el.onResize)
    el.onResize(function(event) {
        widget.update();
    });

function suffixScript() {
    el.setWidget(widget);
}