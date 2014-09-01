var container, viewPort, colorRe = /^#([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/;

var defaults = {
    fontSize : "large"
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
    "light" : 0.15,
    "heavy" : 0.35,
    "rounded" : 0.5
};

var widget = {
    _initAnalog : function(config) {
        el.select('.numeric').style.visibility = 'hidden';
        var elems = el.selectAll('.analogic');
        for ( var i = 0, len = elems.length; i < len; i++)
            elems[i].style.visibility = 'visible';

        var hour = el.select(".hour");
        var minute = el.select(".minute");
        var second = el.select(".second");

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f) {
            setTimeout(f, 60);
        };

        if (config.param["text_color"] && config.param["text_color"].match(colorRe).length === 4) {
            second.style["border-color"] = config.param["text_color"];
            minute.style.background = config.param["text_color"];
            hour.style.background = config.param["text_color"];
        }

        function updateclock() {
            var curdate = new Date();
            var hour_as_degree = (curdate.getHours() + curdate.getMinutes() / 60) / 12 * 360;
            var minute_as_degree = curdate.getMinutes() / 60 * 360;
            var second_as_degree = (curdate.getSeconds() + curdate.getMilliseconds() / 1000) / 60 * 360;
            hour.style['transform'] = 'rotate(' + hour_as_degree + 'deg)';
            hour.style['-webkit-transform'] = 'rotate(' + hour_as_degree + 'deg)';
            minute.style['transform'] = 'rotate(' + minute_as_degree + 'deg)';
            minute.style['-webkit-transform'] = 'rotate(' + minute_as_degree + 'deg)';
            second.style['transform'] = 'rotate(' + second_as_degree + 'deg)';
            second.style['-webkit-transform'] = 'rotate(' + second_as_degree + 'deg)';
            requestAnimationFrame(updateclock);
        }

        updateclock();
        return;
        setInterval(function() {
            var curdate = new Date();
            var hour_as_degree = (curdate.getHours() + curdate.getMinutes() / 60) / 12 * 360;
            var minute_as_degree = curdate.getMinutes() / 60 * 360;
            var second_as_degree = (curdate.getSeconds() + curdate.getMilliseconds() / 1000) / 60 * 360;
            hour.style['transform'] = 'rotate(' + hour_as_degree + 'deg)';
            hour.style['-webkit-transform'] = 'rotate(' + hour_as_degree + 'deg)';
            minute.style['transform'] = 'rotate(' + minute_as_degree + 'deg)';
            minute.style['-webkit-transform'] = 'rotate(' + minute_as_degree + 'deg)';
            second.style['transform'] = 'rotate(' + second_as_degree + 'deg)';
            second.style['-webkit-transform'] = 'rotate(' + second_as_degree + 'deg)';
        }, 1000);
    },
    _initNumeric : function(config) {
        el.select('.numeric').style.visibility = 'visible';
        var elems = el.selectAll('.analogic');
        for ( var i = 0, len = elems.length; i < len; i++)
            elems[i].style.visibility = 'hidden';

        // initialize
        if (container === undefined)
            container = el.select(".contentContainer");
        container.style.lineHeight = container.clientHeight + "px";
        if (container.clientHeight * 7 < container.clientWidth) // 7 correspond to the ratio between char height and the length of the string hh:mm::ss pm
            container.style.fontSize = container.clientHeight * fontSizeMap[config.param["font-size"] || defaults.fontSize] + "px";
        else
            container.style.fontSize = container.clientWidth * fontSizeMapH[config.param["font-size"] || defaults.fontSize] + "px";

        if (config.param["font-family"])
            container.style.fontFamily = config.param["font-family"];
        if (config.param["text_color"] && config.param["text_color"].match(colorRe).length === 4)
            container.style.color = config.param["text_color"];

        /* setup clock refresh */
        container.innerText = (new Date()).toLocaleTimeString();
        setInterval(function() {
            container.innerText = (new Date()).toLocaleTimeString();
        }, 500);
    },
    update : function(cfg) {
        config = cfg || config || {
            "param" : {}
        };

        if (viewPort === undefined)
            viewPort = el.select(".clockWidget");
        config.param.viewPortWidth = viewPort.clientWidth + "px";

        var bg_color = {
            "match" : config.param["bg_color"] && config.param["bg_color"].match(colorRe) || undefined,
            "alpha" : Number(config.param["bg_color.alpha"])
        };
        if (bg_color.match && bg_color.match.length === 4) {
            if (!bg_color.alpha || bg_color.alpha > 1)
                bg_color.alpha = 1;
            bg_color.color = "rgba(" + parseInt(bg_color.match[1], 16) + "," + parseInt(bg_color.match[2], 16) + "," + parseInt(bg_color.match[3], 16) + "," + bg_color.alpha + ")";
        }

        var elems = el.selectAll('.face');
        for ( var i = 0, len = elems.length; i < len; i++) {
            if (borderRadiusMap[config.param["border-radius"]])
                elems[i].style['borderRadius'] = (borderRadiusMap[config.param["border-radius"]]) * viewPort.clientHeight + "px";
            elems[i].style['backgroundColor'] = bg_color.color || "white";
        }

        if (config.param.type == "analogic")
            widget._initAnalog(config);
        else
            widget._initNumeric(config);
    }
};

window.onresize = function(event) {
    widget.update();
};

function suffixScript() {
    el.setWidget(widget);
}