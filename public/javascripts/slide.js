jQuery(document)
    .ready(function (q) {
    q("#pagenavi")
        .css("display", "none")
        .before('<div id="ajax-loader"></div>');
    var s = "Loading",
        r = q("#ajax-loader")
            .html(s),
        f = 5,
        i, p = q(window),
        o = p.width(),
        v = parseInt(q("#pagenavi span.current")
            .text()),
        u = v * 4,
        k = u - 2,
        t = true;
    q("#ajax-loader")
        .css({
        width: 120,
        height: 20,
        margin: "0px auto",
        display: "none"
    });
    q("#wrapper")
        .css({
        width: "auto"
    });
    q(".post-thumbnail a.img,.post-thumbnail a.noimg")
        .live({
        mouseenter: function () {
            q(this)
                .stop()
                .children("span")
                .slideDown(100)
        },
        mouseout: function () {
            q(this)
                .stop()
                .children("span")
                .slideUp(100)
        }
    });
    q("#container")
        .waterfall({
        isResizable: true,
        endFn: function () {
            q("#header-box")
                .css("width", q("#container")
                .width())
        }
    });
    q("#post-tags a")
        .each(function () {
        var d = q(this),
            b = d.attr("title"),
            a = parseInt(b),
            c = "<span>" + a + "</span>";
        d.append(c)
    });
    p.bind("scroll", function () {
        var d = p.scrollTop(),
            c = q("#footer")
                .offset()
                .top,
            a = p.height(),
            b = c - d - a;
            
        if (t != false && b <= 0) {
            x()
        }
    });

    function w() {
        (f < 0) ? (f = 5, r.html(s), w()) : (r[0].innerHTML += "·", f--, i = setTimeout(w, 200))
    }
    function x() {
        if (k <= u) {
            var c = q("#cate")
                .attr("data-type"),
                b = q("#cate")
                    .attr("data-name"),
                a = "";
            switch (c) {
           
            case "index":
/*                 a = "?action=ajax_post&pag=" + k; */
				a = "/post";
              
                break;
            case "cat":
                a = "?action=ajax_post&cat=" + b + "&pag=" + k;
                break;
            case "tag":
                a = "?action=ajax_post&tag=" + b + "&pag=" + k;
                break;
            case "meta":
                a = "?action=ajax_post&meta=" + b + "&pag=" + k;
                break
            }
            q.ajax({
                url: a,
                beforeSend: function () {
                    t = false;
                    r.fadeIn(200);
                    w()
                },
                success: function (d) {
                    if (!d) {
                        r.fadeOut(500);
                        q("#pagenavi")
                            .show();
                        p.unbind("scroll");
                        clearTimeout(i);
                        i = null;
                        return false

                        
                    } else {
                    	
                    	var _d = '';
                    	q.each(d,function(key,value) {
                    		
                    		q.each(value,function(_key,_value) {
                    			_d +=  _value.content ;
                    			
                    		})
                    	})
                        q("#container")
                            .append(_d)
                            .waterfall({
                            isResizable: true,
                            endFn: function () {
                                t = true;
                                r.fadeOut(500);
                                clearTimeout(i);
                                i = null;
                                k++
                            }
                        })
                    }
                }
            })
        } else {
        
            q("#pagenavi")
                .show();
            p.unbind("scroll");
            return false
        }
    }
});