import { MouseEventHandler, useState } from 'react';
import ReactPlayer from 'react-player';
import { yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { Star, VideoLibrary } from '@mui/icons-material';
import {
  Box,
  Chip,
  useTheme,
  CardMedia,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { PreviewCourse } from 'api/courses';

import * as Styles from './styles';

const maxSkillsOnMobile = 2;

export const Card = ({ data }: { data: PreviewCourse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasVideoRequestError, setVideoRequestError] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(!isMobile);

  const [hovered, setHovered] = useState(false);

  const {
    meta: { courseVideoPreview },
  } = data;

  const videoIsOk = courseVideoPreview?.duration && !hasVideoRequestError;

  const skills =
    isMobile && !showAllSkills
      ? data?.meta.skills?.slice(0, maxSkillsOnMobile)
      : data?.meta.skills;

  const onShowMoreSkillsClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    setShowAllSkills(true);
  };

  return (
    <Styles.Card
      onClick={() => navigate(data.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && videoIsOk ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            video: {
              objectFit: 'cover',
            },
          }}
        >
          <ReactPlayer
            loop
            muted
            playing
            width="100%"
            height="300px"
            url={courseVideoPreview.link}
            onError={() => {
              if (!hasVideoRequestError) setVideoRequestError(true);
            }}
          />
        </Box>
      ) : (
        <CardMedia
          height="300"
          component="img"
          title={data.title}
          image={`${data.previewImageLink}/cover.webp`}
        />
      )}

      <Styles.CardContent>
        <Styles.CardTitleContainer>
          <Typography variant="h5">{data.title}</Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Star sx={{ color: yellow[500] }} />
            {data.rating}
          </Box>
        </Styles.CardTitleContainer>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <VideoLibrary />
          {data.lessonsCount} lessons
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {skills?.map((skill, index) => (
            <Chip
              key={index}
              size="small"
              label={skill}
              sx={{ cursor: 'pointer' }}
            />
          ))}

          {isMobile && !showAllSkills && (
            <Chip
              label="..."
              size="small"
              sx={{ cursor: 'pointer' }}
              onClick={onShowMoreSkillsClick}
            />
          )}
        </Box>
      </Styles.CardContent>
    </Styles.Card>
  );
};
