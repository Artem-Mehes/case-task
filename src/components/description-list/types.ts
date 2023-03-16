import { ReactNode } from 'react';

export interface DescriptionListProps {
  items: {
    title: string;
    details: ReactNode;
  }[];
}
