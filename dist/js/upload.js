/* DOM-ready guard — works from <head>, defer, or end of <body>. */
(function(){
function __exsaInit(){

/* EXSA Upload — dropzone + file list with progress (vanilla, zero-dependency)
   .upload > (.upload__dropzone > .upload__input, .upload__list)
   data-upload-url: real XHR upload with live progress.
   Without it, progress is simulated (demo mode).
   Events on .upload: exsa:upload-add / -done / -error / -remove. */
(function () {
  'use strict';

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function ext(name) {
    var i = name.lastIndexOf('.');
    return i > 0 ? name.slice(i + 1).toUpperCase().slice(0, 4) : 'FILE';
  }

  document.querySelectorAll('.upload').forEach(function (up) {
    var input = up.querySelector('.upload__input');
    var zone = up.querySelector('.upload__dropzone');
    var list = up.querySelector('.upload__list');
    if (!input || !zone || !list) return;
    var url = up.getAttribute('data-upload-url') || '';

    zone.addEventListener('click', function () { input.click(); });
    zone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });
    input.addEventListener('change', function () {
      if (input.files.length) addFiles(input.files);
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) {
        e.preventDefault();
        zone.classList.add('upload__dropzone--over');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) {
        e.preventDefault();
        zone.classList.remove('upload__dropzone--over');
      });
    });
    zone.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });

    function addFiles(files) {
      Array.prototype.forEach.call(files, function (file) { addItem(file); });
      up.dispatchEvent(new CustomEvent('exsa:upload-add', { detail: { files: Array.prototype.slice.call(files) } }));
    }

    function addItem(file) {
      var li = document.createElement('li');
      li.className = 'upload__item';
      li.innerHTML =
        '<span class="upload__item-ext">' + ext(file.name) + '</span>' +
        '<div class="upload__item-body">' +
          '<div class="upload__item-name"></div>' +
          '<div class="upload__item-meta"></div>' +
          '<div class="upload__item-track"><div class="upload__item-fill"></div></div>' +
        '</div>' +
        '<button type="button" class="upload__item-remove" aria-label="Remove file">&times;</button>';
      li.querySelector('.upload__item-name').textContent = file.name;
      list.appendChild(li);

      var fill = li.querySelector('.upload__item-fill');
      var meta = li.querySelector('.upload__item-meta');
      var remove = li.querySelector('.upload__item-remove');
      var xhr = null;
      var simTimer = null;

      function done() {
        li.classList.add('upload__item--done');
        meta.textContent = fmtSize(file.size) + ' · Done';
        up.dispatchEvent(new CustomEvent('exsa:upload-done', { detail: { file: file, name: file.name } }));
      }
      function fail(message) {
        li.classList.add('upload__item--error');
        meta.textContent = message || 'Upload failed';
        up.dispatchEvent(new CustomEvent('exsa:upload-error', { detail: { file: file, name: file.name, message: message || 'Upload failed' } }));
      }
      function cancel() {
        if (xhr) xhr.abort();
        if (simTimer) clearInterval(simTimer);
        li.remove();
        up.dispatchEvent(new CustomEvent('exsa:upload-remove', { detail: { name: file.name } }));
      }
      remove.addEventListener('click', cancel);

      if (url) {
        /* Real upload with live progress */
        xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            var pct = (e.loaded / e.total) * 100;
            fill.style.setProperty('--upload-pct', pct + '%');
            meta.textContent = fmtSize(file.size) + ' · ' + Math.round(pct) + '%';
          }
        };
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) done();
          else fail('Upload failed (' + xhr.status + ')');
        };
        xhr.onerror = function () { fail('Network error'); };
        xhr.onabort = function () { /* remove already called */ };
        var fd = new FormData();
        fd.append('file', file);
        xhr.send(fd);
        meta.textContent = fmtSize(file.size) + ' · 0%';
      } else {
        /* Demo mode — simulated progress */
        var pct = 0;
        meta.textContent = fmtSize(file.size) + ' · 0%';
        simTimer = setInterval(function () {
          pct += Math.random() * 14 + 4;
          if (pct >= 100) {
            pct = 100;
            clearInterval(simTimer);
            fill.style.setProperty('--upload-pct', '100%');
            done();
            return;
          }
          fill.style.setProperty('--upload-pct', pct + '%');
          meta.textContent = fmtSize(file.size) + ' · ' + Math.round(pct) + '%';
        }, 220);
      }
    }
  });
})();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__exsaInit);}
else{__exsaInit();}
})();
