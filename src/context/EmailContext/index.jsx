"use client"
import React, { createContext, useState, useEffect } from 'react';
import { deleteFetcher, getFetcher, putFetcher } from '@/api/globalFetcher';


const initialEmailContext = {
    emails: [],
    selectedEmail: null,
    filter: 'inbox',
    searchQuery: '',
    loading: true,
    error: null,
    setSelectedEmail: () => { },
    deleteEmail: () => { },
    toggleStar: () => { },
    toggleImportant: () => { },
    setFilter: () => { },
    setSearchQuery: () => { },
    setEmails: () => { },
    refreshEmails: () => { },
};

export const EmailContext = createContext(initialEmailContext);

export const EmailContextProvider = ({ children }) => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [filter, setFilter] = useState('inbox');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load emails from backend
    const loadEmails = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await getFetcher('/api/email');
            
            if (response.status === 200) {
                setEmails(response.data);
                
                // Set first email as selected if none selected
                if (response.data.length > 0 && !selectedEmail) {
                    setSelectedEmail(response.data[0]);
                }
            } else {
                setError(response.message || 'Failed to load emails');
            }
        } catch (error) {
            console.error('Error loading emails:', error);
            setError('Failed to connect to email service');
        } finally {
            setLoading(false);
        }
    };

    // Refresh emails function
    const refreshEmails = () => {
        loadEmails();
    };

    // Load emails on component mount
    useEffect(() => {
        loadEmails();
    }, []);

    // Send new email
    const sendEmail = async (to, subject, message) => {
        try {
            const response = await postFetcher('/api/email/send', {
                to,
                subject,
                message
            });

            if (response.status === 201) {
                // Add the new email to the state
                setEmails(prevEmails => [response.data, ...prevEmails]);
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.message || 'Failed to send email' };
            }
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: 'Failed to send email' };
        }
    };

    // Delete email
    const deleteEmail = async (emailId) => {
        try {
            const response = await deleteFetcher(`/api/email/${emailId}`);
            
            if (response.status === 200) {
                // Remove from state
                setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
                
                // Clear selected if it was deleted
                if (selectedEmail?.id === emailId) {
                    setSelectedEmail(null);
                }
                
                return { success: true };
            } else {
                return { success: false, error: response.message || 'Failed to delete email' };
            }
        } catch (error) {
            console.error('Error deleting email:', error);
            return { success: false, error: 'Failed to delete email' };
        }
    };

    // Toggle star status
    const toggleStar = async (emailId) => {
        try {
            const response = await putFetcher(`/api/email/${emailId}/star`, {});
            
            if (response.status === 200) {
                // Update state
                setEmails(prevEmails => 
                    prevEmails.map(email => 
                        email.id === emailId 
                            ? { ...email, starred: response.data.starred }
                            : email
                    )
                );
                
                // Update selected email if it's the same
                if (selectedEmail?.id === emailId) {
                    setSelectedEmail(prev => ({ ...prev, starred: response.data.starred }));
                }
                
                return { success: true };
            } else {
                return { success: false, error: response.message || 'Failed to update star' };
            }
        } catch (error) {
            console.error('Error toggling star:', error);
            return { success: false, error: 'Failed to update star' };
        }
    };

    // Toggle important status (if needed later)
    const toggleImportant = async (emailId) => {
        try {
            // Update local state optimistically
            setEmails(prevEmails =>
                prevEmails.map(email =>
                    email.id === emailId ? { ...email, important: !email.important } : email
                )
            );

            if (selectedEmail?.id === emailId) {
                setSelectedEmail((prevEmail) => ({
                    ...(prevEmail),
                    important: !(prevEmail).important
                }));
            }

            // Note: Backend doesn't have important endpoint yet
            // This is just for UI state management
        } catch (error) {
            console.error('Error toggling important:', error);
        }
    };

    return (
        <EmailContext.Provider value={{ 
            emails, 
            selectedEmail, 
            setSelectedEmail, 
            deleteEmail, 
            toggleStar, 
            toggleImportant, 
            sendEmail,
            refreshEmails,
            setFilter, 
            filter, 
            error, 
            loading, 
            searchQuery, 
            setSearchQuery 
        }}>
            {children}
        </EmailContext.Provider>
    );
};
