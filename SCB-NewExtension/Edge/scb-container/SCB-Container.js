const DEBUG = true;
var clickBaitLink = "null";
var $ = jQuery;
var user = { selectedColor: '#ffffff' };
var c = console;
c.l = function(l){
    if(DEBUG) console.log(l);
};

$.fn.calcHeight = function () {
    var t = $(this);
    return t.height() +parseInt(t.css('borderTopWidth')) +parseInt(t.css('borderBottomWidth'));
}
$.fn.changeClass = function (c) {
    if(typeof c != 'string') return this;
    if(c.length < 1) return this;
    return $(this).removeClass().addClass(c);
}

if (document.location.href.indexOf('?') > -1) {
    clickBaitLink = document.location.href.split('?url=')[1];
    clickBaitLink = decodeURIComponent(clickBaitLink);
    clickBaitLink = clickBaitLink.split('?')[0];
    if(clickBaitLink.indexOf('&') !== -1) clickBaitLink = clickBaitLink.substr(0, clickBaitLink.indexOf('&'));
}
//var userID = chrome.storage.local.get("userID");

// Get the current color from Chrome storage and set the custom colors in the document.
chrome.storage.local.get('selectedColor', function (items) {
    setElementColors(items.selectedColor);
    user.selectedColor = items.selectedColor;
});

sortComments('votes');

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace !== 'local') return;
    $.each(changes, function (index, value) {
        if(typeof user[index] == 'undefined'){
            c.l(index +': is not being used');
            return;
        }

        user[index] = value.newValue;
        c.l(index +': was changed from ' +value.oldValue +' to ' +value.newValue);
    });
});

if (DEBUG) {
    processingCommentList({
        "comments": [
            {
                "id": 2,
                "timestamp": 14900000050,
                "commentText": clickBaitLink,
                "userName": "SCB Admin",
                "starCount": '17k',
                "ownComment": true
            },
            {
                "id": 3,
                "timestamp": 14900000051,
                "commentText": "Ever since that boy became a man, he made a promise to himself to be honest and always pursue the knowledge that can free the mind and he...",
                "userName": "DISL Automatic",
                "starCount": 670,
                "ownComment": false
            },
            {
                "id": 1,
                "timestamp": 1490000001,
                "commentText": "She's held down by the transcripts my hands grip; tried to tie her wings back on before they're once again clipped",
                "userName": "Sage Francis",
                "starCount": 256,
                "ownComment": false
            },
            {
                "commentText": "we could learn a thing or two to dispossess exist between things that suck life from us and give life to us and telling us who we are...",
                "id": 4,
                "ownComment": false,
                "userName": "SoleOneDotOrg",
                "starCount": 128,
                "timestamp": 1490000002
            },
            {
                "id": 5,
                "timestamp": 1490000000,
                "commentText": "Everything I feel they've tought, since little, has faught with me and my struggle's to find larger self, larger meaning",
                "userName": "nolly-d",
                "starCount": 99,
                "ownComment": false
            },
            {
                "id": 67,
                "timestamp": 1490000000,
                "commentText": "Matter is what you don't to me, he don't to she, we don't to we but hopefully we can gather together and figure out what life's about",
                "userName": "Eyedea",
                "starCount": 67,
                "ownComment": false
            },
            {
                "id": 24,
                "timestamp": 1490000000,
                "commentText": "We set sail without an anchor, we count upon that never stop; [because] an anchor's just a coffin nail, waiting for that hammer drop",
                "userName": "Astronautalis",
                "starCount": 33,
                "ownComment": false
            }
        ]
    });
    addEventHandlers();
} else {
    jQuery.ajax({
        method: 'POST',
        url: 'https://server.stopclickbait.com/getComments.php',
        data: { url: encodeURIComponent(clickBaitLink), userid: userID },
        success: (content) => {
            processingCommentList(content);
            addEventHandlers();
        }

    });
}

