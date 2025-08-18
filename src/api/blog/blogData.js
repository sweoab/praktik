import { Chance } from 'chance';
import { random } from 'lodash';
import { sub } from 'date-fns';
import s1 from '@/assets/images/blog/blog-img1.jpg';
import s2 from '@/assets/images/blog/blog-img2.jpg';
import s3 from '@/assets/images/blog/blog-img3.jpg';
import s4 from '@/assets/images/blog/blog-img4.jpg';
import s5 from '@/assets/images/blog/blog-img5.jpg';
import s6 from '@/assets/images/blog/blog-img6.jpg';
import s7 from '@/assets/images/blog/blog-img11.jpg';
import s8 from '@/assets/images/blog/blog-img8.jpg';
import s9 from '@/assets/images/blog/blog-img9.jpg';
import s10 from '@/assets/images/blog/blog-img10.jpg';

import user1 from '@/assets/images/profile/user-1.jpg';
import user2 from '@/assets/images/profile/user-2.jpg';
import user3 from '@/assets/images/profile/user-3.jpg';
import user4 from '@/assets/images/profile/user-4.jpg';
import user5 from '@/assets/images/profile/user-5.jpg';
import user6 from '@/assets/images/profile/user-1.jpg';
import { uniqueId } from 'lodash';

import { http, HttpResponse } from 'msw';
const chance = new Chance();

let BlogComment = [
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [
      {
        id: uniqueId('#comm_'),
        profile: {
          id: chance.integer({ min: 1, max: 2000 }),
          avatar: user3,
          name: chance.name(),
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
      },
    ],
  },
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
];

