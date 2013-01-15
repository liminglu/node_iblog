	var i = 0,
	got = -1,
	len = document.getElementsByTagName('script').length;
	while (i <= len && got == -1) {
		var js_url = document.getElementsByTagName('script')[i].src,
		got = js_url.indexOf('wizylike.js');
		i++
	}
	var edit_mode = '1',
	wizylike_url = js_url.substr(0, js_url.indexOf('/javascripts/'));
function wizylike(post_id, user_id, title, type) {

  if (post_id >= 1) {
    if (type === 'like') {

      // like button clicked
      jQuery('#wizylike-post-' + post_id).children('span:last').empty().addClass('wizylike_loading');

      jQuery.get(wizylike_url + '/like', {
        post_id: post_id,
        user_id: user_id,
        post_title:title,
        like: 'like'
      },
      function(result) {
        jQuery('#wizylike-post-' + post_id + ' .wizylike_count').text(result.like.collect_count).removeClass('wizylike_loading');

        jQuery('#wizylike-post-' + post_id + ' .wizylike_icon').replaceWith('<span class="wizylike_icon" onclick="wizylike(' + post_id + ', ' + user_id + ', \''+ result.like.title + '\', \'unlike\');"></span>');
      });

    } else if (type === 'unlike') {

      // unlike button clicked
      jQuery('#wizylike-post-' + post_id).children('span:last').empty().addClass('wizylike_loading');

      jQuery.get(wizylike_url + '/unlike', {
        post_id: post_id,
        user_id: user_id,
        post_title:title,
        like: 'unlike'
      },
      function(result) {
		jQuery('#wizylike-post-' + post_id + ' .wizylike_count').text(result.unlike.collect_count).removeClass('wizylike_loading');

        jQuery('#wizylike-post-' + post_id + ' .wizylike_icon').replaceWith('<span class="wizylike_icon" onclick="wizylike(' + post_id + ', ' + user_id + ', \'like\');"></span>');

      });

    } // end like type check
  } // end post id check
} // end wizylike