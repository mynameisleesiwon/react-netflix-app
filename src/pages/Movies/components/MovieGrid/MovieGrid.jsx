import React, { useEffect } from 'react';
import './MovieGrid.style.css';
import {
  useDiscoverMoviesQuery,
  useMoviesQuery,
  useSearchMoviesQuery,
} from '../../../../hooks/useMoviesQuery';
import Card from '../../../Home/components/Card/Card';
import { useSearchParams } from 'react-router-dom';

const MovieGrid = ({
  searchTerm,
  currentPage,
  onTotalResultsChange,
  onTotalPagesChange,
}) => {
  const [searchParams] = useSearchParams();

  // 필터 파라미터 읽기
  const withGenres = searchParams.get('with_genres');
  const year = searchParams.get('year');
  const sortBy = searchParams.get('sort_by');

  // 필터 옵션 구성
  const filterOptions = {
    with_genres: withGenres,
    primary_release_year: year,
    sort_by: sortBy || 'popularity.desc',
    page: currentPage,
  };

  // 적절한 쿼리 선택
  // 1. 검색어가 있으면 검색 쿼리 실행
  // 2. 필터가 있으면 discover 쿼리 실행
  // 3. 둘 다 없으면 인기 영화 표시
  const searchQuery = useSearchMoviesQuery(searchTerm, currentPage);
  const discoverQuery = useDiscoverMoviesQuery(filterOptions);
  const popularQuery = useMoviesQuery('popular', { page: currentPage });

  // 현재 사용할 쿼리 선택
  const activeQuery = searchTerm
    ? searchQuery
    : withGenres || year || sortBy
    ? discoverQuery
    : popularQuery;

  const { data, isLoading, error } = activeQuery;

  // 총 페이지 수 변경 시 부모 컴포넌트에 알림
  // 페이지네이션 컴포넌트에서 사용할 총 페이지 수 정보 전달
  useEffect(() => {
    if (data?.total_pages && onTotalPagesChange) {
      onTotalPagesChange(data.total_pages);
    }
  }, [data?.total_pages, onTotalPagesChange]);

  // 총 데이터 수 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onTotalResultsChange(data?.total_results);
  }, [data?.total_results, onTotalResultsChange]);

  // 로딩 상태 표시
  // 스켈레톤 UI로 로딩 중임을 시각적으로 표현
  if (isLoading) {
    return (
      <div className="movie-grid">
        {/* 스켈레톤 UI 생성 (20개 영화 카드 형태) */}
        {Array(20)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="movie-grid-card-skeleton">
              <div className="movie-grid-card-skeleton-image"></div>
              <div className="movie-grid-card-skeleton-title"></div>
              <div className="movie-grid-card-skeleton-year"></div>
            </div>
          ))}
      </div>
    );
  }

  // 에러 상태 표시
  // API 호출 중 오류 발생 시 사용자에게 친절한 에러 메시지 표시
  if (error) {
    return (
      <div className="movie-grid-error">
        <h3>😥 영화 정보를 불러오는 중 오류가 발생했습니다</h3>
        <p>잠시 후 다시 시도해주세요.</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  // 검색 결과 없음
  if (data?.results?.length === 0) {
    return (
      <div className="movie-grid-empty">
        <h3>
          {searchTerm
            ? `🔍 "${searchTerm}"에 대한 검색 결과가 없습니다`
            : withGenres || year
            ? '🎬 선택한 필터에 맞는 영화가 없습니다'
            : '영화 목록을 불러올 수 없습니다'}
        </h3>
        <p>
          {searchTerm
            ? '다른 검색어로 시도해보세요.'
            : withGenres || year
            ? '필터 옵션을 변경해보세요.'
            : '잠시 후 다시 시도해주세요.'}
        </p>
      </div>
    );
  }

  // 영화 목록 표시
  return (
    <div className="movie-grid">
      {data?.results?.map((movie) => (
        <Card key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
