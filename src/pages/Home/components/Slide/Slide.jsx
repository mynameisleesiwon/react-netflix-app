import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '../Card/Card';
import './Slide.style.css';
import { useMoviesQuery } from '../../../../hooks/useMoviesQuery';

const Slide = ({
  title = '인기 영화',
  category = 'popular',
  option = {},
  data = null,
  isLoading: externalLoading = false,
  hideTitle = false,
}) => {
  // 외부에서 data를 받지 않은 경우에만 API 요청
  const {
    data: apiData,
    isLoading: apiLoading,
    isError,
    error,
  } = useMoviesQuery(
    category,
    option,
    { enabled: !data } // data가 외부에서 제공되면 API 요청 비활성화
  );

  // 외부 데이터 또는 API 데이터 사용
  const movies = data || apiData;
  const isLoading = externalLoading || apiLoading;

  // 커스텀 화살표 컴포넌트
  function CustomNextArrow(props) {
    const { onClick } = props;
    return (
      <div className="custom-arrow custom-next-arrow" onClick={onClick}>
        &#10095;
      </div>
    );
  }

  function CustomPrevArrow(props) {
    const { onClick } = props;
    return (
      <div className="custom-arrow custom-prev-arrow" onClick={onClick}>
        &#10094;
      </div>
    );
  }

  // 슬라이더 설정
  const settings = {
    dots: false,
    infinite: true, // 무한 루프 설정
    speed: 500,
    slidesToShow: 6, // 기본 개수 (CSS에서 더 세밀하게 조정)
    slidesToScroll: 5, // 한 번에 스크롤할 카드 수
    swipeToSlide: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    arrows: true,
  };

  if (isLoading) {
    return (
      <div className="slide-container">
        <h2 className="slide-title">{title}</h2>
        <div className="slide-loading">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="card-skeleton"></div>
            ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="slide-container">
        <h2 className="slide-title">{title}</h2>
        <div className="slide-error">
          영화 정보를 불러오는데 실패했습니다: {error.message}
        </div>
      </div>
    );
  }

  // 영화 데이터가 없는 경우
  if (!movies || !movies.results || movies.results.length === 0) {
    return (
      <div className="slide-container">
        {!hideTitle && <h2 className="slide-title">{title}</h2>}
        <div className="slide-empty">표시할 영화가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="slide-container">
      {!hideTitle && <h2 className="slide-title">{title}</h2>}

      <div className="slick-slider-container">
        <Slider {...settings}>
          {movies.results.map((movie) => (
            <div key={movie.id} className="movie-slide-item">
              <Card movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;
