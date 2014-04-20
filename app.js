#!/usr/bin/env node

var fs = require('fs');
var scp = require('scp');

/* Path to Chrome Bookmarks File */
var bmPath = '/Users/YOURUSER/Library/Application Support/Google/Chrome/Default/Bookmarks';

/* Name of output file */
var outFile = 'bookmarks.json';

/* Options for SCP */
var scpOptions = {
  file: outFile,
  user: 'YOURUSER',
  host: '10.0.0.1',
  port: '22',
  path: '/var/www/bookmarks'
};

/* Convert Chrome's modified Windows Datetime to JavaScript datetime */
function dt(chrome_time) {
  'use strict';
  var date_added = (chrome_time / 1000000 - 11644473600) * 1000;
  var date_fixed = new Date(date_added);
  return date_fixed;
}

/* Create the "json" object */
function createJSON(callback) {
  'use strict';
  var bookmark_data = JSON.parse(fs.readFileSync(bmPath));
  var json = {};
  var link = {};
  var next_folder, nodeName;

  /* loop through the Chrome bookmarks and parse into more simplified JSON */
  function compileBookmarks(bookmarks) {
    for (var entry in bookmarks) {
      if (bookmarks[entry]['type'] === 'folder') {
        if (bookmarks[entry]['children'].length !== 0) {
          json[bookmarks[entry]['name']] = {};
          nodeName = bookmarks[entry]['name'];
          next_folder = bookmarks[entry]['children'];
          compileBookmarks(next_folder);
        }
      } else {
        if (bookmarks[entry]['url']) {
          //link = {url: encodeURI(bookmarks[entry]['url']), name: bookmarks[entry]['name'], added: dt(bookmarks[entry]['date_added'])};
          json[nodeName][bookmarks[entry]['name']] = encodeURI(bookmarks[entry]['url']);
        }
      }
    }
  }

  /* Use Chrome's "Other" folder as root */
  var roots = bookmark_data['roots']['other'];

  /* Then loop through it and pass it to the "compileBookmarks" function */
  for (var entry in roots) {
    try {
      compileBookmarks(roots[entry]);
    } catch (e) {
      console.error(e);
    }
  }

  /* return the "json" object */
  callback.call(json);
}

 /* Wrapped in self-executing function and catches callback for proper
  * serialized operation */
(function() {
  'use strict';
  createJSON(function() {
    /* Write the output to "outFile" */
    fs.writeFileSync(outFile, JSON.stringify(this), 'utf8');
    scp.send(scpOptions, function (err) {
      if (err) console.log(err);
      else console.log('File transferred.');
    });
  });
})();
