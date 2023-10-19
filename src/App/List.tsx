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
    <ul>
      {photos.map(photo => (
        <Card key={photo.id} photo={photo} />
      ))}
    </ul>
  );
};
