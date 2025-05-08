import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './FilterPanel.style.css';

// TMDB API의 주요 장르 목록
const GENRES = [
  { id: 28, name: '액션' },
  { id: 12, name: '모험' },
  { id: 16, name: '애니메이션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  { id: 18, name: '드라마' },
  { id: 14, name: '판타지' },
  { id: 27, name: '공포' },
  { id: 10749, name: '로맨스' },
  { id: 878, name: 'SF' },
  { id: 53, name: '스릴러' },
];

// 연도 옵션 생성 (현재 연도부터 1990년까지)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year);
  }
  return years;
};

const FilterPanel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 필터 상태 관리
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // 검색어 확인을 위해 searchParams 사용
  const searchTerm = searchParams.get('q');

  // URL에서 필터 파라미터 읽기
  useEffect(() => {
    // 장르 파라미터 처리
    const genreParam = searchParams.get('with_genres');
    if (genreParam) {
      setSelectedGenres(genreParam.split(',').map((id) => parseInt(id)));
    } else {
      setSelectedGenres([]);
    }

    // 연도 파라미터 처리
    const yearParam = searchParams.get('year');
    setSelectedYear(yearParam || '');

    // 정렬 파라미터 처리
    const sortParam = searchParams.get('sort_by');
    setSortBy(sortParam || 'popularity.desc');
  }, [searchParams]);

  // 장르 선택 토글
  const toggleGenre = (genreId) => {
    const isSelected = selectedGenres.includes(genreId);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  // 연도 선택 핸들러
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // 정렬 선택 핸들러
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // 필터 적용
  const applyFilters = () => {
    // 현재 URL 파라미터 유지
    const params = new URLSearchParams(searchParams);

    // 장르 파라미터 설정
    if (selectedGenres.length > 0) {
      params.set('with_genres', selectedGenres.join(','));
    } else {
      params.delete('with_genres');
    }

    if (selectedYear) {
      params.set('year', selectedYear);
    } else {
      params.delete('year');
    }

    // 정렬 파라미터 설정
    if (sortBy !== 'popularity.desc') {
      params.set('sort_by', sortBy);
    } else {
      params.delete('sort_by');
    }

    // 페이지 파라미터 초기화 (새 필터로 첫 페이지부터 보기)
    params.set('page', '1');

    // 필터 적용된 URL로 이동
    navigate({ pathname: '/movies', search: params.toString() });

    // 필터 패널 닫기
    setShowFilters(false);
  };

  // 장르 필터 제거
  const removeGenre = (genreId) => {
    // 새 배열 생성 (불변성 유지)
    const newGenres = selectedGenres.filter((id) => id !== genreId);

    // 현재 URL 파라미터 유지하면서 장르만 변경
    const params = new URLSearchParams(searchParams);

    if (newGenres.length > 0) {
      params.set('with_genres', newGenres.join(''));
    } else {
      params.delete('with_genres');
    }

    // 페이지 초기화
    params.set('page', '1');

    // 필터 적용된 URL로 이동
    navigate({ pathname: '/movies', search: params.toString() });
  };

  // 연도 필터 제거
  const removeYear = () => {
    // 현재 URL 파라미터 유지하면서 연도 제거
    const params = new URLSearchParams(searchParams);
    params.delete('year');
    params.set('page', '1');
    navigate({ pathname: '/movies', search: params.toString() });
  };

  // 정렬 필터 초기화
  const resetSort = () => {
    // 현재 URL 파라미터 유지하면서 정렬 기본값으로
    const params = new URLSearchParams(searchParams);
    params.delete('sort_by');
    params.set('page', '1');
    navigate({ pathname: '/movies', search: params.toString() });
  };

  // 필터 초기화
  const resetFilters = () => {
    // 검색어와 페이지 파라미터만 유지
    const params = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) {
      params.set('q', query);
    }
    params.set('page', '1');

    // 필터 초기화된 URL로 이동
    navigate({ pathname: '/movies', search: params.toString() });

    // 필터 상태 초기화
    setSelectedGenres([]);
    setSelectedYear('');
    setSortBy('popularity.desc');
  };

  // 검색 중이면 필터 패널을 렌더링하지 않음
  if (searchTerm) {
    return null;
  }

  return (
    <div className="filter-panel">
      <button
        className="filter-toggle-button"
        onClick={() => {
          setShowFilters(!showFilters);
        }}
        aria-expanded={showFilters}
      >
        <span>필터 {showFilters ? '접기' : '펼치기'}</span>
        <span className="filter-icon">{showFilters ? '▲' : '▼'}</span>
      </button>

      {showFilters && (
        <div className="filter-options">
          {/* 장르 필터 */}
          <div className="filter-section">
            <h3 className="filter-section-title">장르</h3>
            <div className="genre-tags">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`genre-tag ${
                    selectedGenres.includes(genre.id)
                      ? 'genre-tag-selected'
                      : ''
                  }`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* 연도 필터 */}
          <div className="filter-section">
            <h3 className="filter-section-title">개봉 연도</h3>
            <select
              className="year-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">전체 연도</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 옵션 */}
          <div className="filter-section">
            <h3 className="filter-section-title">정렬</h3>
            <select
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">인기도 (높은순)</option>
              <option value="popularity.asc">인기도 (낮은순)</option>
              <option value="vote_average.desc">평점 (높은순)</option>
              <option value="vote_average.asc">평점 (낮은순)</option>
              <option value="release_date.desc">개봉일 (최신순)</option>
              <option value="release_date.asc">개봉일 (오래된순)</option>
            </select>
          </div>

          {/* 필터 적용/초기화 버튼 */}
          <div className="filter-actions">
            <button className="filter-apply-button" onClick={applyFilters}>
              필터 적용
            </button>

            <button className="filter-reset-button" onClick={resetFilters}>
              초기화
            </button>
          </div>
        </div>
      )}

      {/* 활성화된 필터 태그 표시 */}
      {(selectedGenres.length > 0 ||
        selectedYear ||
        sortBy !== 'popularity.desc') && (
        <div className="active-filters">
          {selectedGenres?.map((genreId) => {
            const genre = GENRES.find((g) => g.id === genreId);
            return (
              genre && (
                <div key={genreId} className="active-filter-tag">
                  {genre.name}
                  <button
                    className="remove-filter"
                    onClick={() => removeGenre(genreId)}
                  >
                    x
                  </button>
                </div>
              )
            );
          })}

          {selectedYear && (
            <div className="active-filter-tag">
              {selectedYear}년
              <button className="remove-filter" onClick={removeYear}>
                x
              </button>
            </div>
          )}

          {sortBy !== 'popularity.desc' && (
            <div className="active-filter-tag">
              {sortBy.includes('popularity')
                ? '인기도'
                : sortBy.includes('vote_average')
                ? '평점'
                : '개봉일'}
              ({sortBy.includes('.desc') ? '높은순' : '낮은순'})
              <button className="remove-filter" onClick={resetSort}>
                x
              </button>
            </div>
          )}

          <button className="clear-all-filters" onClick={resetFilters}>
            모두 지우기
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
