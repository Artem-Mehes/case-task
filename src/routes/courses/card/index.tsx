import ReactPlayer from 'react-player';
import { yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { VideoLibrary } from '@mui/icons-material';
import { MouseEventHandler, useEffect, useState } from 'react';
import {
  Chip,
  Rating,
  useTheme,
  CardMedia,
  Typography,
  CardContent,
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

  const [hovered, setHovered] = useState(false);

  const {
    id,
    title,
    rating,
    description,
    lessonsCount,
    previewImageLink,
    meta: { courseVideoPreview, skills },
  } = data;

  const [showAllSkills, setShowAllSkills] = useState(true);

  useEffect(
    () =>
      setShowAllSkills(
        !isMobile ||
          !skills ||
          Boolean(skills && skills.length <= maxSkillsOnMobile)
      ),
    [isMobile, skills]
  );

  const videoIsOk = courseVideoPreview?.duration && !hasVideoRequestError;

  const resultSkills =
    isMobile && !showAllSkills ? skills?.slice(0, maxSkillsOnMobile) : skills;

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

      <Flex gap={2} column component={CardContent}>
        <Flex column gap={1}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Flex>

        <Flex gap={1} alignItems="center">
          <Typography variant="body1" color={yellow['800']}>
            {rating}
          </Typography>

          <Rating defaultValue={rating} precision={0.5} readOnly />
        </Flex>

        <Flex gap={1}>
          <VideoLibrary />
          {lessonsCount} lessons
        </Flex>

        <Flex gap={1} flexWrap="wrap">
          {resultSkills?.map((skill, index) => (
            <Chip
              key={index}
              size="small"
              label={skill}
              sx={{ cursor: 'pointer' }}
            />
          ))}

          {!showAllSkills && (
            <Chip
              label="..."
              size="small"
              sx={{ cursor: 'pointer' }}
              onClick={onShowMoreSkillsClick}
            />
          )}
        </Flex>
      </Flex>
    </Styles.Card>
  );
};
