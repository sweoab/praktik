// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useEffect, useState } from 'react';
import { List } from '@mui/material';
import EmailListItem from './EmailListItem';
import Scrollbar from '@/components/custom-scroll/Scrollbar';
import { EmailContext } from '@/context/EmailContext';



const EmailList = ({ showrightSidebar }) => {

  const { emails, setSelectedEmail, deleteEmail, filter, toggleStar, toggleImportant, searchQuery } = useContext(EmailContext);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedEmailId, setSelectedEmailId] = useState(emails.length > 0 ? emails[0].id : null);


  useEffect(() => {
    if (emails.length > 0) {
      setSelectedEmailId(emails[0].id);
      setSelectedEmail(emails[0]);
    }
  }, [emails, setSelectedEmail]);

  const handleCheckboxChange = (emailId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [emailId]: !prevState[emailId]
    }));
  };

  const handleDelete = (emailId) => {
    deleteEmail(emailId);
  };

  const filteredEmails = searchQuery
    ? emails.filter((email) =>
      email.from.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : emails.filter((email) => {
      if (filter === 'starred') {
        return email.starred;
      } else if (['Promotional', 'Social', 'Health'].includes(filter)) {
        return email.label === filter;
      } else {
        return email[filter];
      }
    });

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setSelectedEmailId(email.id);
    setCheckedItems({});

  };
  return (
    <List>
      <Scrollbar sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '800px' }}>
        {/* ------------------------------------------- */}
        {/* Email page */}
        {/* ------------------------------------------- */}
        {filteredEmails.map((email) => (
          <EmailListItem
            key={email.id}
            {...email}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectEmail(email);
              showrightSidebar;
            }}
            onDelete={() => handleDelete(email.id)}
            isSelected={email.id === selectedEmailId}
            onStar={() => toggleStar(email.id)}
            onImportant={() => toggleImportant(email.id)}
            onChange={() => handleCheckboxChange(email.id)}
            checked={checkedItems[email.id]}
          />
        ))}
      </Scrollbar>
    </List>
  );
};

export default EmailList;
