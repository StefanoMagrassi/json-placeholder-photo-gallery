import {type FC, useState} from 'react';
import {useDB} from '../DB/db';
import type {Model} from '../DB/model';
import {Footer} from './Footer';
import {List} from './List';
import type {Pagination} from './pagination';

interface PhotosProps {
  model: Model;
}

export const Photos: FC<PhotosProps> = ({model}) => {
  const {state} = useDB(model);
  const [pagination, setPagination] = useState<Pagination>({page: 1, size: 10});

  return (
    <main>
      <List photos={state} pagination={pagination} />

      <Footer
        page={pagination.page}
        size={pagination.size}
        total={model.photos.length}
        onPageChange={page => setPagination(({size}) => ({page, size}))}
        onSizeChange={size => setPagination(({page}) => ({page, size}))}
      />
    </main>
  );
};
