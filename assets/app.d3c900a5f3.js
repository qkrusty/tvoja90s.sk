(() => {
  'use strict';
  const dialog = document.querySelector('#artist-dialog');
  const body = document.querySelector('#artist-content');
  const close = document.querySelector('#close-dialog');
  let trigger;
  let activeIndex = 0;
  const photoDialog = document.querySelector('#photo-dialog');
  const expandedPhoto = document.querySelector('#expanded-photo');
  const closePhoto = document.querySelector('#close-photo');
  let photoTrigger;
  function bindZoom(root) {
    root.querySelectorAll('.photo-zoom').forEach(button => {
      button.addEventListener('click', () => {
        const img = button.querySelector('img');
        photoTrigger = button;
        expandedPhoto.src = img.classList.contains('gallery-image') ? img.src : button.dataset.full;
        expandedPhoto.alt = img.alt;
        document.querySelector('#expanded-caption').textContent = img.alt;
        photoDialog.showModal();
        document.body.classList.add('dialog-open');
        closePhoto.focus({preventScroll:true});
      });
    });
  }
  bindZoom(document);
  closePhoto.addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', event => {
    if (event.target === photoDialog) photoDialog.close();
  });
  photoDialog.addEventListener('close', () => {
    if (!dialog.open) document.body.classList.remove('dialog-open');
    expandedPhoto.removeAttribute('src');
    photoTrigger?.focus({preventScroll:true});
  });

  function selectPhoto(index) {
    const buttons = [...body.querySelectorAll('[data-photo]')];
    if (!buttons.length) return;
    activeIndex = (index + buttons.length) % buttons.length;
    const selected = buttons[activeIndex];
    const photo = body.querySelector('.gallery-image');
    photo.src = selected.dataset.photo;
    photo.alt = selected.dataset.alt;
    photo.closest('.photo-zoom').setAttribute('aria-label', `Zväčšiť fotografiu: ${photo.alt}`);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeIndex)));
    body.querySelector('.photo-counter').textContent = `${activeIndex + 1} / ${buttons.length}`;
  }

  document.querySelectorAll('[data-artist]').forEach(button => {
    button.addEventListener('click', () => {
      const template = document.getElementById(`${button.dataset.artist}-profile`);
      if (!template) return;
      trigger = button;
      body.replaceChildren(template.content.cloneNode(true));
      bindZoom(body);
      activeIndex = 0;
      body.querySelectorAll('[data-photo]').forEach((thumb, index) => {
        thumb.addEventListener('click', () => selectPhoto(index));
      });
      body.querySelectorAll('[data-photo-step]').forEach(step => {
        step.addEventListener('click', () => selectPhoto(activeIndex + Number(step.dataset.photoStep)));
      });
      dialog.showModal();
      document.body.classList.add('dialog-open');
      body.scrollTop = 0;
      close.focus({preventScroll:true});
    });
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectPhoto(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    body.replaceChildren();
    trigger?.focus({preventScroll:true});
  });

})();
