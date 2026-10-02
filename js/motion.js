(function () {
  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !window.gsap) {
    html.classList.remove("motion");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  var EASE = "power3.out";

  function $(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* Initial states: set synchronously so nothing flashes before animating. */
  var heroText = $(".hero-text > :not(.display)");
  var heroTitle = document.querySelector(".hero .display");
  var heroImg = document.querySelector(".hero-img");
  var detailImg = document.querySelector(".detail-img");
  var detailInfo = $(".detail-info > *");
  var cards = $(".works-grid .card");
  var fades = $("[data-reveal]");

  gsap.set(heroText.concat(detailInfo, cards, fades), { autoAlpha: 0, y: 32 });
  if (heroTitle) gsap.set(heroTitle, { autoAlpha: 0 });
  if (heroImg) gsap.set(heroImg, { clipPath: "inset(100% 0% 0% 0%)" });
  if (detailImg) gsap.set(detailImg, { clipPath: "inset(0% 0% 100% 0%)" });
  html.classList.remove("motion");

  /* 2. Gallery cards: staggered rise as they enter the viewport. */
  if (cards.length) {
    ScrollTrigger.batch(cards, {
      start: "top 92%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.12, overwrite: true });
      },
    });
  }

  /* Generic section heads and blocks. */
  fades.forEach(function (el) {
    gsap.to(el, {
      autoAlpha: 1, y: 0, duration: 1.1, ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  /* 5. Artwork detail: curtain reveal on the image, then the info sheet in sequence. */
  if (detailImg) {
    var img = detailImg.querySelector("img");
    gsap.timeline({ defaults: { ease: "power4.inOut" } })
      .to(detailImg, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 })
      .from(img, { scale: 1.12, duration: 1.8, ease: EASE }, 0)
      .to(detailInfo, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08 }, 0.5);
  }

  /* Text work depends on final font metrics. */
  document.fonts.ready.then(function () {
    /* 1. Hero: letters rise from a mask, image opens like a curtain. */
    if (heroTitle) {
      var split = SplitText.create(heroTitle, { type: "lines,chars", mask: "lines" });
      var tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.set(heroTitle, { autoAlpha: 1 })
        .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.045, ease: "power4.out" })
        .to(heroText, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.35);
      if (heroImg) {
        tl.to(heroImg, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" }, 0.15)
          .from(heroImg.querySelector("img"), { scale: 1.15, duration: 2, ease: EASE }, 0.15);
      }
    }

    /* 3. Quotes and lead paragraphs: words light up while scrolling. */
    $(".quote, .prose .lead").forEach(function (el) {
      var words = SplitText.create(el, { type: "words" }).words;
      gsap.from(words, {
        opacity: 0.12,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true },
      });
    });

    ScrollTrigger.refresh();
  });
})();
