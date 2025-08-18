import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CardContent,
  Stack,
  Avatar,
  Typography,
  CardMedia,
  Chip,
  Tooltip,
  Box,
  Divider,
  TextField,
  Button,
  Skeleton,
} from '@mui/material';
import { IconEye, IconMessage2, IconPoint, IconQuote } from '@tabler/icons-react';
import { format } from 'date-fns';
import BlogComment from './BlogComment';
import { uniqueId } from 'lodash';
import { BlogContext } from "@/context/BlogContext";
import BlankCard from '../../../shared/BlankCard';


const BlogDetail = () => {
  const { posts, isLoading, setLoading, addComment } = useContext(BlogContext);

  const title = useLocation();

  const getTitle = title.pathname.split('/').pop();
  const post = posts.find((p) => p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') === getTitle);

  const [replyTxt, setReplyTxt] = React.useState('');

  const onSubmit = () => {
    if (!post || !post.id) return;
    const newComment = {
      id: uniqueId('#comm_'),
      profile: {
        id: uniqueId('#USER_'),
        avatar: post.author?.avatar || '',
        name: post.author?.name || '',
        time: 'Now',
      },
      comment: replyTxt,
      replies: [],
      postId: post.id,
    };
    addComment(post.id, newComment);
    setReplyTxt('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <BlankCard>
        <>
          {isLoading ? (
            <>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="100%"
                height={440}
                sx={{ borderRadius: (theme) => theme.shape.borderRadius / 5 }}
              ></Skeleton>
            </>
          ) : (
            <CardMedia component="img" height="440" image={post?.coverImg} alt="green iguana" />
          )}
          <CardContent>
            <Stack direction="row" sx={{ marginTop: '-45px' }}>
              <Tooltip title={post?.author?.name || ''} placement="top">
                <Avatar aria-label="recipe" src={post?.author?.avatar}></Avatar>
              </Tooltip>
              <Chip
                sx={{
                  marginLeft: 'auto',
                  marginTop: '-21px',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? theme.palette.background.default : 'white',
                }}
                label="2 min Read"
                size="small"
              ></Chip>
            </Stack>
            <Chip label={post?.category} size="small" sx={{ marginTop: 2 }}></Chip>
            <Box my={3}>
              <Typography
                gutterBottom
                variant="h1"
                fontWeight={600}
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                {post?.title}
              </Typography>
            </Box>
            <Stack direction="row" gap={3} alignItems="center">
              <Stack direction="row" gap={1} alignItems="center">
                <IconEye size="18" /> {post?.view}
              </Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <IconMessage2 size="18" /> {post?.comments?.length || 0}
              </Stack>

              <Stack direction="row" ml="auto" alignItems="center">
                <IconPoint size="16" />


                <small>
                  {post?.createdAt ? format(new Date(post.createdAt), 'E, MMM d') : ''}
                </small>
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: post?.content?.replace(/\n/g, '<br/>') || '' }} />
          </CardContent>
        </>
      </BlankCard>
      <BlankCard sx={{ mt: 3, p: 0 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600}>
            Post Comments
          </Typography>
          <br />
          <TextField
            rows={4}
            multiline
            fullWidth
            value={replyTxt}
            onChange={(e) => setReplyTxt(e.target.value)}
          ></TextField>
          <br />
          <br />
          <Button color="primary" variant="contained" onClick={onSubmit}>
            Post Comment
          </Button>

          <Stack direction="row" gap={2} alignItems="center" mb={3} mt={5}>
            <Typography variant="h4" fontWeight={600}>
              Comments
            </Typography>
            <Box px={1.5} py={1} color="primary.main" bgcolor={'primary.light'}>
              <Typography variant="h6" fontWeight={600}>
                {post?.comments?.length || 0}  {/* Optional chaining and fallback */}
              </Typography>
            </Box>
          </Stack>
          <Box>
            {post?.comments?.map((comment) => {
              return <BlogComment comment={comment} key={comment.profile.id} />;
            })}
          </Box>
        </CardContent>
      </BlankCard>
    </Box>
  );
};

export default BlogDetail;
