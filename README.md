# Stop Clickbait Frontend Development
Stopping clickbait one line at a time

## Where To Start

### Folder & File Locations
 * `/popup` -- browser user interface
 * `/scripts/stopclickbait.js` -- script which manipulates facebook user interface
 * `/scb-container` -- iframe which holds Stop Clickbait comments etc.

### Loading User Extension in Chrome, Opera & Firefox
 * download and unpack `SCB-Frontend-master.zip`
 * navigate to `chrome://extensions/` (Firefox users: `about:debugging`)
 * check 'Developer Mode' box (Opera users: click 'Developer Mode' | Firefox users: check 'Enable add-on debugging')
 * click 'Load unpacked extension...' (Firefox users: Load Temporary Add-on)
 * locate unpacked location and choose `Chrome/` folder (Firefox users: choose `manifest.json` or any file in directory)

### Loading User Extension in Edge
 * download and unpack `SCB-Frontend-master.zip`
 * navigate to `about:flags`
 * check the 'Enable extension developer features' checkbox
 * click the three dot button in the upper-right for the menu
 * click extensions
 * click "load extension"
 * specify the `Edge/` folder in the unpacked zip file.

## Features
* [html5doctor CSS Reset](http://html5doctor.com/html-5-reset-stylesheet) (v1.6.1)
* [resizeSensor](https://github.com/marcj/css-element-queries)
* [jQuery](https://code.jquery.com)  (v3.2.1)
  * [mouseWheel](https://github.com/jquery/jquery-mousewheel) (v3.1.13)
  * [jScrollPane](https://github.com/vitch/jScrollPane)  (v2.0.23)
