jQuery.noConflict();

jQuery.fn.classCount = function () {
    var t = jQuery(this);
    if (typeof t.attr('class') === 'undefined') return 0;
    return jQuery.grep(t.attr('class').split(/\s+/), jQuery.trim).length;
};

jQuery.fn.child = function (n) {
    return this.contents().eq(n);
};

jQuery.fn.id = function (id) {
    if (typeof id === 'undefined') {
        return jQuery(this).attr('id');
    }

    return jQuery(this).attr('id', id);
};

jQuery.fn.href = function (href) {
    var t = jQuery(this);

    if (typeof href === 'undefined') {
        return t.attr('href');
    }

    t.attr('href', href);
    return t;
};

jQuery.fn.isEmpty = function () {
    return !jQuery.trim(this.html());
};

jQuery.fn.hasClasses = function () {
    return typeof this.attr('class') !== 'undefined';
};

(function ($) {
    'use strict';

    const DEBUG = true;
    var
        user = { // user variables
            showDefaultExplanation: true,
            hoverToOpen: true
        },
        c = console,
        LinkTimeout
    ;

    c.l = function (l) {
        if (DEBUG) c.log(l);
    };

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace !== 'local') return;
        $.each(changes, function (index, value) {
            if(typeof user[index] != 'undefined'){
                user[index] = value.newValue;
                c.l(index +': was changed from ' +value.oldValue +' to ' +value.newValue);
            }else{
                c.l(index +': is not being used');
            }
        });
    });

    function prepare() {
        chrome.storage.local.get('showDefaultExplanation', (items) => {
            if (items.hasOwnProperty('showDefaultExplanation'))
                user.showDefaultExplanation = items.showDefaultExplanation;
        });


        chrome.storage.local.get('hoverToOpen', (items) => {
            if (items.hasOwnProperty('hoverToOpen'))
                user.hoverToOpen = items.hoverToOpen;
        });

        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `.__clickbait_text {
    display: inline-block;
    margin-left: 1em;
}

._42nr > span::before { content: '' !important; }

._4x9_, ._a7s ._524d a, ._a7s ._50u4, ._1ysv { padding: 0px !important; }

.__clickbait_btn { margin-right: 5px; }

._zw3 { padding: 8px 4px 4px 0 !important; }

._3m9g { padding-left: 0 !important; }


.st0 { fill: #4b4f56; }

.SCBcards {
    width: 500px;
    height: 424px;
    position: absolute;
    z-index: 7;
    background-color: white;
    overflow: hidden;
}

svg { transform: translate(0, 2px); }

.__clickbait_reveal_line {
    padding: 4px;
    padding-left: 8px;
    margin-top: 11px;
    margin-bottom: 11px;
    margin-left: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15) inset, 0 1px 4px rgba(0, 0, 0, .1);
}

`;
        document.head.appendChild(css);

        // Set the default color if it has not yet been set.
        chrome.storage.local.get('selectedColor', function (items) {
            if (items.hasOwnProperty('selectedColor')) return;
            // If there is no setting for selectedColor - i.e. the first time popup.html is opened:
            chrome.storage.local.set({ 'selectedColor': '#3b5999' }, function () {
                c.l('#3b5999 saved to default.');
            });
        });
    }

    var uniqueIds = 1;

    function loop() {
        // select all anchor elements WITH a class of '_52c6' which is the post's image if it links out of facebook
        // for each element selected above
        $('a._52c6').each(function (i, elem) {
            // if current element is WITHOUT a class of '__clickbait_link'
            if (!$(elem).hasClass('__clickbait_link') && $(elem).parents('._3c21').length == 0) {
                var
                    node = $(elem).addClass('__clickbait_link'),
                    spanContainer = $(node).parents('.fbUserContent'), // whole post container
                    cardForm = spanContainer.find('form').eq(0), // form element in post container
                    realUrl = function () {
                        var
                            item = decodeURIComponent(node.href()),
                            str = 'l.php?u=',
                            strlen = str.length
                            ;
                        if (item.indexOf(str) !== -1) {
                            item = item.substring(item.indexOf(str) + strlen);
                            item = item.substring(0, item.indexOf('&h='));
                        }

                        return item;
                    },
                    FBPostURL = spanContainer.find('a._5pcq').eq(0)[0].href,
                    RevealLine = $(node).parents('[data-ft]').eq(1).parent().next()[0], // element where 
                    actionBar = cardForm.find('div._42nr').eq(0),
                    span = $('<span>').appendTo(actionBar),
                    anchor = $('<a>')
                        .addClass('__clickbait_btn')
                        .href('#')
                        .attr('title', 'Stop Clickbait!')
                        .attr('data-url', realUrl())
                        .attr('data-fburl', FBPostURL)
                        .id('__clickbait_btn_' + uniqueIds)
                        .html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="5px" width="16px" height="16px" viewBox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"><g id="loading"><g><path class="st0" d="M20.5,4c-1.1,0.1-1.9,1-1.8,2.1l0.5,7.6c0.1,1.1,1,1.9,2.1,1.8c1.1-0.1,1.9-1,1.8-2.1l-0.5-7.6C22.5,4.7,21.6,3.9,20.5,4z"/><path class="st0" d="M11.6,8.9c-0.7-0.8-2-1-2.8-0.2s-0.9,2-0.2,2.8l4.9,5.8c0.4,0.5,1.1,0.7,1.7,0.7c0.4,0,0.8-0.2,1.1-0.5c0.8-0.7,1-2,0.2-2.8L11.6,8.9z"/><path class="st0" d="M3.6,21.7l7.4,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.8-0.1,1.6-0.6,1.8-1.5c0.3-1.1-0.4-2.1-1.4-2.4l-7.4-1.8c-1.1-0.3-2.1,0.4-2.4,1.5C1.9,20.4,2.6,21.5,3.6,21.7z"/><path class="st0" d="M13.8,27.5c-0.4-1-1.6-1.5-2.6-1.1l-7.1,2.9c-1,0.4-1.5,1.6-1.1,2.6c0.3,0.8,1.2,1.3,2,1.2c0.2,0,0.4-0.1,0.6-0.1l7.1-2.9C13.7,29.7,14.2,28.5,13.8,27.5z"/><path class="st0" d="M26.5,16.8c0.4,0.2,0.8,0.3,1.2,0.3c0.6,0,1.2-0.4,1.6-0.9l4-6.5c0.6-0.9,0.3-2.2-0.6-2.8c-0.9-0.6-2.2-0.3-2.8,0.6l-4,6.5C25.3,15,25.6,16.3,26.5,16.8z"/></g></g><g id="arrow_cursor"><g id="_x35_0-arrrow-cursor.png"><g><path class="st0" d="M50.3,40.5L65,31.6c0,0,0.3-0.2,0.4-0.3c0.9-0.9,0.9-2.3,0-3.1c-0.3-0.3-0.7-0.5-1.1-0.6l0,0c-4.2-1-43.7-8.2-43.7-8.2l0,0c-0.7-0.2-1.5,0.1-2,0.6c-0.6,0.6-0.8,1.3-0.6,2l0,0L24.6,53l3.1,12.1c0.1,0.4,0.3,0.9,0.6,1.2c0.9,0.9,2.3,0.9,3.1,0c0.1-0.2,0.4-0.5,0.4-0.5c0,0,9.2-15.9,9.2-15.9L60.1,69l9.4-9.4L50.3,40.5z"/></g></g></g></svg><span style="margin-left: 6px;">#SCB</span>')
                        .on('click', function () {
                            var opened = jQuery('#SCBinterface').length > 0;
                            if (!anchor.hasClass('clicked')) {
                                anchor.addClass('clicked');
                            } else {
                                //anchor.removeClass('clicked');
                                hideSCBContainer();
                                return;
                            }
                            if (anchor.hasClass('hovered')) { anchor.removeClass('hovered'); return; }
                            displaySCBContainer(anchor, false);
                        })
                        .appendTo(span),
                    FBPageLink = spanContainer.find('span.fwb').eq(0)[0].childNodes[0].href.split('?')[0]
                    ;

                if (user.showDefaultExplanation)
                    revealLine(RevealLine, realUrl(), uniqueIds); // shows the line which gives the top explanation


                anchor.on('mouseenter', () => {
                    if (!user.hoverToOpen) return;
                    if (!anchor.hasClass('clicked')) {
                        anchor.addClass('hovered');
                        displaySCBContainer(anchor, true);
                    }
                }).on('mouseleave', () => {
                    if (!user.hoverToOpen) return;
                    LinkTimeout = setTimeout(() => {
                        if (anchor.hasClass('hovered'))
                            hideSCBContainer();
                        anchor.removeClass('hovered');
                    }, 500);
                });

                uniqueIds++;
/*
                actionBar.children().each((i, elem) => {
                    jQuery(elem).on('click', () => {
                        moveTopComment(elem);
                    });
                });
*/
            }
        });
    }

    function init() {
        prepare();
        document.onscroll = loop;
        loop();
    }

    function moveTopComment(e) {
        targ = e;
        var TopComment = targ.parentNode.parentNode.parentNode.parentNode.parentNode;
        window.setTimeout(function () {
            if (TopComment.childNodes[0].classList.contains('_3m9g')) {
                TopComment = TopComment.childNodes[0];
                var temp = TopComment.parentNode;
                temp.removeChild(TopComment);
                temp.appendChild(TopComment);
            }
        }, 200);
    }

    function displaySCBContainer(e, hover) {
        if (jQuery('#SCBinterface').length > 0) {
            hideSCBContainer();
            return;
        }
        c.l('container opened');
        var
            card,
            loadImg = $('<div><img src="' +chrome.runtime.getURL('images/loading.gif') +'"></div>').css({
                maxWidth: '100%',
                width: 'auto'
            }).find('img').css({
                height: 'auto',
                width: 'auto',
                maxWidth: '100%'
            }),
            cardForm = jQuery(e).parents('.fbUserContent').eq(0).child(1).child(0),
            postWidth = cardForm[0].offsetWidth,
            cardDiv = $('<div>').addClass('SCBcards').id('SCBinterface').insertBefore(cardForm.child(4)).css({
                left: 0,
                width: postWidth,
                backgroundColor: '#e9ebee'
            }).html(loadImg).hide().stop().slideDown(400, function(){
                card = $('<iframe>')
                    .addClass('SCBcards')
                    .id('SCBinterfaceIFRAME')
                    .attr('scrolling', 'no')
                    .attr('src', chrome.runtime.getURL('scb-container/SCB-Container.html') + '?url=' + encodeURIComponent($(e).attr('data-url') + '&fburl=' + encodeURIComponent($(e).attr('data-fburl'))))
                    .css({
                    width: postWidth,
                    top: 0,
                    border: 0,
                    left: 0
                }).on('mouseenter', () => {
                    if (LinkTimeout) {
                        jQuery(jQuery('#SCBinterface')[0].parentNode.childNodes[0]).addClass('clicked').removeClass('hovered');
                        clearTimeout(LinkTimeout);
                        LinkTimeout = null;
                    }
                }).appendTo($(this)).hide().on('load', function(){
                    var t = $(this);

                    loadImg.fadeOut(400, function(){
                        $(this).remove();
                        t.fadeIn();
                    });
                });
            })
        ;

        // listener for container size changes
        new ResizeSensor(cardDiv, function(){ // when cardDiv changes size
            // find container containing the post's comments and resize it to the card's height continuously as it slides up and down
            cardDiv.parents('form').eq(0).find('.UFIContainer').css('minHeight', cardDiv.height());
        });
    }

    function hideSCBContainer() {
        var cards = jQuery('#SCBinterface');
        if (cards.length === 0) return;
        cards.parents('form').eq(0).find('.UFIContainer').attr('style', '');


        $('a.__clickbait_btn').removeClass('clicked hovered');
        $('.SCBButtonSpan').removeClass('clicked hovered');
        $('#SCBinterface').stop().slideUp(400, function(){
            $(this).remove();
            $('div.SCBcards').each(function(){
                ResizeSensor.detach($(this));
            });
        });

        clearTimeout(LinkTimeout);
        LinkTimeout = null;

        c.l('container closed');
    }

    function isjQ(obj) {
        if (typeof jQuery !== 'function')
            return false;

        return obj instanceof jQuery;
    }

    function revealLine(element, realURL, id) {
        // var userID = chrome.storage.local.get("userID");

        if (element instanceof jQuery === false) element = $(element);
        realURL = realURL.substring(0, realURL.indexOf('?'));
        element.addClass('_5pbx __clickbait_reveal_line').id('__clickbait_reveal_line_' + id);

        if(user.showDefaultExplanation){
            if (!DEBUG) {
                $.ajax({
                    method: 'POST',
                    url: 'https://server.stopclickbait.com/getTopComment.php',
                    data: { url: encodeURIComponent(realURL), userid: userID },
                    success: function (content) {
                        element.text(content);
                    }
                });
            } else {
                element.text('This is a StopClickBait test.');
            }
        }
    }

    init();

})(jQuery);