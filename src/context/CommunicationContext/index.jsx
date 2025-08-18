import { createContext, useState, useEffect, useContext } from 'react';
import React from "react";
import useSWR from 'swr';
import { getFetcher, postFetcher } from '@/api/globalFetcher';

// Create context with default values
export const CommunicationContext = createContext({
    // Chat related
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoadingMessages: false,
    
    // Notifications
    notifications: [],
    unreadNotifications: 0,
    
    // Documents
    documents: [],
    
    // Meetings
    meetings: [],
    upcomingMeetings: [],
    
    // Users
    users: [],
    currentUser: null,
    
    // AI Assistant
    aiAssistant: {
        isActive: false,
        reminders: [],
        suggestions: [],
        workflowAnalysis: null,
        chatHistory: []
    },
    
    // Actions
    setActiveConversation: () => {},
    sendMessage: () => {},
    markNotificationAsRead: () => {},
    uploadDocument: () => {},
    createMeeting: () => {},
    refreshData: () => {},
    
    // AI Actions
    createAIReminder: () => {},
    analyzeWorkflow: () => {},
    getAISuggestions: () => {},
    generateSmartNotification: () => {},
    
    // Loading states
    isLoading: true,
    error: null
});

// CommunicationProvider component
export const CommunicationProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser] = useState({ id: 1 }); // Mock current user - skulle komma från AuthContext
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // AI Assistant state
    const [aiReminders, setAiReminders] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [workflowAnalysis, setWorkflowAnalysis] = useState(null);
    const [aiChatHistory, setAiChatHistory] = useState([]);

    // Fetch conversations
    const { data: conversationsData, error: conversationsError } = useSWR(
        currentUser ? `/api/communication/conversations/${currentUser.id}` : null,
        getFetcher
    );

    // Fetch notifications
    const { data: notificationsData, error: notificationsError } = useSWR(
        currentUser ? `/api/communication/notifications/${currentUser.id}` : null,
        getFetcher
    );

    // Fetch documents
    const { data: documentsData, error: documentsError } = useSWR(
        currentUser ? `/api/communication/documents/${currentUser.id}` : null,
        getFetcher
    );

    // Fetch meetings
    const { data: meetingsData, error: meetingsError } = useSWR(
        currentUser ? `/api/communication/meetings/${currentUser.id}` : null,
        getFetcher
    );

    // Fetch users
    const { data: usersData, error: usersError } = useSWR(
        '/api/communication/users',
        getFetcher
    );

    // Fetch messages for active conversation
    const { data: messagesData, error: messagesError } = useSWR(
        activeConversation ? `/api/communication/conversations/${activeConversation.id}/messages` : null,
        getFetcher
    );

    // Update state when data changes
    useEffect(() => {
        if (conversationsData) {
            setConversations(conversationsData.data || []);
        }
        if (conversationsError) {
            setError(conversationsError);
        }
    }, [conversationsData, conversationsError]);

    useEffect(() => {
        if (notificationsData) {
            setNotifications(notificationsData.data || []);
        }
        if (notificationsError) {
            setError(notificationsError);
        }
    }, [notificationsData, notificationsError]);

    useEffect(() => {
        if (documentsData) {
            setDocuments(documentsData.data || []);
        }
        if (documentsError) {
            setError(documentsError);
        }
    }, [documentsData, documentsError]);

    useEffect(() => {
        if (meetingsData) {
            setMeetings(meetingsData.data || []);
        }
        if (meetingsError) {
            setError(meetingsError);
        }
    }, [meetingsData, meetingsError]);

    useEffect(() => {
        if (usersData) {
            setUsers(usersData.data || []);
        }
        if (usersError) {
            setError(usersError);
        }
    }, [usersData, usersError]);

    useEffect(() => {
        setIsLoadingMessages(true);
        if (messagesData) {
            setMessages(messagesData.data || []);
            setIsLoadingMessages(false);
        }
        if (messagesError) {
            setError(messagesError);
            setIsLoadingMessages(false);
        }
    }, [messagesData, messagesError]);

    useEffect(() => {
        // Set loading to false when we have basic data
        if (conversationsData && notificationsData && usersData) {
            setIsLoading(false);
        }
    }, [conversationsData, notificationsData, usersData]);

    // Send a message
    const sendMessage = async (content, type = 'text') => {
        if (!activeConversation || !currentUser) return;

        try {
            const messageData = {
                senderId: currentUser.id,
                content,
                type
            };

            const response = await postFetcher(
                `/api/communication/conversations/${activeConversation.id}/messages`,
                messageData
            );

            if (response.status === 200) {
                // Add message to local state immediately for better UX
                const newMessage = response.data;
                setMessages(prevMessages => [...prevMessages, newMessage]);
                
                // Update conversation's last activity
                setConversations(prevConversations => 
                    prevConversations.map(conv => 
                        conv.id === activeConversation.id 
                            ? { ...conv, lastActivity: new Date() }
                            : conv
                    )
                );
                
                return newMessage;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setError(error);
        }
    };

    // Mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            await postFetcher(`/api/communication/notifications/${notificationId}/read`, {});
            
            // Update local state
            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            setError(error);
        }
    };

    // Upload document
    const uploadDocument = async (documentData) => {
        try {
            const response = await postFetcher('/api/communication/documents/upload', documentData);
            
            if (response.status === 200) {
                // Add document to local state
                setDocuments(prevDocs => [response.data, ...prevDocs]);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
            setError(error);
        }
    };

    // Create meeting
    const createMeeting = async (meetingData) => {
        try {
            const response = await postFetcher('/api/communication/meetings', meetingData);
            
            if (response.status === 200) {
                // Add meeting to local state
                setMeetings(prevMeetings => [response.data, ...prevMeetings]);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to create meeting:', error);
            setError(error);
        }
    };

    // Refresh all data
    const refreshData = () => {
        // This would trigger a re-fetch of all SWR data
        // In a real app, you might use mutate from SWR
        window.location.reload(); // Simple refresh for now
    };

    // AI Assistant Functions
    const createAIReminder = async (reminderData) => {
        try {
            const reminder = {
                id: Date.now(),
                ...reminderData,
                createdAt: new Date(),
                isActive: true,
                aiGenerated: false
            };
            
            setAiReminders(prevReminders => [...prevReminders, reminder]);
            
            // Create a notification for the reminder
            const notification = {
                id: Date.now() + 1,
                type: 'ai_reminder',
                title: `Påminnelse: ${reminder.title}`,
                message: reminder.description,
                timestamp: new Date(),
                isRead: false,
                priority: reminder.priority,
                scheduledFor: reminder.dueDate
            };
            
            setNotifications(prevNotifications => [notification, ...prevNotifications]);
            
            return reminder;
        } catch (error) {
            console.error('Failed to create AI reminder:', error);
            setError(error);
        }
    };

    const analyzeWorkflow = async () => {
        try {
            // Simulate AI workflow analysis
            const analysis = {
                summary: "Du har varit mest aktiv på förmiddagarna den här veckan. Dina produktivaste timmar är 09:00-11:00.",
                insights: [
                    "83% av dina möten sker på förmiddagen",
                    "Du får flest notifieringar mellan 13:00-15:00",
                    "Genomsnittlig svarstid på meddelanden: 2.5 timmar"
                ],
                suggestions: [
                    "Blockera tid för djuparbete på eftermiddagarna",
                    "Schemalägg viktiga möten före lunch",
                    "Aktivera sammanfattningsnotiser för att minska avbrott"
                ],
                efficiency: 78,
                timestamp: new Date()
            };
            
            setWorkflowAnalysis(analysis);
            return analysis;
        } catch (error) {
            console.error('Failed to analyze workflow:', error);
            setError(error);
        }
    };

    const getAISuggestions = async () => {
        try {
            // Generate personalized suggestions based on user patterns
            const suggestions = [
                {
                    id: 1,
                    title: "Optimera mötestider",
                    description: "Flytta rutinmöten till eftermiddagar för bättre fokus på morgonen",
                    category: "productivity",
                    priority: "medium",
                    impact: "high"
                },
                {
                    id: 2,
                    title: "Automatiska påminnelser",
                    description: "Aktivera smarta påminnelser 15 min före viktiga deadlines",
                    category: "automation",
                    priority: "high",
                    impact: "medium"
                },
                {
                    id: 3,
                    title: "Sammanfattningsnotiser",
                    description: "Få dagliga sammanfattningar istället för ständiga avbrott",
                    category: "communication",
                    priority: "low",
                    impact: "high"
                }
            ];
            
            setAiSuggestions(suggestions);
            return suggestions;
        } catch (error) {
            console.error('Failed to get AI suggestions:', error);
            setError(error);
        }
    };

    const generateSmartNotification = async (context) => {
        try {
            // Generate contextual notifications based on user behavior and schedule
            const smartNotification = {
                id: Date.now(),
                type: 'ai_smart',
                title: context.title || 'Smart påminnelse',
                message: context.message,
                timestamp: new Date(),
                isRead: false,
                aiGenerated: true,
                context: context.category || 'general',
                priority: context.priority || 'medium'
            };
            
            setNotifications(prevNotifications => [smartNotification, ...prevNotifications]);
            return smartNotification;
        } catch (error) {
            console.error('Failed to generate smart notification:', error);
            setError(error);
        }
    };

    // AI Assistant object
    const aiAssistant = {
        isActive: true,
        reminders: aiReminders,
        suggestions: aiSuggestions,
        workflowAnalysis,
        chatHistory: aiChatHistory,
        loadData: async () => ({
            reminders: aiReminders,
            suggestions: aiSuggestions,
            workflowAnalysis
        })
    };

    // Computed values
    const unreadNotifications = notifications.filter(notif => !notif.isRead).length;
    
    const upcomingMeetings = meetings
        .filter(meeting => new Date(meeting.startTime) > new Date())
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 5); // Next 5 meetings

    const value = {
        // Data
        conversations,
        activeConversation,
        messages,
        isLoadingMessages,
        notifications,
        unreadNotifications,
        documents,
        meetings,
        upcomingMeetings,
        users,
        currentUser,
        
        // AI Assistant
        aiAssistant,
        
        // Actions
        setActiveConversation,
        sendMessage,
        markNotificationAsRead,
        uploadDocument,
        createMeeting,
        refreshData,
        
        // AI Actions
        createAIReminder,
        analyzeWorkflow,
        getAISuggestions,
        generateSmartNotification,
        
        // States
        isLoading,
        error
    };

    return (
        <CommunicationContext.Provider value={value}>
            {children}
        </CommunicationContext.Provider>
    );
};

// Custom hook to use communication context
export const useCommunication = () => {
    const context = useContext(CommunicationContext);
    if (context === undefined) {
        throw new Error('useCommunication must be used within a CommunicationProvider');
    }
    return context;
};

export default CommunicationContext;
