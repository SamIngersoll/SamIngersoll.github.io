var plus = document.getElementById('plus');
var s = document.getElementById('s');
var social = document.getElementById('social');
var contact = document.getElementById('contact');

function scroll() {
  if ( window.pageYOffset > document.documentElement.clientWidth/5 ) {
    if ( !plus.classList.contains("spin")  )  {
      plus.classList.add("spin");
      plus.classList.remove("unspin");
      s.classList.add("raise");
      s.classList.remove("unraise");
    }
  } else
    if ( plus.classList.contains("spin") )  {
      plus.classList.remove("spin");
      plus.classList.add("unspin");
      s.classList.remove("raise");
      s.classList.add("unraise");
    }
}
