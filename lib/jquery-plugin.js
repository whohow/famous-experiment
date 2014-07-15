(function($){
    $.fn.fillWithImage = function(imgUrl){
        var $this = $(this);
        $this.html('');
        if (imgUrl) {
            //if the source is internal
            if (imgUrl.indexOf(':')<0)
            {
                imgUrl = "http://trivia.playableitem.demobo.com/" + imgUrl;
            }
            if (imgUrl.match(/.svg$/)) {
                $.get(imgUrl, function(d){
                    var s = new XMLSerializer();
                    $this.setSVG(s.serializeToString(d.querySelector('svg')));
                });
            }
            else
            {
                Helper.getImage(imgUrl, function(dataUrl) {
                    $this.html('<img src="'+dataUrl+'">');
                }.bind(this));
            }
        } else {
            $this.html('');
        }
    };
  
    $.fn.setSVG = function(svg) {
        var $this = $(this);
        $this.html(svg);
        var zoom = $this.width() / $('svg', $this).width();
        $this.css('height',zoom*$('svg', $this).height());
        $('svg', $this).css('zoom', zoom);
        var total = $('svg', $this).children().length;
        var animationInterval = 10000/total;
        $('svg', $this).children().hide().each(function(index, element){
            setTimeout(function(){
                $(element).show('slow');
            }, index * animationInterval);
        });
    };

    $.fn.countdown = function(total, callback) {
        var theCountdown = $(this);
        var timer = theCountdown.prop('timer');
        clearInterval(timer);
        if (total == 0) {
            theCountdown.hide();
            return;
        }
        theCountdown.show();
        theCountdown.prop('isTimerRunning', true);
        var color1 = "#ffdc50";
        var color2 = "#ff5050";

        theCountdown.html('<i class="clock_playpause fa fa-pause"></i><div class="clock_seconds"><div class="bgLayer"><div class="topLayer"></div><canvas id="canvas_seconds" width="194" height="194"></canvas><div class="text"><p class="val">0</p></div></div></div>');
        theCountdown.find('.clock_seconds .text').css('background', '');
        theCountdown.find('.clock_playpause').click(function() {
            toggleCountdown();
        });
        var warning = total / 2;
        function deg(deg) {
            return (Math.PI / 180) * deg - (Math.PI / 180) * 90;
        }
        function toggleCountdown() {
            theCountdown.prop('isTimerRunning', !(theCountdown
                .prop('isTimerRunning')));
            theCountdown.find('.clock_playpause').toggleClass('fa-pause fa-play');
        }
        function advance(seconds) {
            if (seconds == total) {
                clearInterval(timer);
                if (callback)
                    callback();
            }
            color = (seconds < warning) ? color1 : color2;
            var cSec = theCountdown.find("#canvas_seconds").get(0);
            var ctx = cSec.getContext("2d");
            ctx.clearRect(0, 0, cSec.width, cSec.height);
            ctx.beginPath();
            ctx.strokeStyle = color;

            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = color;

            ctx.arc(97, 97, 85, deg(0), deg(360 * seconds / total));
            ctx.lineWidth = 17;
            ctx.stroke();
            // if (seconds==warning)
            // theCountdown.find('.clock_seconds').effect("pulsate", { times:
            // (total-warning) }, (total-warning)*1000);
            if (seconds >= warning) {
                theCountdown.find('.clock_seconds .text').css('background',
                    'rgba(255,0,0,0.3)');
                ctx.beginPath();
                ctx.strokeStyle = color1;

                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = color1;

                ctx.arc(97, 97, 85, deg(0), deg(360 * warning / total));
                ctx.lineWidth = 17;
                ctx.stroke();
            }
            theCountdown.find(".clock_seconds .val").text(total - seconds);
        }
        var cd = 0;
        advance(cd);
        timer = setInterval(function() {
            if (theCountdown.prop('isTimerRunning'))
                advance(++cd);
        }, 1000);
        theCountdown.prop('timer', timer);
        return theCountdown;
    };

    $.fn.moveUp = function() {
        $.each(this, function() {
            $(this).after($(this).prev());
        });
    };

    $.fn.moveDown = function() {
        $.each(this, function() {
            $(this).before($(this).next());
        });
    };

    $.fn.hint = function(blurClass) {
        if (!blurClass) {
            blurClass = 'blur';
        }
        return this
            .each(function() {
                var $input = $(this), title = $input.attr('title'), $form = $(this.form), $win = $(window);

                function remove() {
                    if ($input.val() === title && $input.hasClass(blurClass)) {
                        $input.val('').removeClass(blurClass);
                    }
                }

                if (title) {
                    $input.blur(function() {
                        if (this.value === '') {
                            $input.val(title).addClass(blurClass);
                        }
                    }).focus(remove).blur();
                    $form.submit(remove);
                }
            });
    };

})( jQuery );
