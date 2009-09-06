jetpack.tabs.onReady(function onNextPage(doc)
{
  if (doc.location.href.match(/http:\/\/twitter.com/)) {
    $(doc).find('html').css({'overflow': '-moz-scrollbars-vertical'});
    $(doc).find('#trends a, #trends_list a').click(function() {
      $(doc).find('#home_search_q, #sidebar_search_q').val($(this).attr('name'));
    });
    $(doc).find('a.search-link').click(function() {
      $(doc).find('#sidebar_search_q').val($(this).attr('title'));
    });
  }
});