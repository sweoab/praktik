import { Chance } from 'chance';
import { sub, add } from 'date-fns';
import { uniqueId } from 'lodash';
import { http, HttpResponse } from 'msw';

// Import images
import user1 from '@/assets/images/profile/user-1.jpg';
import user2 from '@/assets/images/profile/user-2.jpg';
import user3 from '@/assets/images/profile/user-3.jpg';
import user4 from '@/assets/images/profile/user-4.jpg';
import user5 from '@/assets/images/profile/user-5.jpg';

// File type icons
import pdfIcon from '@/assets/images/chat/icon-adobe.svg';
import docIcon from '@/assets/images/chat/icon-chrome.svg';
import zipIcon from '@/assets/images/chat/icon-zip-folder.svg';
import imgIcon from '@/assets/images/chat/icon-figma.svg';

const chance = new Chance();

// User types for the system
const UserTypes = {
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  COMPANY_MENTOR: 'company_mentor',
  TEACHER: 'teacher'
};

// AI Reminder Types
const AIReminderTypes = {
  MEETING: 'meeting',
  DEADLINE: 'deadline',
  BREAK: 'break',
  FOCUS_TIME: 'focus_time',
  FOLLOW_UP: 'follow_up',
  PERSONAL: 'personal'
};

// AI Suggestion Categories
const AISuggestionCategories = {
  PRODUCTIVITY: 'productivity',
  COMMUNICATION: 'communication',
  WELLNESS: 'wellness',
  LEARNING: 'learning',
  WORKFLOW: 'workflow'
};

// Users in the system
export let Users = [
  {
    id: 1,
    name: 'Anna Andersson',
    email: 'anna.andersson@skola.se',
    type: UserTypes.STUDENT,
    avatar: user1,
    status: 'online',
    company: 'TechCorp AB',
    class: 'IT-23A',
    lastSeen: new Date(),
  },
  {
    id: 2,
    name: 'Erik Svensson',
    email: 'erik.svensson@skola.se',
    type: UserTypes.STUDENT,
    avatar: user2,
    status: 'offline',
    company: 'TechCorp AB',
    class: 'IT-23A',
    lastSeen: sub(new Date(), { hours: 2 }),
  },
  {
    id: 3,
    name: 'Maria Johansson',
    email: 'maria.johansson@techcorp.se',
    type: UserTypes.COMPANY_MENTOR,
    avatar: user3,
    status: 'online',
    company: 'TechCorp AB',
    department: 'Development',
    lastSeen: new Date(),
  },
  {
    id: 4,
    name: 'Lars Persson',
    email: 'lars.persson@skola.se',
    type: UserTypes.TEACHER,
    avatar: user4,
    status: 'away',
    school: 'Teknikskolan',
    subject: 'Programmering',
    lastSeen: sub(new Date(), { minutes: 15 }),
  },
  {
    id: 5,
    name: 'Sofia Nilsson',
    email: 'sofia.nilsson@skola.se',
    type: UserTypes.STUDENT,
    avatar: user5,
    status: 'online',
    company: 'DesignStudio AB',
    class: 'IT-23B',
    lastSeen: new Date(),
  }
];

