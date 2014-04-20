$.getJSON('bookmarks.json', function(data) {
  createList(data);
  $('ul > li > span').on('click', function() {
    var $this = $(this).next();
    $('span + ul').not($this).hide();
    $this.slideToggle();
  });
});

$('#toggle').on('click', function() {
  var $this = $(this);
  if ($this.html() === 'Expand All') {
  $('span + ul').show();
    $this.html('Collapse All');
  } else {
    $('span + ul').hide();
    $this.html('Expand All');
  }
});

$('#query input[name="query"]').on('keypress', function(e) {
  //e.preventDefault();
  if (e.which == 13) {
    searchFunction($(this).val());
    return false;
  }
});

function searchFunction(query) {
  query = new RegExp(query, 'i');
  var $searchResults = $('#searchResults');
  if (!$searchResults.is(':empty')) $searchResults.empty();
  $('a').each(function() {
    var $result = $(this).attr('title').search(query);
    if ($result >= 0) {
      $(this).clone().appendTo($searchResults);
    }
  });
  if (!$('.searchResults').is(':empty')) {
    $('.searchResults').slideDown();
    $('#closeResults').one('click', function() {
      $('.searchResults').slideUp();
      $('#query input[name="query"]').val('');
    });
  }
}

function createList(collection) {
  var el = document.getElementById('bookmarks');
  el.appendChild(json2html(collection));
}

/* Function to turn json data into unordered list */
function json2html(json) {
  'use strict';
  var i, ret = document.createElement('ul'),
      a, li, span;
  for (i in json) {
    li = ret.appendChild(document.createElement('li'));
    if (typeof json[i] === 'object') {
      span = li.appendChild(document.createElement('span'));
      span.appendChild(document.createTextNode(i));
    } else {
      a = li.appendChild(document.createElement('a'));
      a.appendChild(document.createTextNode(i));
      a.title = i;
      a.href = json[i];
    }
    if (typeof json[i] === 'object') {
      li.appendChild(json2html(json[i]));
    }
  }
  return ret;
}
