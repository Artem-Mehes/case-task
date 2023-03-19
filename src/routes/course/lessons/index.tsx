import { Fragment } from 'react';
import { Lock } from '@mui/icons-material';
import {
  List,
  AppBar,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { secondsToHm } from 'utils';

import { LessonsProps } from './types';

export const Lessons = ({
  lessons,
  progress,
  onSelectLesson,
}: LessonsProps) => {
  return (
    <>
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
        {lessons?.map((lesson) => {
          const isLocked = lesson.status === 'locked';

          return (
            <Fragment key={lesson.id}>
              <ListItem disablePadding>
                <ListItemButton
                  disabled={isLocked}
                  selected={progress.active === lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
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
    </>
  );
};