// Chat conversations
export let Conversations = [
  {
    id: 1,
    type: 'direct', // direct, group, class, company
    name: 'Anna & Maria (Handledning)',
    participants: [1, 3], // Student and Company Mentor
    company: 'TechCorp AB',
    lastActivity: sub(new Date(), { minutes: 5 }),
    unreadCount: 2,
    isArchived: false,
    messages: [
      {
        id: uniqueId('msg_'),
        senderId: 3,
        content: 'Hej Anna! Hur går det med projektuppgiften?',
        timestamp: sub(new Date(), { hours: 2 }),
        type: 'text',
        readBy: [3],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 1,
        content: 'Hej Maria! Det går bra, jag håller på med API-integrationen just nu.',
        timestamp: sub(new Date(), { hours: 1, minutes: 45 }),
        type: 'text',
        readBy: [1, 3],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 3,
        content: 'Perfekt! Har du någon fråga om autentiseringen?',
        timestamp: sub(new Date(), { minutes: 30 }),
        type: 'text',
        readBy: [3],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 1,
        content: 'Ja, jag undrar över JWT-tokens. Kan vi ta det på morgondagens möte?',
        timestamp: sub(new Date(), { minutes: 5 }),
        type: 'text',
        readBy: [1],
        editedAt: null,
      }
    ]
  },
  {
    id: 2,
    type: 'group',
    name: 'TechCorp Praktikanter 2024',
    participants: [1, 2, 3], // Students + Company Mentor
    company: 'TechCorp AB',
    lastActivity: sub(new Date(), { hours: 1 }),
    unreadCount: 0,
    isArchived: false,
    messages: [
      {
        id: uniqueId('msg_'),
        senderId: 3,
        content: 'Välkomna alla! Här kan vi diskutera gemensamma frågor och hjälpa varandra.',
        timestamp: sub(new Date(), { days: 1 }),
        type: 'text',
        readBy: [1, 2, 3],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 1,
        content: 'Tack Maria! Ser fram emot samarbetet.',
        timestamp: sub(new Date(), { days: 1, minutes: -10 }),
        type: 'text',
        readBy: [1, 2, 3],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 2,
        content: 'Samma här! Någon som har erfarenhet av React?',
        timestamp: sub(new Date(), { hours: 2 }),
        type: 'text',
        readBy: [1, 2, 3],
        editedAt: null,
      }
    ]
  },
  {
    id: 3,
    type: 'class',
    name: 'IT-23A Klasschatt',
    participants: [1, 2, 4], // Students + Teacher
    class: 'IT-23A',
    lastActivity: sub(new Date(), { hours: 3 }),
    unreadCount: 1,
    isArchived: false,
    messages: [
      {
        id: uniqueId('msg_'),
        senderId: 4,
        content: 'Påminnelse: Praktikrapport ska lämnas in senast fredag!',
        timestamp: sub(new Date(), { hours: 4 }),
        type: 'text',
        readBy: [4, 1],
        editedAt: null,
      },
      {
        id: uniqueId('msg_'),
        senderId: 1,
        content: 'Tack för påminnelsen Lars!',
        timestamp: sub(new Date(), { hours: 3 }),
        type: 'text',
        readBy: [1, 4],
        editedAt: null,
      }
    ]
  }
];

// Notifications
export let Notifications = [
  {
    id: uniqueId('notif_'),
    userId: 1,
    type: 'meeting_reminder',
    title: 'Möte med handledare imorgon',
    message: 'Du har ett schemalagt möte med Maria Johansson kl 14:00',
    timestamp: sub(new Date(), { minutes: 30 }),
    isRead: false,
    isArchived: false,
    data: {
      meetingId: 'meeting_123',
      time: add(new Date(), { days: 1, hours: 14 }),
      location: 'TechCorp konferensrum A'
    }
  },
  {
    id: uniqueId('notif_'),
    userId: 1,
    type: 'deadline_reminder',
    title: 'Praktikrapport deadline',
    message: 'Glöm inte att lämna in din praktikrapport senast fredag',
    timestamp: sub(new Date(), { hours: 2 }),
    isRead: false,
    isArchived: false,
    data: {
      deadline: add(new Date(), { days: 3 }),
      taskType: 'report'
    }
  },
  {
    id: uniqueId('notif_'),
    userId: 1,
    type: 'message',
    title: 'Nytt meddelande från Maria',
    message: 'Perfekt! Har du någon fråga om autentiseringen?',
    timestamp: sub(new Date(), { minutes: 30 }),
    isRead: true,
    isArchived: false,
    data: {
      conversationId: 1,
      senderId: 3
    }
  },
  {
    id: uniqueId('notif_'),
    userId: 1,
    type: 'document_shared',
    title: 'Dokument delat',
    message: 'Maria har delat "API Dokumentation v2.pdf" med dig',
    timestamp: sub(new Date(), { hours: 1 }),
    isRead: false,
    isArchived: false,
    data: {
      documentId: 'doc_123',
      sharedBy: 3,
      fileName: 'API Dokumentation v2.pdf'
    }
  }
];

