import { Lock } from '@mui/icons-material';
import BaseReactPlayer from 'react-player/base';
import { QueryClient, useQuery } from 'react-query';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { Fragment, useCallback, useMemo, useRef } from 'react';
import { useParams, LoaderFunction, Params } from 'react-router-dom';
import {
  Box,
  List,
  Chip,
  AppBar,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import api from 'api';
import { secondsToHm } from 'utils';
import { useLocalStorageById } from 'hooks';
import { DescriptionList } from 'components';

import { Progress } from './types';

export const courseQuery = (id: Params['id']) => ({
  enabled: Boolean(id),
  queryKey: ['course', id],
  queryFn: async () => api.courses.getById(id!),
});

export const courseLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async ({ params }) => {
    const query = courseQuery(params.id);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const Course = () => {
  const playerRef = useRef<BaseReactPlayer<ReactPlayerProps> | null>(null);
  const params = useParams();
  const { data } = useQuery(courseQuery(params.id));

  const { tags, meta, title, lessons, duration, description } = data ?? {};

  const sortedLessons = useMemo(
    () => lessons && [...lessons].sort((a, b) => a.order - b.order),
    [lessons]
  );

  const firstLessonId = sortedLessons?.[0].id;

  const [progress, setProgress] = useLocalStorageById<Progress>(
    {
      active: firstLessonId,
      [String(firstLessonId)]: 0,
    },
    params.id!,
    {
      name: 'progress',
      skip: !sortedLessons?.[0].id || !params.id,
    }
  );

  const played = progress[progress.active];

  const onReady = useCallback(() => {
    if (played && playerRef.current) {
      playerRef.current.seekTo(Number(played), 'seconds');
    }
  }, [progress.active]);

  const selectedLesson = data?.lessons?.find(
    ({ id }) => id === progress.active
  );

  console.log('progress:', progress);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            gap: 2,
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ position: 'relative', pt: '56.25%' }}>
            <ReactPlayer
              controls
              width="100%"
              height="100%"
              ref={playerRef}
              onReady={onReady}
              url={selectedLesson?.link}
              style={{ position: 'absolute', top: 0, left: 0 }}
              onProgress={(videoProgress) =>
                setProgress((prev) => ({
                  ...prev,
                  [progress.active]: videoProgress.playedSeconds,
                }))
              }
            />
          </Box>

          <Box sx={{ p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              About this course
            </Typography>
            <Box>
              <Typography variant="h6">{title}</Typography>
              <Typography>
                Launched at{' '}
                {data &&
                  new Date(data.launchDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
              </Typography>
            </Box>

            <Divider />

            <DescriptionList
              items={[
                {
                  title: 'By the numbers',
                  details: (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span>
                        Video:{' '}
                        {duration &&
                          secondsToHm(duration, {
                            plural: true,
                            type: 'biggest',
                            label: {
                              minutes: ' total minute',
                              hours: ' total hour',
                            },
                          })}
                      </span>
                      <span>Lessons: {lessons?.length}</span>
                    </Box>
                  ),
                },
                {
                  title: 'Description',
                  details: description,
                },
                ...(meta?.skills
                  ? [
                      {
                        title: 'Skills',
                        details: (
                          <>
                            {meta.skills.map((skill, index) => (
                              <Chip key={index} label={skill} />
                            ))}
                          </>
                        ),
                      },
                    ]
                  : []),
                ...(tags
                  ? [
                      {
                        title: 'Tags',
                        details: (
                          <>
                            {tags.map((tag, index) => (
                              <Chip key={index} label={tag} />
                            ))}
                          </>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </Box>
        </Box>

        <Box
          sx={{
            right: 0,
            zIndex: 1,
            width: '25%',
            display: 'flex',
            position: 'fixed',
            flexDirection: 'column',
            height: `calc(100% - 64px)`,
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <AppBar
            position="static"
            enableColorOnDark
            sx={{ padding: 1, boxShadow: 'none' }}
          >
            <Typography sx={{ fontWeight: 'bold' }} variant="h5">
              Course content
            </Typography>
          </AppBar>

          <List sx={{ overflowY: 'auto', flex: 1 }}>
            {sortedLessons?.map((lesson) => {
              const isLocked = lesson.status === 'locked';

              return (
                <Fragment key={lesson.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      disabled={isLocked}
                      selected={progress.active === lesson.id}
                      onClick={() =>
                        setProgress((prev) => ({
                          ...prev,
                          active: lesson.id,
                        }))
                      }
                    >
                      <ListItemText
                        secondary={secondsToHm(lesson.duration)}
                        primary={`Lesson ${lesson.order}: ${lesson.title}`}
                      />

                      {isLocked && <Lock />}
                    </ListItemButton>
                  </ListItem>
                  <Divider component="li" />
                </Fragment>
              );
            })}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Course;
