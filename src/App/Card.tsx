import {some} from 'fp-ts/Option';
import {useContext, type FC} from 'react';
import type {Photo} from '../DB/db';
import {CurrentPhotoContext} from './Context';

interface CardProps {
  photo: Photo;
}

export const Card: FC<CardProps> = ({photo}) => {
  const {setCurrentPhoto} = useContext(CurrentPhotoContext);

  return (
    <article className="card">
      <aside className="thumbnail">
        <img
          alt={photo.title}
          src={photo.thumbnailUrl}
          onClick={() => setCurrentPhoto(some(photo))}
        />
      </aside>

      <section>
        <dl className="meta">
          <dt>Title:</dt>
          <dd>{photo.title}</dd>
          <dt>Album:</dt>
          <dd>{photo.album}</dd>
          <dt>User:</dt>
          <dd>{photo.user.name}</dd>
        </dl>
      </section>
    </article>
  );
};
