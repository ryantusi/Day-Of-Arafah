        // ═══════════════════════════════
        // CURSOR
        // ═══════════════════════════════
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        function animateCursor() {
            dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
            rx += (mx - rx - 14) * 0.12;
            ry += (my - ry - 14) * 0.12;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        document.querySelectorAll('a,button,.sig-card,.dua-card,.routine-tile').forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.style.transform += ' scale(1.8)';
                ring.style.width = '44px'; ring.style.height = '44px';
                ring.style.borderColor = 'rgba(212,129,58,0.6)';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.width = '28px'; ring.style.height = '28px';
                ring.style.borderColor = 'rgba(212,129,58,0.5)';
            });
        });

        // ═══════════════════════════════
        // PARTICLES
        // ═══════════════════════════════
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        function createParticle(randomY) {
            return {
                x: Math.random() * window.innerWidth,
                y: randomY ? Math.random() * window.innerHeight : window.innerHeight + Math.random() * 100,
                size: Math.random() * 3 + 1,
                speedY: -(Math.random() * 0.5 + 0.15),
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.55 + 0.15,
                life: randomY ? Math.random() : 0,
                pulse: Math.random() * Math.PI * 2
            };
        }
        for (let i = 0; i < 140; i++) particles.push(createParticle(true));
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.life += 0.0025;
                p.pulse += 0.02;
                if (p.life > 1 || p.y < -20) {
                    particles[i] = createParticle(false);
                    return;
                }
                const alpha = Math.sin(p.life * Math.PI) * p.opacity * (0.8 + 0.2 * Math.sin(p.pulse));
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                grd.addColorStop(0, `rgba(245, 223, 160, ${alpha})`);
                grd.addColorStop(1, `rgba(201, 168, 76, 0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // ═══════════════════════════════
        // PRELOADER
        // ═══════════════════════════════
        window.addEventListener('load', () => {
            setTimeout(() => {
                const pre = document.getElementById('preloader');
                pre.style.transition = 'opacity 0.8s ease';
                pre.style.opacity = '0';
                setTimeout(() => {
                    pre.style.display = 'none';
                    // Animate hero elements
                    setTimeout(() => {
                        document.getElementById('heroBadge').style.opacity = '1';
                        setTimeout(() => { document.getElementById('heroArabic').style.opacity = '1'; }, 200);
                        setTimeout(() => { document.getElementById('heroEnglish').style.opacity = '1'; }, 400);
                        setTimeout(() => { document.getElementById('heroTagline').style.opacity = '1'; }, 600);
                        setTimeout(() => { document.getElementById('heroCountdowns').style.opacity = '1'; }, 900);
                    }, 100);
                }, 800);
            }, 2600);
        });

        // ═══════════════════════════════
        // COUNTDOWN
        // ═══════════════════════════════
        function pad(n) { return String(n).padStart(2, '0'); }
        function updateCountdowns() {
            const now = new Date();
            // IST is UTC+5:30
            const fajr = new Date('2026-05-27T04:25:00+05:30');
            const maghrib = new Date('2026-05-27T18:30:00+05:30');
            function setCountdown(prefix, target) {
                const diff = target - now;
                if (diff <= 0) {
                    ['days', 'hours', 'mins', 'secs'].forEach(u => { document.getElementById(`${prefix}-${u}`).textContent = '00'; });
                    return;
                }
                const days = Math.floor(diff / 86400000);
                const hours = Math.floor((diff % 86400000) / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                document.getElementById(`${prefix}-days`).textContent = pad(days);
                document.getElementById(`${prefix}-hours`).textContent = pad(hours);
                document.getElementById(`${prefix}-mins`).textContent = pad(mins);
                document.getElementById(`${prefix}-secs`).textContent = pad(secs);
            }
            setCountdown('f', fajr);
            setCountdown('m', maghrib);
        }
        updateCountdowns();
        setInterval(updateCountdowns, 1000);

        // ═══════════════════════════════
        // SCROLL REVEALS
        // ═══════════════════════════════
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

        // Prep steps reveal
        const prepObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
        }, { threshold: 0.2 });
        document.querySelectorAll('.prep-step').forEach(el => prepObs.observe(el));

        // ═══════════════════════════════
        // SIG CARDS DRAG SCROLL
        // ═══════════════════════════════
        const sigScroll = document.getElementById('sigScroll');
        let isDown = false, startX, scrollLeft;
        sigScroll.addEventListener('mousedown', e => { isDown = true; sigScroll.classList.add('grabbing'); startX = e.pageX - sigScroll.offsetLeft; scrollLeft = sigScroll.scrollLeft; });
        sigScroll.addEventListener('mouseleave', () => { isDown = false; sigScroll.classList.remove('grabbing'); });
        sigScroll.addEventListener('mouseup', () => { isDown = false; sigScroll.classList.remove('grabbing'); });
        sigScroll.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - sigScroll.offsetLeft; sigScroll.scrollLeft = scrollLeft - (x - startX) * 1.5; });

        // ═══════════════════════════════
        // ROUTINE DATA & RENDER
        // ═══════════════════════════════
        const routineData = [
          {
            time: "2:00 AM",
            name: "Tahajjud",
            desc: "Pray at least 2 rakah. Make long duā in sujood. This is the closest you are to Allah.",
            period: "Pre-Fajr",
            color: "#6B7FD4",
          },
          {
            time: "3:30 AM",
            name: "Suhoor",
            desc: "Eat light. Make niyyah to fast. Make duā during suhoor — this time is blessed.",
            period: "Pre-Fajr",
            color: "#6B7FD4",
          },
          {
            time: "4:25 AM",
            name: "Fajr",
            desc: "Pray with khushoo'. Men: in congregation, non-negotiable. The day has begun.",
            period: "Fajr",
            color: "#C9A84C",
          },
          {
            time: "5:00 AM",
            name: "Ishraq",
            desc: "Stay after Fajr. Do dhikr, read Quran until sunrise (~6:15 AM). Pray 2 rakah. Reward: like Hajj and 'Umrah.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "5:30 AM",
            name: "Morning Adhkar",
            desc: "Complete your morning supplications fully. Don't rush. Every word is counted today.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "6:30 AM",
            name: "Quran",
            desc: "Dedicate this block to Quran only. Every letter is rewarded 10x — this day multiplies that further.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "7:30 AM",
            name: "Duha Prayer",
            desc: "2 to 12 rakah between sunrise and noon. A prayer of gratitude and drawing closer.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "8:00 AM",
            name: "Istighfar × 100",
            desc: "Astaghfirullaha wa atubu ilayh — one hundred times, uninterrupted. Let nothing break it.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "8:30 AM",
            name: "Salawat × 100",
            desc: "Salutations upon the Prophet ﷺ — one hundred times. This is beloved to Allah.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "9:00 AM",
            name: "Dhikr Block",
            desc: "Lā ilāha illallāhu waḥdahu lā sharīka lah × 100. The best dhikr of the Day of Arafah.",
            period: "Morning",
            color: "#C9A84C",
          },
          {
            time: "10:00 AM",
            name: "Quran & Reflect",
            desc: "Continue. Don't stop. Even one juz completed today carries immense weight.",
            period: "Midday",
            color: "#C9A84C",
          },
          {
            time: "12:30 PM",
            name: "Dhuhr",
            desc: "Pray on time. Pray Tahiyyatul Masjid. ★ THE KEY WINDOW OPENS NOW.",
            period: "Key Window",
            color: "#F5DFA0",
            key: true,
          },
          {
            time: "12:45 PM",
            name: "Duā — For Yourself",
            desc: "Your personal requests. Use your prepared list. Pour everything out. Nothing is too small or too large.",
            period: "Key Window",
            color: "#F5DFA0",
            key: true,
          },
          {
            time: "1:30 PM",
            name: "99 Names of Allah",
            desc: "Call on Allah through His beautiful names. Slowly. Deliberately. Yā Razzāq. Yā Ghafūr. Yā Wadūd.",
            period: "Key Window",
            color: "#F5DFA0",
            key: true,
          },
          {
            time: "2:00 PM",
            name: "Duā — For Others",
            desc: "Family, friends, the sick, the oppressed, the entire Ummah. Their reward comes back to you.",
            period: "Key Window",
            color: "#F5DFA0",
            key: true,
          },
          {
            time: "3:00 PM",
            name: "4 Rakah Before Asr",
            desc: '"May Allah have mercy on a person who prays four rakah before Asr." — Prophet ﷺ',
            period: "Final Push",
            color: "#D4813A",
            key: true,
          },
          {
            time: "3:30 PM",
            name: "Asr",
            desc: "Pray Asr. The final push begins now. Every minute remaining is precious.",
            period: "Final Push",
            color: "#D4813A",
            key: true,
          },
          {
            time: "4:00 PM",
            name: "Intense Duā",
            desc: "The last window before the gates close. Don't hold anything back. Ask like you've never asked.",
            period: "Final Push",
            color: "#D4813A",
            key: true,
          },
          {
            time: "5:00 PM",
            name: "Dhikr Marathon",
            desc: "SubhanAllah. Alhamdulillah. Allahu Akbar. Lā ilāha illallāh. Continuously. Without pause.",
            period: "Final Push",
            color: "#D4813A",
            key: true,
          },
          {
            time: "6:00 PM",
            name: "Final Duā",
            desc: "Last 30 minutes before Maghrib. The most powerful duā window of the entire year. Give it everything.",
            period: "Closing",
            color: "#8B3A2A",
            key: true,
          },
          {
            time: "6:30 PM",
            name: "Maghrib & Iftar",
            desc: "Break your fast. Make duā at iftar — the fasting person's duā is accepted. Pray Maghrib. Alhamdulillah.",
            period: "Iftar",
            color: "#8B3A2A",
            key: true,
          },
        ];

        const routineTimeline = document.getElementById('routineTimeline');
        routineData.forEach((r, i) => {
            const tile = document.createElement('div');
            tile.className = 'routine-tile';
            tile.style.setProperty('--tile-color', r.color);
            const isOdd = i % 2 === 0;
            tile.innerHTML = isOdd ? `
    <div class="tile-card" style="--tile-color:${r.color}">
      <div class="tile-period" style="color:${r.color}">${r.period}</div>
      <div class="tile-name">${r.name}</div>
      <div class="tile-desc">${r.desc}</div>
      ${r.key ? '<div class="tile-key">★ Key Window</div>' : ''}
    </div>
    <div class="tile-dot" style="background:${r.color};box-shadow:0 0 10px ${r.color}"></div>
    <div class="tile-time"><div class="tile-time-main" style="color:${r.color}">${r.time}</div></div>
  ` : `
    <div class="tile-time" style="text-align:right"><div class="tile-time-main" style="color:${r.color}">${r.time}</div></div>
    <div class="tile-dot" style="background:${r.color};box-shadow:0 0 10px ${r.color}"></div>
    <div class="tile-card" style="--tile-color:${r.color}">
      <div class="tile-period" style="color:${r.color}">${r.period}</div>
      <div class="tile-name">${r.name}</div>
      <div class="tile-desc">${r.desc}</div>
      ${r.key ? '<div class="tile-key">★ Key Window</div>' : ''}
    </div>
  `;
            routineTimeline.appendChild(tile);
        });

        const tileObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
        }, { threshold: 0.15 });
        document.querySelectorAll('.routine-tile').forEach(el => tileObs.observe(el));

        // ═══════════════════════════════
        // DUA DATA & RENDER
        // ═══════════════════════════════
        const duaData = {

            // ══════════════════════════════════════════════════════════
            // 1. FORGIVENESS  (Al-Maghfirah)
            // ══════════════════════════════════════════════════════════
            'Forgiveness': [
                {
                arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
                trans: 'Rabbanā ẓalamnā anfusanā wa-in lam taghfir lanā wa-tarḥamnā lanakūnanna minal-khāsirīn',
                meaning: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
                source: 'Qur\'an 7:23 — Du\'ā of Adam & Hawwā \'alayhimassalām',
                names: ['Yā Ghafūr', 'Yā Tawwāb', 'Yā Raḥīm']
                },
                {
                arabic: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
                trans: 'Astaghfirullāhal-ʿaẓīmallathī lā ilāha illā huwal-ḥayyul-qayyūmu wa-atūbu ilayh',
                meaning: 'I seek forgiveness from Allah the Magnificent, besides Whom there is no god, the Ever-Living, the Self-Sustaining, and I repent to Him.',
                source: 'Abū Dāwūd 1517, Tirmidhī 3577 — Sayyid al-Istighfār variation',
                names: ['Yā Ghafūr', 'Yā ʿAfuww', 'Yā Ḥayy', 'Yā Qayyūm']
                },
                {
                arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
                trans: 'Allāhumma innaka ʿafuwwun tuḥibbul-ʿafwa faʿfu ʿannī',
                meaning: 'O Allah, You are Most Forgiving, and You love forgiveness, so forgive me.',
                source: 'Ibn Mājah 3850 — The Prophet ﷺ taught this specifically for Laylat al-Qadr and blessed nights',
                names: ['Yā ʿAfuww', 'Yā Karīm']
                },
                {
                arabic: 'اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي وَإِسْرَافِي فِي أَمْرِي وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي',
                trans: 'Allāhummaghfir lī khaṭīʾatī wa-jahli wa-isrāfī fī amrī wa-mā anta aʿlamu bihī minnī',
                meaning: 'O Allah, forgive me my sins, my ignorance, my excesses in my affairs, and whatever You know about me better than I know myself.',
                source: 'Ṣaḥīḥ al-Bukhārī 6398, Ṣaḥīḥ Muslim 2719 — From the Prophet ﷺ',
                names: ['Yā Ghafūr', 'Yā ʿAlīm', 'Yā Ḥalīm']
                },
                {
                arabic: 'رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي',
                trans: 'Rabbi innī ẓalamtu nafsī faghfir lī',
                meaning: 'My Lord, indeed I have wronged myself, so forgive me.',
                source: 'Qur\'an 28:16 — Du\'ā of Mūsā \'alayhissalām after the incident in Egypt',
                names: ['Yā Ghafūr', 'Yā Raḥīm']
                },
                {
                arabic: 'سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
                trans: 'Subḥānaka innī kuntu minaẓ-ẓālimīn',
                meaning: 'Glory be to You; indeed I have been among the wrongdoers.',
                source: 'Qur\'an 21:87 — Du\'ā of Yūnus \'alayhissalām in the belly of the whale. The Prophet ﷺ said: no Muslim calls with this du\'ā except that Allah answers him (Tirmidhī 3505)',
                names: ['Yā Tawwāb', 'Yā Quddūs', 'Yā ʿAfuww']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 2. JANNAH & THE HEREAFTER
            // ══════════════════════════════════════════════════════════
            'Jannah': [
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ',
                trans: 'Allāhumma innī asʾalukal-jannata wa-mā qarraba ilayhā min qawlin aw ʿamal',
                meaning: 'O Allah, I ask You for Paradise and for whatever brings one closer to it in words and deeds.',
                source: 'Ibn Mājah 3846 — Prophetic supplication',
                names: ['Yā Karīm', 'Yā Wahhāb']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
                trans: 'Allāhumma innī asʾalukal-jannata wa-aʿūdhu bika minan-nār',
                meaning: 'O Allah, I ask You for Paradise and I seek refuge with You from the Fire.',
                source: 'Abū Dāwūd 792 — The Prophet ﷺ said: whoever says this three times, Paradise says "O Allah, admit him", and the Fire says "O Allah, protect him from me" (Tirmidhī 2572)',
                names: ['Yā Karīm', 'Yā Ḥafīẓ']
                },
                {
                arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                trans: 'Rabbanā ātinā fid-dunyā ḥasanatan wa-fil-ākhirati ḥasanatan wa-qinā ʿadhāban-nār',
                meaning: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
                source: 'Qur\'an 2:201 — Anas ibn Mālik رضي الله عنه said the Prophet ﷺ most frequently made this du\'ā (Ṣaḥīḥ Muslim 2690)',
                names: ['Yā Raḥmān', 'Yā Karīm', 'Yā Wāqī']
                },
                {
                arabic: 'اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الأُمُورِ كُلِّهَا وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الآخِرَةِ',
                trans: 'Allāhumma aḥsin ʿāqibatanā fil-umūri kullihā wa-ajirnā min khizyi-d-dunyā wa-ʿadhābil-ākhirah',
                meaning: 'O Allah, make our end good in all our affairs, and save us from disgrace in this world and the punishment of the Hereafter.',
                source: 'Musnad Aḥmad 17571 — Authenticated by al-Albānī',
                names: ['Yā Karīm', 'Yā Ḥafīẓ', 'Yā Raḥmān']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفِرْدَوْسَ الأَعْلَى',
                trans: 'Allāhumma innī asʾalukal-firdawsal-aʿlā',
                meaning: 'O Allah, I ask You for al-Firdaws al-Aʿlā — the highest level of Paradise.',
                source: 'From the counsel of the Prophet ﷺ: "When you ask Allah for Paradise, ask for al-Firdaws" (Ṣaḥīḥ al-Bukhārī 2790)',
                names: ['Yā Karīm', 'Yā Wahhāb', 'Yā Mannān']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 3. WEALTH & PROVISION
            // ══════════════════════════════════════════════════════════
            'Provision': [
                {
                arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
                trans: 'Allāhumma akfinī biḥalālika ʿan ḥarāmika wa-aghninī bifaḍlika ʿamman siwāk',
                meaning: 'O Allah, suffice me with Your lawful provisions against forbidden ones, and with Your bounty make me free from need of anyone other than You.',
                source: 'Tirmidhī 3563 — Authenticated (ḥasan)',
                names: ['Yā Razzāq', 'Yā Ghanī', 'Yā Mughīth']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
                trans: 'Allāhumma innī asʾaluka ʿilman nāfiʿan wa-rizqan ṭayyiban wa-ʿamalan mutaqabbalan',
                meaning: 'O Allah, I ask You for beneficial knowledge, wholesome sustenance, and deeds that will be accepted.',
                source: 'Ibn Mājah 925 — From the morning supplication of the Prophet ﷺ after Fajr',
                names: ['Yā Razzāq', 'Yā ʿAlīm', 'Yā Qabūl']
                },
                {
                arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
                trans: 'Rabbi innī limā anzalta ilayya min khayrin faqīr',
                meaning: 'My Lord, indeed I am in need of whatever good You may send down to me.',
                source: 'Qur\'an 28:24 — Du\'ā of Mūsā \'alayhissalām after fleeing Egypt, exhausted and hungry. The scholars consider it a supreme du\'ā for provision and relief.',
                names: ['Yā Razzāq', 'Yā Karīm', 'Yā Muʿṭī']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
                trans: 'Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wal-ʿajzi wal-kasal, wal-bukhli wal-jubn, wa-ḍalaʿid-dayn wa-ghalabatir-rijāl',
                meaning: 'O Allah, I seek refuge in You from anxiety, grief, incapacity, laziness, miserliness, cowardice, the burden of debt, and being overpowered by men.',
                source: 'Ṣaḥīḥ al-Bukhārī 2893 — Comprehensive du\'ā of the Prophet ﷺ that covers financial and emotional hardship',
                names: ['Yā Mughnī', 'Yā Qawī', 'Yā Muʿīn']
                },
                {
                arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
                trans: 'Allāhumma bārik lanā fīmā razaqtanā wa-qinā ʿadhāban-nār',
                meaning: 'O Allah, bless us in what You have provided for us and protect us from the punishment of the Fire.',
                source: 'Ibn al-Sunnī, \'Amal al-Yawm 459 — Du\'ā before eating, reflecting gratitude and barakah in sustenance',
                names: ['Yā Razzāq', 'Yā Bārī', 'Yā Shakūr']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 4. HEALTH & HEALING
            // ══════════════════════════════════════════════════════════
            'Health': [
                {
                arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
                trans: 'Allāhumma ʿāfinī fī badanī, Allāhumma ʿāfinī fī samʿī, Allāhumma ʿāfinī fī baṣarī',
                meaning: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.',
                source: 'Abū Dāwūd 5090 — Morning and evening supplication of the Prophet ﷺ',
                names: ['Yā Shāfī', 'Yā Muʿīn']
                },
                {
                arabic: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
                trans: 'Adh-hibil-baʾsa Rabban-nāsi, washfi antash-shāfī, lā shifāʾa illā shifāʾuka, shifāʾan lā yughādiru saqamā',
                meaning: 'Remove the affliction, O Lord of Mankind. Heal, for You are the Healer. There is no healing except Your healing — a healing that leaves no illness behind.',
                source: 'Ṣaḥīḥ al-Bukhārī 5743, Ṣaḥīḥ Muslim 2191 — The Prophet ﷺ would recite this when visiting the sick',
                names: ['Yā Shāfī', 'Yā Rabb', 'Yā Qādir']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
                trans: 'Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah',
                meaning: 'O Allah, I ask You for pardon and well-being in this world and the next.',
                source: 'Abū Dāwūd 5074 — \'Abdullāh ibn ʿUmar said: the Prophet ﷺ never left these words in his morning and evening du\'ā',
                names: ['Yā ʿAfuww', 'Yā Shāfī', 'Yā Salām']
                },
                {
                arabic: 'رَبِّ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
                trans: 'Rabbi annī massaniyaḍ-ḍurru wa-anta arḥamar-rāḥimīn',
                meaning: 'My Lord, indeed adversity has touched me, and You are the Most Merciful of the merciful.',
                source: 'Qur\'an 21:83 — Du\'ā of Ayyūb \'alayhissalām after years of illness. Allah says: "So We responded to him and removed what afflicted him."',
                names: ['Yā Raḥmān', 'Yā Shāfī', 'Yā Muʿīn']
                },
                {
                arabic: 'بِسْمِ اللهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ اللهُ يَشْفِيكَ',
                trans: 'Bismillāhi arqīka min kulli shayʾin yuʾdhīka, min sharri kulli nafsin aw ʿaynin ḥāsidin, Allāhu yashfīk',
                meaning: 'In the Name of Allah I perform ruqyah for you, from everything that harms you, from the evil of every soul or envious eye — may Allah heal you.',
                source: 'Ṣaḥīḥ Muslim 2186 — Ruqyah of Jibrīl \'alayhissalām as taught to the Prophet ﷺ',
                names: ['Yā Shāfī', 'Yā Ḥafīẓ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 5. FAMILY
            // ══════════════════════════════════════════════════════════
            'Family': [
                {
                arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
                trans: 'Rabbanā hab lanā min azwājinā wa-dhurriyyātinā qurrata aʿyunin waj-ʿalnā lil-muttaqīna imāmā',
                meaning: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.',
                source: 'Qur\'an 25:74 — Du\'ā of the servants of the Most Merciful (ʿIbād ar-Raḥmān)',
                names: ['Yā Wadūd', 'Yā Raḥmān']
                },
                {
                arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
                trans: 'Rabbij-ʿalnī muqīmaṣ-ṣalāti wa-min dhurriyyatī, Rabbanā wa-taqabbal duʿāʾ',
                meaning: 'My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.',
                source: 'Qur\'an 14:40 — Du\'ā of Ibrāhīm \'alayhissalām, asking for righteous progeny',
                names: ['Yā Samīʿ', 'Yā Mujīb', 'Yā Wadūd']
                },
                {
                arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي',
                trans: 'Allāhumma aṣliḥ lī dīniyalladhī huwa ʿiṣmatu amrī, wa-aṣliḥ lī dunyāyallatī fīhā maʿāshī, wa-aṣliḥ lī ākhiratīllatī fīhā maʿādī',
                meaning: 'O Allah, rectify for me my religion which is the safeguard of my affairs; rectify for me my worldly life in which is my livelihood; and rectify for me my Hereafter to which is my return.',
                source: 'Ṣaḥīḥ Muslim 2720 — Prophetic du\'ā for comprehensive goodness in all dimensions of life',
                names: ['Yā Muṣlīḥ', 'Yā Walī', 'Yā Ḥakīm']
                },
                {
                arabic: 'اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا وَأَصْلِحْ ذَاتَ بَيْنِنَا وَاهْدِنَا سُبُلَ السَّلَامِ',
                trans: 'Allāhumma allif bayna qulūbinā wa-aṣliḥ dhāta bayninā wahdināa subulas-salām',
                meaning: 'O Allah, unite our hearts, mend our relationships, and guide us along the paths of peace.',
                source: 'Abū Dāwūd 969 — From the du\'ā after prayer, reflecting the Prophet\'s ﷺ concern for communal bonds',
                names: ['Yā Wadūd', 'Yā Salām', 'Yā Jāmiʿ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 6. MARRIAGE
            // ══════════════════════════════════════════════════════════
            'Marriage': [
                {
                arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
                trans: 'Rabbi hab lī mil-ladunka dhurriyyatan ṭayyibah, innaka samīʿud-duʿāʾ',
                meaning: 'My Lord, grant me from Yourself good offspring. Indeed, You are the Hearer of supplication.',
                source: 'Qur\'an 3:38 — Du\'ā of Zakariyyā \'alayhissalām, praying for a righteous child in old age. Allah answered him with Yaḥyā.',
                names: ['Yā Wahhāb', 'Yā Samīʿ', 'Yā Mujīb']
                },
                {
                arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَبَارِكْ لَنَا فِي مَا أَعْطَيْتَنَا',
                trans: 'Allāhumma bārik lanā fīmā razaqtanā wa-bārik lanā fīmā aʿṭaytanā',
                meaning: 'O Allah, bless us in what You have provided for us and bless us in what You have given us.',
                source: 'From classical supplications — asking for barakah in one\'s home, partner, and livelihood',
                names: ['Yā Bārī', 'Yā Razzāq', 'Yā Wahhāb']
                },
                {
                arabic: 'رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ',
                trans: 'Rabbi lā tadharni fardan wa-anta khayrul-wārithīn',
                meaning: 'My Lord, do not leave me alone [without heir], and You are the best of inheritors.',
                source: 'Qur\'an 21:89 — Du\'ā of Zakariyyā \'alayhissalām, the most concise prayer for a spouse and family',
                names: ['Yā Wahhāb', 'Yā Samīʿ', 'Yā Karīm']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ ﷺ',
                trans: 'Allāhumma innī asʾaluka min khayri mā saʾalaka minhu nabiyyuka Muḥammadun ﷺ',
                meaning: 'O Allah, I ask You for the best of what Your Prophet Muhammad ﷺ asked You for.',
                source: 'Tirmidhī 3521 — A comprehensive supplication that encompasses all the Prophet\'s ﷺ prayers, including for a righteous spouse',
                names: ['Yā Karīm', 'Yā Mujīb', 'Yā Wahhāb']
                },
                {
                arabic: 'بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
                trans: 'Bārakallāhu laka wa-bāraka ʿalayka wa-jamaʿa baynakumā fī khayr',
                meaning: 'May Allah bless you and shower blessings upon you and bring you together in goodness.',
                source: 'Abū Dāwūd 2130, Tirmidhī 1091 — The du\'ā the Prophet ﷺ would make for a newly-wed couple',
                names: ['Yā Wadūd', 'Yā Bārī', 'Yā Jāmiʿ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 7. CHILDREN & RIGHTEOUS OFFSPRING
            // ══════════════════════════════════════════════════════════
            'Children': [
                {
                arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ',
                trans: 'Rabbi hab lī minaṣ-ṣāliḥīn',
                meaning: 'My Lord, grant me [a child] from among the righteous.',
                source: 'Qur\'an 37:100 — Du\'ā of Ibrāhīm \'alayhissalām, answered with Ismāʿīl',
                names: ['Yā Wahhāb', 'Yā Mujīb', 'Yā Raḥmān']
                },
                {
                arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي',
                trans: 'Rabbij-ʿalnī muqīmaṣ-ṣalāti wa-min dhurriyyatī',
                meaning: 'My Lord, make me and my descendants people who establish prayer.',
                source: 'Qur\'an 14:40 — Du\'ā of Ibrāhīm \'alayhissalām — the greatest prayer for one\'s children: that they pray',
                names: ['Yā Samīʿ', 'Yā Hādī', 'Yā Wadūd']
                },
                {
                arabic: 'اللَّهُمَّ اجْعَلْ أَوْلَادَنَا أَوْلَادًا صَالِحِينَ حَافِظِينَ لِلْقُرْآنِ',
                trans: 'Allāhumma-jʿal awlādanā awlādan ṣāliḥīna ḥāfiẓīna lil-Qurʾān',
                meaning: 'O Allah, make our children righteous children who preserve the Qur\'an.',
                source: 'From the du\'ās of the righteous predecessors (salaf), transmitted through Islamic tradition',
                names: ['Yā Wahhāb', 'Yā Hādī', 'Yā Muʿallim']
                },
                {
                arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
                trans: 'Rabbanāghfir lī wa-liwālidayya wa-lil-muʾminīna yawma yaqūmul-ḥisāb',
                meaning: 'Our Lord, forgive me and my parents and the believers on the Day when the account is established.',
                source: 'Qur\'an 14:41 — Du\'ā of Ibrāhīm \'alayhissalām for himself, his parents, and all believers',
                names: ['Yā Ghafūr', 'Yā Raḥīm', 'Yā ʿAdl']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 8. PARENTS
            // ══════════════════════════════════════════════════════════
            'Parents': [
                {
                arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
                trans: 'Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā',
                meaning: 'My Lord, have mercy upon them as they brought me up when I was small.',
                source: 'Qur\'an 17:24 — The most beloved du\'ā for living and deceased parents',
                names: ['Yā Raḥīm', 'Yā Raḥmān']
                },
                {
                arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
                trans: 'Rabbiighfir lī wa-liwālidayya wa-liman dakhala baytiya muʾminan wa-lil-muʾminīna wal-muʾmināt',
                meaning: 'My Lord, forgive me, my parents, whoever enters my home as a believer, and all the believing men and women.',
                source: 'Qur\'an 71:28 — Du\'ā of Nūḥ \'alayhissalām — encompassing self, parents, and all believers',
                names: ['Yā Ghafūr', 'Yā Raḥīm', 'Yā Karīm']
                },
                {
                arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا',
                trans: 'Allāhummaghfir liḥayyinā wa-mayyitinā wa-shāhidinā wa-ghāʾibinā wa-ṣaghīrinā wa-kabīrinā',
                meaning: 'O Allah, forgive our living and our dead, those present and those absent, our young and our old.',
                source: 'Abū Dāwūd 3201, Tirmidhī 1024 — Supplication for the deceased, recited at funerals',
                names: ['Yā Ghafūr', 'Yā Raḥmān', 'Yā Karīm']
                },
                {
                arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ',
                trans: 'Rabbanāghfir lanā wa-li-ikhwāninālladhīna sabaqūnā bil-īmān',
                meaning: 'Our Lord, forgive us and our brothers who preceded us in faith.',
                source: 'Qur\'an 59:10 — The du\'ā for our parents and all Muslims who passed before us',
                names: ['Yā Ghafūr', 'Yā Raḥmān', 'Yā Wadūd']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 9. KNOWLEDGE & WISDOM
            // ══════════════════════════════════════════════════════════
            'Knowledge': [
                {
                arabic: 'رَبِّ زِدْنِي عِلْمًا',
                trans: 'Rabbi zidnī ʿilmā',
                meaning: 'My Lord, increase me in knowledge.',
                source: 'Qur\'an 20:114 — The only thing in the Qur\'an Allah commanded the Prophet ﷺ to ask for more of is knowledge',
                names: ['Yā ʿAlīm', 'Yā Ḥakīm', 'Yā Muʿallim']
                },
                {
                arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا',
                trans: 'Allāhumma infanī bimā ʿallamtanī wa-ʿallimnī mā yanfaʿunī wa-zidnī ʿilmā',
                meaning: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
                source: 'Tirmidhī 3599, Ibn Mājah 251 — Morning supplication of the Prophet ﷺ',
                names: ['Yā ʿAlīm', 'Yā Muʿallim', 'Yā Nūr']
                },
                {
                arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
                trans: 'Rabbish-raḥ lī ṣadrī wa-yassir lī amrī waḥlul ʿuqdatan mil-lisānī yafqahū qawlī',
                meaning: 'My Lord, expand for me my breast, ease my task for me, and remove the impediment from my speech, so they may understand what I say.',
                source: 'Qur\'an 20:25-28 — Du\'ā of Mūsā \'alayhissalām before speaking to Firʿawn. The scholars recite this before teaching, speaking, or studying.',
                names: ['Yā Fattāḥ', 'Yā Muʿallim', 'Yā Nūr']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
                trans: 'Allāhumma innī asʾaluka ʿilman nāfiʿan wa-rizqan ṭayyiban wa-ʿamalan mutaqabbalan',
                meaning: 'O Allah, I ask You for knowledge that benefits, provision that is pure and good, and deeds that will be accepted.',
                source: 'Ibn Mājah 925 — Du\'ā after Fajr, combining three pillars: knowledge, sustenance, and righteous action',
                names: ['Yā ʿAlīm', 'Yā Razzāq', 'Yā Qabūl']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ وَمِنْ قَلْبٍ لَا يَخْشَعُ وَمِنْ نَفْسٍ لَا تَشْبَعُ وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا',
                trans: 'Allāhumma innī aʿūdhu bika min ʿilmin lā yanfaʿ, wa-min qalbin lā yakhshaʿ, wa-min nafsin lā tashbaʿ, wa-min daʿwatin lā yustajābu lahā',
                meaning: 'O Allah, I seek refuge in You from knowledge that does not benefit, a heart that does not have khushūʿ, a soul that is never satisfied, and a supplication that is not answered.',
                source: 'Ṣaḥīḥ Muslim 2722 — The Prophet ﷺ sought refuge from these four things daily',
                names: ['Yā ʿAlīm', 'Yā Nāfiʿ', 'Yā Samīʿ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 10. PROTECTION
            // ══════════════════════════════════════════════════════════
            'Protection': [
                {
                arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
                trans: 'Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wa-aʿūdhu bika minal-ʿajzi wal-kasal',
                meaning: 'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness.',
                source: 'Ṣaḥīḥ al-Bukhārī 6363 — From the morning and evening supplication of the Prophet ﷺ',
                names: ['Yā Ḥafīẓ', 'Yā Wakīl', 'Yā Muqīt']
                },
                {
                arabic: 'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَن أُغْتَالَ مِنْ تَحْتِي',
                trans: 'Allāhummaḥfaẓnī min bayni yadayya wa-min khalfī wa-ʿan yamīnī wa-ʿan shimālī wa-min fawqī, wa-aʿūdhu biʿaẓamatika an ughtāla min taḥtī',
                meaning: 'O Allah, guard me from in front of me and behind me, on my right and on my left, and from above me. And I seek refuge in Your Greatness from being swallowed from beneath me.',
                source: 'Abū Dāwūd 5074, Ibn Mājah 3871 — Comprehensive protection supplication of the Prophet ﷺ',
                names: ['Yā Ḥafīẓ', 'Yā ʿAẓīm', 'Yā Qawī']
                },
                {
                arabic: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
                trans: 'Ḥasbunallāhu wa-niʿmal-wakīl',
                meaning: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
                source: 'Qur\'an 3:173 — The words Ibrāhīm \'alayhissalām said when thrown into the fire. The Prophet ﷺ also said these words (Ṣaḥīḥ al-Bukhārī 4563).',
                names: ['Yā Wakīl', 'Yā Ḥafīẓ', 'Yā Kāfī']
                },
                {
                arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
                trans: 'Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq',
                meaning: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
                source: 'Ṣaḥīḥ Muslim 2708 — The Prophet ﷺ said: whoever says this three times in the evening will not be harmed by anything that night',
                names: ['Yā Ḥafīẓ', 'Yā Muḥaymin', 'Yā Qādir']
                },
                {
                arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
                trans: 'Bismillāhilladhī lā yaḍurru maʿa-smihī shayʾun fil-arḍi wa-lā fis-samāʾi wa-huwas-samīʿul-ʿalīm',
                meaning: 'In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
                source: 'Abū Dāwūd 5088, Tirmidhī 3388 — The Prophet ﷺ said: whoever says this three times morning and evening will not be afflicted by sudden calamity',
                names: ['Yā Samīʿ', 'Yā ʿAlīm', 'Yā Ḥafīẓ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 11. THE UMMAH
            // ══════════════════════════════════════════════════════════
            'The Ummah': [
                {
                arabic: 'اللَّهُمَّ أَصْلِحْ أُمَّةَ مُحَمَّدٍ، اللَّهُمَّ فَرِّجْ عَنْ أُمَّةِ مُحَمَّدٍ، اللَّهُمَّ ارْحَمْ أُمَّةَ مُحَمَّدٍ',
                trans: 'Allāhumma aṣliḥ ummata Muḥammad, Allāhumma farrij ʿan ummati Muḥammad, Allāhumma irḥam ummata Muḥammad',
                meaning: 'O Allah, rectify the Ummah of Muhammad. O Allah, relieve the Ummah of Muhammad. O Allah, have mercy on the Ummah of Muhammad.',
                source: 'Musnad Aḥmad — From the supplications of the Prophet ﷺ for his Ummah',
                names: ['Yā Raḥmān', 'Yā Muʿīn', 'Yā Fattāḥ']
                },
                {
                arabic: 'اللَّهُمَّ انْصُرِ الْمُسْتَضْعَفِينَ مِنَ الْمُؤْمِنِينَ',
                trans: 'Allāhumma-nṣuril-mustaḍʿafīna minal-muʾminīn',
                meaning: 'O Allah, support the oppressed and vulnerable among the believers.',
                source: 'Derived from the du\'ā of the Prophet ﷺ for the oppressed believers in Makkah (Ṣaḥīḥ al-Bukhārī 240)',
                names: ['Yā Naṣīr', 'Yā Qawī', 'Yā Muʿīn']
                },
                {
                arabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا رَبَّنَا إِنَّكَ أَنتَ الْعَزِيزُ الْحَكِيمُ',
                trans: 'Rabbanā lā tajʿalnā fitnatan lilladhīna kafarū waghfir lanā rabbanā innaka antal-ʿazīzul-ḥakīm',
                meaning: 'Our Lord, do not make us a trial for those who disbelieve, and forgive us, our Lord. Indeed, it is You who is the Exalted in Might, the Wise.',
                source: 'Qur\'an 60:5 — Du\'ā of Ibrāhīm \'alayhissalām and the believers with him',
                names: ['Yā ʿAzīz', 'Yā Ḥakīm', 'Yā Ghafūr']
                },
                {
                arabic: 'اللَّهُمَّ اجْعَلْ أَوَّلَنَا صَلَاحًا وَأَوْسَطَنَا فَلَاحًا وَآخِرَنَا نَجَاحًا',
                trans: 'Allāhumma-jʿal awwalanā ṣalāḥan wa-awsaṭanā falāḥan wa-ākhiranā najāḥā',
                meaning: 'O Allah, make our beginning righteousness, our middle success, and our end triumph.',
                source: 'Transmitted from the du\'ās of the salaf for the Muslim community',
                names: ['Yā Fattāḥ', 'Yā Naṣīr', 'Yā Muflīḥ']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 12. GUIDANCE
            // ══════════════════════════════════════════════════════════
            'Guidance': [
                {
                arabic: 'اللَّهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ وَعَافِنَا فِيمَنْ عَافَيْتَ',
                trans: 'Allāhumma hdinā fīman hadayt, wa-ʿāfinā fīman ʿāfayt',
                meaning: 'O Allah, guide us among those You have guided and pardon us among those You have pardoned.',
                source: 'Abū Dāwūd 1425 — Opening of the Qunūt supplication, narrated by al-Ḥasan ibn ʿAlī رضي الله عنه',
                names: ['Yā Hādī', 'Yā Nūr']
                },
                {
                arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
                trans: 'Ihdinaṣ-ṣirāṭal-mustaqīm, ṣirāṭalladhīna anʿamta ʿalayhim',
                meaning: 'Guide us to the straight path — the path of those upon whom You have bestowed favour.',
                source: 'Qur\'an 1:6-7 — Sūrat al-Fātiḥah, recited seventeen times daily in prayer. The most repeated du\'ā in existence.',
                names: ['Yā Hādī', 'Yā Nūr', 'Yā Walī']
                },
                {
                arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
                trans: 'Yā muqallibal-qulūbi thabbit qalbī ʿalā dīnik',
                meaning: 'O Turner of the hearts, keep my heart steadfast upon Your religion.',
                source: 'Tirmidhī 2140, Musnad Aḥmad 12107 — The Prophet ﷺ said this du\'ā abundantly, and when asked why, he replied that hearts are between two fingers of Allah',
                names: ['Yā Muqallib', 'Yā Thābit', 'Yā Hādī']
                },
                {
                arabic: 'اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ',
                trans: 'Allāhumma arinā-l-ḥaqqa ḥaqqan wa-rzuqnā ittibāʿahu, wa-arinā-l-bāṭila bāṭilan wa-rzuqnā ijtinābah',
                meaning: 'O Allah, show us truth as truth and grant us the ability to follow it, and show us falsehood as falsehood and grant us the ability to avoid it.',
                source: 'Musnad Aḥmad — Transmitted from ʿAlī ibn Abī Ṭālib رضي الله عنه, the most beloved du\'ā for clarity of heart',
                names: ['Yā Hādī', 'Yā Nūr', 'Yā ʿAlīm']
                },
                {
                arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
                trans: 'Rabbanā lā tuzigh qulūbanā baʿda idh hadaytanā wa-hab lanā mil-ladunka raḥmatan innaka antal-Wahhāb',
                meaning: 'Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy. Indeed, You are the Bestower.',
                source: 'Qur\'an 3:8 — The du\'ā of those firmly grounded in knowledge (ar-rāsikhūna fil-ʿilm)',
                names: ['Yā Hādī', 'Yā Wahhāb', 'Yā Thabbit']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 13. HARDSHIP & ANXIETY
            // ══════════════════════════════════════════════════════════
            'Hardship': [
                {
                arabic: 'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
                trans: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn',
                meaning: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
                source: 'Qur\'an 21:87 — Du\'ā of Yūnus \'alayhissalām. The Prophet ﷺ said: "No Muslim calls upon Allah with it while in distress, except that Allah relieves him." (Tirmidhī 3505)',
                names: ['Yā LāʾilāhaillaHu', 'Yā Raḥmān', 'Yā Mujīb']
                },
                {
                arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
                trans: 'Allāhumma lā sahla illā mā jaʿaltahu sahlā, wa-anta tajʿalul-ḥazna idhā shiʾta sahlā',
                meaning: 'O Allah, there is no ease except what You make easy, and You make grief, if You wish, easy.',
                source: 'Ibn Ḥibbān 974 — The Prophet ﷺ taught this du\'ā for difficulty and grief',
                names: ['Yā Muʿīn', 'Yā Mufattiḥ', 'Yā Laṭīf']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
                trans: 'Allāhumma innī aʿūdhu bika minal-hammi wal-ḥuzni wa-aʿūdhu bika minal-ʿajzi wal-kasal',
                meaning: 'O Allah, I seek refuge in You from anxiety and grief, and I seek refuge in You from incapacity and laziness.',
                source: 'Ṣaḥīḥ al-Bukhārī 6369 — The Prophet ﷺ\'s comprehensive refuge from the ailments that paralyse the believer',
                names: ['Yā Muʿīn', 'Yā Qawī', 'Yā Ḥafīẓ']
                },
                {
                arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ',
                trans: 'Allāhumma innī ʿabduka wa-bnu ʿabdika wa-bnu amatika, nāṣiyatī biyadika, māḍin fiyya ḥukmuka, ʿadlun fiyya qaḍāʾuka',
                meaning: 'O Allah, I am Your servant, the son of Your servant, the son of Your maidservant. My forelock is in Your hand. Your command over me is forever executed. Your decree over me is just.',
                source: 'Musnad Aḥmad 3704 — The famous du\'ā of grief (du\'ā al-karb). The Prophet ﷺ said: "Allah will remove his grief and replace it with joy."',
                names: ['Yā Laṭīf', 'Yā Muʿīn', 'Yā ʿAdl']
                },
                {
                arabic: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
                trans: 'Ḥasbiyallāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa-huwa rabbul-ʿarshil-ʿaẓīm',
                meaning: 'Allah is sufficient for me. There is no deity except Him. I have placed my reliance upon Him, and He is the Lord of the Magnificent Throne.',
                source: 'Qur\'an 9:129 — The Prophet ﷺ said: "Whoever says this seven times morning and evening, Allah will be sufficient for him in whatever grieves him." (Abū Dāwūd 5081)',
                names: ['Yā Ḥasbī', 'Yā Wakīl', 'Yā Kāfī']
                },
            ],

            // ══════════════════════════════════════════════════════════
            // 14. GRATITUDE & BLESSINGS
            // ══════════════════════════════════════════════════════════
            'Gratitude': [
                {
                arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
                trans: 'Allāhumma aʿinnī ʿalā dhikrika wa-shukrika wa-ḥusni ʿibādatik',
                meaning: 'O Allah, help me to remember You, be grateful to You, and worship You in the best manner.',
                source: 'Abū Dāwūd 1522, Nasāʾī 1303 — The Prophet ﷺ taught this to Muʿādh ibn Jabal رضي الله عنه and told him to say it after every prayer',
                names: ['Yā Shakūr', 'Yā Muʿīn']
                },
                {
                arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
                trans: 'Rabbi awziʿnī an ashkura niʿmatakallātī anʿamta ʿalayya wa-ʿalā wālidayya wa-an aʿmala ṣāliḥan tarḍāh',
                meaning: 'My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do righteousness of which You approve.',
                source: 'Qur\'an 27:19 — Du\'ā of Sulaymān \'alayhissalām when he heard the ant. A du\'ā for gratitude combined with righteous action.',
                names: ['Yā Shakūr', 'Yā Raḥmān', 'Yā Wadūd']
                },
                {
                arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
                trans: 'Al-ḥamdu lillāhilladhī biniʿmatihī tatimmuṣ-ṣāliḥāt',
                meaning: 'All praise is for Allah, through Whose blessings all good things are completed.',
                source: 'Ibn Mājah 3803 — The Prophet ﷺ said to say this when something pleasing happens',
                names: ['Yā Ḥamīd', 'Yā Muniʿm', 'Yā Shakūr']
                },
                {
                arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِّنْ خَلْقِكَ فَمِنكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
                trans: 'Allāhumma mā aṣbaḥa bī min niʿmatin aw bi-aḥadin min khalqika faminka waḥdaka lā sharīka laka fa-lakal-ḥamdu wa-lakashshukr',
                meaning: 'O Allah, whatever blessing I receive this morning, or any of Your creation receives — it is from You alone, without partner. So to You is all praise and all thanks.',
                source: 'Abū Dāwūd 5073 — The Prophet ﷺ said: "Whoever says this in the morning has fulfilled the gratitude of that day."',
                names: ['Yā Ḥamīd', 'Yā Muniʿm', 'Yā Shakūr']
                },
                {
                arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
                trans: 'Rabbi innī limā anzalta ilayya min khayrin faqīr',
                meaning: 'My Lord, I am truly in need of whatever good You send down to me.',
                source: 'Qur\'an 28:24 — Du\'ā of Mūsā \'alayhissalām. A du\'ā of humility and complete dependence that opens the door to provision.',
                names: ['Yā Razzāq', 'Yā Karīm', 'Yā Muniʿm']
                },
            ],

            };


        const categories = Object.keys(duaData);
        const catContainer = document.getElementById('duaCategories');
        const duaWrap = document.getElementById('duaCardsWrap');
        let savedDuas = JSON.parse(localStorage.getItem('savedDuas') || '[]');
        let activeCat = categories[0];

        function renderCategories() {
            catContainer.innerHTML = '';
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'dua-cat-btn' + (cat === activeCat ? ' active' : '');
                btn.textContent = cat;
                btn.onclick = () => selectCategory(cat);
                catContainer.appendChild(btn);
            });
        }

        function renderDuas(cat) {
            const duas = duaData[cat] || [];
            duaWrap.innerHTML = '';
            duas.forEach((d, i) => {
                const key = cat + '-' + i;
                const isSaved = savedDuas.includes(key);
                const card = document.createElement('div');
                card.className = 'dua-card';
                card.innerHTML = `
      <div class="dua-arabic">${d.arabic}</div>
      <div class="dua-transliteration">${d.trans}</div>
      <div class="dua-translation">${d.meaning}</div>
      <div class="dua-names">${d.names.map(n => `<span class="dua-name-pill">${n}</span>`).join('')}</div>
      <button class="dua-save-btn ${isSaved ? 'saved' : ''}" data-key="${key}">
        ${isSaved ? '♥ Saved' : '♡ Save to My List'}
      </button>
    `;
                card.querySelector('.dua-save-btn').onclick = function () {
                    const k = this.dataset.key;
                    if (savedDuas.includes(k)) {
                        savedDuas = savedDuas.filter(x => x !== k);
                        this.textContent = '♡ Save to My List'; this.classList.remove('saved');
                    } else {
                        savedDuas.push(k);
                        this.textContent = '♥ Saved'; this.classList.add('saved');
                    }
                    localStorage.setItem('savedDuas', JSON.stringify(savedDuas));
                };
                duaWrap.appendChild(card);
            });
        }

        function selectCategory(cat) {
            activeCat = cat;
            duaWrap.classList.add('animating-out');
            setTimeout(() => {
                renderDuas(cat);
                renderCategories();
                duaWrap.classList.remove('animating-out');
                duaWrap.classList.add('animating-in');
                setTimeout(() => { duaWrap.classList.remove('animating-in'); duaWrap.style.opacity = '1'; duaWrap.style.transform = 'none'; }, 50);
            }, 350);
        }

        renderCategories();
        renderDuas(activeCat);

        // ═══════════════════════════════
        // HOW TO MAKE DUA PANELS
        // ═══════════════════════════════
        const duaStepsData = [
          {
            arabic: "الْحَمْدُ لِلَّهِ",
            en: "Praise Allah First",
            body: 'Begin by glorifying Allah. Say: "Alhamdulillahi Rabbil ʿālameen." Every duā begins with hamd — with recognition of who you are speaking to.',
          },
          {
            arabic: "الصَّلَاةُ عَلَى النَّبِيّ",
            en: "Send Salawat",
            body: 'Upon the Prophet ﷺ — open and close every duā with it.The Prophet ﷺ said: "No duā is stopped from being answered as long as it begins and ends with salawat."',
          },
          {
            arabic: "الاسْتِغْفَار",
            en: "Seek Forgiveness",
            body: "Before asking for anything, ask for forgiveness. Sincerely. Completely. A heart carrying sin is a vessel with holes — seal it first.",
          },
          {
            arabic: "اشْكُرِ اللهَ",
            en: "Express Gratitude",
            body: "Thank Allah for what He has already given you before asking for more. Count your blessings aloud. Gratitude opens the door to abundance.",
          },
          {
            arabic: "تَوَسَّلْ بِأَسْمَائِهِ",
            en: "Call on His Names",
            body: "Choose the Name of Allah that fits your need. Yā Razzāq for provision. Yā Shifā for health. Yā Ghafūr for forgiveness. Yā Wadūd for love. He responds to those who call Him by His names.",
          },
          {
            arabic: "ادْعُ بِدُعَاءِ الْقُرْآنِ وَالسُّنَّة",
            en: "Recite the Duās from the Quran & Sunnah",
            body: "Begin with the sacred supplications revealed in the Quran and taught in authentic Hadith. These are the words Allah preserved and the Messenger ﷺ repeated most often. Let divine words guide your own before you pour your heart out to Allah.",
          },
          {
            arabic: "اسْكُبْ قَلْبَكَ",
            en: "Pour Your Heart Out",
            body: "Speak to Allah directly in your language. He understands every tongue. Name exactly what you want — specificity is not greed, it is trust. Allah loves that you depend on Him for everything.",
          },
          {
            arabic: "اسْأَلِ اللهَ الْجَنَّةَ وَالنَّجَاةَ",
            en: "Ask Allah for the Hereafter",
            body: "This world is temporary, but the Hereafter is eternal. Ask Allah sincerely for Jannah, forgiveness, protection from the Fire, and a beautiful meeting with Him. Make your eternal destination your greatest concern on this sacred day.",
          },
          {
            arabic: "ادْعُ لِلآخَرِين",
            en: "Make Duā for Others",
            body: 'For your family.For the sick.For the oppressed.For the Ummah.The angels say "Ameen and for you too" — and the duā of the absent for the absent is answered swiftly.',
          },
          {
            arabic: "اخْتِمْ بِالصَّلَاة",
            en: "End with Salawat, Āmeen, & Sadaqah",
            body: "Close with praise. Close with trust. Say Āmeen with certainty. And if you are able, give sadaqah immediately after — it seals your duā with a deed.",
          },
        ];

        const duaStepsEl = document.getElementById('duaSteps');
        duaStepsData.forEach((s, i) => {
            const panel = document.createElement('div');
            panel.className = 'dua-step-panel';
            panel.innerHTML = `
    <div class="dua-panel-num">Step ${String(i + 1).padStart(2, '0')}</div>
    <div>
      <div class="dua-panel-arabic">${s.arabic}</div>
      <div class="dua-panel-divider"></div>
      <div class="dua-panel-title">${s.en}</div>
      <div class="dua-panel-body">${s.body}</div>
    </div>
  `;
            duaStepsEl.appendChild(panel);
        });

        const panelObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
        }, { threshold: 0.3 });
        document.querySelectorAll('.dua-step-panel').forEach(el => panelObs.observe(el));

        // ═══════════════════════════════
        // PLANNER
        // ═══════════════════════════════
        const plannerBlocksData = [
            {
                id: 'night', title: 'Midnight → Fajr', arabic: 'بعد منتصف الليل', time: '12:00 AM – 4:25 AM', color: '#6B7FD4', suggested: ['Tahajjud Prayer', 'Personal Duā in Sujood', 'Suhoor & Niyyah', 'Morning Adhkar']
            },
            {
                id: 'morning', title: 'Fajr → Dhuhr', arabic: 'بعد الفجر', time: '4:25 AM – 12:30 PM', color: '#C9A84C', suggested: ['Fajr in Congregation', 'Ishraq Prayer', 'Quran Recitation', 'Duha Prayer', 'Istighfar × 100', 'Salawat × 100', 'Dhikr Block']
            },
            {
                id: 'keywindow', title: 'Dhuhr → Asr', arabic: 'النافذة الذهبية', time: '12:30 PM – 3:30 PM ★', color: '#F5DFA0', suggested: ['Dhuhr Prayer', 'Duā for Self', 'Duā for Family', '99 Names of Allah', 'Duā for the Ummah']
            },
            {
                id: 'finalpush', title: 'Asr → Maghrib', arabic: 'الدفعة الأخيرة', time: '3:30 PM – 6:30 PM', color: '#D4813A', suggested: ['4 Rakah Before Asr', 'Asr Prayer', 'Intense Duā', 'Dhikr Marathon', 'Final Duā', 'Iftar & Maghrib']
            },
        ];

        let plannerState = JSON.parse(localStorage.getItem('plannerState') || 'null');
        if (!plannerState) {
            plannerState = {};
            plannerBlocksData.forEach(b => { plannerState[b.id] = [...b.suggested]; });
        }

        function savePlanner() { localStorage.setItem('plannerState', JSON.stringify(plannerState)); }

        function renderPlanner() {
            const container = document.getElementById('plannerBlocks');
            container.innerHTML = '';
            plannerBlocksData.forEach(block => {
                const tiles = plannerState[block.id] || [];
                const el = document.createElement('div');
                el.className = 'planner-block reveal';
                el.style.setProperty('--block-color', block.color);
                el.innerHTML = `
      <div class="planner-block-header" style="--block-color:${block.color}">
        <div class="planner-block-title">${block.title}</div>
        <div class="planner-block-arabic" style="color:${block.color}">${block.arabic}</div>
        <div class="planner-block-time">${block.time}</div>
      </div>
      <div class="planner-tiles" id="tiles-${block.id}">
        ${tiles.map((t, i) => `
          <div class="planner-tile" data-block="${block.id}" data-idx="${i}">
            <input class="planner-tile-text" value="${t}" onchange="updateTile('${block.id}', ${i}, this.value)">
            <button class="planner-tile-remove" onclick="removeTile('${block.id}',${i})">×</button>
          </div>
        `).join('')}
      </div>
      <button class="planner-add-btn" onclick="addTile('${block.id}')">+ Add Worship Act</button>
    `;
                container.appendChild(el);
                revealObs.observe(el);
            });
        }

        function addTile(blockId) {
            plannerState[blockId].push('');
            savePlanner(); renderPlanner();
            // Focus the new input
            setTimeout(() => {
                const tiles = document.querySelectorAll(`#tiles-${blockId} .planner-tile-text`);
                if (tiles.length) tiles[tiles.length - 1].focus();
            }, 50);
        }
        function removeTile(blockId, idx) { plannerState[blockId].splice(idx, 1); savePlanner(); renderPlanner(); }
        function updateTile(blockId, idx, val) { plannerState[blockId][idx] = val; savePlanner(); }
        function resetPlanner() {
            plannerState = {};
            plannerBlocksData.forEach(b => { plannerState[b.id] = [...b.suggested]; });
            savePlanner(); renderPlanner();
        }

        renderPlanner();

        // ═══════════════════════════════
        // MODAL
        // ═══════════════════════════════
        const fabBtn = document.getElementById('fabBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        fabBtn.onclick = () => modalOverlay.classList.add('open');
        modalClose.onclick = closeModal;
        modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
        function closeModal() { modalOverlay.classList.remove('open'); }
        function scrollTo(selector) {
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        }

        // ═══════════════════════════════
        // PDF GENERATION
        // ═══════════════════════════════
        function downloadRoutinePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(201, 168, 76);
            doc.text('Yawm Arafah — Full Routine', 20, 30);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('New Dawn Foundation × The Presence — Signature Studio', 20, 40);
            doc.text('27 May 2026 · 9 Dhul Hijjah 1447 · India (IST)', 20, 47);
            let y = 62;
            doc.setFontSize(12);
            routineData.forEach((r, i) => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.setTextColor(150, 120, 50);
                doc.text(`${r.time} — ${r.name}`, 20, y);
                y += 6;
                doc.setFontSize(9);
                doc.setTextColor(80, 80, 80);
                const lines = doc.splitTextToSize(r.desc, 165);
                doc.text(lines, 20, y);
                y += lines.length * 5 + 8;
                doc.setFontSize(12);
            });
            doc.setFontSize(8);
            doc.setTextColor(150, 120, 50);
            doc.text('Crafted by The Presence — Signature Studio · thepresencestudio@gmail.com', 20, 285);
            doc.save('Arafah-Routine-2026.pdf');
        }

        function downloadDuasPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(201, 168, 76);
            doc.text("Yawm Arafah — Du'a Collection", 20, 30);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('New Dawn Foundation × The Presence — Signature Studio', 20, 40);
            if (savedDuas.length > 0) {
                doc.setFontSize(9); doc.setTextColor(180, 100, 40);
                doc.text('♥ = Saved to your list', 20, 48);
            }
            let y = 57;
            Object.entries(duaData).forEach(([cat, duas]) => {
                if (y > 260) { doc.addPage(); y = 20; }
                doc.setFontSize(14); doc.setTextColor(201, 168, 76);
                doc.text(cat, 20, y); y += 8;
                duas.forEach((d, i) => {
                    if (y > 260) { doc.addPage(); y = 20; }
                    const key = cat + '-' + i;
                    const isSaved = savedDuas.includes(key);
                    doc.setFontSize(9); doc.setTextColor(60, 40, 10);
                    const prefix = isSaved ? '♥  ' : '    ';
                    if (isSaved) doc.setTextColor(180, 80, 20);
                    const tlines = doc.splitTextToSize(prefix + d.trans, 162);
                    doc.text(tlines, 20, y); y += tlines.length * 5;
                    doc.setTextColor(100, 100, 100);
                    const mlines = doc.splitTextToSize('    ' + d.meaning, 162);
                    doc.text(mlines, 20, y); y += mlines.length * 5 + 6;
                });
                y += 4;
            });
            doc.setFontSize(8); doc.setTextColor(150, 120, 50);
            doc.text('Crafted by The Presence — Signature Studio · thepresencestudio@gmail.com', 20, 285);
            doc.save('Arafah-Duas-2026.pdf');
        }

        function downloadDuaStepsPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(20); doc.setTextColor(201, 168, 76);
            doc.text("How to Make Du'a — 10 Steps", 20, 30);
            doc.setFontSize(10); doc.setTextColor(100, 100, 100);
            doc.text('New Dawn Foundation × The Presence — Signature Studio', 20, 40);
            let y = 55;
            duaStepsData.forEach((s, i) => {
                if (y > 260) { doc.addPage(); y = 20; }
                doc.setFontSize(13); doc.setTextColor(150, 120, 50);
                doc.text(`${i + 1}. ${s.en}`, 20, y); y += 7;
                doc.setFontSize(9); doc.setTextColor(80, 80, 80);
                const lines = doc.splitTextToSize(s.body, 165);
                doc.text(lines, 20, y); y += lines.length * 5 + 8;
            });
            doc.setFontSize(8); doc.setTextColor(150, 120, 50);
            doc.text('Crafted by The Presence — Signature Studio · thepresencestudio@gmail.com', 20, 285);
            doc.save('How-to-Make-Dua-2026.pdf');
        }

        function download99Names() {
           window.open("./NDF_99_Names_of_Allah_English.pdf", "_blank");
        }

        function downloadPlannerPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(20); doc.setTextColor(201, 168, 76);
            doc.text('My Personal Arafah Plan — 2026', 20, 30);
            doc.setFontSize(10); doc.setTextColor(100, 100, 100);
            doc.text('27 May 2026 · 9 Dhul Hijjah 1447 · Crafted with New Dawn Foundation', 20, 40);
            let y = 55;
            plannerBlocksData.forEach(block => {
                if (y > 260) { doc.addPage(); y = 20; }
                doc.setFontSize(14); doc.setTextColor(150, 120, 50);
                doc.text(block.title + ' (' + block.time + ')', 20, y); y += 8;
                const tiles = plannerState[block.id] || [];
                tiles.forEach(t => {
                    if (!t.trim()) return;
                    if (y > 270) { doc.addPage(); y = 20; }
                    doc.setFontSize(10); doc.setTextColor(60, 60, 60);
                    doc.text('· ' + t, 25, y); y += 7;
                });
                y += 6;
            });
            doc.setFontSize(8); doc.setTextColor(150, 120, 50);
            doc.text('Crafted by The Presence — Signature Studio · thepresencestudio@gmail.com', 20, 285);
            doc.save('My-Arafah-Plan-2026.pdf');
        }

        // GSAP removed — using IntersectionObserver instead

        // ═══════════════════════════════
        // SIG CARD VISIBILITY
        // ═══════════════════════════════
        const sigCardObs = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('card-visible'), e.target.dataset.delay || 0);
                    sigCardObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 100px 0px 0px' });
        document.querySelectorAll('.sig-card').forEach((el, i) => {
            el.dataset.delay = i * 120;
            sigCardObs.observe(el);
        });


        // ═══════════════════════════════
        // ARABIC TEXT VISIBILITY
        // ═══════════════════════════════
        const arabicObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('arabic-visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-arabic').forEach(el => arabicObs.observe(el));

        // ═══════════════════════════════
        // ROUTINE TIMELINE LINE ANIMATION
        // ═══════════════════════════════
        const tlLine = document.querySelector('.timeline-line');
        if (tlLine) {
            const routineSection = document.getElementById('routine');
            const lineObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        tlLine.style.transition = 'transform 2s ease';
                        tlLine.style.transformOrigin = 'top';
                        tlLine.style.animation = 'lineGrow 2s ease forwards';
                    }
                });
            }, { threshold: 0.05 });
            lineObs.observe(routineSection);
        }
