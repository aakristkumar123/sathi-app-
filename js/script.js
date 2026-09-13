/* ============================================================
   DATA LAYER (localStorage)
============================================================ */
const DB_KEY = 'sathi_data_v1';
function loadDB(){
  const raw = localStorage.getItem(DB_KEY);
  if(raw) return JSON.parse(raw);
  const fresh = {
    settings:{ language:'hi' }, // 'en' | 'hi' | 'brx' (Bodo) - patient's chosen voice/text language
    patient:{ name:'Ramesh Sharma', age:72, wake:'06:00', sleep:'21:30', meals:'Chai 7am, Nashta 8am, Khana 1pm, Raat ka khana 8pm' },
    medicines:[
      {name:'Donepezil', dosage:'5mg', time:'09:00'},
      {name:'BP ki dawai', dosage:'1 tablet', time:'20:00'}
    ],
    familyMembers:[
      {name:'Anita', relation:'Beti (Daughter)'},
      {name:'Rahul', relation:'Beta (Son)'},
      {name:'Priya', relation:'Pothi (Granddaughter)'}
    ],
    photos:[],
    healthRecords:[],
    gameScores:[]
  };
  saveDB(fresh);
  return fresh;
}
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
let db = loadDB();
if(!db.settings) db.settings = { language:'hi' }; // safety net for data saved before this feature existed

/* ============================================================
   LANGUAGE / TRANSLATIONS
   Supports English, Hindi, and Bodo (a Tibeto-Burman language
   spoken widely in Assam) so the patient can pick the language
   they're most comfortable hearing and reading.

   IMPORTANT - READ BEFORE YOUR DEMO:
   The Bodo ("brx") lines marked with a [VERIFY] comment are our
   best-effort placeholders, not confirmed by a native speaker.
   "khulumbai" (formal greeting) is confirmed correct. Please get
   the [VERIFY] lines checked/corrected by a Bodo speaker on your
   team before presenting - wrong translations shown on stage would
   hurt more than skipping the language would.
============================================================ */
const TRANSLATIONS = {
  en: {
    greeting: 'Namaste',
    reminders_label: 'Reminders',
    reminders_sub: 'Medicine, food & routine',
    photo_game_label: 'Memory Photos',
    photo_game_sub: 'Photo memory game',
    routine_game_label: 'Daily Questions',
    routine_game_sub: 'Daily routine questions',
    exit: 'Exit',
    next_question: 'Next Question →',
    correct_msg: 'Well done! ✅',
    wrong_msg_prefix: 'That\'s okay, the correct answer was: ',
    reminder_done: 'Done ✓',
    reminder_listen: '🔊 Listen',
    no_photos_msg: 'No photos yet. Ask your caretaker to add some.',
    q_who_is_beside: 'Who is standing beside you in this photo?',
    q_when_was_this: 'When was this photo taken?',
    q_wake_time: 'What time do you wake up in the morning?',
    q_sleep_time: 'What time do you go to sleep at night?',
    q_medicine_time: (med)=>`What time do you take ${med}?`,
    q_family_name: (relation)=>`What is the name of your ${relation}?`
  },
  hi: {
    greeting: 'Namaste',
    reminders_label: 'Reminders',
    reminders_sub: 'Dawai, khana aur routine',
    photo_game_label: 'Yaadon ka Khel',
    photo_game_sub: 'Photo memory game',
    routine_game_label: 'Roz ka Sawal',
    routine_game_sub: 'Daily routine questions',
    exit: 'Exit',
    next_question: 'Agla Sawal →',
    correct_msg: 'Bahut badhiya! ✅',
    wrong_msg_prefix: 'Koi baat nahi, sahi jawab tha: ',
    reminder_done: 'Ho gaya ✓',
    reminder_listen: '🔊 Suno',
    no_photos_msg: 'Abhi koi photo nahi hai. Caretaker ko photo upload karne ke liye kahiye.',
    q_who_is_beside: 'Is photo mein aapke bagal mein kaun khada hai?',
    q_when_was_this: 'Yeh photo kab ki hai?',
    q_wake_time: 'Aap subah kitne baje uthte hain?',
    q_sleep_time: 'Aap raat ko kitne baje sote hain?',
    q_medicine_time: (med)=>`${med} kis samay leni hoti hai?`,
    q_family_name: (relation)=>`${relation} ka naam kya hai?`
  },
  brx: {
    greeting: 'Khulumbai', // confirmed: formal Bodo greeting, like "Namaste"
    reminders_label: 'Reminders', // [VERIFY] kept in English - please add Bodo word for "reminder"
    reminders_sub: 'Dawai, khana aru routine', // [VERIFY] mixed Bodo/Hindi placeholder
    photo_game_label: 'Fwithai Khel', // [VERIFY] attempted "photo game" - please confirm wording
    photo_game_sub: 'Photo memory game', // [VERIFY]
    routine_game_label: 'Gaskhrai Sawal', // [VERIFY] attempted "daily question" - please confirm
    routine_game_sub: 'Daily routine questions', // [VERIFY]
    exit: 'Doraikhi', // [VERIFY] attempted "exit/leave" - please confirm
    next_question: 'Fwrni Sawal →', // [VERIFY]
    correct_msg: 'Mwjang! ✅', // [VERIFY] "mwjang" = good/nice (confirmed word), full phrase not verified
    wrong_msg_prefix: 'Jinga dasi, sonnaithi jwbab: ', // [VERIFY] "jinga dasi" = don't worry (confirmed phrase), rest not verified
    reminder_done: 'Jaboti ✓', // [VERIFY]
    reminder_listen: '🔊 Nagw', // [VERIFY] attempted "listen" - please confirm
    no_photos_msg: 'Fwithai jaya. Caretaker nw fwithai upload khalamnanwiubthi.', // [VERIFY]
    q_who_is_beside: 'Be fwithai o nwngni gwrjwm o sw dungwn?', // [VERIFY] full sentence not confirmed
    q_when_was_this: 'Be fwithai bosor de?', // [VERIFY] full sentence not confirmed
    q_wake_time: 'Nwng subah maha be uthinai?', // [VERIFY] full sentence not confirmed
    q_sleep_time: 'Nwng habha maha be uninai?', // [VERIFY] full sentence not confirmed
    q_medicine_time: (med)=>`${med} maha be jagwn?`, // [VERIFY] full sentence not confirmed
    q_family_name: (relation)=>`Nwngni ${relation} bimwng mwn se?` // [VERIFY] full sentence not confirmed
  }
};

