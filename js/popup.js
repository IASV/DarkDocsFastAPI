let state = localStorage.getItem('state');
let insert = localStorage.getItem('insert');
const styleWhite = `${readTextFile("/source/styleWhite.css")}`;
const styleDark = `${readTextFile("/source/styleDark.css")}`;

function handleUpdated() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, tabs => {
        let url = tabs[0].url;
        if (url == "http://localhost:8000/docs#/" && state == "active") {
            loadResource();
            enableTheme();
        }
    });
}

browser.tabs.onUpdated.addListener(handleUpdated);

$(function () {
    $('#toggle-event').change(function () {
        if ($(this).prop('checked')) {
            loadResource();
            enableTheme();            
        }
        if (!$(this).prop('checked')) {
            disableTheme();            
        }
    })
});

function poppupActive() {
    $('#toggle-event').prop('checked', true);
    $('#contain').addClass('active');
}

function poppupInactive() {
    $('#toggle-event').prop('checked', false);
    $('#contain').removeClass('active');
}

function loadResource() {
    browser.tabs.executeScript(null, {
        file: '/js/theme.js'
    });

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let insertingCSS = browser.tabs.insertCSS({
        code: styleWhite
    });
    insertingCSS.then(() => null, onError);

}

function enableTheme() {
    poppupActive();
    localStorage.setItem('state', 'active');
    localStorage.setItem('insert', 'active');

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let insertingCSSNew = browser.tabs.insertCSS({
        code: styleDark
    });
    insertingCSSNew.then(() => null, onError);

}

function disableTheme() {
    poppupInactive();
    localStorage.setItem('state', 'inactive');
    localStorage.setItem('insert', 'inactive');

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let insertingCSSNew = browser.tabs.removeCSS({
        code: styleDark
    });
    insertingCSSNew.then(() => null, onError);
}

function readTextFile(file)
{
    let allText = '';
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;                
            }
        }
    }
    rawFile.send(null);
    return allText;
}

if (state == 'active') {
    poppupActive();
    if (insert == 'inactive') {
        loadResource();
        enableTheme();
    }
}

if (state == 'inactive') {
    poppupInactive();
    disableTheme();
}