import React, { useEffect, useRef, useState } from 'react';
import './Banner.style.css';
import { useMoviesQuery } from '../../../../hooks/useMoviesQuery';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const { data, isLoading, isError, error } = useMoviesQuery('popular', {});

  const [movie, setMovie] = useState(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [backgroundPosition, setBackgroundPosition] = useState(0);

  const animationRef = useRef(null);

  const navigate = useNavigate();

  // 영화 데이터가 로드되면 영화 선택
  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      setMovie(data.results[currentMovieIndex]);
      setFadeIn(true);
      setBackgroundPosition(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animateBackground);
    }
  }, [data, currentMovieIndex]);

  // 일정 시간마다 다른 영화로 배너 변경
  useEffect(() => {
    const timer = setInterval(() => {
      if (data && data.results) {
        setFadeIn(false);

        setTimeout(() => {
          const nextIndex = (currentMovieIndex + 1) % data.results.length;
          setCurrentMovieIndex(nextIndex);
        }, 500);
      }
    }, 15000); // 15초마다 변경

    return () => {
      clearInterval(timer);
    };
  }, [data, currentMovieIndex]);

  // 배경 이미지 움직임 애니메이션
  const animateBackground = () => {
    setBackgroundPosition((prevPos) => {
      // 배경 위치가 30%를 넘으면 멈춤 (이동 범위 제한)
      if (prevPos >= 30) {
        cancelAnimationFrame(animationRef.current);
        return prevPos;
      }

      // 매우 작은 값씩 증가 (천천히 이동)
      return prevPos + 0.05;
    });

    animationRef.current = requestAnimationFrame(animateBackground);
  };

  // 영화 줄거리 자르기 (너무 길면 ...으로 표시)
  const truncateText = (text, limit) => {
    return text?.length > limit ? text.substr(0, limit - 1) + '...' : text;
  };

  // 영화 상세 페이지로 이동
  const goToMovieDetail = () => {
    if (movie) {
      navigate(`/movies/${movie.id}`);
    }
  };

  if (isLoading) {
    return <div className="banner-skeleton"></div>;
  }

  if (isError) {
    return (
      <div className="banner-error">
        영화 정보를 불러오는데 실패했습니다: {error.message}
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div
      className={`banner ${fadeIn ? 'fade-in' : 'fade-out'}`}
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: `${backgroundPosition}% center`,
      }}
    >
      <div className="banner-contents">
        <h1 className="banner-title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner-description">
          {truncateText(movie?.overview, 150)}
        </div>
        <div className="banner-buttons">
          <button
            className="banner-button detail-button"
            onClick={goToMovieDetail}
          >
            상세 정보
          </button>
        </div>
      </div>
      <div className="banner-fadeBottom"></div>
    </div>
  );
};

export default Banner;