function t(key){
  const lang = db.settings.language || 'hi';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}

// Maps our internal language code to the BCP-47 tag the browser's speech
// engine expects, and tells us honestly whether a voice actually exists
// for it on this device - browsers currently do NOT ship Bodo voices,
// so we never pretend to speak it if no matching voice is found.
function getSpeechLangCode(){
  const lang = db.settings.language || 'hi';
  if(lang === 'en') return 'en-IN';
  if(lang === 'brx') return 'brx-IN';
  return 'hi-IN';
}
function deviceHasVoiceFor(langCode){
  const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
  return voices.some(v => v.lang === langCode || (v.lang && v.lang.startsWith(langCode.split('-')[0])));
}

function setLanguage(lang){
  db.settings.language = lang;
  saveDB(db);
  applyPatientTranslations();
  speak(t('greeting'), getSpeechLangCode());
  updateVoiceAvailabilityNote();
}

// Be honest with the user: most phones/browsers do not currently ship a
// Bodo (or other Tibeto-Burman) voice, so we tell them plainly instead of
// silently failing to speak.
function updateVoiceAvailabilityNote(){
  const note = document.getElementById('voiceNote');
  if(!note) return;
  if(!deviceHasVoiceFor(getSpeechLangCode())){
    note.textContent = 'Is device par is bhasha ki awaaz uplabdh nahi hai — sirf likha hua text dikhega.';
    note.classList.remove('hidden');
  } else {
    note.classList.add('hidden');
  }
}

