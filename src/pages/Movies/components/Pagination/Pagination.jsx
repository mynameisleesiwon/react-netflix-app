import React from 'react';
import './Pagination.style.css';
import { Link, useSearchParams } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, searchTerm }) => {
  const [searchParams] = useSearchParams();

  // 실제 제한된 총 페이지 수 계산 (TMDB API의 실제 제한을 고려)
  const SAFE_MAX_PAGES = 500; // TMDB API의 일반적인 최대 제한
  const safeTotalPages = Math.min(totalPages, SAFE_MAX_PAGES);

  // 페이지 총 개수에 따라 표시할 페이지 버튼 수 결정
  const maxPageButtons = 5;

  // 페이지 범위 계산 (현재 페이지 중심으로 최대 5개 버튼)
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(safeTotalPages, startPage + maxPageButtons - 1);

  // startPage 재조정 (endPage가 totalPages에 도달했을 때)
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 현재 URL 파라미터 유지하면서 페이지만 변경하는 함수
  const getPageUrl = (page) => {
    // 현재 모든 URL 파라미터 복사
    const params = new URLSearchParams(searchParams);

    // 페이지 파라미터만 변경
    params.set('page', page.toString());

    // 변경된 파라미터로 URL 생성
    return `/movies?${params.toString()}`;
  };

  // 페이지 수가 1페이지 이하면 페이지네이션 표시 안함
  if (safeTotalPages <= 1) return null;

  return (
    <div className="pagination">
      {/* 첫 페이지 버튼 */}
      {currentPage > 1 && (
        <Link
          to={getPageUrl(1)}
          className="pagination-button pagination-prev"
          aria-label="첫 페이지로 이동"
        >
          «
        </Link>
      )}

      {/* 이전 페이지 버튼 */}
      {currentPage > 1 && (
        <Link
          to={getPageUrl(currentPage - 1)}
          className="pagination-button pagination-prev"
          aria-label="이전 페이지로 이동"
        >
          ‹
        </Link>
      )}

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((number) => (
        <Link
          key={number}
          to={getPageUrl(number)}
          className={`pagination-button ${
            number === currentPage ? 'pagination-active' : ''
          }`}
          aria-label={`${number} 페이지로 이동`}
          aria-current={number === currentPage ? 'page' : undefined}
        >
          {number}
        </Link>
      ))}

      {/* 다음 페이지 버튼 */}
      {currentPage < safeTotalPages && (
        <Link
          to={getPageUrl(currentPage + 1)}
          className="pagination-button pagination-next"
          aria-label="다음 페이지로 이동"
        >
          ›
        </Link>
      )}

      {/* 마지막 페이지 버튼 */}
      {currentPage < safeTotalPages && (
        <Link
          to={getPageUrl(safeTotalPages)}
          className="pagination-button pagination-last"
          aria-label="마지막 페이지로 이동"
        >
          »
        </Link>
      )}
    </div>
  );
};

export default Pagination;
