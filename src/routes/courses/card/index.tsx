import ReactPlayer from 'react-player';
import { yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { Star, VideoLibrary } from '@mui/icons-material';
import { MouseEventHandler, useEffect, useState } from 'react';
import {
  Chip,
  useTheme,
  CardMedia,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { Flex } from 'components';
import { getCoverUrl } from 'utils';
import { PreviewCourse } from 'api/courses';

import * as Styles from './styles';

const maxSkillsOnMobile = 2;

export const Card = ({ data }: { data: PreviewCourse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasVideoRequestError, setVideoRequestError] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(!isMobile);

  useEffect(() => setShowAllSkills(!isMobile), [isMobile]);

  const [hovered, setHovered] = useState(false);

  const {
    id,
    title,
    rating,
    description,
    lessonsCount,
    previewImageLink,
    meta: { courseVideoPreview },
  } = data;

  const videoIsOk = courseVideoPreview?.duration && !hasVideoRequestError;

  const skills =
    isMobile && !showAllSkills
      ? data.meta.skills?.slice(0, maxSkillsOnMobile)
      : data.meta.skills;

  const onShowMoreSkillsClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    setShowAllSkills(true);
  };

  return (
    <Styles.Card
      onClick={() => navigate(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && videoIsOk ? (
        <Flex
          justifyContent="center"
          sx={{
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
        </Flex>
      ) : (
        <CardMedia
          height="300"
          component="img"
          title={title}
          image={getCoverUrl(previewImageLink)}
        />
      )}

      <Styles.CardContent>
        <Styles.CardTitleContainer>
          <Typography variant="h5">{title}</Typography>

          <Flex gap={1}>
            <Star sx={{ color: yellow[500] }} />
            {rating}
          </Flex>
        </Styles.CardTitleContainer>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Flex gap={1}>
          <VideoLibrary />
          {lessonsCount} lessons
        </Flex>

        <Flex gap={1} flexWrap="wrap">
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
        </Flex>
      </Styles.CardContent>
    </Styles.Card>
  );
};
