import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack, 
  Chip,
  Avatar,
  IconButton,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  IconEye, 
  IconHeart, 
  IconShare, 
  IconClock,
  IconArrowRight 
} from '@tabler/icons';

// Import blog images
import blogImg1 from '../../../assets/images/blog/blog-img9.jpg';
import blogImg2 from '../../../assets/images/blog/blog-img10.jpg';
import userImg1 from '../../../assets/images/profile/user-4.jpg';
import userImg2 from '../../../assets/images/profile/user-5.jpg';

import DashboardCard from '../../shared/DashboardCard';

const BlogWidgets = () => {
  const theme = useTheme();

  const featuredBlog = {
    id: 1,
    title: "Vad ska man tänka på när man söker en praktik",
    excerpt: "Att söka praktik behöver inte vara svårt! Med rätt strategi och förberedelse ökar du dramatiskt dina chanser att få den praktikplats du drömmer om...",
    image: blogImg1,
    author: {
      name: "Praktik Expert",
      avatar: userImg1
    },
    category: "Karriär",
    readTime: "8 min",
    views: 2847,
    likes: 184,
    publishedAt: "5 dagar sedan"
  };

  const recentBlog = {
    id: 2,
    title: "Hur du skriver det perfekta CV:t för praktikansökan",
    excerpt: "Ditt CV är ofta det första intryck en arbetsgivare får av dig. För praktikanter är det extra viktigt att göra rätt från början...",
    image: blogImg2,
    author: {
      name: "CV-Expert Anna",
      avatar: userImg2
    },
    category: "Karriär",
    readTime: "6 min",
    views: 1923,
    likes: 127,
    publishedAt: "1 dag sedan"
  };

  const BlogCard = ({ blog, size = "large" }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardMedia
        component="img"
        height={size === "large" ? 180 : 120}
        image={blog.image}
        alt={blog.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: size === "large" ? 2 : 1.5 }}>
        <Stack spacing={size === "large" ? 1.5 : 1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Chip 
              label={blog.category}
              size="small"
              sx={{ 
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                fontSize: '0.7rem',
                height: 20
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <IconClock size={14} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="textSecondary">
                {blog.readTime}
              </Typography>
            </Stack>
          </Stack>

          <Typography 
            variant={size === "large" ? "h6" : "subtitle2"} 
            fontWeight={600}
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: size === "large" ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3
            }}
          >
            {blog.title}
          </Typography>

          {size === "large" && (
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {blog.excerpt}
            </Typography>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar 
                src={blog.author.avatar} 
                sx={{ width: size === "large" ? 28 : 24, height: size === "large" ? 28 : 24 }}
              />
              <Box>
                <Typography variant="caption" fontWeight={600}>
                  {blog.author.name}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {blog.publishedAt}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconEye size={16} color={theme.palette.text.secondary} />
                <Typography variant="caption" color="textSecondary">
                  {blog.views > 999 ? `${(blog.views/1000).toFixed(1)}k` : blog.views}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconHeart size={16} color={theme.palette.text.secondary} />
                <Typography variant="caption" color="textSecondary">
                  {blog.likes}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {size === "large" && (
            <Stack direction="row" justifyContent="flex-end">
              <IconButton 
                size="small" 
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.light }
                }}
              >
                <IconArrowRight size={18} />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <DashboardCard>
      <Box sx={{ p: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            📚 Senaste från bloggen
          </Typography>
          <Typography 
            variant="caption" 
            color="primary" 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Visa alla →
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <BlogCard blog={featuredBlog} size="large" />
          </Grid>
        </Grid>
      </Box>
    </DashboardCard>
  );
};

export default BlogWidgets;
