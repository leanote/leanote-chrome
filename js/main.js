if (self === window.parent) {

    // Default official server address
    var host = 'https://leanote.com';
    // Visible flag
    var visible = false;

    function show(request) {
        // Avoid recursive frame insertion...
        var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
        if (!location.ancestorOrigins.contains(extensionOrigin)) {

            // Data to be sent to leanote, shown as title
            var data = {title: document.title, 
                src: location.href
            };

            getServerAddr(request);

            // Bind listener, wait for message from leanote
            window.addEventListener('message', function(e) {
                console.log("received message from child iframe");
                window.frames['leanote-ifr'].postMessage(data, host);
            }, false);

            var tpl = '<div class="leanote-ifr-ctn">'
                + '<div class="leanote-ifr-resizer leanote-ifr-resizer-left"></div>'
                + '<div class="leanote-ifr-resizer leanote-ifr-resizer-right"></div>'
                + '<div class="leanote-ifr-resizer leanote-ifr-resizer-lb"></div>'
                + '<div class="leanote-ifr-resizer leanote-ifr-resizer-rb"></div>'
                + '<div class="leanote-ifr-resizer leanote-ifr-resizer-bottom"></div>'
                + '<div class="leanote-ifr-header">Leanote<span class="leanote-ifr-min">-</span><span class="leanote-ifr-max">+</span><span class="leanote-ifr-close" title="关闭">x</span></div>'
                + '<div class="leanote-ifr-body"><iframe name="leanote-ifr" class="leanote-ifr" src="' + host + "/note?from=plugin" + '"></iframe></div>'
                + '</div>';
                $('body').append(tpl);

            visible = true;
            // After display, set setting changed flag to false
            chrome.storage.local.set({'setting_changed': false}, function() {}); 
        }
        else {
            return;
        }

        $('.leanote-ifr-min').click(function () {
            $('.leanote-ifr-ctn').addClass('leanote-ifr-max-show');
        });
        $('.leanote-ifr-max').click(function () {
            $('.leanote-ifr-ctn').removeClass('leanote-ifr-max-show');
        });
        $('.leanote-ifr-close').click(function () {
            hide();
        });

        var onMove = false;
        var onResize = false;
        var isLB, isRB, isL, isB;
        var mX, mY;
        var dx, dy;
        var $divWrap = $('.leanote-ifr-ctn');
        var width = $divWrap.width();
        var height = $divWrap.height();
        $('.leanote-ifr-header').on('mousedown', function (evt) {
            onMove = true;
            mX = evt.clientX;
            mY = evt.clientY;

            dX = $divWrap.offset().left;
            dY = parseInt($divWrap.css('top'));

            $('body').addClass('un-select');
        });
        $(document).on('mousemove', function (evt) {
            var x = evt.clientX;
            var y = evt.clientY;

            if (onMove) {
                var left = x - mX + dX;
                var top = y - mY + dY;

                if (top < 0) {
                    top = 0;
                }

                // return;
                $('.leanote-ifr-ctn').css({
                    left: left + 'px',
                    top: top + 'px',
                    width: width,
                    height: height,
                    bottom: 'auto',
                    right: 'auto'
                });
            }
            else if (onResize) {
                var w, h;
                var css = {};
                //  左下, 要定位right
                if (isLB) {
                    w = -x + mX + width;
                    h = y - mY + height;
                }
                // 右下, 要定位left
                else if (isRB) {
                    w = x - mX + width;
                    h = y - mY + height;
                    
                }
                // 左侧
                else if (isL) {
                    w = -x + mX + width;
                    h = height;
                }
                // 右侧
                else if (isR) {
                    w = x - mX + width;
                    h = height;
                }
                // 底部
                else if (isB) {
                    w = width;
                    h = y - mY + height;
                    if ($divWrap.css('bottom') == 'auto') {
                        css.bottom = 'auto';
                    }
                }

                // 需要固定右侧
                if (isL || isLB) {
                    if ($divWrap.css('right') == 'auto') {
                        css.left = 'auto';
                        css.right = $('body').width() - $divWrap.offset().left - width + 'px';
                    }
                }

                // 需要定位左侧
                if (isR || isRB) {
                    if ($divWrap.css('left') == 'auto') {
                        css.right = 'auto';
                        css.left = $divWrap.offset().left + 'px';
                    }
                }

                if (w < 100 || h < 100) {
                    return;
                }
                css.width = w;
                css.height = h;
                $('.leanote-ifr-ctn').css(css);
            }
        });
        $(document).on('mouseup', function (evt) {
            onMove = false;
            if (onResize) {
                width = $divWrap.width();
                height = $divWrap.height();
                onResize = false;
            }
            $('body').removeClass('un-select');
        });

        // resize
        $('.leanote-ifr-resizer').on('mousedown', function (evt) {
            onResize = true;
            mX = evt.clientX;
            mY = evt.clientY;

            isLB = false;
            isRB = false;
            isL = false;
            isR = false;
            isB = false;
            var $this = $(this);
            if ($this.hasClass('leanote-ifr-resizer-lb')) {
                isLB = true;
            }
            else if ($this.hasClass('leanote-ifr-resizer-rb')) {
                isRB = true;
            }
            else if ($this.hasClass('leanote-ifr-resizer-left')) {
                isL = true;
            }
            else if ($this.hasClass('leanote-ifr-resizer-right')) {
                isR = true;
            }
            else if ($this.hasClass('leanote-ifr-resizer-bottom')) {
                isB = true;
            }

            width = $divWrap.width();
            height = $divWrap.height();

            $('body').addClass('un-select');
        });
    }

    function display() {
        $('.leanote-ifr-ctn').show();
        visible = true;
    }

    function hide() {
        $('.leanote-ifr-ctn').hide();
        visible = false;
    }

    function removeLeanote() {
        $('.leanote-ifr-ctn').remove();
        visible = false;
    }

    function getServerAddr(request){
        if(!request.serverType){
            return;
        }
        if(request.serverType === "Personal"){
           host = request.personalAddr;
        }
        else{
            // Reset to official server address
            host = 'https://leanote.com';
        }
    }

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) { 
        console.log(request);
        if (!$('.leanote-ifr-ctn').length) {
            // frame not loaded
            show(request);
        }
        else if(visible){
            // frame loaded and showing, hide current frame
            hide();
        }
        else if(request.settingChanged == false && !visible){
            // frame loaded and is hidden, settings not changed, display current frame
            display();
        }
        else if(request.settingChanged == true && !visible){
            // frame loaded and is hidden, setting changed, refresh with new settings
            removeLeanote();
            show(request);
        }
        
    }); 

}