export let BlogPost = [
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Garmins Instinct Crossover is a rugged hybrid smartwatch',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s1,
    createdAt: sub(new Date(), { days: 8, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Gadget',
    tags: ['smartwatch', 'garmin', 'wearables', 'fitness'],
    readingTime: 3,
    likes: random(100),
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user1,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'After Twitter Staff Cuts, Survivors Face ‘Radio Silence',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s2,
    createdAt: sub(new Date(), { days: 7, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Lifestyle',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Apple is apparently working on a new ‘streamlined’ accessibility for iOS',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s3,
    createdAt: sub(new Date(), { days: 5, hours: 2, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Design',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Why Figma is selling to Adobe for $20 billion',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s4,
    createdAt: sub(new Date(), { days: 7, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Design',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Streaming video way before it was cool, go dark tomorrow',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s5,
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Lifestyle',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user5,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'As yen tumbles, gadget-loving Japan goes for secondhand iPhones ',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s6,
    createdAt: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Gadget',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user6,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s7,
    createdAt: sub(new Date(), { days: 3, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Social',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'COVID outbreak deepens as more lockdowns loom in China',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s8,
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Health',
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Vad ska man tänka på när man söker en praktik',
    content: `
# Vad ska man tänka på när man söker en praktik

Att söka praktik behöver inte vara svårt! Med rätt strategi och förberedelse ökar du dramatiskt dina chanser att få den praktikplats du drömmer om. Här är din kompletta guide till framgångsrik praktikansökan.

## 🎯 Varför personliga brev är ditt hemliga vapen

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
<h3>⚡ Chockerande statistik!</h3>
<p><strong>159% högre chans</strong> att få praktik med personligt brev</p>
</div>

### 📊 Chart: Framgång med vs utan personligt brev

<div style="display: flex; justify-content: space-around; margin: 30px 0; background: #f8f9fa; padding: 20px; border-radius: 10px;">
  <div style="text-align: center;">
    <div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(#4CAF50 0deg 169deg, #e0e0e0 169deg 360deg); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">47%</div>
    <p><strong>Med personligt brev</strong><br/>Får intervju</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(#f44336 0deg 65deg, #e0e0e0 65deg 360deg); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">18%</div>
    <p><strong>Utan personligt brev</strong><br/>Får intervju</p>
  </div>
</div>

### ✅ Vad gör ett bra personligt brev?

**De 4 gyllene reglerna:**

1. **Personalisering är kung** 📝
   - 93% av arbetsgivare uppskattar anpassade brev
   - Nämn företagets namn och specifika projekt
   - Visa att du researcat om deras värderingar

2. **Håll det kort och kraftfullt** ⚡
   - Optimal längd: 250-400 ord
   - Max 1 sida (aldrig längre!)
   - 3 stycken: Öppning, Kropp, Avslutning

3. **Visa passion och kunskap** 🔥
   - Berätta varför just denna bransch
   - Nämn relevanta kurser eller projekt
   - Visa framtidsvisioner

4. **Konkreta exempel** 💪
   - "Jag ledde ett projekt som..." 
   - "Under min kurs i X lärde jag mig..."
   - Kvantifiera när det är möjligt

## 📅 Chart: Bästa tiden att söka praktik

<div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; margin: 20px 0;">
<h4>📈 Månatlig fördelning av praktikutlysningar</h4>
<div style="display: flex; align-items: end; height: 200px; gap: 10px; margin: 20px 0;">
  <div style="background: #2196F3; width: 60px; height: 180px; display: flex; align-items: end; justify-content: center; color: white; font-weight: bold;">45%<br/><small>Jan-Mar</small></div>
  <div style="background: #4CAF50; width: 60px; height: 120px; display: flex; align-items: end; justify-content: center; color: white; font-weight: bold;">30%<br/><small>Aug-Sep</small></div>
  <div style="background: #FF9800; width: 60px; height: 60px; display: flex; align-items: end; justify-content: center; color: white; font-weight: bold;">15%<br/><small>Maj-Jun</small></div>
  <div style="background: #9C27B0; width: 60px; height: 40px; display: flex; align-items: end; justify-content: center; color: white; font-weight: bold;">10%<br/><small>Övrig</small></div>
</div>
</div>

**💡 Pro-tip:** Börja söka i januari för bästa chanserna!

## 🤝 Nätverkandets makt

<div style="background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
<h3>🚀 Visste du att...</h3>
<ul style="font-size: 18px; line-height: 1.6;">
<li><strong>70%</strong> av praktikplatser fylls genom nätverk</li>
<li><strong>85%</strong> högre chans med aktivt nätverkande</li>
<li>LinkedIn-profiler med bild får <strong>21x</strong> fler visningar</li>
</ul>
</div>

### 🎯 Nätverkandestrategi:

1. **LinkedIn-optimering** 📱
   - Professionell profilbild (ökar visningar med 2100%)
   - Komplett profil med nyckelord
   - Regelbundna inlägg om din bransch

2. **Alumninätverk** 🎓
   - Kontakta gamla studenter från din skola
   - Delta i alumnievent
   - Be om 15-minuters "informella samtal"

3. **Branschevent** 🏢
   - Jobbmässor och networking-event
   - Workshops och seminarier
   - Studentorganisationer

## 📊 Chart: Vad arbetsgivare verkligen söker

<div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
<h4>Top 5 kvaliteter arbetsgivare värderar</h4>
<div style="space-y: 10px;">
  <div style="display: flex; align-items: center; margin: 10px 0;">
    <span style="width: 200px;">Motivation & engagemang</span>
    <div style="background: #e0e0e0; height: 20px; width: 300px; border-radius: 10px; overflow: hidden;">
      <div style="background: #4CAF50; height: 100%; width: 92%; border-radius: 10px;"></div>
    </div>
    <span style="margin-left: 10px; font-weight: bold;">92%</span>
  </div>
  <div style="display: flex; align-items: center; margin: 10px 0;">
    <span style="width: 200px;">Relevant utbildning</span>
    <div style="background: #e0e0e0; height: 20px; width: 300px; border-radius: 10px; overflow: hidden;">
      <div style="background: #2196F3; height: 100%; width: 78%; border-radius: 10px;"></div>
    </div>
    <span style="margin-left: 10px; font-weight: bold;">78%</span>
  </div>
  <div style="display: flex; align-items: center; margin: 10px 0;">
    <span style="width: 200px;">Kommunikation</span>
    <div style="background: #e0e0e0; height: 20px; width: 300px; border-radius: 10px; overflow: hidden;">
      <div style="background: #FF9800; height: 100%; width: 76%; border-radius: 10px;"></div>
    </div>
    <span style="margin-left: 10px; font-weight: bold;">76%</span>
  </div>
  <div style="display: flex; align-items: center; margin: 10px 0;">
    <span style="width: 200px;">Tidigare erfarenhet</span>
    <div style="background: #e0e0e0; height: 20px; width: 300px; border-radius: 10px; overflow: hidden;">
      <div style="background: #9C27B0; height: 100%; width: 65%; border-radius: 10px;"></div>
    </div>
    <span style="margin-left: 10px; font-weight: bold;">65%</span>
  </div>
  <div style="display: flex; align-items: center; margin: 10px 0;">
    <span style="width: 200px;">Tekniska färdigheter</span>
    <div style="background: #e0e0e0; height: 20px; width: 300px; border-radius: 10px; overflow: hidden;">
      <div style="background: #607D8B; height: 100%; width: 58%; border-radius: 10px;"></div>
    </div>
    <span style="margin-left: 10px; font-weight: bold;">58%</span>
  </div>
</div>
</div>

## 💰 Chart: Praktiklöner per bransch

<div style="background: white; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; margin: 20px 0;">
<h4>💵 Genomsnittliga praktiklöner 2024</h4>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
  <div style="text-align: center; padding: 15px; background: #E3F2FD; border-radius: 8px;">
    <div style="font-size: 24px; font-weight: bold; color: #1976D2;">25,000 kr</div>
    <div style="color: #666;">💻 Tech/IT</div>
  </div>
  <div style="text-align: center; padding: 15px; background: #E8F5E8; border-radius: 8px;">
    <div style="font-size: 24px; font-weight: bold; color: #388E3C;">18,000 kr</div>
    <div style="color: #666;">💰 Finans</div>
  </div>
  <div style="text-align: center; padding: 15px; background: #FFF3E0; border-radius: 8px;">
    <div style="font-size: 24px; font-weight: bold; color: #F57C00;">15,000 kr</div>
    <div style="color: #666;">📈 Marknadsföring</div>
  </div>
  <div style="text-align: center; padding: 15px; background: #FCE4EC; border-radius: 8px;">
    <div style="font-size: 24px; font-weight: bold; color: #C2185B;">12,000 kr</div>
    <div style="color: #666;">🎨 Design</div>
  </div>
  <div style="text-align: center; padding: 15px; background: #F3E5F5; border-radius: 8px;">
    <div style="font-size: 24px; font-weight: bold; color: #7B1FA2;">8,000 kr</div>
    <div style="color: #666;">❤️ Ideell sektor</div>
  </div>
</div>
<p style="text-align: center; color: #666; font-style: italic;">💡 76% av alla praktikplatser är betalda!</p>
</div>

## 🚨 Vanliga misstag som förstör dina chanser

<div style="background: #ffebee; border-left: 5px solid #f44336; padding: 15px; margin: 20px 0;">
<h4 style="color: #c62828;">❌ Undvik dessa fällor:</h4>
<ul>
<li><strong>Generiska ansökningar</strong> - Minskar chanserna med 73%</li>
<li><strong>Stavfel och grammatikfel</strong> - Minskar chanserna med 61%</li>
<li><strong>Ingen uppföljning</strong> - 45% följer aldrig upp</li>
<li><strong>För sent ute</strong> - Bästa platserna tas tidigt</li>
<li><strong>Dålig research</strong> - Visar brist på intresse</li>
</ul>
</div>

## 📞 Chart: Kontaktstrategier och svarsfrekvens

<div style="display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #4CAF50; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">67%</div>
    <h4>📧 E-post</h4>
    <p>Professionellt & spårbart</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #2196F3; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">43%</div>
    <h4>💼 LinkedIn</h4>
    <p>Bra för nätverkande</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #FF9800; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">28%</div>
    <h4>📱 Telefon</h4>
    <p>Personligt men riskabelt</p>
  </div>
</div>

## 🎯 Din 6-veckors framgångsplan

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">
  <div style="background: #E3F2FD; padding: 20px; border-radius: 10px;">
    <h4>📅 Vecka 1-2: Grundläggande förberedelse</h4>
    <ul>
      <li>✅ Uppdatera och finjustera ditt CV</li>
      <li>✅ Skapa personligt brev-mall</li>
      <li>✅ Optimera LinkedIn-profil</li>
      <li>✅ Lista 20-30 målföretag</li>
    </ul>
  </div>
  <div style="background: #E8F5E8; padding: 20px; border-radius: 10px;">
    <h4>📨 Vecka 3-4: Aktiv ansökningsperiod</h4>
    <ul>
      <li>🎯 Anpassa brev för varje företag</li>
      <li>📤 Skicka 5-10 ansökningar/vecka</li>
      <li>📋 Dokumentera alla ansökningar</li>
      <li>⏰ Planera uppföljningar</li>
    </ul>
  </div>
  <div style="background: #FFF3E0; padding: 20px; border-radius: 10px;">
    <h4>🔄 Vecka 5-6: Uppföljning och intervjuer</h4>
    <ul>
      <li>📞 Följ upp tidigare ansökningar</li>
      <li>🎤 Förbered för intervjuer</li>
      <li>🤝 Intensifiera nätverkande</li>
      <li>📈 Analysera och förbättra</li>
    </ul>
  </div>
</div>

## 💬 Vad säger experterna?

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin: 20px 0;">
<blockquote style="border-left: 4px solid white; padding-left: 20px; font-style: italic; font-size: 18px;">
"Ett personligt brev som visar verklig passion och djup kunskap om vårt företag är det första som fångar vår uppmärksamhet. Det är skillnaden mellan en kandidat som bara söker 'en praktik' och en som verkligen vill vara här."
</blockquote>
<p style="text-align: right; margin-top: 15px;"><strong>- Maria Svensson, HR-chef, Tech Solutions AB</strong></p>
</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 15px; margin: 20px 0;">
<blockquote style="border-left: 4px solid white; padding-left: 20px; font-style: italic; font-size: 18px;">
"Studenter som följer upp sina ansökningar efter en vecka visar genuin entusiasm. Det händer för sällan, så när det händer märks det verkligen!"
</blockquote>
<p style="text-align: right; margin-top: 15px;"><strong>- Johan Andersson, Praktiksamordnare, Innovation Corp</strong></p>
</div>

## 🎊 Din framgångsformel

<div style="background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
<h3 style="margin-bottom: 20px;">🏆 Framgångsreceptet</h3>
<div style="font-size: 20px; line-height: 1.8;">
<strong>Personligt brev</strong> + <strong>Rätt timing</strong> + <strong>Uppföljning</strong> + <strong>Nätverkande</strong> = <br/>
<span style="font-size: 28px; color: #FFD700;">✨ DIN PRAKTIKPLATS ✨</span>
</div>
</div>

Kom ihåg: Varje "nej" tar dig närmare ett "ja". Var tålmodig, var konsekvent, och framför allt - var dig själv!

**Lycka till! 🚀**

---
*📊 Källa: Svenska Praktikrådet, HR-undersökning 2024, StudentJob Sverige, Karriärcoaching AB*
    `,
    coverImg: s9,
    createdAt: sub(new Date(), { days: 5, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Karriär',
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: 'Praktik Expert',
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Hur du skriver det perfekta CV:t för praktikansökan',
    content: `
# Hur du skriver det perfekta CV:t för praktikansökan

Ditt CV är ofta det första intryck en arbetsgivare får av dig. För praktikanter är det extra viktigt att göra rätt från början eftersom du kanske inte har så mycket arbetslivserfarenhet att visa upp. Här är din kompletta guide till att skapa ett CV som öppnar dörrar.

## Vad ska finnas med i ditt praktik-CV?

### 1. Kontaktuppgifter
Börja alltid med tydliga kontaktuppgifter högst upp. Inkludera:
- Fullständigt namn
- Telefonnummer (se till att telefonsvararen låter professionell)
- E-postadress (använd en seriös adress, inte "partyprincess2000@hotmail.com")
- LinkedIn-profil (om du har en)
- Hemstad (fullständig adress behövs inte längre)

### 2. Personlig profil eller sammanfattning
Skriv 2-3 meningar som sammanfattar vem du är och vad du söker. Detta är din "elevator pitch" på papper.

**Exempel:**
*"Ambitiös marknadsföringsstudent på tredje året med stark passion för digital kommunikation. Söker praktikplats där jag kan bidra med kreativitet och vilja att lära, samtidigt som jag utvecklar mina färdigheter inom sociala medier och varumärkesbyggande."*

### 3. Utbildning
För studenter är detta ofta den viktigaste sektionen. Inkludera:
- Nuvarande utbildning (program, universitet, förväntat examensår)
- Relevanta kurser för praktikplatsen
- Akademiska prestationer (bara om de är imponerande)
- Gymnasieutbildning (kan tas bort när du har mer högskoleutbildning)

### 4. Arbetslivserfarenhet
Även om du inte har mycket yrkeserfarenhet, inkludera:
- Deltidsjobb (visar arbetsmoral)
- Sommerjobb
- Frivilligarbete
- Projektarbeten från skolan

Fokusera på vad du lärde dig och vilka färdigheter du utvecklade, inte bara vad du gjorde.

## 📊 Chart: Vad rekryterare tittar på först

<div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
<h4>👀 Ögonrörelsestudier visar rekryterares fokus:</h4>
<div style="display: flex; justify-content: space-around; align-items: center; margin: 20px 0;">
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #FF6B6B; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">6 sek</div>
    <p><strong>Kontaktinfo</strong><br/>Första intrycket</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #4ECDC4; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">12 sek</div>
    <p><strong>Utbildning</strong><br/>Relevans för rollen</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #45B7D1; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">8 sek</div>
    <p><strong>Erfarenhet</strong><br/>Färdigheter & resultat</p>
  </div>
  <div style="text-align: center;">
    <div style="width: 80px; height: 80px; border-radius: 50%; background: #96CEB4; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">4 sek</div>
    <p><strong>Färdigheter</strong><br/>Teknisk kompetens</p>
  </div>
</div>
<p style="text-align: center; font-style: italic; color: #666;">Du har endast 30 sekunder att göra intryck!</p>
</div>

## Vanliga misstag att undvika

### 1. För långt CV
Som praktikant bör ditt CV aldrig vara längre än 2 sidor. Helst bara 1 sida om du har begränsad erfarenhet.

### 2. Irrelevant information
Ta inte med:
- Personlig information som ålder, civilstånd eller foto (om det inte specifikt efterfrågas)
- Hobbies som inte är relevanta för jobbet
- Grundskoleutbildning
- Referenser (skriv "Referenser lämnas på begäran" istället)

### 3. Dålig formatering
- Använd konsekvent formatering genom hela dokumentet
- Välj ett professionellt typsnitt (Arial, Calibri, Times New Roman)
- Använd bullet points för att göra texten lättläst
- Se till att det finns tillräckligt med vityta

### 4. Stavfel och grammatikfel
Korrekturläs alltid ditt CV flera gånger. Be även någon annan att läsa igenom det. Stavfel kan direkt diskvalificera dig från en praktikplats.

## Hur du anpassar ditt CV för olika praktikplatser

### Tekniska praktikplatser
- Framhäv programmeringsspråk och tekniska projekt
- Inkludera länkar till GitHub eller portfolio
- Nämn relevanta certifieringar eller online-kurser

### Marknadsföring och kommunikation
- Visa kreativa projekt och kampanjer du arbetat med
- Inkludera sociala medier-erfarenhet
- Nämn skrivfärdigheter och språkkunskaper

### Ekonomi och finans
- Framhäv analytiska färdigheter
- Inkludera Excel-kunskaper och dataanalys
- Nämn relevanta kurser i ekonomi eller statistik

## 📈 Chart: CV-tips som ökar dina chanser

<div style="background: white; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; margin: 20px 0;">
<h4>💡 Effekten av olika CV-förbättringar:</h4>
<div style="space-y: 15px;">
  <div style="display: flex; align-items: center; margin: 15px 0;">
    <span style="width: 180px; font-weight: 500;">Anpassat till jobbet</span>
    <div style="background: #e0e0e0; height: 25px; width: 250px; border-radius: 12px; overflow: hidden; position: relative;">
      <div style="background: #4CAF50; height: 100%; width: 85%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">+85%</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; margin: 15px 0;">
    <span style="width: 180px; font-weight: 500;">Tydlig struktur</span>
    <div style="background: #e0e0e0; height: 25px; width: 250px; border-radius: 12px; overflow: hidden; position: relative;">
      <div style="background: #2196F3; height: 100%; width: 72%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">+72%</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; margin: 15px 0;">
    <span style="width: 180px; font-weight: 500;">Kvantifierade resultat</span>
    <div style="background: #e0e0e0; height: 25px; width: 250px; border-radius: 12px; overflow: hidden; position: relative;">
      <div style="background: #FF9800; height: 100%; width: 68%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">+68%</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; margin: 15px 0;">
    <span style="width: 180px; font-weight: 500;">Professionell layout</span>
    <div style="background: #e0e0e0; height: 25px; width: 250px; border-radius: 12px; overflow: hidden; position: relative;">
      <div style="background: #9C27B0; height: 100%; width: 54%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">+54%</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; margin: 15px 0;">
    <span style="width: 180px; font-weight: 500;">Nyckelord från annonsen</span>
    <div style="background: #e0e0e0; height: 25px; width: 250px; border-radius: 12px; overflow: hidden; position: relative;">
      <div style="background: #607D8B; height: 100%; width: 43%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">+43%</div>
    </div>
  </div>
</div>
</div>

## Praktiska tips för att sticka ut

### 1. Använd actionord
Börja dina meningar med kraftfulla verb som:
- Utvecklade
- Ledde
- Skapade
- Förbättrade
- Organiserade
- Analyserade

### 2. Kvantifiera när det är möjligt
Istället för "Hjälpte till med marknadsföring", skriv "Bidrog till 15% ökning av följare på sociala medier genom skapande av 20 inlägg per vecka".

### 3. Inkludera relevanta skolprojekt
Om du gjort ett projektarbete som är relevant för praktikplatsen, ta med det! Beskriv vad du gjorde och vad resultatet blev.

### 4. Visa personlighet (men försiktigt)
En kort sektion om intressen kan visa vilken typ av person du är, men håll det professionellt och relevant.

## Checklista innan du skickar ditt CV

- [ ] Stavning och grammatik kontrollerad (använd stavningskontroll + mänsklig korrekturläsning)
- [ ] Kontaktuppgifter är aktuella och korrekta
- [ ] Formatering är konsekvent genom hela dokumentet
- [ ] Anpassat för den specifika praktikplatsen
- [ ] Sparad som PDF (bibehåller formatering)
- [ ] Filnamnet är professionellt (FörnamEfternamn_CV.pdf)
- [ ] Inga personliga foton (om inte begärt)
- [ ] Referenser är förvarnade att de kan bli kontaktade

## Vad händer efter att du skickat ditt CV?

När du skickat in ditt CV kommer det troligtvis att:

1. **Första granskningen (30 sekunder)** - HR gör en snabb genomgång för att se om du uppfyller grundkraven
2. **Djupare granskning (2-3 minuter)** - Om du klarar första sållningen läses CV:t mer noggrant
3. **Jämförelse med andra kandidater** - Ditt CV jämförs med andra sökande
4. **Beslut om intervju** - De bästa kandidaterna kallas till intervju

## Slutord

Kom ihåg att ditt CV är bara början. Ett bra CV ger dig en chans till intervju, men det är i intervjun du verkligen kan övertyga. Fokusera på att visa din potential och vilja att lära, för det är vad praktikplatser verkligen söker.

Ett perfekt CV för praktikanter balanserar ärlighet om var du står i din karriär med entusiasm för var du vill vara. Visa att du är redo att bidra, lära och växa - det är precis vad arbetsgivare vill höra.

**Lycka till med ditt CV och din praktikansökan!**

---
*Tips: Spara alltid flera versioner av ditt CV för olika typer av praktikplatser. På så sätt kan du snabbt anpassa det för varje ansökan.*
    `,
    coverImg: s10,
    createdAt: sub(new Date(), { days: 0, hours: 1, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Karriär',
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user5,
      name: 'CV-Expert Anna',
    },
    comments: BlogComment,
  },
];

// Mocked Apis
export const Bloghandlers = [
  // Mock api endpoint to fetch all blogposts
  http.get('/api/data/blog/BlogPosts', () => {
    try {
      return HttpResponse.json({ status: 200, data: BlogPost, msg: 'success' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'something went wrong' });
    }
  }),

  // Mock api endpoint to add post info
  http.post('/api/data/blog/post/add', async ({ request }) => {
    try {
      const { postId, comment } = (await request.json());
      const postIndex = BlogPost.findIndex((x) => x.id === postId);
      const post = BlogPost[postIndex];
      const cComments = post.comments || [];
      post.comments = [comment, ...cComments];
      return HttpResponse.json({
        status: 200,
        data: { posts: [...BlogPost] },
        msg: 'success',
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error,
      });
    }
  }),

  // Mock api endpoint to search blog posts
  http.get('/api/data/blog/search', ({ request }) => {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get('q')?.toLowerCase() || '';
      const category = url.searchParams.get('category');
      
      let filteredPosts = BlogPost;
      
      if (query) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
        );
      }
      
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      return HttpResponse.json({
        status: 200,
        data: filteredPosts,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error,
      });
    }
  }),

  // Mock api endpoint to get all categories
  http.get('/api/data/blog/categories', () => {
    try {
      const categories = [...new Set(BlogPost.map(post => post.category))];
      return HttpResponse.json({
        status: 200,
        data: categories,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error,
      });
    }
  }),

  // Mock api endpoint to get blog statistics
  http.get('/api/data/blog/stats', () => {
    try {
      const stats = {
        totalPosts: BlogPost.length,
        totalViews: BlogPost.reduce((sum, post) => sum + post.view, 0),
        totalShares: BlogPost.reduce((sum, post) => sum + post.share, 0),
        totalComments: BlogPost.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
        categoriesCount: [...new Set(BlogPost.map(post => post.category))].length,
        popularCategories: [...new Set(BlogPost.map(post => post.category))]
          .map(category => ({
            name: category,
            count: BlogPost.filter(post => post.category === category).length,
            totalViews: BlogPost.filter(post => post.category === category)
              .reduce((sum, post) => sum + post.view, 0)
          }))
          .sort((a, b) => b.totalViews - a.totalViews)
      };
      return HttpResponse.json({
        status: 200,
        data: stats,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error,
      });
    }
  }),
];
