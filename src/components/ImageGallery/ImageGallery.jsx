

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Loader } from '../Loader/Loader';
import { Button } from '../Button/Button';

export const ImageGallery = ({ onClick, inputValue, page, loadMoreBtn }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [disableLoadMoreBtn, setDisableLoadMoreBtn] = useState(false);

  const getImages = async (inputValue, page = 1) => {
    const url = 'https://pixabay.com/api/';
    const API_KEY = '35274925-eeeea550779812487c02d925d';

    return await fetch(
      `${url}?q=${inputValue}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    ).then(res => res.json());
  };

  useEffect(() => {
    const fetchLoad = () => {
      setStatus('pending');

      getImages(inputValue, page)
        .then(response => {
          if (page === 1) {
            setImages(response.hits);
          } else {
            setImages(prevImages => [...prevImages, ...response.hits]);
          }

          setStatus('resolve');

          if (response.hits.length < 12) {
            setDisableLoadMoreBtn(true);
          } else {
            setDisableLoadMoreBtn(false);
          }
        })
        .catch(error => setStatus('rejected'));
    };

    fetchLoad();
  }, [inputValue, page]);

  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'resolve') {
    return (
      <>
        <ul className='ImageGallery'>
          {images.map(({ id, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={id}
              url={largeImageURL}
              tags={tags}
              onClick={onClick}
            />
          ))}
        </ul>
        {!disableLoadMoreBtn && (
          <Button onClick={loadMoreBtn} disabled={disableLoadMoreBtn}>
            Load More
          </Button>
        )}
      </>
    );
  }

};

ImageGallery.propTypes = {
  onClick: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  loadMoreBtn: PropTypes.func.isRequired,
};
