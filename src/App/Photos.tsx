import {type FC, useState} from 'react';
import {useDB} from '../DB/db';
import type {Model} from '../DB/model';
import type {Pagination} from '../Libs/pagination';
import {CurrentPhotoProvider} from './Context';
import {Footer} from './Footer';
import {Header} from './Header';
import {List} from './List';
import {Modal} from './Modal';

const DEFAULT_PAGINATION: Pagination = {page: 1, size: 10};

interface PhotosProps {
  model: Model;
}

export const Photos: FC<PhotosProps> = ({model}) => {
  const {state, updatePhoto} = useDB(model);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);

  const [photos, setPhotos] = useState(state);

  const refreshWith = (s: typeof photos): void => {
    setPhotos(s);
    setPagination(DEFAULT_PAGINATION);
  };

  return (
    <CurrentPhotoProvider>
      <main>
        <Header
          onApply={([filterBy, value]) => {
            refreshWith(
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
            );
          }}
          onReset={() => refreshWith(state)}
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
