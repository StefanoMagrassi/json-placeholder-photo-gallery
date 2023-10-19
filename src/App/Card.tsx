import type {FC} from 'react';
import type {Photo} from '../DB/model';

interface CardProps {
  photo: Photo;
}

export const Card: FC<CardProps> = ({photo}) => (
  <article className="card">
    <aside className="thumbnail">
      <img alt={photo.title} src={photo.thumbnailUrl} />
    </aside>

    <section>
      <dl className="meta">
        <dt>Title:</dt>
        <dd>{photo.title}</dd>
        <dt>Album:</dt>
        <dd></dd>
        <dt>User:</dt>
        <dd></dd>
      </dl>
    </section>
  </article>
);
