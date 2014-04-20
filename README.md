ChromeMarks
===

Just a simple node.js app that automatically exports your *nix or OSX
Chrome/Chromium bookmarks into simplified JSON and prettified HTML
(if required). With search capability.

All "Folders" are headers and the links themselves are lists beneath
each header.

Optionally scp the file to a remote host in order to publish on your web
server for access elsewhere.

Add this script to your cron in order to have it update your bookmarks
when they change or perhaps further this script with linux' ionotify
so that it automatically runs when the bookmark database is modified.

Uses
---
jQuery
Optional: system provided SCP to transfer to a remote host

To Configure
---
Chrome/Chromium:
Change bmPath for usage with Chrome or Chromium as they use different directory
paths (obviously).

Change the scpOptions 'username', 'host', and 'filename', 'path' to suit your
requirements.

To Install
---
    npm install
    node app
    copy "client" folder to the webserver path where you'll be placing
      bookmarks.json
