import {FC} from 'react';
import type {Model} from '../DB/model';
import {Card} from './Card';
import {type Pagination, paginate} from './pagination';

interface ListProps {
  data: Model;
  pagination: Pagination;
}

export const List: FC<ListProps> = ({data, pagination}) => {
  const photos = paginate(data.photos)(pagination);

  return (
    <ul className="photos">
      {photos.map(photo => (
        <li key={photo.id}>
          <Card photo={photo} />
        </li>
      ))}
    </ul>
  );
};
