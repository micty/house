$(function () {
  // 右侧 frame tab标题点击事件
  $('.frmtabs').on('click','.frmtab',function (e) {
    var $this = $(this),fid;
    if ($this.hasClass('active')) return;
    $('.frmtabs > .frmtab').removeClass('active');
    $(this).addClass('active');
    fid = $this.data('frameid');
    if (fid) {
      $('.nav-tabs ul li').removeClass('active');
      $('.nav-tabs ul li[data-frameid="' + fid + '"]').addClass('active');
      $('.iframes > iframe').removeClass('active');
      $('#' + $this.data('frameid')).addClass('active');
    }
  });

  // 右侧 frame tab标题 关闭图标 点击事件
  $('.frmtabs').on('click','.close',function (e) {
    var $parent = $(this).parent(),
      fid = $parent.data('frameid');
    $('#' + fid).remove();
    $parent.remove();
    $('.frmtabs .frmtab:last').click();
    return false;
  });

  // 左侧菜单点击事件
  $('.nav-tabs').on('click','li',function () {
    var $this = $(this),
      fid = $this.data('frameid'),
      ftitle, furl;
    if (fid && !$this.hasClass('active')) {
      if ($('#' + fid).length) {
        $('.frmtabs .frmtab[data-frameid="' + fid + '"]').click();
      } else {
        ftitle = $this.text();
        furl = $this.data('url');
        $('.frmtabs .frmtab').removeClass('active');
        $('.frmtabs').append('<div class="frmtab active" data-frameid="' + fid + '">' + ftitle + '<span class="close">×</span></div>');
        $('.iframes iframe').removeClass('active');
        $('.iframes').append('<iframe src="' + furl + '" id="' + fid + '" frameborder="0" class="active"></iframe>');
        $('.nav-tabs ul li').removeClass('active');
        $this.addClass('active');
      }
    };
  });

  $('.switch-width').on('click',function () {
    $fa = $(this).find('.fa');
    $mainWrapper = $('.main-wrapper');
    console.log('click...');
    if ($fa.hasClass('fa-expand')) {
      $fa.removeClass('fa-expand');
      $fa.addClass('fa-compress');
      $mainWrapper.addClass('full-wrapper');
    } else {
      $fa.removeClass('fa-compress');
      $fa.addClass('fa-expand');
      $mainWrapper.removeClass('full-wrapper');
    }
  });

});
