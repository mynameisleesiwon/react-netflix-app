import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from './components/MovieGrid/MovieGrid';
import './MoviePage.style.css';
import Pagination from './components/Pagination/Pagination';
import FilterPanel from './components/FilterPanel/FilterPanel';

const MoviePage = () => {
  // URL 검색 파라미터 관리
  const [searchParams] = useSearchParams();

  // 검색어와 페이지 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // URL 파라미터가 변경될 때마다 상태 업데이트
  useEffect(() => {
    // AppLayout에서 'q' 파라미터로 검색어 전달
    const query = searchParams.get('q') || '';
    setSearchTerm(query);

    // 페이지 파라미터 처리
    const page = parseInt(searchParams.get('page') || '1');
    setCurrentPage(page);

    // 페이지 로드 시 스크롤 맨 위로 이동
    window.scrollTo(0, 0);
  }, [searchParams]);

  // 총 데이터 갯수
  const handleTotalResultsChange = (results) => {
    setTotalResults(results);
  };

  // 총 페이지 수 변경 처리
  const handleTotalPagesChange = (pages) => {
    setTotalPages(pages);
  };

  return (
    <div className="movie-page">
      <div className="movie-page-container">
        <h1 className="movie-page-title">
          {searchTerm ? `"${searchTerm}" 검색 결과 ` : '인기 영화'}
          {searchTerm && totalResults !== undefined && totalResults !== 0 ? (
            <span>{`${totalResults}개`}</span>
          ) : (
            ''
          )}
        </h1>

        <FilterPanel />

        <MovieGrid
          searchTerm={searchTerm}
          currentPage={currentPage}
          onTotalResultsChange={handleTotalResultsChange}
          onTotalPagesChange={handleTotalPagesChange}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default MoviePage;
