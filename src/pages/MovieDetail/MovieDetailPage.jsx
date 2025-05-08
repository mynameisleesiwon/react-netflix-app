import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetailPage.style.css';
import {
  useMovieCreditsQuery,
  useMovieDetailQuery,
  useMovieVideosQuery,
  useSimilarMoviesQuery,
} from '../../hooks/useMoviesQuery';
import Slide from '../Home/components/Slide/Slide';

const MovieDetailPage = () => {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);

  // URL에서 영화 ID 가져오기
  const { id } = useParams();

  // 영화 상세 정보 가져오기
  const { data: movie, isLoading, isError, error } = useMovieDetailQuery(id);

  // 영화 출연진 가져오기
  const { data: credits, isLoading: isCreditsLoading } =
    useMovieCreditsQuery(id);

  // 비슷한 영화 가져오기
  const { data: similarMovies, isLoading: isSimilarLoading } =
    useSimilarMoviesQuery(id);

  // 영화 트레일러 가져오기
  const { data: videos, isLoading: isVideosLoading } = useMovieVideosQuery(id);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 상영 시간 포맷팅
  const formatRunTime = (minutes) => {
    if (!minutes) return '정보 없음';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  // 트레일러 필터링 함수
  const getTrailers = () => {
    if (!videos || !videos.results) return [];

    // 공식 트레일러만 필터링 (한국어 또는 영어)
    return videos.results.filter(
      (video) =>
        (video.type === 'Trailer' || video.type === 'Teaser') &&
        (video.iso_639_1 === 'ko' || video.iso_639_1 === 'en')
    );
  };

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // 페이지 로드 시 스크롤 맨 위로 이동
    window.scrollTo(0, 0);
  }, [id]); // 영화 ID가 바뀔 때마다 실행

  // 스크롤 위치에 따른 배경 이미지 스타일 계산
  const backgroundStyle = {
    backgroundImage: movie?.backdrop_path
      ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
      : 'none',
    backgroundPosition: `center ${20 + scrollPosition * 0.1}%`,
    opacity: Math.max(0.3, 1 - scrollPosition * 0.002),
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="movie-detail-error">
        <h2>오류가 발생했습니다</h2>
        <p>{error?.message || '영화 정보를 불러오는데 실패했습니다.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 영화 데이터가 없는 경우
  if (!movie) {
    return (
      <div className="movie-detail-not-found">
        <h2>영화를 찾을 수 없습니다</h2>
        <p>요청하신 영화 정보가 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <div
        className="movie-detail-scroll-progress"
        style={{
          width: `${Math.min(
            100,
            (scrollPosition /
              (document.body.scrollHeight - window.innerHeight)) *
              100
          )}%`,
        }}
      ></div>

      {/* 배경 이미지 */}
      <div className="movie-detail-backdrop" style={backgroundStyle}>
        <div
          className="movie-detail-backdrop-overlay"
          style={{
            background: `linear-gradient(
        to bottom,
        rgba(20, 20, 20, ${0.6 + Math.min(0.3, scrollPosition * 0.001)}) 0%,
        rgba(20, 20, 20, ${0.7 + Math.min(0.2, scrollPosition * 0.001)}) 40%,
        #141414 100%
      )`,
          }}
        ></div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="movie-detail-content" ref={contentRef}>
        <div className="movie-detail-header">
          <h1
            className="movie-detail-title"
            style={{
              fontSize: `${Math.max(2, 3 - scrollPosition * 0.005)}rem`,
              marginBottom: `${Math.max(5, 10 - scrollPosition * 0.05)}px`,
            }}
          >
            {movie.title}
            {movie.release_date && (
              <span
                className="movie-detail-year"
                style={{
                  fontSize: `${Math.max(1.3, 2 - scrollPosition * 0.005)}rem`,
                }}
              >
                ({new Date(movie.release_date).getFullYear()})
              </span>
            )}
          </h1>

          {/* 기본 영화 정보 */}
          <div className="movie-detail-meta">
            <span className="movie-detail-release-data">
              {formatDate(movie.release_date)}
            </span>
            {movie.runtime > 0 && (
              <>
                <span className="movie-detail-meta-divider">•</span>
                <span className="movie-detail-runtime">
                  {formatRunTime(movie.runtime)}
                </span>
              </>
            )}
            {movie.vote_average > 0 && (
              <>
                <span className="movie-detail-rating">
                  ⭐ {(movie.vote_average / 2).toFixed(1)}/5
                </span>
              </>
            )}
          </div>

          {/* 장르 태그 */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-detail-genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="movie-detail-genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* 영화 개요 */}
          <div className="movie-detail-overview">
            <h3>개요</h3>
            <p>{movie.overview || '줄거리 정보가 없습니다.'}</p>
          </div>
        </div>

        <div className="movie-detail-main">
          {/* 포스터 섹션 */}
          <div className="movie-detail-poster-container">
            <div className="movie-detail-poster">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
              />
            </div>

            {/* 제작사 로고 (있을 경우) */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div className="movie-detail-companies">
                  <h4>제작사</h4>
                  <div className="movie-detail-company-list">
                    {movie.production_companies.map((company) => (
                      <div key={company.id} className="movie-detail-company">
                        {company.logo_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                          />
                        ) : (
                          <span>{company.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* 세부 정보 섹션 */}
          <div className="movie-detail-info">
            <div className="movie-detail-info-section">
              <h3>영화 정보</h3>
              <div className="movie-detail-info-grid">
                {movie.original_title !== movie.title && (
                  <div className="movie-detail-info-item">
                    <span className="movie-detail-info-label">원제목</span>
                    <span className="movie-detail-info-value">
                      {movie.original_title}
                    </span>
                  </div>
                )}

                <div className="movie-detail-info-item">
                  <span className="movie-detail-info-label">상태</span>
                  <span className="movie-detail-info-value">
                    {movie.status === 'Released' ? '개봉됨' : movie.status}
                  </span>
                </div>

                <div className="movie-detail-info-item">
                  <span className="movie-detail-info-label">원어</span>
                  <span className="movie-detail-info-value">
                    {movie.original_language === 'en'
                      ? '영어'
                      : movie.original_language === 'ko'
                      ? '한국어'
                      : movie.original_language}
                  </span>
                </div>

                {movie.budget > 0 && (
                  <div className="movie-detail-info-item">
                    <span className="movie-detail-info-label">예산</span>
                    <span className="movie-detail-info-value">
                      ${movie.budget.toLocaleString()}
                    </span>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div className="movie-detail-info-item">
                    <span className="movie-detail-info-label">수익</span>
                    <span className="movie-detail-info-value">
                      ${movie.revenue.toLocaleString()}
                    </span>
                  </div>
                )}

                {movie.production_countries &&
                  movie.production_countries.length > 0 && (
                    <div className="movie-detail-info-item">
                      <span className="movie-detail-info-label">제작 국가</span>
                      <span className="movie-detail-info-value">
                        {movie.production_countries
                          .map((country) => country.name)
                          .join(', ')}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* 영화 줄거리 (모바일에서는 여기로 이동) */}
            <div className="movie-detail-mobile-overview">
              <h3>개요</h3>
              <p>{movie.overview || '줄거리 정보가 없습니다.'}</p>
            </div>
          </div>
        </div>

        {!isVideosLoading && getTrailers().length > 0 && (
          <div className="movie-detail-trailer-section">
            <h2 className="movie-detail-section-title">트레일러</h2>

            {selectedTrailer ? (
              <div className="movie-detail-trailer-player">
                <div className="movie-detail-trailer-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1`}
                    title={selectedTrailer.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <button
                  className="movie-detail-close-trailer"
                  onClick={() => setSelectedTrailer(null)}
                >
                  닫기
                </button>
              </div>
            ) : (
              <div className="movie-detail-trailer-list">
                {getTrailers()
                  .slice(0, 3)
                  .map((trailer) => (
                    <div
                      key={trailer.id}
                      className="movie-detail-trailer-card"
                      onClick={() => setSelectedTrailer(trailer)}
                    >
                      <div className="movie-detail-trailer-thumbnail">
                        <img
                          src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                          alt={trailer.name}
                        />
                        <div className="movie-detail-play-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="movie-detail-trailer-info">
                        <h4 className="movie-detail-trailer-name">
                          {trailer.name}
                        </h4>
                        <p className="movie-detail-trailer-type">
                          {trailer.type}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="movie-detail-cast-section">
          <h2 className="movie-detail-section-title">주요 출연진</h2>

          {isCreditsLoading ? (
            <div className="movie-detail-cast-loading">
              <div className="movie-detail-loading-text">
                출연진 정보를 불러오는 중...
              </div>
            </div>
          ) : credits && credits.cast && credits.cast.length > 0 ? (
            <div className="movie-detail-cast-slider">
              <div className="movie-detail-cast-container">
                {credits.cast.slice(0, 10).map((person) => (
                  <div key={person.id} className="movie-detail-cast-card">
                    <div className="movie-detail-cast-image">
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                            : 'https://via.placeholder.com/185x278?text=No+Image'
                        }
                        alt={person.name}
                      />
                    </div>
                    <div className="movie-detail-cast-info">
                      <h4 className="movie-detail-cast-name">{person.name}</h4>
                      <p className="movie-detail-cast-character">
                        {person.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="movie-detail-no-cast">출연진 정보가 없습니다.</div>
          )}
        </div>

        {similarMovies &&
          similarMovies.results &&
          similarMovies.results.length > 0 && (
            <div className="movie-detail-similar-section">
              <h2 className="movie-detail-section-title">비슷한 영화</h2>
              <Slide
                title=""
                data={similarMovies}
                isLoading={isSimilarLoading}
                hideTitle={true}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
