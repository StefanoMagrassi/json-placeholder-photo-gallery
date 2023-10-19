import type {FC} from 'react';
import type {Photo} from '../DB/model';

interface CardProps {
  photo: Photo;
}

export const Card: FC<CardProps> = ({photo}) => (
  <article className="card">
    <header>
      <h1>{photo.title}</h1>
    </header>
    <section className="card-body">
      <img className="thumbnail" alt={photo.title} src={photo.thumbnailUrl} />
      <dl className="card-meta">
        <dt>Album:</dt>
        <dd></dd>
        <dt>User:</dt>
        <dd></dd>
      </dl>
    </section>
  </article>
);
