import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useMoviesQuery = (category = 'popular', options = {}) => {
  // API 경로 결정
  let endpoint = '';

  // 카테고리에 따른 엔드포인트 설정
  switch (category) {
    case 'top_rated':
      endpoint = '/movie/top_rated';
      break;
    case 'upcoming':
      endpoint = '/movie/upcoming';
      break;
    case 'now_playing':
      endpoint = '/movie/now_playing';
      break;
    case 'popular':
    default:
      endpoint = '/movie/popular';
      break;
  }

  // 영화 데이터 가져오기
  const fetchMovies = () => {
    return api.get(endpoint, { params: options }).then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['movies', category, options],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
  });
};

// 영화 상세 정보를 가져오는 훅
export const useMovieDetailQuery = (movieId, options = {}) => {
  // 영화 상세 정보 가져오기
  const fetchMovieDetail = () => {
    return api
      .get(`/movie/${movieId}`, { params: options })
      .then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: fetchMovieDetail,
    enabled: !!movieId, // movieId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분 동안 데이터 유지
    gcTime: 60 * 60 * 1000, // 60분 동안 캐시 유지
  });
};

// 영화 출연진 정보를 가져오는 훅
export const useMovieCreditsQuery = (movieId, options = {}) => {
  // 출연진 정보 가져오기
  const fetchMovieCredits = () => {
    return api
      .get(`/movie/${movieId}/credits`, { params: options })
      .then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: fetchMovieCredits,
    enabled: !!movieId, // movieId가 있을 때만 실행
    staleTime: 60 * 60 * 1000, // 60분 동안 데이터 유지 (출연진은 잘 변하지 않음)
  });
};

// 비슷한 영화 정보를 가져오는 훅
export const useSimilarMoviesQuery = (movieId, options = {}) => {
  // 비슷한 영화 정보 가져오기
  const fetchSimilarMovies = () => {
    return api
      .get(`/movie/${movieId}/similar`, { params: options })
      .then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['movie', movieId, 'similar'],
    queryFn: fetchSimilarMovies,
    enabled: !!movieId, // movieId가 있을 때만 실행
    staleTime: 30 * 60 * 1000, // 30분 동안 데이터 유지
  });
};

// 영화 비디오(트레일러) 정보를 가져오는 훅
export const useMovieVideosQuery = (movieId, options = {}) => {
  // 영화 비디오 정보 가져오기
  const fetchMovieVideos = () => {
    return api
      .get(`/movie/${movieId}/videos`, { params: options })
      .then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['movie', movieId, 'videos'],
    queryFn: fetchMovieVideos,
    enabled: !!movieId, // movieId가 있을 때만 실행
    staleTime: 24 * 60 * 60 * 1000, // 24시간 동안 데이터 유지 (트레일러는 잘 변하지 않음)
  });
};

// 영화 검색을 위한 훅
export const useSearchMoviesQuery = (searchTerm, page = 1, options = {}) => {
  // 검색 요청 함수
  const fetchSearchMovies = () => {
    // 검색어가 없으면 빈 결과 반환
    if (!searchTerm)
      return Promise.resolve({ result: [], total_pages: 0, total_results: 0 });

    return api
      .get('/search/movie', {
        params: {
          query: searchTerm,
          page,
          ...options,
        },
      })
      .then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['searchMovies', searchTerm, page, options],
    queryFn: fetchSearchMovies,
    enabled: !!searchTerm, // 검색어가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분동안 데이터 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
  });
};

// 필터링된 영화 목록
export const useDiscoverMoviesQuery = (options = {}) => {
  // 기본 옵션 설정
  const params = {
    language: 'ko-KR',
    include_adult: false,
    ...options,
  };

  // 영화 데이터 가져오기
  const fetchMovies = () => {
    return api.get('/discover/movie', { params }).then((res) => res.data);
  };

  // React Query를 사용해 데이터 요청 및 캐싱
  return useQuery({
    queryKey: ['discover', options],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
  });
};
