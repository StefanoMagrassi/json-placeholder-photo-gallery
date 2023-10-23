import type {FC} from 'react';
import type {Photo} from '../DB/db';
import {type Pagination, paginate} from '../Libs/pagination';
import {Card} from './Card';

interface ListProps {
  photos: Photo[];
  pagination: Pagination;
}

export const List: FC<ListProps> = ({photos, pagination}) =>
  photos.length ? (
    <ul className="photos">
      {paginate(photos)(pagination).map(photo => (
        <li key={`card_${photo.id}`} data-photo-id={photo.id}>
          <Card photo={photo} />
        </li>
      ))}
    </ul>
  ) : (
    <div className="no-data">No results</div>
  );
