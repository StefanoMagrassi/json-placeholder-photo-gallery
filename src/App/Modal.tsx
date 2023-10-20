import * as O from 'fp-ts/Option';
import {type FC, useRef, useEffect, useContext} from 'react';
import type {Photo} from '../DB/db';
import {CurrentPhotoContext} from './Context';
import {Rating} from './Rating';

interface ModalProps {
  onSave: (photo: Photo) => void;
}

export const Modal: FC<ModalProps> = ({onSave}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ratingRef = useRef<Photo['rating']>(O.none);

  const {currentPhoto: photo, setCurrentPhoto} =
    useContext(CurrentPhotoContext);

  const hasPhoto = O.isSome(photo);

  useEffect(
    () => (hasPhoto ? ref.current?.showModal() : ref.current?.close()),
    [hasPhoto]
  );

  return (
    <dialog ref={ref} className="modal">
      {hasPhoto && (
        <>
          <img
            className="image"
            alt={photo.value.title}
            src={photo.value.url}
          />

          <form>
            <section>
              <div className="field">
                <label htmlFor="title">Title:</label>
                <input
                  ref={inputRef}
                  id="title"
                  type="text"
                  name="title"
                  style={{width: '100%'}}
                  defaultValue={photo.value.title}
                />
              </div>

              <Rating
                value={photo.value.rating}
                onChange={v => {
                  ratingRef.current = O.some(v);
                }}
              />

              <dl className="meta">
                <dt>Album:</dt>
                <dd>{photo.value.album}</dd>
                <dt>User name:</dt>
                <dd>{photo.value.user.name}</dd>
                <dt>User email:</dt>
                <dd>{photo.value.user.email}</dd>
              </dl>
            </section>

            <footer>
              <button onClick={() => setCurrentPhoto(O.none)}>Close</button>
              <button
                onClick={() => {
                  onSave({
                    ...photo.value,
                    title: inputRef.current?.value ?? photo.value.title,
                    rating: ratingRef.current
                  });

                  return setCurrentPhoto(O.none);
                }}
              >
                Save
              </button>
            </footer>
          </form>
        </>
      )}
    </dialog>
  );
};
