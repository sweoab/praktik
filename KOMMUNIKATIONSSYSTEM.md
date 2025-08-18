# Kommunikationssystem för Praktikplatser

Detta kommunikationssystem har skapats för att förbättra kommunikationen mellan elever, handledare, lärare och företag under praktikperioder.

## 🚀 Funktioner

### 💬 **Chattfunktion**
- **Direktchatt** mellan elev och handledare
- **Gruppchatt** för alla praktikanter på samma företag
- **Klasschatt** för alla elever i samma klass
- **Realtidsmeddelanden** med lässtatus
- **Fildelning** i chattar
- **Emoji-stöd**

### 🔔 **Notifieringar & Påminnelser**
- **Mötespåminnelser** - automatiska notiser före schemalagda möten
- **Deadline-påminnelser** - för uppgifter och rapporter
- **Meddelandenotiser** - när nya meddelanden kommer
- **Dokumentdelning** - när någon delar ett dokument

### 📁 **Dokumentdelning**
- **Ladda upp** arbetsprover, rapporter, bilder
- **Organisering** med taggar och kategorier
- **Delning** med specifika användare eller grupper
- **Versionshantering** och nedladdningsstatistik
- **Sökfunktion** i dokument och beskrivningar

### 📅 **Möten & Kalender**
- **Schemalägg möten** mellan elev och handledare
- **Återkommande möten** (veckomöten, etc.)
- **Påminnelser** 1 timme och 15 minuter före möten
- **Platsangivelse** (fysisk plats eller videolänk)
- **Deltagarlista** och mötestyper

### 👥 **Kontakter & Användare**
- **Användarkatalog** med alla deltagare
- **Filterering** efter roll (elev, lärare, handledare)
- **Status** (online, borta, offline)
- **Direktkontakt** via meddelanden, telefon eller e-post

## 🏗️ Teknisk Arkitektur

### **Frontend Komponenter**
```
src/views/apps/communication/
├── Communication.jsx          # Huvudkomponent med tabs
├── ChatPanel.jsx             # Chattfunktionalitet
├── NotificationsPanel.jsx    # Notifieringar
├── DocumentsPanel.jsx        # Dokumenthantering
├── MeetingsPanel.jsx         # Möten och kalender
└── UsersPanel.jsx            # Användarkatalog
```

### **Context & State Management**
```
src/context/CommunicationContext/
└── index.jsx                 # React Context för kommunikation
```

### **API & Data**
```
src/api/communication/
└── communicationData.js      # Mock data och API handlers
```

### **Mock Data Strukturer**

#### **Användare**
```javascript
{
  id: 1,
  name: 'Anna Andersson',
  email: 'anna.andersson@skola.se',
  type: 'student', // student, teacher, company_mentor, supervisor
  avatar: '/path/to/avatar',
  status: 'online', // online, away, offline
  company: 'TechCorp AB',
  class: 'IT-23A'
}
```

#### **Konversationer**
```javascript
{
  id: 1,
  type: 'direct', // direct, group, class, company
  name: 'Anna & Maria (Handledning)',
  participants: [1, 3],
  lastActivity: '2024-01-15T10:30:00Z',
  unreadCount: 2,
  messages: [...]
}
```

#### **Meddelanden**
```javascript
{
  id: 'msg_123',
  senderId: 1,
  content: 'Hej! Hur går projektet?',
  timestamp: '2024-01-15T10:30:00Z',
  type: 'text', // text, file, image
  readBy: [1, 3]
}
```

#### **Notifieringar**
```javascript
{
  id: 'notif_123',
  userId: 1,
  type: 'meeting_reminder', // meeting_reminder, deadline_reminder, message, document_shared
  title: 'Möte med handledare imorgon',
  message: 'Du har ett schemalagt möte...',
  isRead: false,
  data: { meetingId: 'meeting_123' }
}
```

## 🛠️ Installation & Setup

1. **Installera beroenden** (om inte redan gjort):
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install date-fns
npm install swr
```

2. **Lägg till i routes** (`src/routes/Router.js`):
```javascript
const Communication = lazyLoad(() => import('../views/apps/communication/Communication'));

// I routes array:
{ path: '/apps/communication', element: <Communication /> }
```

3. **Uppdatera mock handlers** (`src/api/mocks/handlers/mockhandlers.js`):
```javascript
import { CommunicationHandlers } from '@/api/communication/communicationData';

export const mockHandlers = [
  // ... andra handlers
  ...CommunicationHandlers,
];
```

## 🔧 API Endpoints

### **Konversationer**
- `GET /api/communication/conversations/:userId` - Hämta användarens konversationer
- `GET /api/communication/conversations/:conversationId/messages` - Hämta meddelanden
- `POST /api/communication/conversations/:conversationId/messages` - Skicka meddelande

### **Notifieringar**
- `GET /api/communication/notifications/:userId` - Hämta notifieringar
- `PATCH /api/communication/notifications/:notificationId/read` - Markera som läst

### **Dokument**
- `GET /api/communication/documents/:userId` - Hämta delade dokument
- `POST /api/communication/documents/upload` - Ladda upp dokument

### **Möten**
- `GET /api/communication/meetings/:userId` - Hämta användarens möten
- `POST /api/communication/meetings` - Skapa nytt möte

### **Användare**
- `GET /api/communication/users` - Hämta alla användare (med filtrering)

## 🎨 Användargränssnitt

### **Huvuddashboard**
- **Statistikkort** med olästa notiser, kommande möten, aktiva chattar
- **Tabbar** för olika funktioner
- **Responsiv design** för mobil och desktop

### **Chattinterface**
- **Konversationslista** med sökfunktion
- **Meddelandevy** med bubblor och tidsstämplar
- **Direktkontakt** med telefon- och videoknappar

### **Notifieringspanel**
- **Kategoriserade notiser** (alla, olästa, möten, uppgifter)
- **Detaljvy** med mötesinfo och åtgärdsknappar
- **Markera som läst** funktionalitet

## 📱 Användarroller & Behörigheter

### **Elev (Student)**
- Chatta med handledare och klasskompisar
- Ta emot notiser om möten och deadlines
- Ladda upp arbetsprover och rapporter
- Se schemalagda möten

### **Handledare (Company Mentor)**
- Chatta med sina praktikanter
- Schemalägg möten
- Dela dokument och resurser
- Skicka påminnelser

### **Lärare (Teacher)**
- Kommunicera med hela klassen
- Skicka deadline-påminnelser
- Dela kursmaterial
- Övervaka praktikframsteg

## 🔄 Framtida Utveckling

### **Planerade Funktioner**
- **Video-/röstsamtal** integrerat i chatten
- **Skärmdelning** för handledningsmöten
- **Push-notifieringar** för mobila enheter
- **E-postintegration** för externa meddelanden
- **Kalendersynkronisering** med externa kalendrar
- **Automatiska rapporter** om praktikframsteg

### **Tekniska Förbättringar**
- **WebSocket** för realtidsmeddelanden
- **Offline-stöd** med caching
- **Bättre filhantering** med drag-and-drop
- **Avancerad sökning** med filter och sortering
- **Export-funktioner** för chattar och rapporter

## 📞 Support & Kontakt

För frågor eller support angående kommunikationssystemet, kontakta:
- **Teknisk support**: it-support@skola.se
- **Användarhandledning**: praktik-koordinator@skola.se

---

**Version**: 1.0.0  
**Skapad**: Augusti 2024  
**Senast uppdaterad**: Augusti 2024