// Updates all the static patient-facing text to the currently selected language.
function applyPatientTranslations(){
  const first = (db.patient.name||'').split(' ')[0];
  const g = document.getElementById('patientGreeting');
  if(g) g.textContent = t('greeting') + (first ? ', ' + first : '') + ' 🙏';
  const map = {
    lbl_reminders:'reminders_label', sub_reminders:'reminders_sub',
    lbl_photogame:'photo_game_label', sub_photogame:'photo_game_sub',
    lbl_routinegame:'routine_game_label', sub_routinegame:'routine_game_sub',
    txt_exit:'exit'
  };
  Object.keys(map).forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = t(map[id]);
  });
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===(db.settings.language||'hi')));
}

/* ============================================================
   TEXT TO SPEECH
   Mobile browsers (iOS Safari, many Android Chrome builds) block
   speechSynthesis unless called directly from a user tap, and often
   report zero voices until 'voiceschanged' fires. We cache voices
   as soon as they're available and always call speak() from a
   direct tap handler (never from a setTimeout), so it works on phones.
============================================================ */
let cachedVoices = [];
function refreshVoices(){ cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
if('speechSynthesis' in window){
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}
function speak(text, lang){
  if(!('speechSynthesis' in window)){
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }
  lang = lang || 'hi-IN';
  window.speechSynthesis.cancel();
  // tiny delay after cancel() avoids a known Chrome/Android bug where
  // speak() right after cancel() gets silently dropped
  setTimeout(()=>{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.pitch = 1;
    const voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    const voice = voices.find(v=>v.lang===lang) || voices.find(v=>v.lang && v.lang.startsWith('hi')) || null;
    if(voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }, 50);
}

/* ============================================================
   NAVIGATION
============================================================ */
function goLanding(){
  document.getElementById('landing').classList.remove('hidden');
  document.getElementById('patientView').classList.add('hidden');
  document.getElementById('caretakerView').classList.add('hidden');
  window.speechSynthesis.cancel();
  clearInterval(reminderTimer);
}
function goPatient(){
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('patientView').classList.remove('hidden');
  document.getElementById('caretakerView').classList.add('hidden');
  applyPatientTranslations();
  showPatientHome();
  speak(t('greeting') + ' ' + db.patient.name.split(' ')[0], getSpeechLangCode());
  updateVoiceAvailabilityNote();
  startReminderWatcher();
}
function goCaretaker(){
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('caretakerView').classList.remove('hidden');
  document.getElementById('patientView').classList.add('hidden');
  showCaretakerPage('profile');
}
function showPatientHome(){
  document.getElementById('patientHomeScreen').classList.remove('hidden');
  document.getElementById('photoGameScreen').classList.add('hidden');
  document.getElementById('routineGameScreen').classList.add('hidden');
  document.getElementById('backLink').classList.add('hidden');
  window.speechSynthesis.cancel();
}

/* ============================================================
   REMINDERS (patient side)
============================================================ */
let reminderTimer = null;
let firedToday = {};
function startReminderWatcher(){
  clearInterval(reminderTimer);
  reminderTimer = setInterval(checkReminders, 15000);
  checkReminders();
}
function checkReminders(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const current = hh+':'+mm;
  db.medicines.forEach(med=>{
    if(med.time === current && !firedToday[med.name+med.time]){
      firedToday[med.name+med.time] = true;
      triggerReminder('💊', med.name+' lene ka samay ho gaya hai', med.name+' — '+med.dosage);
    }
  });
}
let lastReminderSpeech = '';
function triggerReminder(icon, title, text){
  document.querySelector('#reminderAlert .icon').textContent = icon;
  document.getElementById('reminderTitle').textContent = title;
  document.getElementById('reminderText').textContent = text;
  document.getElementById('reminderListenBtn').textContent = t('reminder_listen');
  document.getElementById('reminderDoneBtn').textContent = t('reminder_done');
  document.getElementById('reminderAlert').classList.remove('hidden');
  lastReminderSpeech = title + '. ' + text;
  // Attempt auto-speak (works on desktop; on many phones this timer-triggered
  // call gets silently blocked, which is why the visible "Listen" button below
  // exists — tapping it always works since it's a direct user gesture).
  speak(lastReminderSpeech, getSpeechLangCode());
}
function replayReminder(){ speak(lastReminderSpeech, getSpeechLangCode()); }
function dismissReminder(){
  document.getElementById('reminderAlert').classList.add('hidden');
  window.speechSynthesis.cancel();
}
// Demo trigger button removed from UI flow; testers can call testReminder() from console,
// or use the "Test a reminder now" button on the caretaker Reminders page.
function testReminder(){
  if(db.medicines.length===0){ alert('Add a medicine first.'); return; }
  const med = db.medicines[0];
  triggerReminder('💊', med.name+' lene ka samay ho gaya hai', med.name+' — '+med.dosage);
}

/* ============================================================
   GAME 1: PHOTO RECALL
============================================================ */
let currentPhotoQ = null;
function startPhotoGame(){
  document.getElementById('patientHomeScreen').classList.add('hidden');
  document.getElementById('routineGameScreen').classList.add('hidden');
  document.getElementById('backLink').classList.remove('hidden');
  const screen = document.getElementById('photoGameScreen');
  screen.classList.remove('hidden');

  if(db.photos.length === 0){
    screen.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
        <span style="font-size:3rem;">📷</span>
        <p class="empty-note">${t('no_photos_msg')}</p>
      </div>`;
    return;
  }
  nextPhotoQuestion();
}
function nextPhotoQuestion(){
  const photo = db.photos[Math.floor(Math.random()*db.photos.length)];
  const qTypeIsWho = photo.people && photo.people.length>0 && Math.random() < 0.6;
  let question, correctAnswer, options;

  if(qTypeIsWho){
    const person = photo.people[Math.floor(Math.random()*photo.people.length)];
    question = t('q_who_is_beside');
    correctAnswer = person.name + ' (' + person.relation + ')';
    const distractors = db.familyMembers
      .filter(f=>f.name !== person.name)
      .map(f=>f.name+' ('+f.relation+')')
      .sort(()=>0.5-Math.random())
      .slice(0,3);
    options = [correctAnswer, ...distractors].sort(()=>0.5-Math.random());
  } else {
    question = t('q_when_was_this');
    correctAnswer = photo.occasion;
    const distractors = db.photos
      .filter(p=>p.occasion !== photo.occasion)
      .map(p=>p.occasion)
      .sort(()=>0.5-Math.random())
      .slice(0,3);
    while(distractors.length < 3){ distractors.push('Pata nahi'); }
    options = [correctAnswer, ...distractors].sort(()=>0.5-Math.random());
  }
  currentPhotoQ = {photo, question, correctAnswer};
  renderGameQuestion('photoGameScreen', photo.url, question, options, correctAnswer, 'photo');
}
function renderGameQuestion(screenId, imgUrl, question, options, correctAnswer, gameType){
  const screen = document.getElementById(screenId);
  screen.innerHTML = `
    ${imgUrl ? `<img class="game-photo" src="${imgUrl}" alt="memory photo">` : ''}
    <div class="game-question">
      <span>${question}</span>
      <button class="speak-btn" onclick="speak('${question.replace(/'/g,"\\'")}', getSpeechLangCode())">🔊</button>
    </div>
    <div class="options-grid" id="optionsGrid"></div>
    <div class="feedback-msg" id="feedbackMsg"></div>
  `;
  const grid = document.getElementById('optionsGrid');
  options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = ()=> handleAnswer(btn, opt, correctAnswer, gameType);
    grid.appendChild(btn);
  });
  speak(question, getSpeechLangCode());
}
function handleAnswer(btn, chosen, correctAnswer, gameType){
  const allBtns = document.querySelectorAll('#optionsGrid .option-btn');
  allBtns.forEach(b=>b.disabled = true);
  const isCorrect = chosen === correctAnswer;
  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  if(!isCorrect){
    allBtns.forEach(b=>{ if(b.textContent===correctAnswer) b.classList.add('correct'); });
  }
  const msg = document.getElementById('feedbackMsg');
  msg.innerHTML = isCorrect ? t('correct_msg') : t('wrong_msg_prefix')+correctAnswer;
  speak(isCorrect ? t('correct_msg') : t('wrong_msg_prefix')+correctAnswer, getSpeechLangCode());

  recordScore(gameType, isCorrect);

  // Next question is triggered by an explicit tap (not a timer) so that
  // speech synthesis on mobile — which requires a direct user gesture —
  // keeps working for every question, not just the first.
  const nextBtn = document.createElement('button');
  nextBtn.className = 'done-btn';
  nextBtn.style.marginTop = '18px';
  nextBtn.style.background = 'var(--gold)';
  nextBtn.style.color = 'var(--forest-dark)';
  nextBtn.textContent = t('next_question');
  nextBtn.onclick = ()=>{
    if(gameType==='photo') nextPhotoQuestion();
    else nextRoutineQuestion();
  };
  msg.after(nextBtn);
}
function recordScore(gameType, isCorrect){
  const today = new Date().toISOString().slice(0,10);
  let entry = db.gameScores.find(g=>g.date===today && g.gameType===gameType);
  if(!entry){
    entry = {date:today, gameType, correct:0, total:0};
    db.gameScores.push(entry);
  }
  entry.total += 1;
  if(isCorrect) entry.correct += 1;
  saveDB(db);
}

/* ============================================================
   GAME 2: ROUTINE RECALL
============================================================ */
function startRoutineGame(){
  document.getElementById('patientHomeScreen').classList.add('hidden');
  document.getElementById('photoGameScreen').classList.add('hidden');
  document.getElementById('backLink').classList.remove('hidden');
  document.getElementById('routineGameScreen').classList.remove('hidden');
  nextRoutineQuestion();
}
function nextRoutineQuestion(){
  const p = db.patient;
  const pool = [
    {
      q: t('q_wake_time'),
      correct: p.wake,
      distractors: ['05:00','07:30','10:00'].filter(tm=>tm!==p.wake)
    },
    {
      q: t('q_sleep_time'),
      correct: p.sleep,
      distractors: ['19:00','22:30','23:00'].filter(tm=>tm!==p.sleep)
    }
  ];
  if(db.medicines.length>0){
    const med = db.medicines[Math.floor(Math.random()*db.medicines.length)];
    pool.push({
      q: t('q_medicine_time')(med.name),
      correct: med.time,
      distractors: ['08:00','13:00','18:00','21:00'].filter(tm=>tm!==med.time)
    });
  }
  if(db.familyMembers.length>0){
    const fam = db.familyMembers[Math.floor(Math.random()*db.familyMembers.length)];
    pool.push({
      q: t('q_family_name')(fam.relation),
      correct: fam.name,
      distractors: db.familyMembers.filter(f=>f.name!==fam.name).map(f=>f.name)
    });
  }
  const picked = pool[Math.floor(Math.random()*pool.length)];
  let opts = [picked.correct, ...picked.distractors.sort(()=>0.5-Math.random()).slice(0,3)];
  while(opts.length<4) opts.push('Pata nahi');
  opts = opts.sort(()=>0.5-Math.random());
  renderGameQuestion('routineGameScreen', null, picked.q, opts, picked.correct, 'routine');
}

/* ============================================================
   CARETAKER DASHBOARD
============================================================ */
function showCaretakerPage(page){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.page===page));
  const content = document.getElementById('caretakerContent');
  if(page==='profile') content.innerHTML = renderProfilePage();
  if(page==='reminders') content.innerHTML = renderRemindersPage();
  if(page==='photos') content.innerHTML = renderPhotosPage();
  if(page==='health') content.innerHTML = renderHealthPage();
  if(page==='scores') content.innerHTML = renderScoresPage();
}

/* ---- Profile page ---- */
function renderProfilePage(){
  const p = db.patient;
  return `
    <h1>Patient Profile</h1>
    <div class="page-sub">Basic details and daily routine used to personalise reminders and games.</div>
    <div class="card">
      <h3>Basic Details</h3>
      <div class="form-row">
        <div class="field"><label>Name</label><input id="pf_name" value="${p.name}"></div>
        <div class="field"><label>Age</label><input id="pf_age" type="number" value="${p.age}"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Wake-up time</label><input id="pf_wake" type="time" value="${p.wake}"></div>
        <div class="field"><label>Sleep time</label><input id="pf_sleep" type="time" value="${p.sleep}"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Meal schedule / diet notes</label><textarea id="pf_meals">${p.meals}</textarea></div>
      </div>
      <button class="primary-btn" onclick="saveProfile()">Save changes</button>
    </div>

    <div class="card">
      <h3>Family Members (used in games)</h3>
      <div id="famList"></div>
      <div class="form-row" style="margin-top:14px;">
        <div class="field"><label>Name</label><input id="fam_name" placeholder="e.g. Anita"></div>
        <div class="field"><label>Relation</label><input id="fam_relation" placeholder="e.g. Beti (Daughter)"></div>
      </div>
      <button class="secondary-btn" onclick="addFamilyMember()">+ Add family member</button>
    </div>
  `;
}
function renderFamListInline(){
  const el = document.getElementById('famList');
  if(!el) return;
  el.innerHTML = db.familyMembers.map((f,i)=>`
    <div class="list-item">
      <span>${f.name} <span class="tag">${f.relation}</span></span>
      <button class="delete-x" onclick="removeFamilyMember(${i})">×</button>
    </div>`).join('') || '<p style="color:#6B7268;font-size:0.9rem;">No family members added yet.</p>';
}
function saveProfile(){
  db.patient.name = document.getElementById('pf_name').value || db.patient.name;
  db.patient.age = document.getElementById('pf_age').value || db.patient.age;
  db.patient.wake = document.getElementById('pf_wake').value || db.patient.wake;
  db.patient.sleep = document.getElementById('pf_sleep').value || db.patient.sleep;
  db.patient.meals = document.getElementById('pf_meals').value;
  saveDB(db);
  alert('Profile saved.');
}
function addFamilyMember(){
  const name = document.getElementById('fam_name').value.trim();
  const relation = document.getElementById('fam_relation').value.trim();
  if(!name || !relation){ alert('Please enter both name and relation.'); return; }
  db.familyMembers.push({name, relation});
  saveDB(db);
  showCaretakerPage('profile');
}
function removeFamilyMember(i){
  db.familyMembers.splice(i,1);
  saveDB(db);
  showCaretakerPage('profile');
}

/* ---- Reminders page ---- */
function renderRemindersPage(){
  return `
    <h1>Medicines & Reminders</h1>
    <div class="page-sub">These appear as full-screen voice alerts on the patient's screen at the set time.</div>
    <div class="card">
      <h3>Medicine Schedule</h3>
      <div id="medList"></div>
      <div class="form-row" style="margin-top:14px;">
        <div class="field"><label>Medicine name</label><input id="med_name" placeholder="e.g. Donepezil"></div>
        <div class="field"><label>Dosage</label><input id="med_dosage" placeholder="e.g. 5mg"></div>
        <div class="field"><label>Time</label><input id="med_time" type="time"></div>
      </div>
      <button class="secondary-btn" onclick="addMedicine()">+ Add medicine</button>
    </div>
    <div class="card">
      <h3>Demo</h3>
      <p style="font-size:0.9rem;color:#6B7268;margin-bottom:14px;">For the hackathon demo, trigger a reminder instantly instead of waiting for the scheduled time.</p>
      <button class="primary-btn" onclick="testReminder()">Test a reminder now</button>
    </div>
  `;
}
function addMedicine(){
  const name = document.getElementById('med_name').value.trim();
  const dosage = document.getElementById('med_dosage').value.trim();
  const time = document.getElementById('med_time').value;
  if(!name || !time){ alert('Please enter medicine name and time.'); return; }
  db.medicines.push({name, dosage: dosage||'—', time});
  saveDB(db);
  showCaretakerPage('reminders');
}
function removeMedicine(i){
  db.medicines.splice(i,1);
  saveDB(db);
  showCaretakerPage('reminders');
}

/* ---- Photos page ---- */
function renderPhotosPage(){
  return `
    <h1>Family Photos</h1>
    <div class="page-sub">Upload a photo, name the occasion, and tag who's in it. These power the memory game.</div>
    <div class="card">
      <h3>Upload a new photo</h3>
      <div class="form-row">
        <div class="field"><label>Photo</label><input id="photo_file" type="file" accept="image/*"></div>
        <div class="field"><label>Occasion / date</label><input id="photo_occasion" placeholder="e.g. Bihu 2022"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>People in photo (comma-separated, must match family members)</label>
          <input id="photo_people" placeholder="e.g. Anita, Rahul">
        </div>
      </div>
      <button class="primary-btn" onclick="addPhoto()">Add photo</button>
    </div>
    <div class="card">
      <h3>Uploaded Photos (${db.photos.length})</h3>
      <div class="photo-grid" id="photoGrid"></div>
    </div>
  `;
}
function addPhoto(){
  const fileInput = document.getElementById('photo_file');
  const occasion = document.getElementById('photo_occasion').value.trim();
  const peopleNames = document.getElementById('photo_people').value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!fileInput.files[0] || !occasion){ alert('Please choose a photo and enter the occasion.'); return; }

  const people = peopleNames.map(name=>{
    const match = db.familyMembers.find(f=>f.name.toLowerCase()===name.toLowerCase());
    return { name, relation: match ? match.relation : 'Parivaar' };
  });

  const reader = new FileReader();
  reader.onload = function(e){
    db.photos.push({ url: e.target.result, occasion, people });
    saveDB(db);
    showCaretakerPage('photos');
  };
  reader.readAsDataURL(fileInput.files[0]);
}
function removePhoto(i){
  db.photos.splice(i,1);
  saveDB(db);
  showCaretakerPage('photos');
}
function renderPhotoGridInline(){
  const el = document.getElementById('photoGrid');
  if(!el) return;
  el.innerHTML = db.photos.map((p,i)=>`
    <div class="photo-card">
      <img src="${p.url}" alt="${p.occasion}">
      <div class="meta">
        <div class="occ">${p.occasion}</div>
        <div class="people">${p.people.map(pp=>pp.name).join(', ') || 'No one tagged'}</div>
        <button class="delete-x" style="margin-top:6px;" onclick="removePhoto(${i})">Remove ×</button>
      </div>
    </div>`).join('') || '<p style="color:#6B7268;font-size:0.9rem;">No photos uploaded yet.</p>';
}

/* ---- Health records page ---- */
function renderHealthPage(){
  return `
    <h1>Health Records</h1>
    <div class="page-sub">Doctor visits, vitals, and notes over time.</div>
    <div class="card">
      <h3>Add a record</h3>
      <div class="form-row">
        <div class="field"><label>Date</label><input id="hr_date" type="date"></div>
        <div class="field"><label>Vitals (optional)</label><input id="hr_vitals" placeholder="e.g. BP 130/85"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Notes</label><textarea id="hr_notes" placeholder="Doctor visit notes, observations..."></textarea></div>
      </div>
      <button class="primary-btn" onclick="addHealthRecord()">Add record</button>
    </div>
    <div class="card">
      <h3>History</h3>
      <div id="healthList"></div>
    </div>
  `;
}
function addHealthRecord(){
  const date = document.getElementById('hr_date').value;
  const vitals = document.getElementById('hr_vitals').value.trim();
  const notes = document.getElementById('hr_notes').value.trim();
  if(!date || !notes){ alert('Please enter a date and notes.'); return; }
  db.healthRecords.unshift({date, vitals, notes});
  saveDB(db);
  showCaretakerPage('health');
}
function removeHealthRecord(i){
  db.healthRecords.splice(i,1);
  saveDB(db);
  showCaretakerPage('health');
}
function renderHealthListInline(){
  const el = document.getElementById('healthList');
  if(!el) return;
  el.innerHTML = db.healthRecords.map((h,i)=>`
    <div class="list-item" style="align-items:flex-start;flex-direction:column;gap:4px;">
      <div style="display:flex;justify-content:space-between;width:100%;">
        <strong>${h.date}</strong>
        <button class="delete-x" onclick="removeHealthRecord(${i})">×</button>
      </div>
      ${h.vitals ? `<span class="tag">${h.vitals}</span>` : ''}
      <p style="margin:4px 0 0;font-size:0.92rem;color:#4A4A4A;">${h.notes}</p>
    </div>`).join('') || '<p style="color:#6B7268;font-size:0.9rem;">No health records yet.</p>';
}

/* ---- Scores page ---- */
function renderScoresPage(){
  const photoScores = db.gameScores.filter(g=>g.gameType==='photo');
  const routineScores = db.gameScores.filter(g=>g.gameType==='routine');
  const totalCorrect = db.gameScores.reduce((a,g)=>a+g.correct,0);
  const totalPlayed = db.gameScores.reduce((a,g)=>a+g.total,0);
  const overallPct = totalPlayed ? Math.round(100*totalCorrect/totalPlayed) : 0;

  return `
    <h1>Game Scores</h1>
    <div class="page-sub">Cognitive engagement trend from the patient's games. Not a diagnostic tool — for tracking engagement only.</div>
    <div class="stat-row">
      <div class="stat-box"><div class="num">${overallPct}%</div><div class="lbl">Overall accuracy</div></div>
      <div class="stat-box"><div class="num">${totalPlayed}</div><div class="lbl">Questions played</div></div>
      <div class="stat-box"><div class="num">${db.gameScores.length}</div><div class="lbl">Sessions logged</div></div>
    </div>
    <div class="card">
      <h3>Photo Recall — daily accuracy</h3>
      <div id="photoScoreBars"></div>
    </div>
    <div class="card">
      <h3>Routine Recall — daily accuracy</h3>
      <div id="routineScoreBars"></div>
    </div>
  `;
}
function renderScoreBars(elId, scores){
  const el = document.getElementById(elId);
  if(!el) return;
  if(scores.length===0){
    el.innerHTML = '<p style="color:#6B7268;font-size:0.9rem;">No games played yet.</p>';
    return;
  }
  el.innerHTML = scores.map(s=>{
    const pct = Math.round(100*s.correct/s.total);
    return `
      <div class="score-bar-row">
        <span class="sdate">${s.date}</span>
        <div class="score-bar-track"><div class="score-bar-fill" style="width:${pct}%;"></div></div>
        <span class="spct">${pct}%</span>
      </div>`;
  }).join('');
}

/* ============================================================
   Post-render hooks (since we use innerHTML string templates,
   fill in dynamic list sections right after injecting HTML)
============================================================ */
const origShowCaretakerPage = showCaretakerPage;
showCaretakerPage = function(page){
  origShowCaretakerPage(page);
  if(page==='profile') renderFamListInline();
  if(page==='reminders') renderMedListInline();
  if(page==='photos') renderPhotoGridInline();
  if(page==='health') renderHealthListInline();
  if(page==='scores'){
    renderScoreBars('photoScoreBars', db.gameScores.filter(g=>g.gameType==='photo'));
    renderScoreBars('routineScoreBars', db.gameScores.filter(g=>g.gameType==='routine'));
  }
};
function renderMedListInline(){
  const el = document.getElementById('medList');
  if(!el) return;
  el.innerHTML = db.medicines.map((m,i)=>`
    <div class="list-item">
      <span>${m.name} <span class="tag">${m.dosage}</span> — ${m.time}</span>
      <button class="delete-x" onclick="removeMedicine(${i})">×</button>
    </div>`).join('') || '<p style="color:#6B7268;font-size:0.9rem;">No medicines added yet.</p>';
}