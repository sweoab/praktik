// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useState } from 'react';

import {
  ListItemText,
  ListItemButton,
  List,
  Divider,
  ListItemIcon,
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

import { EmailContext } from "@/context/EmailContext";
import EmailCompose from './EmailCompose';
import Scrollbar from '@/components/custom-scroll/Scrollbar';
import {
  IconMail,
  IconSend,
  IconFlag,
  IconTrash,
  IconStar,
  IconAlertCircle,
  IconFolder,
  IconNote,
} from '@tabler/icons-react';
import { CustomizerContext } from '@/context/CustomizerContext';

const EmailFilter = () => {
  const { isBorderRadius } = useContext(CustomizerContext);
  const br = `${isBorderRadius}px`;
  const { setFilter, filter } = useContext(EmailContext);
  const [composeOpen, setComposeOpen] = useState(false);

  const handleFilterClick = (filterName) => {
    setFilter(filterName);
  };

  const filterData = [
    {
      id: 2,
      name: 'inbox',
      icon: IconMail,
      color: 'inherit',
    },
    {
      id: 3,
      name: 'sent',
      icon: IconSend,
      color: 'inherit',
    },
    {
      id: 4,
      name: 'draft',
      icon: IconNote,
      color: 'inherit',
    },
    {
      id: 4,
      name: 'spam',
      icon: IconFlag,
      color: 'inherit',
    },
    {
      id: 5,
      name: 'trash',
      icon: IconTrash,
      color: 'inherit',
    },
    {
      id: 6,
      divider: true,
    },
    {
      id: 1,
      filterbyTitle: 'Sortera efter',
    },
    {
      id: 7,
      name: 'starred',
      icon: IconStar,
      color: 'inherit',
    },
    {
      id: 8,
      name: 'important',
      icon: IconAlertCircle,
      color: 'inherit',
    },
  ];

  return (
    <>
      <Box>
        {/* Modern Compose Button */}
        <Box p={3} pb={1}>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<EditIcon />}
            onClick={() => setComposeOpen(true)}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Skriv meddelande
          </Button>
        </Box>

        {/* Compose Dialog */}
        <EmailCompose 
          open={composeOpen} 
          onClose={() => setComposeOpen(false)} 
        />
      </Box>

      <List>
        <Scrollbar sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '800px' }}>
          {filterData.map((item) => {
            if (item.filterbyTitle) {
              return (
                <Typography
                  variant="subtitle2"
                  p={3}
                  pb={1}
                  pl={5.5}
                  fontWeight={600}
                  key={item.id}
                  sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  {item.filterbyTitle}
                </Typography>
              );
            } else if (item.divider) {
              return <Divider key={item.id} sx={{ my: 1 }} />;
            }

            return (
              <ListItemButton
                sx={{
                  mb: 1,
                  px: '20px',
                  mx: 3,
                  borderRadius: br,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.lighter',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.lighter',
                    }
                  }
                }}
                selected={filter === `${item.name}`}
                onClick={() => handleFilterClick(item.name)}
                key={`${item.id}${item.name}`}
              >
                <ListItemIcon sx={{ minWidth: '30px', color: item.color }}>
                  <item.icon stroke="1.5" size={19} />
                </ListItemIcon>
                <ListItemText 
                  sx={{ 
                    textTransform: 'capitalize',
                    '& .MuiTypography-root': {
                      fontWeight: filter === item.name ? 600 : 400
                    }
                  }}
                >
                  {item.name}
                </ListItemText>
              </ListItemButton>
            );
          })}
        </Scrollbar>
      </List>
    </>
  );
};

export default EmailFilter;
