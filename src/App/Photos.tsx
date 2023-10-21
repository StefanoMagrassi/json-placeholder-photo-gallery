import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import {type FC, useState} from 'react';
import {useDB} from '../DB/db';
import type {Model} from '../DB/model';
import type {Pagination} from '../Libs/pagination';
import {CurrentPhotoProvider} from './Context';
import {Footer} from './Footer';
import {type Filter, Header} from './Header';
import {List} from './List';
import {Modal} from './Modal';

const DEFAULT_PAGINATION: Pagination = {page: 1, size: 10};

interface PhotosProps {
  model: Model;
}

export const Photos: FC<PhotosProps> = ({model}) => {
  const {state, updatePhoto} = useDB(model);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);

  const [filter, setFilter] = useState<O.Option<Filter>>(O.none);

  const refreshWith = (f: O.Option<Filter>): void => {
    setFilter(f);
    setPagination(DEFAULT_PAGINATION);
  };

  const photos = pipe(
    filter,
    O.map(([filterBy, value]) =>
      state.filter(p => {
        switch (filterBy) {
          case 'album':
            return p.album.includes(value);

          case 'photo':
            return p.title.includes(value);

          case 'user':
            return p.user.name.includes(value);
        }
      })
    ),
    O.getOrElse(() => state)
  );

  return (
    <CurrentPhotoProvider>
      <main>
        <Header
          onApply={f => refreshWith(O.some(f))}
          onReset={() => refreshWith(O.none)}
        />

        <List photos={photos} pagination={pagination} />

        <Footer
          page={pagination.page}
          size={pagination.size}
          total={photos.length}
          onPageChange={page => setPagination(({size}) => ({page, size}))}
          onSizeChange={size => setPagination(({page}) => ({page, size}))}
        />

        <Modal onSave={updatePhoto} />
      </main>
    </CurrentPhotoProvider>
  );
};