// Add event handlers
function addEventHandlers() {
    // Add event listener to find selected color in settings:
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === "local" && changes["selectedColor"]) {
            setElementColors(changes["selectedColor"].newValue);
        }
    });

    $('#sort-top').on('click', function () {
        sortComments('votes');
    });

    $('#sort-date').on('click', function () {
        sortComments('date');
    });

    var submitCB = $('#submitCB');
    var submitHeight = submitCB.calcHeight();
    var commentArea = $('#comment-area');

    submitCB.on('focusin', function () {
        var t = $(this);
        t.attr('style', '').css({
            paddingBottom: 20,
            height: t[0].scrollHeight + 50
        });

        $('#control-bar, #control-bar-buttons').changeClass('block');
        $('#counter').changeClass('flex');

        commentArea.css('height', 305 - t[0].offsetHeight);
    }).on('focusout', () => {
        if (submitCB.val().length > 0) return;

        $('#control-bar, #counter, #control-bar-buttons').changeClass('hidden');
        submitCB.css({
            height: '',
            paddingBottom: 0
        });
        commentArea.css('height', 265);
    }).on('input', () => {
        var submitCB = $('#submitCB');
        if (submitCB.val().indexOf('\n') !== -1) {
            submitCB.val(submitCB.val().replace('\n', ' '));
        }

        $('#counter').text(140 - submitCB.val().length);
        commentArea.css('height', 305 - submitArea.offsetHeight);
        if (submitCB.val().indexOf('\n') !== -1) {
            submitCB.val(submitCB.val().replace('\n', ' '));
        }
    });

    $('#close').on('click', function () {
        var submitArea = $('#submitCB');
        submitArea.val('');
        $('#control-bar, #counter').changeClass('hidden');
        $('#comment-area').css('height', 265);
        submitArea.css({
            height: 30,
            paddingBottom: 0
        });
    });

    $('#poll-button-yes').on('click', (e) => {
        $('#poll-answers').changeClass('block');
        $('#poll-button-area').changeClass('hidden');
        $('#poll-answer-yes, #poll-answer-no').changeClass('inline');
        $('#poll-answer-bar').css('justifyContent', 'space-between');

        if (!DEBUG) {
            $.ajax({
                method: 'POST',
                url: 'https://server.stopclickbait.com/voting.php',
                data: {
                    url: encodeURIComponent(clickBaitLink),
                    userid: userID,
                    vote: 'yes'
                },
                success: (content) => {
                    processingVotingResults(content);
                }
            });
        } else {
            processingVotingResults(JSON.parse('{ "no": "5", "yes": "95" }'));
        }
        e.preventDefault();
    });

    $('#poll-button-no').on('click', function () {
        $('#poll-answers').changeClass('block');
        $('#poll-button-area').changeClass('hidden');
        $('#poll-answer-yes, #poll-answer-no').changeClass('inline');
        $('#poll-answer-bar').css('justifyContent', 'space-between');

        if (!DEBUG) {
            $.ajax({
                method: 'POST',
                url: 'https://server.stopclickbait.com/voting.php',
                data: {
                    url: encodeURIComponent(clickBaitLink),
                    userid: userID,
                    vote: 'no'
                },
                success: (content) => {
                    processingVotingResults(content);
                }
            });
        } else {
            processingVotingResults(JSON.parse('{ "no": "95", "yes": "5" }'));
        }
    });

    $('.report-link-a').each((i, elem) => {
        $(elem).on('click', (e) => {
            if (!DEBUG) {
                $.ajax({
                    method: 'POST',
                    url: 'https://server.stopclickbait.com/report.php',
                    data: {
                        userid: userID,
                        reportID: $(elem).parents('.comment-box')[0].id
                    },
                    success: (content) => {
                        processingVotingResults(content);
                    }
                });

            }
            $(elem).html(chrome.i18n.getMessage("Thanks") + "!");
            e.stopPropagation();
        });
    });
}

function processingCommentList(content) {
    for (var i in content.comments) if (content.comments.hasOwnProperty(i)) {
        var comment = content.comments[i];
        createCommentBox(comment.id, comment.timestamp, comment.commentText, comment.userName, comment.starCount, comment.ownComment);
    }

    $('#comment-area').wrapInner($('<div id="comment-inner">'));
}

