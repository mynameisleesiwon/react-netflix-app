import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.style.css';

const Card = ({ movie }) => {
  const navigate = useNavigate();

  // 영화 상세 페이지로 이동
  const goToMovieDetail = () => {
    navigate(`/movies/${movie.id}`);
  };

  // 포스터 이미지가 없는 경우 대체 이미지 사용
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // 평점을 10점 만점에서 5점 만점으로 변환
  const rating = movie.vote_average
    ? (movie.vote_average / 2).toFixed(1)
    : '평점 없음';

  return (
    <div className="movie-card" onClick={goToMovieDetail}>
      <div className="movie-poster">
        <img src={posterPath} alt={movie?.title || movie?.name} />
        <div className="movie-overlay">
          <div className="movie-info">
            <h3 className="movie-title">{movie.title || movie.name}</h3>
            <div className="movie-rating">⭐ {rating}</div>
            <p className="movie-year">
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : '출시일 정보 없음'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
