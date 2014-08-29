var config, settings, container, viewPort, viewable, colorRe = /^#([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/;

var defaults = {
    fontSize : "large"
};

var fontSizeMap = {
    full : 0.85,
    large : 0.73,
    medium : 0.55,
    small : 0.4
};

var borderRadiusMap = {
    "light" : 0.15,
    "heavy" : 0.35,
    "rounded" : 0.5
};

var widget = {
    update : function(cfg) {
        config = cfg;

        // initialize
        if (container === undefined)
            container = el.select(".contentContainer");
        if (viewPort === undefined)
            viewPort = el.select(".textWidget");
        if (viewable === undefined)
            viewable = el.select(".viewable");
        container.innerHTML = '';
        container.style.webkitAnimation = "";
        container.style.webkitAnimationPlayState = "paused";
        config.viewPortWidth = viewPort.clientWidth + "px";
        container.style.lineHeight = container.clientHeight + "px";
        container.style.fontSize = container.clientHeight * fontSizeMap[config.param["font-size"] || defaults.fontSize] + "px";

        var bg_color = {}, family, content = [];
        for ( var x in cfg.param) {
            var v = cfg.param[x];

            if (x === "font-family") {
                container.style.fontFamily = v;
            }
            if (x === "text_color" && v.match(colorRe).length === 4) {
                container.style.color = v;
            }
            if (x === "bg_color") {
                bg_color.match = v.match(colorRe);
            }
            if (x === "bg_color.alpha" && !isNaN(Number(v))) {
                bg_color.alpha = Number(v);
                if (bg_color.alpha > 1) {
                    el.log.warn('Given invaild alpha : ' + v);
                    bg_color.alpha = 1;
                } else if (bg_color.alpha < 0) {
                    el.log.warn('Given invaild alpha : ' + v);
                    bg_color.alpha = 0;
                } else if (isNaN(bg_color.alpha)) {
                    bg_color.alpha = 1;
                }
            }
        }
        if (bg_color.match.length === 4) {
            viewPort.style.backgroundColor = "rgba(" + parseInt(bg_color.match[1], 16) + "," + parseInt(bg_color.match[2], 16) + "," + parseInt(bg_color.match[3], 16) + "," + bg_color.alpha + ")";
        }
        var borderRadius = borderRadiusMap[config.param["border-radius"]] || 0;
        viewPort.style.borderRadius = borderRadius * viewPort.clientHeight + "px";
        viewable.style.marginRight = viewable.style.marginLeft = borderRadius * viewPort.clientHeight * 0.5 + "px";
        viewable.style.width = viewPort.clientWidth - borderRadius * viewPort.clientHeight + "px";
        
        /* setup clock refresh */
        container.innerText = (new Date()).toLocaleTimeString();
        setInterval(function() {
            container.innerText = (new Date()).toLocaleTimeString();
        }, 500);
    }
};

function suffixScript() {
    el.setWidget(widget);
}