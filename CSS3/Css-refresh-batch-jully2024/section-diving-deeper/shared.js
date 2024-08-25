var backdrop = document.querySelector('.backdrop');
var model = document.querySelector('.modal');
var selectPlanButtons = document.querySelectorAll('.plan button');
var modelButton = document.querySelector('.modal__action--negative');
var toggleButton = document.querySelector('.toggle-button');
var mobileNav = document.querySelector('.mobile-nav');

for (let i = 0; i < selectPlanButtons.length; i++) {
  selectPlanButtons[i].addEventListener('click', function () {
    backdrop.style.display = 'block';
    model.style.display = 'block';
  });
}

toggleButton.addEventListener('click', function () {
  backdrop.style.display = 'block';
  mobileNav.style.display = 'block';

});

modelButton.addEventListener('click', function () {
  backdrop.style.display = 'none';
  model.style.display = 'none';
});

backdrop.addEventListener('click', function () {
  backdrop.style.display = 'none';
  model.style.display = 'none';
  mobileNav.style.display = 'none';
});




console.dir(backdrop);