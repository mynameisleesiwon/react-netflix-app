import React from 'react';
import Banner from './components/Banner/Banner';
import Slide from './components/Slide/Slide';

// 1. 배너 => popular 영화를 들고 와서 첫 번째 아이템을 보여주자.
// 2. popular moive
// 3. top rated movie
// 4. upcoming movie
const Homepage = () => {
  return (
    <div>
      <Banner />
      <Slide title="인기 영화" category="popular" />
      <Slide title="평점 높은 영화" category="top_rated" />
      <Slide title="개봉 예정 영화" category="upcoming" />
    </div>
  );
};

export default Homepage;
