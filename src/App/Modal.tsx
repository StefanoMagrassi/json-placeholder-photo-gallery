import {isSome, none} from 'fp-ts/Option';
import {useRef, type FC, useEffect, useContext} from 'react';
import type {Photo} from '../DB/db';
import {CurrentPhotoContext} from './Context';

interface ModalProps {
  onSave: (photo: Photo) => void;
}

export const Modal: FC<ModalProps> = ({onSave}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {currentPhoto: photo, setCurrentPhoto} =
    useContext(CurrentPhotoContext);

  const hasPhoto = isSome(photo);

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
              <dl className="meta">
                <dt>
                  <label htmlFor="title">Title:</label>
                </dt>
                <dd>
                  <input
                    ref={inputRef}
                    id="title"
                    type="text"
                    name="title"
                    defaultValue={photo.value.title}
                  />
                </dd>
                <dt>Album:</dt>
                <dd>{photo.value.album}</dd>
                <dt>User name:</dt>
                <dd>{photo.value.user.name}</dd>
                <dt>User email:</dt>
                <dd>{photo.value.user.email}</dd>
              </dl>
            </section>

            <footer>
              <button onClick={() => setCurrentPhoto(none)}>Close</button>
              <button
                onClick={() => {
                  onSave({
                    ...photo.value,
                    title: inputRef.current?.value ?? photo.value.title
                  });

                  return setCurrentPhoto(none);
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
