import { Error } from '@mui/icons-material';
import BaseReactPlayer from 'react-player/base';
import { ReactPlayerProps } from 'react-player';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LoaderFunctionArgs } from '@remix-run/router/utils';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Params, useParams, useLoaderData } from 'react-router-dom';
import {
  Tab,
  Chip,
  Tabs,
  Divider,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import api from 'api';
import { getCoverUrl, secondsToHm } from 'utils';
import { DescriptionList, Flex } from 'components';
import { useLocalStorageById, useTitle } from 'hooks';

import * as Styles from './styles';
import { Lessons } from './lessons';
import {
  Progress,
  PlaybackRate,
  OnSelectLesson,
  PlaybackRateOptions,
} from './types';

export const courseQuery = (id: Params['id']) => ({
  enabled: Boolean(id),
  queryKey: ['course', id],
  queryFn: async () => api.courses.getById(id!),
});

export const courseLoader =
  (
    queryClient: QueryClient
  ): ((
    args: LoaderFunctionArgs
  ) => ReturnType<ReturnType<typeof courseQuery>['queryFn']>) =>
  async ({ params }) => {
    const query = courseQuery(params.id);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const Course = () => {
  const theme = useTheme();
  const params = useParams();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const playerRef = useRef<BaseReactPlayer<ReactPlayerProps> | null>(null);
  const didInit = useRef(false);

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof courseLoader>>
  >;

  const { data } = useQuery({
    ...courseQuery(params.id),
    initialData,
  });

  const {
    tags,
    meta,
    title,
    lessons,
    duration,
    launchDate,
    description,
    previewImageLink,
  } = data;

  useTitle('Course', title);

  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [tab, setTab] = useState<'content' | 'description'>('content');
  const [showPlaybackRate, setShowPlaybackRate] = useState(false);
  const [videoRequestError, setVideoRequestError] = useState(false);

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
    () => [...lessons].sort((a, b) => a.order - b.order),
    [lessons]
  );

  const firstLessonId = sortedLessons[0].id;

  const [progress, setProgress] = useLocalStorageById<Progress>(
    {
      active: firstLessonId,
      [String(firstLessonId)]: 0,
    },
    params.id!,
    {
      name: 'progress',
      skip: !sortedLessons[0].id || !params.id,
    }
  );

  const played = progress[progress.active];

  const onReady = () => {
    if (played && playerRef.current) {
      playerRef.current.seekTo(Number(played), 'seconds');
    }
    setVideoRequestError(false);
  };

  const onSelectLesson: OnSelectLesson = (id) => {
    setProgress((prev) => ({
      ...prev,
      active: id,
    }));
    setVideoRequestError(false);
  };

  const selectedLesson = lessons.find(({ id }) => id === progress.active);

  return (
    <>
      <Flex>
        <Styles.MainContent>
          {selectedLesson?.link && !videoRequestError ? (
            <Styles.PlayerContainer
              playbackRate={playbackRate}
              showPlaybackRate={showPlaybackRate}
            >
              <Styles.Player
                playing
                controls
                width="100%"
                height="100%"
                ref={playerRef}
                onReady={onReady}
                url={selectedLesson.link}
                playbackRate={playbackRate}
                light={getCoverUrl(previewImageLink)}
                onError={(error) => {
                  if (error.type === 'error') {
                    setVideoRequestError(true);
                  }
                }}
                onProgress={(videoProgress) =>
                  setProgress((prev) => ({
                    ...prev,
                    [progress.active]: videoProgress.playedSeconds,
                  }))
                }
              />
            </Styles.PlayerContainer>
          ) : (
            <Styles.ErrorContainer center gap={3}>
              <Error sx={{ width: '48px', height: '48px' }} />
              <Typography variant="h3">
                Sorry, no video found for this lesson
              </Typography>
            </Styles.ErrorContainer>
          )}

          <Flex column gap={2} sx={{ p: 2 }}>
            <Tabs
              value={tab}
              sx={{ display: { lg: 'none' } }}
              onChange={(e, value) => setTab(value)}
            >
              <Tab label="Course content" value="content" />
              <Tab label="Description" value="description" />
            </Tabs>

            <Flex gap={1} alignSelf="end" alignItems="center">
              Speed: <Styles.ShortcutButton>SHIFT</Styles.ShortcutButton> +{' '}
              <Styles.ShortcutButton>{'<'}</Styles.ShortcutButton> /{' '}
              <Styles.ShortcutButton>{'>'}</Styles.ShortcutButton>
            </Flex>

            {(tab === 'description' || isLargeScreen) && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  About this course
                </Typography>
                <div>
                  <Typography variant="h6">{title}</Typography>
                  <Typography>
                    Launched at{' '}
                    {data &&
                      new Date(launchDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                  </Typography>
                </div>

                <Divider />

                <DescriptionList
                  items={[
                    {
                      title: 'By the numbers',
                      details: (
                        <Flex column>
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
                          <span>Lessons: {lessons.length}</span>
                        </Flex>
                      ),
                    },
                    {
                      title: 'Description',
                      details: description,
                    },
                    ...(meta.skills
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
                onSelectLesson={onSelectLesson}
              />
            )}
          </Flex>
        </Styles.MainContent>

        <Styles.SidebarContainer>
          <Lessons
            progress={progress}
            lessons={sortedLessons}
            onSelectLesson={onSelectLesson}
          />
        </Styles.SidebarContainer>
      </Flex>
    </>
  );
};

export default Course;
