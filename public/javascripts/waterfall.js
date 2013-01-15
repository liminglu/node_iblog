
/**
 * @name jQuery waterfall Plugin
 * @version 1.0.7
 * @create 2012.1.30
 * @lastmodified 2012.5.18
 * @description Based on jQuery 1.4+
 * @author MuFeng (http://mufeng.me)
 * @url http://mufeng.me/waterfall.html
 **/~
function (d) {
    var g = [],
        h = function (b, a) {
            this.options = b;
            this.element = d(a);
            this.init()
        };
    h.prototype = {
        init: function () {
            this.initArg();
            this.reSize();
            this.layout(this.getBricks(this.element))
        },
        getBricks: function (a) {
            var b = this.options.itemSelector;
            if (!this.options.isNewsize) {
                return !b ? a.children().not(".waterfall") : a.filter(b).not(".waterfall").add(a.find(b))
            } else {
                return !b ? a.children() : a.filter(b).add(a.find(b))
            }
        },
        getSize: function () {
            var c = this.getBricks(this.element)[0],
                n = d(c),
                b = this.options.columnCount,
                s = this.options.columnWidth,
                e = [],
                p = n.outerWidth(true),
                r = d(window).width() - 20,
                a = !s ? p : s,
                q = !b ? parseInt(r / a) : b;
            return e.concat(a, q)
        },
        initArg: function () {
            var b = g.length;
            if (this.options.isNewsize) {
                g = [];
                b = 0
            }
            if (b < 1) {
                var e, a = this.getSize(),
                    c = a[1];
                for (e = 0; e < c; e++) {
                    g[e] = 0
                }
            }
        },
        reSize: function () {
            this.element.css("position", "relative");
            if (this.options.isResizable) {
                var a = this.getSize(),
                    b = a[1],
                    c = a[0];
                this.element.css({
                    width: b * c
                })
            }
        },
        layout: function (c) {
            var n = 0,
                b = this.element,
                y = c.length,
                w = this.options.isAnimated,
                e = this.options.Duration,
                x = this.options.Easing,
                A = this.options.endFn,
                i = this.getSize(),
                z = this.options.isNewsize,
                a = i[0],
                B;
            if (!z) {
                c.css("display", "none")
            }
            t();

            function t() {
                if (n < y) {
                    var m = c[n],
                        l = d(m),
                        o = v(g),
                        j = Math.max.apply(Math, g);
                    if (!z) {
                        b.height(j)
                    }
                    l.addClass("waterfall");
                    var k = l.outerHeight(true);
                    !w ? (l.css({
                        display: "block",
                        position: "absolute",
                        left: o * a,
                        top: g[o]
                    })) : (!z ? (l.css({
                        display: "block",
                        position: "absolute",
                        left: 0,
                        top: j
                    }).stop().animate({
                        left: o * a,
                        top: g[o]
                    }, {
                        Duration: e,
                        Easing: x
                    })) : (l.css({
                        display: "block",
                        position: "absolute"
                    }).stop().animate({
                        left: o * a,
                        top: g[o]
                    }, {
                        Duration: e,
                        Easing: x
                    })));
                    g[o] += k;
                    n++;
                    B = setTimeout(t, 10)
                } else {
                    if (n >= y) {
                        clearTimeout(B);
                        B = null;
                        var j = Math.max.apply(Math, g);
                        b.height(j);
                        if (typeof A == "function") {
                            A.call(c)
                        }
                    }
                }
            }
            function v(o) {
                var m, k = 0,
                    l = o[0],
                    j = o.length;
                for (m = 1; m < j; m++) {
                    if (o[m] < l) {
                        l = o[m];
                        k = m
                    }
                }
                return k
            }
        }
    };
    d.waterfall = function (b, a) {
        b = d.extend({
            isResizable: false,
            isAnimated: false,
            isNewsize: false,
            Duration: 500,
            Easing: "swing",
            endFn: function () {}
        }, b);
        d.data(a, "waterfall", new h(b, a));
        return a
    };
    d.fn.waterfall = function (a) {
        return d.waterfall(a, this)
    };

    function f(a) {
        console.log({}.toString.call(a) + " | " + a)
    }
}(jQuery);