// Shared documents
export let SharedDocuments = [
  {
    id: uniqueId('doc_'),
    name: 'Praktikrapport_mall.docx',
    type: 'document',
    size: '2.1 MB',
    icon: docIcon,
    uploadedBy: 4, // Teacher
    uploadedAt: sub(new Date(), { days: 2 }),
    sharedWith: [1, 2, 5], // All students
    description: 'Mall för praktikrapport som ska lämnas in',
    downloadCount: 5,
    isPublic: false,
    tags: ['mall', 'rapport', 'praktik']
  },
  {
    id: uniqueId('doc_'),
    name: 'Företagspresentation_TechCorp.pdf',
    type: 'pdf',
    size: '5.7 MB',
    icon: pdfIcon,
    uploadedBy: 3, // Company Mentor
    uploadedAt: sub(new Date(), { days: 1 }),
    sharedWith: [1, 2], // Students at TechCorp
    description: 'Introduktion till företaget och våra projekt',
    downloadCount: 3,
    isPublic: false,
    tags: ['företag', 'introduktion', 'TechCorp']
  },
  {
    id: uniqueId('doc_'),
    name: 'Projektplan_Vecka1.png',
    type: 'image',
    size: '1.2 MB',
    icon: imgIcon,
    uploadedBy: 1, // Student
    uploadedAt: sub(new Date(), { hours: 5 }),
    sharedWith: [3], // Company Mentor
    description: 'Skiss över projektplan för första veckan',
    downloadCount: 1,
    isPublic: false,
    tags: ['projektplan', 'vecka1', 'skiss']
  },
  {
    id: uniqueId('doc_'),
    name: 'Kodbas_exempel.zip',
    type: 'archive',
    size: '12.3 MB',
    icon: zipIcon,
    uploadedBy: 3, // Company Mentor
    uploadedAt: sub(new Date(), { hours: 3 }),
    sharedWith: [1, 2], // Students
    description: 'Exempel på kodstruktur för React-projekt',
    downloadCount: 2,
    isPublic: false,
    tags: ['kod', 'exempel', 'react', 'struktur']
  }
];

// Meetings/Events
export let Meetings = [
  {
    id: uniqueId('meeting_'),
    title: 'Veckomöte med handledare',
    description: 'Genomgång av veckan och planering framåt',
    startTime: add(new Date(), { days: 1, hours: 14 }),
    endTime: add(new Date(), { days: 1, hours: 15 }),
    participants: [1, 3], // Student and Company Mentor
    location: 'TechCorp konferensrum A',
    type: 'supervision',
    isRecurring: true,
    recurringPattern: 'weekly',
    createdBy: 3,
    reminders: [
      { time: 'PT1H', sent: false }, // 1 hour before
      { time: 'PT15M', sent: false } // 15 minutes before
    ]
  },
  {
    id: uniqueId('meeting_'),
    title: 'Projektpresentation',
    description: 'Presentation av slutprojekt för alla praktikanter',
    startTime: add(new Date(), { days: 7, hours: 13 }),
    endTime: add(new Date(), { days: 7, hours: 16 }),
    participants: [1, 2, 3, 4, 5],
    location: 'Skolan, Stora aulan',
    type: 'presentation',
    isRecurring: false,
    createdBy: 4,
    reminders: [
      { time: 'P1D', sent: false }, // 1 day before
      { time: 'PT2H', sent: false } // 2 hours before
    ]
  }
];

