import { useState } from 'react';
import './App.css';
import AppLayout from './layout/AppLayout';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Home/Homepage';
import MoviePage from './pages/Movies/MoviePage';
import MovieDetailPage from './pages/MovieDetail/MovieDetailPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// 홈페이지 /
// 영화 전체 보여주는 페이지 (서치) /movies?q=asfed
// 영화 디테일 페이지 /movies/:id
// 리뷰 /movies/:id/reviews
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Homepage />} />
        <Route path="movies">
          <Route index element={<MoviePage />} />
          <Route path=":id" element={<MovieDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