function processingVotingResults(results) {
    $('#poll-answer-no').html(chrome.i18n.getMessage('notClickbait') + "\n" + results.no + "%");
    $('#poll-answer-yes').html("CLICKBAIT\n" + results.yes + "%");
    $('#poll-bar').val(results.yes);

}

function linkify(text) {
    var exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, '<a href="$1" target="_blank">$1</a>'); 
}

function createCommentBox(commentId, timestamp, content, userNameString, voteNumber, ownComment) {
    commentArea = $('#comment-area');
    commentBox = $('<div class="comment-box" id="comment-' + commentId + '" data-timestamp="' + timestamp + '"/>').on('click', function () {
        var t = $(this), clas = 'clicked-comment-box';
        if (ownComment) return;
        if (t.hasClass(clas)) {
            t.removeClass(clas);
            return;
        }

        $('.' +clas).removeClass(clas)
        t.css('backgroundColor', '').addClass(clas);
    }).on('mousedown', function () {
        if (ownComment) return;
        $(this).css('backgroundColor', 'rgba(' +hex2rgb(user.selectedColor) +', 0.65)');
    }).on('mouseup', function () {
        if (ownComment) return;
        $(this).attr('style', '');
    }).appendTo(commentArea);
    commentLeft = $('<div class="comment-left"/>').appendTo(commentBox);
    commentText = $('<div class="comment-text"/>').appendTo(commentLeft);
    commentContent = $('<p class="comment-content" />').html(linkify(content)).appendTo(commentText);
    userArea = $('<div class="user-area"/>').appendTo(commentLeft);
    userName = $('<span class="user-name"/>').text(userNameString).appendTo(userArea);
    voteArea = $('<div class="vote-area">').prependTo(commentLeft);
    deleteIcon = $('<div class="delete-icon">c</div>').on('click', function () {
        $(this).parents('.comment-box').addClass('blocked-comment-box').children('.delete-buttons').css('pointerEvents', 'none').fadeIn('fast');
    }).appendTo(commentBox);
    upvoteStar = $('<span class="upvote-star">a</span>').appendTo(voteArea);
    upvotes = $('<span class="upvotes"/>').text(voteNumber).appendTo(voteArea);
    deleteButtons = $('<div class="delete-buttons"/>').appendTo(commentBox);
    deleteButton = $('<button class="delete-button" data-localize="delete">delete</button>').on('click', function () {
        $(this).parent().css({
            display: 'flex',
            justifyContent: 'center',
            verticalAlign: 'middle',
            alignItems: 'center'
        }).html('<span style="color: #828282 !important; text-align: center">' + chrome.i18n.getMessage('postDeleted') + '</span>').parents('.comment-box').delay(1000).slideUp('fast', function () {
            this.remove();
        });
    }).appendTo(deleteButtons);
    cancelButton = $('<button class="cancel-button" data-localize="cancel">cancel</button>').on('click', function () {
        var t = $(this);
        t.parent().animate({left: '100%'}, 'fast', function(){
            t.parents('.comment-box').css('pointerEvents', '').removeClass('blocked-comment-box');
            t.parent().hide().css('left', 0);
        });
    }).on('mousedown', function () {
        $(this).css('filter', 'brightness(80%)');
    }).on('mouseup', function () {
        $(this).css('filter', '');
    }).appendTo(deleteButtons);

    if (ownComment) {
        commentBox.addClass('own-comment');
    } else {
        separator = $('<span class="separator">|</span>').appendTo(userArea);
        reportLink = $('<span class="report-link">').appendTo(userArea);
        reportLinkA = $('<a href="#" class="report-link-a" data-localize="report">report</a>').appendTo(reportLink);
        deleteIcon.remove();
    }
}

function sortComments(by){
    if(typeof by == 'undefined') return;
    var commentInner = $('#comment-inner');

    $('#top-new .selected').removeClass('selected');

    if(by == 'votes'){
        $('#sort-top').addClass('selected');

        commentInner.children().sort(function (a, b) {
            return parseInt($('.upvotes', b).text()) - parseInt($('.upvotes', a).text());
        }).appendTo(commentInner);
    } else if (by == 'date') {
        $('#sort-date').addClass('selected');

        commentInner.children().sort(function (a, b) {
            return parseInt(b.dataset.timestamp) - parseInt(a.dataset.timestamp);
        }).appendTo(commentInner);
    }
}