// API Handlers for Communication System
export const CommunicationHandlers = [
  // Get all conversations for a user
  http.get('/api/communication/conversations/:userId', ({ params }) => {
    try {
      const userId = parseInt(params.userId);
      const userConversations = Conversations.filter(conv => 
        conv.participants.includes(userId)
      ).map(conv => ({
        ...conv,
        participants: conv.participants.map(id => 
          Users.find(user => user.id === id)
        )
      }));
      
      return HttpResponse.json({
        status: 200,
        data: userConversations,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Get messages for a conversation
  http.get('/api/communication/conversations/:conversationId/messages', ({ params }) => {
    try {
      const conversationId = parseInt(params.conversationId);
      const conversation = Conversations.find(conv => conv.id === conversationId);
      
      if (!conversation) {
        return HttpResponse.json({
          status: 404,
          msg: 'Conversation not found'
        });
      }

      return HttpResponse.json({
        status: 200,
        data: conversation.messages,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Send a message
  http.post('/api/communication/conversations/:conversationId/messages', async ({ params, request }) => {
    try {
      const conversationId = parseInt(params.conversationId);
      const { senderId, content, type = 'text' } = await request.json();
      
      const conversation = Conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        return HttpResponse.json({
          status: 404,
          msg: 'Conversation not found'
        });
      }

      const newMessage = {
        id: uniqueId('msg_'),
        senderId,
        content,
        timestamp: new Date(),
        type,
        readBy: [senderId],
        editedAt: null
      };

      conversation.messages.push(newMessage);
      conversation.lastActivity = new Date();
      
      // Update unread count for other participants
      conversation.participants.forEach(participantId => {
        if (participantId !== senderId) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        }
      });

      return HttpResponse.json({
        status: 200,
        data: newMessage,
        msg: 'Message sent successfully'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Get notifications for a user
  http.get('/api/communication/notifications/:userId', ({ params }) => {
    try {
      const userId = parseInt(params.userId);
      const userNotifications = Notifications.filter(notif => 
        notif.userId === userId && !notif.isArchived
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return HttpResponse.json({
        status: 200,
        data: userNotifications,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Mark notification as read
  http.patch('/api/communication/notifications/:notificationId/read', ({ params }) => {
    try {
      const notificationId = params.notificationId;
      const notification = Notifications.find(notif => notif.id === notificationId);
      
      if (!notification) {
        return HttpResponse.json({
          status: 404,
          msg: 'Notification not found'
        });
      }

      notification.isRead = true;

      return HttpResponse.json({
        status: 200,
        data: notification,
        msg: 'Notification marked as read'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Get shared documents
  http.get('/api/communication/documents/:userId', ({ params }) => {
    try {
      const userId = parseInt(params.userId);
      const userDocuments = SharedDocuments.filter(doc => 
        doc.sharedWith.includes(userId) || doc.uploadedBy === userId || doc.isPublic
      ).map(doc => ({
        ...doc,
        uploadedBy: Users.find(user => user.id === doc.uploadedBy)
      }));

      return HttpResponse.json({
        status: 200,
        data: userDocuments,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Upload a document
  http.post('/api/communication/documents/upload', async ({ request }) => {
    try {
      const { name, type, size, uploadedBy, sharedWith, description, tags } = await request.json();
      
      const newDocument = {
        id: uniqueId('doc_'),
        name,
        type,
        size,
        icon: getIconForFileType(type),
        uploadedBy,
        uploadedAt: new Date(),
        sharedWith: sharedWith || [],
        description: description || '',
        downloadCount: 0,
        isPublic: false,
        tags: tags || []
      };

      SharedDocuments.push(newDocument);

      return HttpResponse.json({
        status: 200,
        data: newDocument,
        msg: 'Document uploaded successfully'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Get meetings for a user
  http.get('/api/communication/meetings/:userId', ({ params }) => {
    try {
      const userId = parseInt(params.userId);
      const userMeetings = Meetings.filter(meeting => 
        meeting.participants.includes(userId)
      ).map(meeting => ({
        ...meeting,
        participants: meeting.participants.map(id => 
          Users.find(user => user.id === id)
        ),
        createdBy: Users.find(user => user.id === meeting.createdBy)
      }));

      return HttpResponse.json({
        status: 200,
        data: userMeetings,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Create a new meeting
  http.post('/api/communication/meetings', async ({ request }) => {
    try {
      const meetingData = await request.json();
      
      const newMeeting = {
        id: uniqueId('meeting_'),
        ...meetingData,
        reminders: meetingData.reminders || [
          { time: 'PT1H', sent: false },
          { time: 'PT15M', sent: false }
        ]
      };

      Meetings.push(newMeeting);

      return HttpResponse.json({
        status: 200,
        data: newMeeting,
        msg: 'Meeting created successfully'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // Get users (for chat participant selection)
  http.get('/api/communication/users', ({ request }) => {
    try {
      const url = new URL(request.url);
      const type = url.searchParams.get('type');
      const company = url.searchParams.get('company');
      const class_ = url.searchParams.get('class');
      
      let filteredUsers = Users;
      
      if (type) {
        filteredUsers = filteredUsers.filter(user => user.type === type);
      }
      
      if (company) {
        filteredUsers = filteredUsers.filter(user => user.company === company);
      }
      
      if (class_) {
        filteredUsers = filteredUsers.filter(user => user.class === class_);
      }

      return HttpResponse.json({
        status: 200,
        data: filteredUsers,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error
      });
    }
  }),

  // AI Assistant Endpoints
  
  // Get AI reminders
  http.get('/api/communication/ai/reminders/:userId', ({ params }) => {
    try {
      const { userId } = params;
      
      const aiReminders = [
        {
          id: 1,
          title: 'Förbered presentation för kund',
          description: 'Glöm inte att förbereda slides för kundmötet imorgon.',
          dueDate: add(new Date(), { days: 1, hours: 9 }),
          priority: 'high',
          category: AIReminderTypes.MEETING,
          aiGenerated: true,
          userId: parseInt(userId),
          isActive: true,
          createdAt: sub(new Date(), { hours: 2 }),
          confidence: 0.95
        },
        {
          id: 2,
          title: 'Veckorapport deadline',
          description: 'Deadline för veckorapport är på fredag kl 17:00.',
          dueDate: add(new Date(), { days: 3, hours: 17 }),
          priority: 'medium',
          category: AIReminderTypes.DEADLINE,
          aiGenerated: true,
          userId: parseInt(userId),
          isActive: true,
          createdAt: sub(new Date(), { hours: 5 }),
          confidence: 0.87
        },
        {
          id: 3,
          title: 'Dags för en paus',
          description: 'Du har arbetat intensivt i 2 timmar. En kort paus kan öka produktiviteten.',
          dueDate: new Date(),
          priority: 'low',
          category: AIReminderTypes.BREAK,
          aiGenerated: true,
          userId: parseInt(userId),
          isActive: true,
          createdAt: sub(new Date(), { minutes: 15 }),
          confidence: 0.72
        }
      ];

      return HttpResponse.json({
        status: 200,
        data: aiReminders,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to fetch AI reminders',
        error
      });
    }
  }),

  // Create AI reminder
  http.post('/api/communication/ai/reminders', async ({ request }) => {
    try {
      const reminderData = await request.json();
      
      const newReminder = {
        id: Date.now(),
        ...reminderData,
        aiGenerated: false,
        isActive: true,
        createdAt: new Date(),
        confidence: 1.0
      };

      return HttpResponse.json({
        status: 200,
        data: newReminder,
        msg: 'AI reminder created successfully'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to create AI reminder',
        error
      });
    }
  }),

  // Get AI workflow analysis
  http.get('/api/communication/ai/workflow-analysis/:userId', ({ params }) => {
    try {
      const { userId } = params;
      
      const workflowAnalysis = {
        id: 1,
        userId: parseInt(userId),
        period: 'weekly',
        generatedAt: new Date(),
        summary: 'Din produktivitet har ökat med 15% denna vecka jämfört med förra veckan.',
        metrics: {
          totalWorkHours: 37.5,
          focusTime: 22.3,
          meetingTime: 8.7,
          breakTime: 6.5,
          interruptionCount: 12,
          taskCompletionRate: 0.87,
          averageResponseTime: 2.3 // hours
        },
        insights: [
          {
            type: 'positive',
            title: 'Förbättrad fokustid',
            description: 'Du har ökat din sammanhängande fokustid med 25% denna vecka.',
            impact: 'high'
          },
          {
            type: 'neutral',
            title: 'Mötesbalans',
            description: 'Dina möten är jämnt fördelade över veckan, vilket är bra för arbetsflödet.',
            impact: 'medium'
          },
          {
            type: 'improvement',
            title: 'Pausfrekvens',
            description: 'Du skulle kunna dra nytta av fler korta pauser för optimal prestanda.',
            impact: 'medium'
          }
        ],
        suggestions: [
          {
            id: 1,
            title: 'Optimera mötestider',
            description: 'Flytta rutinmöten till eftermiddagar för bättre fokus på morgonen.',
            category: AISuggestionCategories.PRODUCTIVITY,
            priority: 'medium',
            estimatedImpact: 'high',
            effort: 'low'
          },
          {
            id: 2,
            title: 'Implementera Pomodoro-teknik',
            description: 'Använd 25-minuters fokussessioner med 5-minuters pauser.',
            category: AISuggestionCategories.WELLNESS,
            priority: 'high',
            estimatedImpact: 'medium',
            effort: 'low'
          },
          {
            id: 3,
            title: 'Sammanfattningsnotiser',
            description: 'Få dagliga sammanfattningar istället för ständiga avbrott.',
            category: AISuggestionCategories.COMMUNICATION,
            priority: 'low',
            estimatedImpact: 'high',
            effort: 'medium'
          }
        ],
        overallScore: 78,
        previousScore: 68,
        trend: 'improving'
      };

      return HttpResponse.json({
        status: 200,
        data: workflowAnalysis,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to fetch workflow analysis',
        error
      });
    }
  }),

  // Get AI suggestions
  http.get('/api/communication/ai/suggestions/:userId', ({ params }) => {
    try {
      const { userId } = params;
      
      const aiSuggestions = [
        {
          id: 1,
          title: 'Smart kalenderblockning',
          description: 'Blockera 2-timmar för djuparbete varje förmiddag baserat på dina produktivitetsmönster.',
          category: AISuggestionCategories.PRODUCTIVITY,
          priority: 'high',
          confidence: 0.92,
          estimatedImpact: 'high',
          effort: 'low',
          userId: parseInt(userId),
          createdAt: sub(new Date(), { hours: 1 }),
          isApplied: false,
          applicableAt: add(new Date(), { days: 1 })
        },
        {
          id: 2,
          title: 'Automatisera statusuppdateringar',
          description: 'Skapa mallar för vanliga statusuppdateringar till din handledare.',
          category: AISuggestionCategories.COMMUNICATION,
          priority: 'medium',
          confidence: 0.85,
          estimatedImpact: 'medium',
          effort: 'medium',
          userId: parseInt(userId),
          createdAt: sub(new Date(), { hours: 3 }),
          isApplied: false,
          applicableAt: new Date()
        },
        {
          id: 3,
          title: 'Lärande-momentum',
          description: 'Baserat på din framgång med React, föreslår vi att du utforskar TypeScript nästa.',
          category: AISuggestionCategories.LEARNING,
          priority: 'low',
          confidence: 0.78,
          estimatedImpact: 'high',
          effort: 'high',
          userId: parseInt(userId),
          createdAt: sub(new Date(), { days: 1 }),
          isApplied: false,
          applicableAt: add(new Date(), { weeks: 1 })
        }
      ];

      return HttpResponse.json({
        status: 200,
        data: aiSuggestions,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to fetch AI suggestions',
        error
      });
    }
  }),

  // Generate smart notification
  http.post('/api/communication/ai/smart-notification', async ({ request }) => {
    try {
      const notificationData = await request.json();
      
      const smartNotification = {
        id: Date.now(),
        type: 'ai_smart',
        title: notificationData.title,
        message: notificationData.message,
        timestamp: new Date(),
        isRead: false,
        aiGenerated: true,
        context: notificationData.category || 'general',
        priority: notificationData.priority || 'medium',
        confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
        actionable: true,
        actions: [
          {
            id: 1,
            label: 'Visa detaljer',
            type: 'view_details'
          },
          {
            id: 2,
            label: 'Skapa påminnelse',
            type: 'create_reminder'
          }
        ]
      };

      return HttpResponse.json({
        status: 200,
        data: smartNotification,
        msg: 'Smart notification generated successfully'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to generate smart notification',
        error
      });
    }
  }),

  // AI Chat endpoint (simulated AI responses)
  http.post('/api/communication/ai/chat', async ({ request }) => {
    try {
      const { message, context } = await request.json();
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate contextual AI response
      const aiResponse = generateAIResponse(message, context);
      
      return HttpResponse.json({
        status: 200,
        data: aiResponse,
        msg: 'success'
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'failed to process AI chat',
        error
      });
    }
  })
];

// Helper function to get icon for file type
function getIconForFileType(type) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return pdfIcon;
    case 'document':
    case 'doc':
    case 'docx':
      return docIcon;
    case 'image':
    case 'png':
    case 'jpg':
    case 'jpeg':
      return imgIcon;
    case 'archive':
    case 'zip':
    case 'rar':
      return zipIcon;
    default:
      return docIcon;
  }
}

// Helper function to generate AI responses
function generateAIResponse(message, context = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Pattern matching for different types of requests
  if (lowerMessage.includes('påminnelse') || lowerMessage.includes('reminder')) {
    return {
      content: 'Jag hjälper dig skapa en påminnelse. Vad vill du bli påmind om och när?',
      type: 'reminder_help',
      confidence: 0.95,
      actions: ['show_reminder_dialog'],
      suggestions: ['Imorgon kl 09:00', 'Nästa vecka', 'Om en timme', 'Anpassad tid']
    };
  }
  
  if (lowerMessage.includes('schema') || lowerMessage.includes('planera') || lowerMessage.includes('calendar')) {
    return {
      content: 'Baserat på ditt schema ser jag att du har:\n• Möte med handledare kl 10:00\n• Deadline för projektrapport på fredag\n• Ledig tid mellan 14:00-16:00 för fokusarbete\n\nVill du att jag hjälper dig optimera din dag?',
      type: 'schedule_analysis',
      confidence: 0.88,
      suggestions: ['Optimera schema', 'Blockera fokustid', 'Påminn om möte', 'Visa hela veckan']
    };
  }
  
  if (lowerMessage.includes('analys') || lowerMessage.includes('produktivitet') || lowerMessage.includes('arbetsfloede')) {
    return {
      content: 'Din senaste analys visar:\n• 15% ökning i produktivitet\n• Bästa fokustid: 09:00-11:00\n• Genomsnittlig svarstid: 2,3 timmar\n• 87% slutförda uppgifter\n\nVill du se detaljerade förslag för förbättringar?',
      type: 'productivity_analysis',
      confidence: 0.92,
      suggestions: ['Visa detaljerad rapport', 'Optimera arbetsflöde', 'Sätt nya mål', 'Jämför med förra veckan']
    };
  }
  
  if (lowerMessage.includes('hjälp') || lowerMessage.includes('help')) {
    return {
      content: 'Jag kan hjälpa dig med:\n• Skapa smarta påminnelser och notiser\n• Analysera ditt arbetsflöde och produktivitet\n• Optimera din kalender och schemaläggning\n• Ge personliga förslag för förbättringar\n• Övervaka deadlines och viktiga uppgifter\n\nVad vill du börja med?',
      type: 'help_overview',
      confidence: 1.0,
      suggestions: ['Skapa påminnelse', 'Analysera arbetsflöde', 'Optimera schema', 'Visa tips']
    };
  }
  
  if (lowerMessage.includes('fokus') || lowerMessage.includes('concentration')) {
    return {
      content: 'För bättre fokus föreslår jag:\n• Blockera 2-timmars fokussessioner på förmiddagen\n• Använd Pomodoro-teknik (25 min arbete, 5 min paus)\n• Stäng av notifikationer under fokustid\n• Planera kreativa uppgifter när du är mest alert\n\nVill du att jag skapar en fokusplan för dig?',
      type: 'focus_advice',
      confidence: 0.87,
      suggestions: ['Skapa fokusplan', 'Blockera kalendertid', 'Sätt upp Do Not Disturb', 'Visa fokusstatistik']
    };
  }
  
  // Default response for unmatched queries
  return {
    content: 'Jag förstår din fråga. Som din AI-assistent kan jag hjälpa dig med produktivitet, schemaläggning, påminnelser och arbetsflödesoptimering. Kan du förtydliga vad du behöver hjälp med?',
    type: 'general_response',
    confidence: 0.65,
    suggestions: [
      'Skapa påminnelse',
      'Analysera produktivitet', 
      'Optimera schema',
      'Visa hjälp'
    ]
  };
}

export { UserTypes, AIReminderTypes, AISuggestionCategories };
