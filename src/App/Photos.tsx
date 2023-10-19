import {type FC, useState} from 'react';
import type {Model} from '../DB/model';
import {Footer} from './Footer';
import {List} from './List';
import type {Pagination} from './pagination';

interface PhotosProps {
  data: Model;
}

export const Photos: FC<PhotosProps> = ({data}) => {
  const [pagination, setPagination] = useState<Pagination>({page: 1, size: 10});

  return (
    <section>
      <List data={data} pagination={pagination} />

      <Footer
        page={pagination.page}
        size={pagination.size}
        total={data.photos.length}
        onPageChange={page => setPagination(({size}) => ({page, size}))}
        onSizeChange={size => setPagination(({page}) => ({page, size}))}
      />
    </section>
  );
};
