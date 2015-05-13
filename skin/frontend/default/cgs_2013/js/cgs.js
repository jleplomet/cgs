!function ($) {
  $(function () {
    var $window = $(window);

    $('#cChart,  #cChartNotice').on('click', function () {
      var $cChart = $('.cgs-connector-chart');

      $('body').css('overflow', 'hidden');

      $cChart.fadeIn("fast", function () {
        jQuery('#Grid').mixitup({
          targetDisplayGrid: 'block',
          effects: ['fade']
        });
      });

      jQuery('.cgs-connector-close').on('click', function () {
        $cChart.fadeOut('fast', function () {
          $('body').css('overflow', '');
        });
      });

      // $('.search_filter input').on('keyup', function () {
      //   var value = $(this).val();

      //   if (value != '') {
      //     $('#Grid').mixitup('filter', value.toUpperCase());
      //   } else {
      //     $('#Grid').mixitup('filter', 'all');
      //   }
      // })
    });

    //cgs login form
    $('#cgsLoginModal').on('hidden.bs.modal', function () {
      console.log('hidden.bs.modal');

      $('#loginAlert').hide();

      $('#login-form .has-error').each(function () {
        $(this).removeClass('has-error');
      });
    });

    $('#login-form').submit(function (e) {
      //prevent default cause we have to do stuff
      e.preventDefault();

      $('#cgsLoginModal').trigger('hidden.bs.modal'); //clean it up on every submit

      var $form = $(this), valid = true, displayMessage = '';

      //validate
      var inputs = $form.serializeObject();

      // if both are empty
      if (inputs['login[username]'] == '' && inputs['login[password]'] == '') {
        $form.find('#username').parent().addClass('has-error');
        $form.find('#pass').parent().addClass('has-error');

        valid = false;
      }

      //empty empty
      if (inputs['login[username]'] == '') {
        $form.find('#username').parent().addClass('has-error');

        valid = false;
      }

      //valid email?
      if (!validateEmail(inputs['login[username]'])) {
        $form.find('#username').parent().addClass('has-error');

        valid = false;
        displayMessage = 'Please enter a valid email.';
      }

      //pass empty
      if (inputs['login[password]'] == '') {
        $form.find('#pass').parent().addClass('has-error');

        valid = false;
      }

      if (!valid) {
        if (displayMessage != '') {
          $('#loginAlert').text(displayMessage).fadeIn();

        }
        return;
      }

      $form.find('#notice').fadeIn('fast');

      //now run the damn submit
      $.ajax({
        type: 'POST',
        url: $form.attr('action'),
        data: inputs,
        success: function (data) {
          console.log(data);

          $form.find('#notice').fadeOut('fast');

          if (!data.success) {
            $('#loginAlert').text(data.message).fadeIn();

            return;
          }

          window.location = data.redirect;
        }
      });

    }); 

    var run_once = false;

    //set catalog layered width
    setTimeout(function () {
      var $sideBar = $('.cgs-catalog-layered-nav');

      $sideBar.affix({
        offset: {
          top: function () {
              var offsetTop      = $sideBar.offset().top
              var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
              var navOuterHeight = $('.cgs-top-nav').height()

              console.log(this.top = offsetTop - navOuterHeight - sideBarMargin);

              return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          }
        , bottom: function () {
            return (this.bottom = $('.cgs-footer').outerHeight(true))
          }
        }
      })
    }, 100);

    $window.on('scroll', function () {
      // if ($window.scrollTop() >= 79 && !run_once) {
      //   $('#topCChart').parent().fadeIn();
      //   run_once = true;
      // } else if ($window.scrollTop() < 79 && run_once) {
      //   $('#topCChart').parent().fadeOut('fast');
      //   run_once = false;
      // }

      if ($window.scrollTop() >= 136 && !$('.cgs-header-static').is(':visible')) {
        //console.log('showing static message');

        $('.cgs-header-static').fadeIn('fast');
      } else if ($window.scrollTop() <= 136 && $('.cgs-header-static').is(':visible')) {
        $('.cgs-header-static').fadeOut('fast');
      }
    });

    $('a[href=#]').on('click', function (e) {
      e.preventDefault();
    })
  });

  $.fn.serializeObject = function()
  {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };

  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } 
}(jQuery);

