import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  useTheme
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Search,
  FilterList,
  Visibility,
  Share,
  Delete,
  Description,
  PictureAsPdf,
  Image,
  Archive,
  Close,
  Add
} from '@mui/icons-material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';

const DocumentsPanel = () => {
  const { documents, uploadDocument, users } = useCommunication();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    size: '',
    description: '',
    tags: [],
    sharedWith: []
  });
  const theme = useTheme();

  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'document':
      case 'doc':
      case 'docx':
        return <Description color="primary" />;
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image color="info" />;
      case 'archive':
      case 'zip':
      case 'rar':
        return <Archive color="warning" />;
      default:
        return <Description />;
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'error';
      case 'document':
      case 'doc':
      case 'docx':
        return 'primary';
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'info';
      case 'archive':
      case 'zip':
      case 'rar':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatFileSize = (size) => {
    if (typeof size === 'string') return size;
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleUpload = async () => {
    if (!newDocument.name || !newDocument.type) return;
    
    try {
      await uploadDocument({
        ...newDocument,
        uploadedBy: 1 // Current user ID
      });
      
      setUploadDialogOpen(false);
      setNewDocument({
        name: '',
        type: '',
        size: '',
        description: '',
        tags: [],
        sharedWith: []
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDownload = (document) => {
    // In a real app, this would trigger actual download
    console.log('Downloading:', document.name);
  };

  const handleShare = (document) => {
    setSelectedDocument(document);
    setShareDialogOpen(true);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const documentTypes = [...new Set(documents.map(doc => doc.type))];

  return (
    <Box>
      <Card>
        <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Delade dokument</Typography>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Ladda upp
            </Button>
          </Box>

          {/* Search and Filter */}
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Sök dokument..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filtyp</InputLabel>
              <Select
                value={filterType}
                label="Filtyp"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Alla</MenuItem>
                {documentTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
            >
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                Inga dokument hittades
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {searchTerm || filterType !== 'all' 
                  ? 'Försök med en annan sökning eller filter' 
                  : 'Inga dokument har delats än'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredDocuments.map((document) => (
                <ListItem
                  key={document.id}
                  sx={{
                    mb: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: 'transparent' }}>
                      {getDocumentIcon(document.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {document.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={document.type.toUpperCase()}
                          color={getDocumentTypeColor(document.type)}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(document.size)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {document.description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="caption" color="text.secondary">
                            Uppladdat av: {document.uploadedBy?.name || 'Okänd'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(document.uploadedAt), 'dd MMM yyyy', { locale: sv })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {document.downloadCount} nedladdningar
                          </Typography>
                        </Box>
                        {document.tags.length > 0 && (
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {document.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={tag}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleDownload(document)}>
                        <Download />
                      </IconButton>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleShare(document)}>
                        <Share />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="between" alignItems="center">
            Ladda upp dokument
            <IconButton onClick={() => setUploadDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Filnamn"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                placeholder="t.ex. Projektrapport_v1.pdf"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Filtyp</InputLabel>
                <Select
                  value={newDocument.type}
                  label="Filtyp"
                  onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="document">Dokument</MenuItem>
                  <MenuItem value="image">Bild</MenuItem>
                  <MenuItem value="archive">Arkiv</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Filstorlek"
                value={newDocument.size}
                onChange={(e) => setNewDocument({...newDocument, size: e.target.value})}
                placeholder="t.ex. 2.5 MB"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Beskrivning"
                value={newDocument.description}
                onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                placeholder="Beskriv dokumentet..."
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newDocument.tags}
                onChange={(e, newValue) => setNewDocument({...newDocument, tags: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Taggar" placeholder="Lägg till taggar..." />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.name}
                value={newDocument.sharedWith}
                onChange={(e, newValue) => setNewDocument({...newDocument, sharedWith: newValue.map(u => u.id)})}
                renderInput={(params) => (
                  <TextField {...params} label="Dela med" placeholder="Välj användare..." />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Avbryt
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={!newDocument.name || !newDocument.type}
          >
            Ladda upp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Dela dokument: {selectedDocument?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Välj vem du vill dela dokumentet med:
          </Typography>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Dela med" placeholder="Välj användare..." />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>
            Avbryt
          </Button>
          <Button variant="contained">
            Dela
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPanel;
