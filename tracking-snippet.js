/* ============================================================
   TURNIT — BROKERAGE CLICK TRACKING
   Drop this in as the LAST <script> block of the lesson file.

   WHAT IT DOES
   Fires one webhook per meaningful action on the provider slide:
     provider_selected   — tapped a provider card (browsing)
     provider_confirmed  — pressed "Continue With This Provider" (the real choice)
     provider_visited    — actually clicked through to the provider's site
     more_list_visited   — clicked one of the 12 in the expanded list

   WHO IT ATTRIBUTES TO — read this before trusting the data.
   An iframe cannot see who is logged into the page around it. This
   script tries three sources, in order, and reports which one it used
   so you can tell real identity from a guess:
     1. "url"    — contact id/email passed into the iframe URL
     2. "parent" — the parent page answered our postMessage handshake
     3. "anon"   — no identity available; a random local id is used
   If you never set up 1 or 2, every row will say "anon" and you will
   have counts but not names. See SETUP below.
   ============================================================ */
(function(){
  /* ---------- CONFIG ---------- */
  var WEBHOOK_URL = 'PASTE_YOUR_GHL_INBOUND_WEBHOOK_URL_HERE';
  var LESSON_ID   = 'opening-your-first-account';
  var DEBUG       = true;   /* true = also log every event to the browser console */

  if(!WEBHOOK_URL || WEBHOOK_URL.indexOf('PASTE_YOUR') === 0){
    if(DEBUG) console.warn('[TURNIT] Tracking is off: no webhook URL set.');
    return;
  }

  var root = document.getElementById('tn-oa');
  if(!root) return;

  /* ---------- IDENTITY ---------- */
  var identity = { source:'anon', contactId:'', email:'', name:'' };

  /* 1. from the iframe URL, e.g. ...?cid=abc123&email=jo@x.com */
  try{
    var q = new URLSearchParams(window.location.search);
    var cid   = q.get('cid') || q.get('contact_id') || q.get('contactId') || '';
    var email = q.get('email') || '';
    var name  = q.get('name') || '';
    if(cid || email){
      identity = { source:'url', contactId:cid, email:email, name:name };
    }
  }catch(e){}

  /* 2. ask the parent page (only used if the URL gave us nothing) */
  function askParent(){
    if(identity.source !== 'anon') return;
    try{
      window.parent.postMessage({ turnitWhoAmI:1, lesson:LESSON_ID }, '*');
    }catch(e){}
  }
  window.addEventListener('message', function(ev){
    var d = ev && ev.data;
    if(!d || !d.turnitIdentity) return;
    var i = d.turnitIdentity;
    identity = {
      source:'parent',
      contactId: i.contactId || i.id || '',
      email: i.email || '',
      name: i.name || ''
    };
    if(DEBUG) console.log('[TURNIT] identity from parent:', identity);
  });
  askParent();
  setTimeout(askParent, 1200);   /* retry once, in case the parent script loaded late */

  /* 3. stable-ish anonymous id, so repeat visits from one browser group together.
        localStorage can be blocked for third-party iframes; if it is, we fall
        back to a per-session id and the grouping is lost. That is expected. */
  var anonId = '';
  try{
    anonId = window.localStorage.getItem('turnit_anon_id') || '';
    if(!anonId){
      anonId = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem('turnit_anon_id', anonId);
    }
  }catch(e){
    anonId = 'anon_session_' + Math.random().toString(36).slice(2);
  }

  /* ---------- SEND ---------- */
  var sent = {};   /* de-dupe: one event of each type per provider per page load */

  function track(event, provider, extra){
    var key = event + '|' + provider;
    if(sent[key]) return;
    sent[key] = true;

    var payload = {
      event: event,
      lesson: LESSON_ID,
      provider: provider || '',
      identity_source: identity.source,
      contact_id: identity.contactId || '',
      email: identity.email || '',
      name: identity.name || '',
      anon_id: identity.source === 'anon' ? anonId : '',
      page: (function(){ try{ return document.referrer || ''; }catch(e){ return ''; } })(),
      ts: new Date().toISOString()
    };
    if(extra) for(var k in extra){ if(extra.hasOwnProperty(k)) payload[k] = extra[k]; }

    if(DEBUG) console.log('[TURNIT] track', payload);

    /* sendBeacon survives the tab being navigated away by an outbound click,
       which a plain fetch() often does not. Fall back to fetch if unavailable. */
    var body = JSON.stringify(payload);
    var ok = false;
    try{
      if(navigator.sendBeacon){
        ok = navigator.sendBeacon(WEBHOOK_URL, new Blob([body], {type:'application/json'}));
      }
    }catch(e){}
    if(!ok){
      try{
        fetch(WEBHOOK_URL, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: body,
          keepalive: true,
          mode:'no-cors'
        }).catch(function(){});
      }catch(e){}
    }
  }

  /* ---------- HOOKS ---------- */
  var NAMES = { a:'Robinhood', b:'Fidelity', c:'Charles Schwab',
                d:'Vanguard',  e:'Merrill Edge', f:'E*TRADE' };

  /* browsing a card */
  root.querySelectorAll('#oa-provider-grid .oa-provider-card').forEach(function(card){
    card.addEventListener('click', function(){
      var k = card.getAttribute('data-k');
      track('provider_selected', NAMES[k] || k);
    });
  });

  /* the actual commitment */
  var confirmBtn = root.querySelector('#oa-provider-confirm');
  if(confirmBtn) confirmBtn.addEventListener('click', function(){
    var on = root.querySelector('#oa-provider-grid .oa-provider-card.on');
    var k = on ? on.getAttribute('data-k') : '';
    track('provider_confirmed', NAMES[k] || k);
  });

  /* clicked through to the provider's own site (inline link) */
  root.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('.oa-provider-link') : null;
    if(!a) return;
    var on = root.querySelector('#oa-provider-grid .oa-provider-card.on');
    var k = on ? on.getAttribute('data-k') : '';
    track('provider_visited', NAMES[k] || k, { url: a.getAttribute('href') || '' });
  });

  /* clicked through from the "want to visit?" modal */
  var visitYes = root.querySelector('#oa-visit-yes');
  if(visitYes) visitYes.addEventListener('click', function(){
    track('provider_visited', window.chosenProviderName || '',
          { url: window.chosenProviderLink || '', via:'modal' });
  });

  /* one of the 12 in the expanded list */
  root.querySelectorAll('.oa-more-item').forEach(function(a){
    a.addEventListener('click', function(){
      var b = a.querySelector('b');
      track('more_list_visited', b ? b.textContent.trim() : '',
            { url: a.getAttribute('href') || '' });
    });
  });

  if(DEBUG) console.log('[TURNIT] tracking ready. identity source =', identity.source);
})();
