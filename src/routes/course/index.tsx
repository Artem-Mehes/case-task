import BaseReactPlayer from 'react-player/base';
import { QueryClient, useQuery } from 'react-query';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { useParams, LoaderFunction, Params } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Tab,
  Chip,
  Tabs,
  Divider,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import api from 'api';
import { secondsToHm } from 'utils';
import { DescriptionList } from 'components';
import { useLocalStorageById, useTitle } from 'hooks';

import * as Styles from './styles';
import { Lessons } from './lessons';
import { PlaybackRate, PlaybackRateOptions, Progress } from './types';
import { Error } from '@mui/icons-material';

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
  const theme = useTheme();
  const playerRef = useRef<BaseReactPlayer<ReactPlayerProps> | null>(null);
  const params = useParams();
  const { data } = useQuery(courseQuery(params.id));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const didInit = useRef(false);
  useTitle('Course', data?.title);

  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [tab, setTab] = useState<'content' | 'description'>('content');
  const [showPlaybackRate, setShowPlaybackRate] = useState(false);

  const { tags, meta, title, lessons, duration, description } = data ?? {};

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        const currentIndex = PlaybackRateOptions.indexOf(playbackRate);
        if (e.key === '<') {
          if (currentIndex === 0) return;
          setPlaybackRate(PlaybackRateOptions[currentIndex - 1]);
        } else if (e.key === '>') {
          if (currentIndex === PlaybackRateOptions.length - 1) return;
          setPlaybackRate(PlaybackRateOptions[currentIndex + 1]);
        }
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [playbackRate]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (didInit.current) {
      setShowPlaybackRate(true);
      intervalId = setInterval(() => setShowPlaybackRate(false), 1000);
    }

    didInit.current = true;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [playbackRate]);

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

  const onReady = () => {
    if (played && playerRef.current) {
      playerRef.current.seekTo(Number(played), 'seconds');
    }
  };

  const selectedLesson = data?.lessons?.find(
    ({ id }) => id === progress.active
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Styles.MainContent>
          {selectedLesson?.link ? (
            <Styles.PlayerContainer
              playbackRate={playbackRate}
              showPlaybackRate={showPlaybackRate}
            >
              <ReactPlayer
                playing
                controls
                width="100%"
                height="100%"
                ref={playerRef}
                onReady={onReady}
                url={selectedLesson?.link}
                playbackRate={playbackRate}
                light={`${data?.previewImageLink}/cover.webp`}
                style={{ position: 'absolute', top: 0, left: 0 }}
                onProgress={(videoProgress) =>
                  setProgress((prev) => ({
                    ...prev,
                    [progress.active]: videoProgress.playedSeconds,
                  }))
                }
              />
            </Styles.PlayerContainer>
          ) : (
            <Box
              sx={{
                p: 1,
                gap: 3,
                width: '100%',
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Error sx={{ width: '48px', height: '48px' }} />
              <Typography variant="h3">
                Sorry, no video found for this lesson
              </Typography>
            </Box>
          )}

          <Box sx={{ p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={tab}
              sx={{ display: { lg: 'none' } }}
              onChange={(e, value) => setTab(value)}
            >
              <Tab label="Course content" value="content" />
              <Tab label="Description" value="description" />
            </Tabs>

            <Box
              sx={{
                gap: 1,
                display: 'flex',
                alignSelf: 'end',
                alignItems: 'center',
              }}
            >
              Speed: <Styles.ShortcutButton>SHIFT</Styles.ShortcutButton> +{' '}
              <Styles.ShortcutButton>{'<'}</Styles.ShortcutButton> /{' '}
              <Styles.ShortcutButton>{'>'}</Styles.ShortcutButton>
            </Box>

            {(tab === 'description' || isLargeScreen) && (
              <>
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
              </>
            )}

            {tab === 'content' && !isLargeScreen && (
              <Lessons
                progress={progress}
                lessons={sortedLessons}
                setProgress={setProgress}
              />
            )}
          </Box>
        </Styles.MainContent>

        <Styles.SidebarContainer>
          <Lessons
            progress={progress}
            lessons={sortedLessons}
            setProgress={setProgress}
          />
        </Styles.SidebarContainer>
      </Box>
    </>
  );
};

export default Course;
