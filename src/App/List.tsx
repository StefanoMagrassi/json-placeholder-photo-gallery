import type {FC} from 'react';
import type {Photo} from '../DB/db';
import {Card} from './Card';
import {type Pagination, paginate} from './pagination';

interface ListProps {
  photos: Photo[];
  pagination: Pagination;
}

export const List: FC<ListProps> = ({photos, pagination}) => (
  <ul className="photos">
    {paginate(photos)(pagination).map(photo => (
      <li key={photo.id}>
        <Card photo={photo} />
      </li>
    ))}
  </ul>
);
