export default function () {
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach((el) => {
    el.addEventListener('click', (e) => {
      const self = e.currentTarget;
      const control = self.querySelector('.accordion__control');
      const content = self.querySelector('.accordion__content');

      self.classList.toggle('open');

      if (self.classList.contains('open')) {
        control.setAttribute('aria-expanded', true);
        content.setAttribute('aria-j-hidden', false);
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        control.setAttribute('aria-expanded', false);
        content.setAttribute('aria-j-hidden', true);
        content.style.maxHeight = null;
      }
    });
  });
}