function hex2rgb(hex, alpha){
    if(typeof hex == 'undefined') return
    if(hex.length < 6) return;
    hex = hex.charAt(0) == '#' ? hex.substring(1, 7) : hex;
    var c = [
        parseInt(hex.substring(0,2),16),
        parseInt(hex.substring(2,4),16),
        parseInt(hex.substring(4,6),16)
    ];

    c = c.join(', ');

    if(typeof alpha != 'undefined'){
        return rgba(c, alpha);
    }

    return c;
}

function rgba(rgb, alpha){
    if(typeof rgb == 'undefined' || typeof alpha == 'undefined') return;
    return 'rgba(' +rgb +', ' +alpha +')';
}

function setElementColors(color) {
    user.selectedColor = color;
    var styles = $('style#stylesheet').length > 0 ? $('style#stylesheet') : $('<style id="stylesheet">').prependTo('body');
    styles.html('.comment-box:hover, .clicked-comment-box { background-color: ' +hex2rgb(color, 0.35) +'; }\
.own-comment { background-color: ' +color +'; }\
#poll-area { border-color: ' +color +'; }\
button { color: ' +color +'; border-color: ' +color +'; }\
button:hover{ background-color: ' +color +'; }\
#poll-buttons button, #poll-button-area { color: ' +color +'; }\
#submitCB:focus { outline-color: ' +color +'; }\
.comment-text a { color: rgba(' +hex2rgb(color, 0.5) +'; }');
    return;
    var a = document.styleSheets;
    for (var i in a) if (a.hasOwnProperty(i)) {
        var b;
        a[i].cssRules ? b = a[i].cssRules : b = a[i].rules;
        for (var j in b) if (b.hasOwnProperty(j)) {
            if (b[j].selectorText === ".commentBox:hover" || b[j].selectorText === ".clickedCommentBox") {
                console.log(b[j].selectorText +' { background-color: rgba(' +hex2rgb(color) +', 0.35); }');
                b[j].style.backgroundColor = 'rgba(' +hex2rgb(color) +', 0.35)';
            }
            // Change color:
            if (b[j].selectorText === ".ownComment") {
            console.log(b[j].selectorText +'{ background-color: ' +color +'; }');
                b[j].style.backgroundColor = color;
            }

            // Change Pollbar color:
            if (b[j].selectorText === "#pollBar:not([value])" ||
                b[j].selectorText === "#pollBar:not([value])::-webkit-progress-bar" ||
                b[j].selectorText === "#pollBar:not([value])::-moz-progress-bar" ||
                b[j].selectorText === ":not([value])#pollBar") {
                b[j].style.backgroundColor = "#fff";
                b[j].style.border = "1px solid";
                b[j].style.borderColor = color;
                b[j].style.borderRadius = "3px";
            }

            // Change color for button:
            if (b[j].selectorText === "button") {
                console.log(b[j].selectorText +' { background-color: #ffffff; border: 1px solid; border-color: ' +color +'; border-radius: 3px; }');
                b[j].style.backgroundColor = "#fff";
                b[j].style.border = "1px solid";
                b[j].style.borderColor = color;
                b[j].style.color = color;
                b[j].style.borderRadius = "3px";
            }

            // Change hover style for button:
            if (b[j].selectorText === "button:hover") {
                console.log(b[j].selectorText +' { background-color: ' +color +'; color: #ffffff; }');
                b[j].style.backgroundColor = color;
                b[j].style.color = "#fff";
            }

            // Change text color for these areas:
            if (b[j].selectorText === "#pollBttns button" ||
                b[j].selectorText === "#pollButtonArea") {
                    console.log(b[j].selectorText +' { color: ' +color +'; }');
                b[j].style.color = color;
            }

            // Change the outline color of the textbox:
            if (b[j].selectorText === "#submitCB:focus") {
                console.log(b[j].selectorText +' { outline-color: ' +color +'; } ');
                b[j].style.outlineColor = color;
            }
        }
    }
}

$(document).ready(function(){
    setTimeout(function(){
        $('#card').fadeIn();
    }, 500);
});