// =============================================================
// i18n — DE/EN language toggle for the whole site
// -------------------------------------------------------------
// Single source of truth for every guest-facing string.
// HTML elements opt in via data-attributes:
//   data-i18n="key"            → sets textContent
//   data-i18n-html="key"       → sets innerHTML (for lines with <br>, <span>, <a>…)
//   data-i18n-<attr>="key"     → sets that attribute (e.g. data-i18n-placeholder,
//                                data-i18n-aria-label, data-i18n-alt)
// JS reads the same dict via window.weddingT(key) / window.weddingLang().
// Choice persists in localStorage ('vs_lang'); default 'de'.
// =============================================================
(function () {
  const T = {
    de: {
      // Cover
      cover_seal_alt: 'Wachssiegel mit den Initialen V und S',
      cover_open_aria: 'Einladung öffnen',
      cover_script: 'Diese<br />Einladung<br />ist exklusiv<br /><span class="accent">für dich</span>',

      // Nav
      nav_home_aria: 'Zum Anfang',
      nav_story: 'Geschichte',
      nav_location: 'Location',
      nav_gallery: 'Galerie',
      nav_schedule: 'Ablauf',
      nav_cta: 'Zusagen',
      nav_menu_aria: 'Menü öffnen',

      // Hero
      hero_bg_alt: 'Foto des Paares',
      hero_eyebrow: '<span class="eyebrow-line"></span>Lasst uns gemeinsam Feiern<span class="eyebrow-line"></span>',
      hero_intro: 'Wir freuen uns, diesen besonderen Tag mit dir zu feiern.',
      countdown_aria: 'Countdown bis zur Reception',
      cd_days: 'Tage',
      cd_hours: 'Stunden',
      cd_minutes: 'Minuten',
      cd_seconds: 'Sekunden',
      hero_date: '29. Mai 2027',
      hero_location: 'Saalbau · Kirchberg',
      hero_note: 'Diese Einladung gilt für die Reception (Afterparty).',
      hero_cta: 'Jetzt zusagen',

      // Story
      story_eyebrow: 'Unsere Geschichte',
      story_title: 'Zwei Seelen, ein Schicksal',
      story_lead: 'Zwei Seelen, ein Schicksal — und eine Liebe, die daraus entstand.',
      story1_alt: 'Vithu & Saru – die ersten Nachrichten',
      story1_chip: 'Frühjahr 2024',
      story1_h: 'Erste Schritte',
      story1_p: 'Zwei Kolleginnen wurden zu stillen Wegbereiterinnen unseres Schicksals. Sie stellten uns einander vor, und was mit ein paar Nachrichten begann, entwickelte sich zu tagelangen Gesprächen voller Neugier, Lachen und Vertrautheit.',
      story2_alt: 'Vithu & Saru beim ersten Date',
      story2_chip: 'Frühling 2024',
      story2_h: 'Das erste Date',
      story2_p: 'Unser erstes Treffen fühlte sich an, als hätte das Leben diesen Moment schon lange für uns vorgesehen. Obwohl sich unsere Familien bereits kannten, waren unsere eigenen Wege sich bis dahin nie begegnet. Manchmal kennt das Schicksal den richtigen Zeitpunkt und führt zwei Menschen zusammen, deren Wege sich längst hätten kreuzen können.',
      story3_alt: 'Der Heiratsantrag auf dem Gurten',
      story3_chip: 'Frühjahr 2026',
      story3_h: 'Der Antrag',
      story3_p: 'Der Heiratsantrag war eine wunderschöne Überraschung. Er erzählte mir, wir würden auf den Gurten fahren, um dort essen zu gehen. Unter dem Vorwand, Fotos machen zu wollen, führte er mich zu einem traumhaften Aussichtspunkt. Als ich mich umdrehte, standen plötzlich unsere Familie und unsere engsten Herzensmenschen vor mir, die diesen besonderen Moment mit uns teilen wollten. Dann kniete er sich vor mich und fragte mich auf Tamil: „என்ன, கல்யாணம் கண்டுவோமா?“ Meine Antwort war von Herzen: Ja.',
      story4_alt: 'Vithu & Saru feiern zusammen',
      story4_chip: 'Mai 2027',
      story4_h: 'Unser grosser Tag',
      story4_p: 'Und nun laden wir dich ein — unsere Familie und liebsten Freunde — dieses nächste Kapitel mit uns zu feiern.',

      // Location
      loc_eyebrow: 'Wo & Wann',
      loc_title: 'Location & Anfahrt',
      loc_lead: 'Wir feiern unseren großen Tag an einem Ort, der so besonders ist wie dieser Anlass. Wir freuen uns darauf, ihn mit dir zu teilen!',
      map_aria: 'Karte & Details aufklappen',
      map_hint: 'Für Karte & Details tippen',
      loc_badge: 'Reception · Afterparty',
      loc_meta_date: '29. Mai 2027',
      loc_meta_time: 'Reception ab 16:00 Uhr',
      loc_meta_dress: 'Festlich / Traditionelle',
      btn_route: 'Route anzeigen',

      // Ceremony
      cer_eyebrow: 'Vorab',
      cer_title: 'Traditionelle Hochzeit',
      cer_lead: 'Unsere traditionelle hinduistische Zeremonie findet an einem eigenen Tag statt. Dafür erhältst du eine separate, persönliche Einladung — diese Website und die Rückmeldung unten gelten nur für die Reception.',
      cer_badge: 'Traditionelle Zeremonie',
      cer_meta_date: '16. Mai 2027',

      // Gallery
      gal_eyebrow: 'Augenblicke',
      gal_title: 'Unsere Galerie',
      gal_lead: 'Ein paar Momente, die uns hierher gebracht haben — bald gefüllt mit deinen liebsten Erinnerungen an unseren Tag.',
      gal1_alt: 'Momentaufnahme des Paares',
      gal2_alt: 'Gemeinsamer Moment',
      gal3_alt: 'Erinnerung an einen besonderen Tag',
      gal4_alt: 'Gemeinsame Reise',
      gal5_alt: 'Ein Lächeln zu zweit',
      gal6_alt: 'Ein Versprechen',

      // Schedule
      sch_eyebrow: 'Der Tag',
      sch_title: 'Tagesablauf',
      sch_lead: 'Was dich an unserem großen Tag erwartet.',
      sch1_h: 'Einlass & Empfang',
      sch1_d: 'Willkommen! Die Türen öffnen sich und wir empfangen unsere Gäste.',
      sch2_h: 'Trauungszeremonie',
      sch2_d: 'Der feierliche Moment, auf den wir so lange gewartet haben — wir geben uns das Jawort.',
      sch3_h: 'Sektempfang',
      sch3_d: 'Anstoßen, Lachen und die ersten Fotos als Ehepaar.',
      sch4_h: 'Abendessen',
      sch4_d: 'Ein festliches Dinner mit herzlichen Reden und guter Gesellschaft.',
      sch5_h: 'Tanz & Feier',
      sch5_d: 'Die Tanzfläche ist eröffnet — lasst uns bis in die frühen Morgenstunden feiern!',

      // RSVP
      rsvp_eyebrow: 'Rückmeldung',
      rsvp_title: 'Bist du dabei?',
      rsvp_lead: 'Bitte gib uns bis <strong>Ende Januar 2027</strong> Bescheid, ob du dabei sein kannst. Wir planen unseren großen Tag und möchten sicherstellen, dass für jeden gesorgt ist.',
      rsvp_note: 'Deine Rückmeldung bezieht sich nur auf die <strong>Reception am Samstag, 29. Mai 2027</strong> — für die traditionelle Hochzeit gilt die separate Einladungskarte.',
      rsvp_done_h: 'Schon erledigt!',
      rsvp_done_p: 'Du hast uns bereits Bescheid gegeben — vielen Dank.<br />Möchtest du etwas ändern? Schreib uns an <a href="mailto:vithursan.thayananthan@gmail.com">vithursan.thayananthan@gmail.com</a>.',
      lbl_attend: 'Nimmst du teil? *',
      attend_aria: 'Teilnahme auswählen',
      btn_yes: 'Ja',
      btn_no: 'Nein',
      lbl_name: 'Name *',
      ph_name: 'Dein vollständiger Name',
      lbl_guests: 'Anzahl Gäste (inkl. dir)',
      guests_minus_aria: 'Weniger Gäste',
      guests_plus_aria: 'Mehr Gäste',
      guests_input_aria: 'Anzahl Gäste',
      lbl_veg: 'Isst du vegetarisch?',
      veg_aria: 'Vegetarisch auswählen',
      lbl_song: 'Musikwunsch',
      ph_song: 'Ein Song, der dich auf die Tanzfläche bringt!',
      lbl_message: 'Nachricht an das Brautpaar',
      ph_message: 'Teile deine Wünsche, eine Erinnerung oder ein paar liebe Worte…',
      btn_submit: 'Rückmeldung senden',
      rsvp_sending: 'Wird gesendet…',

      // Footer
      footer_date: '29. Mai 2027 · Kirchberg',
      footer_credit: 'Mit Liebe gemacht',

      // Farewell
      farewell_aria: 'Danke für deine Rückmeldung',
      farewell_cal: 'Zum Kalender hinzufügen',
      farewell_meta: '29. Mai 2027 · Saalbau Kirchberg',
      farewell_contact: 'Möchtest du etwas ändern? Schreib uns an<br /><a href="mailto:vithursan.thayananthan@gmail.com">vithursan.thayananthan@gmail.com</a>',
      farewell_title_yes: 'Vielen Dank!',
      farewell_title_no: 'Danke für deine Rückmeldung',
      farewell_text_yes: 'Wir können es kaum erwarten, mit dir zu feiern. Bis bald auf der Tanzfläche!',
      farewell_text_no: 'Schade, dass du nicht dabei sein kannst — danke, dass du uns Bescheid gegeben hast. Du wirst uns fehlen.',

      // Lightbox / music
      lightbox_aria: 'Galerie-Ansicht',
      lightbox_close: 'Schließen',
      lightbox_prev: 'Vorheriges Foto',
      lightbox_next: 'Nächstes Foto',
      music_aria: 'Musik pausieren oder fortsetzen',

      // Calendar (JS)
      cal_title: 'Hochzeit von Vithu & Saru',
      cal_details: 'Wir feiern im Saalbau Kirchberg! Empfang ab 16:00 Uhr.',
    },

    en: {
      // Cover
      cover_seal_alt: 'Wax seal with the initials V and S',
      cover_open_aria: 'Open invitation',
      cover_script: 'This<br />invitation<br />is exclusively<br /><span class="accent">for you</span>',

      // Nav
      nav_home_aria: 'To the top',
      nav_story: 'Story',
      nav_location: 'Location',
      nav_gallery: 'Gallery',
      nav_schedule: 'Schedule',
      nav_cta: 'RSVP',
      nav_menu_aria: 'Open menu',

      // Hero
      hero_bg_alt: 'Photo of the couple',
      hero_eyebrow: '<span class="eyebrow-line"></span>Let\'s celebrate together<span class="eyebrow-line"></span>',
      hero_intro: 'We can\'t wait to celebrate this special day with you.',
      countdown_aria: 'Countdown to the reception',
      cd_days: 'Days',
      cd_hours: 'Hours',
      cd_minutes: 'Minutes',
      cd_seconds: 'Seconds',
      hero_date: 'May 29, 2027',
      hero_location: 'Saalbau · Kirchberg',
      hero_note: 'This invitation is for the reception (afterparty).',
      hero_cta: 'RSVP now',

      // Story
      story_eyebrow: 'Our Story',
      story_title: 'Two souls, one destiny',
      story_lead: 'Two souls, one destiny — and a love that grew from it.',
      story1_alt: 'Vithu & Saru – the first messages',
      story1_chip: 'Spring 2024',
      story1_h: 'First Steps',
      story1_p: 'Two colleagues became the quiet architects of our destiny. They introduced us to each other, and what began with a few messages grew into days-long conversations full of curiosity, laughter and closeness.',
      story2_alt: 'Vithu & Saru on their first date',
      story2_chip: 'Spring 2024',
      story2_h: 'The First Date',
      story2_p: 'Our first meeting felt as though life had planned this moment for us long ago. Although our families already knew each other, our own paths had never crossed until then. Sometimes destiny knows the right moment and brings together two people whose paths could long since have met.',
      story3_alt: 'The proposal on the Gurten',
      story3_chip: 'Spring 2026',
      story3_h: 'The Proposal',
      story3_p: 'The proposal was a beautiful surprise. He told me we were driving up the Gurten to go out for dinner. Under the pretext of wanting to take photos, he led me to a breathtaking viewpoint. When I turned around, our family and our dearest people were suddenly standing before me, wanting to share this special moment with us. Then he knelt down before me and asked me in Tamil: „என்ன, கல்யாணம் கண்டுவோமா?“ My answer came from the heart: yes.',
      story4_alt: 'Vithu & Saru celebrating together',
      story4_chip: 'May 2027',
      story4_h: 'Our Big Day',
      story4_p: 'And now we invite you — our family and dearest friends — to celebrate this next chapter with us.',

      // Location
      loc_eyebrow: 'Where & When',
      loc_title: 'Location & Directions',
      loc_lead: 'We\'re celebrating our big day at a place as special as the occasion itself. We can\'t wait to share it with you!',
      map_aria: 'Expand map & details',
      map_hint: 'Tap for map & details',
      loc_badge: 'Reception · Afterparty',
      loc_meta_date: 'May 29, 2027',
      loc_meta_time: 'Reception from 4:00 pm',
      loc_meta_dress: 'Festive / Traditional',
      btn_route: 'Show route',

      // Ceremony
      cer_eyebrow: 'Beforehand',
      cer_title: 'Traditional Wedding',
      cer_lead: 'Our traditional Hindu ceremony takes place on a separate day. You\'ll receive a separate, personal invitation for it — this website and the RSVP below are only for the reception.',
      cer_badge: 'Traditional Ceremony',
      cer_meta_date: 'May 16, 2027',

      // Gallery
      gal_eyebrow: 'Moments',
      gal_title: 'Our Gallery',
      gal_lead: 'A few moments that brought us here — soon filled with your favourite memories of our day.',
      gal1_alt: 'A snapshot of the couple',
      gal2_alt: 'A shared moment',
      gal3_alt: 'A memory of a special day',
      gal4_alt: 'A journey together',
      gal5_alt: 'A smile for two',
      gal6_alt: 'A promise',

      // Schedule
      sch_eyebrow: 'The Day',
      sch_title: 'Schedule',
      sch_lead: 'What awaits you on our big day.',
      sch1_h: 'Doors & Reception',
      sch1_d: 'Welcome! The doors open and we greet our guests.',
      sch2_h: 'Wedding Ceremony',
      sch2_d: 'The solemn moment we\'ve waited so long for — we say "I do".',
      sch3_h: 'Champagne Reception',
      sch3_d: 'Toasting, laughter and the first photos as a married couple.',
      sch4_h: 'Dinner',
      sch4_d: 'A festive dinner with heartfelt speeches and good company.',
      sch5_h: 'Dancing & Celebration',
      sch5_d: 'The dance floor is open — let\'s celebrate into the early morning hours!',

      // RSVP
      rsvp_eyebrow: 'RSVP',
      rsvp_title: 'Will you be there?',
      rsvp_lead: 'Please let us know by <strong>the end of January 2027</strong> whether you can make it. We\'re planning our big day and want to make sure everyone is taken care of.',
      rsvp_note: 'Your reply is only for the <strong>reception on Saturday, May 29, 2027</strong> — the traditional wedding has its own separate invitation card.',
      rsvp_done_h: 'All done!',
      rsvp_done_p: 'You\'ve already let us know — thank you!<br />Would you like to change something? Email us at <a href="mailto:vithursan.thayananthan@gmail.com">vithursan.thayananthan@gmail.com</a>.',
      lbl_attend: 'Will you attend? *',
      attend_aria: 'Select attendance',
      btn_yes: 'Yes',
      btn_no: 'No',
      lbl_name: 'Name *',
      ph_name: 'Your full name',
      lbl_guests: 'Number of guests (incl. you)',
      guests_minus_aria: 'Fewer guests',
      guests_plus_aria: 'More guests',
      guests_input_aria: 'Number of guests',
      lbl_veg: 'Do you eat vegetarian?',
      veg_aria: 'Select vegetarian',
      lbl_song: 'Song request',
      ph_song: 'A song that gets you on the dance floor!',
      lbl_message: 'Message to the couple',
      ph_message: 'Share your wishes, a memory or a few kind words…',
      btn_submit: 'Send RSVP',
      rsvp_sending: 'Sending…',

      // Footer
      footer_date: 'May 29, 2027 · Kirchberg',
      footer_credit: 'Made with love',

      // Farewell
      farewell_aria: 'Thank you for your reply',
      farewell_cal: 'Add to calendar',
      farewell_meta: 'May 29, 2027 · Saalbau Kirchberg',
      farewell_contact: 'Would you like to change something? Email us at<br /><a href="mailto:vithursan.thayananthan@gmail.com">vithursan.thayananthan@gmail.com</a>',
      farewell_title_yes: 'Thank you!',
      farewell_title_no: 'Thank you for your reply',
      farewell_text_yes: 'We can\'t wait to celebrate with you. See you on the dance floor!',
      farewell_text_no: 'We\'re sad you can\'t make it — thank you for letting us know. We\'ll miss you.',

      // Lightbox / music
      lightbox_aria: 'Gallery view',
      lightbox_close: 'Close',
      lightbox_prev: 'Previous photo',
      lightbox_next: 'Next photo',
      music_aria: 'Pause or resume music',

      // Calendar (JS)
      cal_title: 'Wedding of Vithu & Saru',
      cal_details: 'We\'re celebrating at Saalbau Kirchberg! Reception from 4:00 pm.',
    },
  };

  const STORE_KEY = 'vs_lang';
  const ATTR_TARGETS = ['placeholder', 'aria-label', 'alt', 'title'];

  let current = 'de';
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === 'de' || saved === 'en') current = saved;
  } catch (_) {}

  function dict() { return T[current] || T.de; }

  // Exposed for main.js (farewell, submit button, calendar)
  window.weddingT = function (key) {
    const d = dict();
    return (key in d) ? d[key] : (T.de[key] != null ? T.de[key] : key);
  };
  window.weddingLang = function () { return current; };

  function applyLang(lang) {
    current = (lang === 'en') ? 'en' : 'de';
    const d = dict();
    document.documentElement.lang = current;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = d[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const v = d[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v;
    });
    ATTR_TARGETS.forEach((attr) => {
      document.querySelectorAll('[data-i18n-' + attr + ']').forEach((el) => {
        const v = d[el.getAttribute('data-i18n-' + attr)];
        if (v != null) el.setAttribute(attr, v);
      });
    });

    // Reflect active state on the switch buttons
    document.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === current);
      b.setAttribute('aria-pressed', String(b.dataset.lang === current));
    });

    try { localStorage.setItem(STORE_KEY, current); } catch (_) {}
    // Let main.js refresh anything it rendered from the dict (e.g. open farewell)
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  window.weddingSetLang = applyLang;

  function init() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
    applyLang(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
