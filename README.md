# 🎬 넷플릭스 데모 애플리케이션

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?logo=vite)
![React Query](https://img.shields.io/badge/React_Query-5.75.2-FF4154?logo=reactquery)

## 📋 프로젝트 소개

이 프로젝트는 React와 TMDB API를 활용한 넷플릭스 스타일의 영화 정보 웹 애플리케이션입니다. 사용자는 최신 인기 영화, 평점 높은 영화, 개봉 예정 영화 등을 둘러보고 검색할 수 있으며, 각 영화에 대한 상세 정보도 확인할 수 있습니다.

## ✨ 주요 기능

- **메인 페이지**: 배너 슬라이더와 카테고리별 영화 슬라이드 제공
- **영화 검색**: 영화 제목으로 검색 가능
- **영화 필터링**: 장르, 개봉 연도, 정렬 방식 등 다양한 필터 옵션 제공
- **영화 상세 정보**: 영화에 대한 상세 정보, 출연진, 트레일러, 비슷한 영화 추천
- **반응형 디자인**: 모바일부터 데스크탑까지 다양한 디바이스 지원

## 🛠️ 기술 스택

- **프론트엔드**:

  - React 19
  - React Router 7
  - React Query (TanStack Query) 5
  - React Slick (캐러셀)
  - CSS 모듈

- **도구**:

  - Vite (빌드 및 개발 서버)
  - ESLint (코드 품질 관리)

- **API**:
  - TMDB (The Movie Database) API

## 🚀 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 방법

1. 레포지토리 클론하기:

```bash
git clone https://github.com/yourusername/netflix-demo.git
cd netflix-demo
```

2. 의존성 설치하기:

```bash
npm install
# 또는
yarn
```

3. `.env` 파일 생성하기:
   프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 TMDB API 키를 추가하세요:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_BASE_URL=https://api.themoviedb.org/3
```

4. 개발 서버 실행하기:

```bash
npm run dev
# 또는
yarn dev
```

5. 브라우저에서 `http://localhost:5173` 접속하기

## 📁 프로젝트 구조

```
netflix-demo/
├── public/
├── src/
│   ├── hooks/
│   │   └── useMoviesQuery.js     # 영화 데이터 가져오는 커스텀 훅
│   ├── layout/
│   │   └── AppLayout.jsx         # 앱 레이아웃 컴포넌트
│   │   └── AppLayout.css         # 앱 레이아웃 컴포넌트 css
│   ├── pages/
│   │   ├── Home/                 # 홈페이지 관련 컴포넌트
│   │   │   ├── components/
│   │   │   │   ├── Banner/       # 배너 컴포넌트
│   │   │   │   ├── Card/         # 영화 카드 컴포넌트
│   │   │   │   └── Slide/        # 영화 슬라이드 컴포넌트
│   │   │   └── Homepage.jsx
│   │   │   └── Homepage.style.css
│   │   ├── Movies/               # 영화 목록 페이지
│   │   │   ├── components/
│   │   │   │   ├── FilterPanel/  # 필터 패널 컴포넌트
│   │   │   │   ├── MovieGrid/    # 영화 그리드 컴포넌트
│   │   │   │   └── Pagination/   # 페이지네이션 컴포넌트
│   │   │   └── MoviePage.jsx
│   │   │   └── MoviePage.style.css
│   │   ├── MovieDetail/          # 영화 상세 페이지
│   │   │   └── MovieDetailPage.jsx
│   │   │   └── MovieDetailPage.style.css
│   │   └── NotFound/             # 404 페이지
│   │       └── NotFoundPage.jsx
│   │       └── NotFoundPage.css
│   ├── utils/
│   │   └── api.js                # API 관련 유틸리티
│   ├── App.jsx                   # 라우트 설정
│   ├── main.jsx                  # 앱 진입점
│   └── index.css                 # 전역 스타일
├── .env                          # 환경 변수 (API 키 등)
├── package.json
└── vite.config.js
```

## 🔗 데모

프로젝트 라이브 데모: [Netflix Demo App](https://your-netflix-demo.vercel.app)

체험해보세요! 영화 검색, 필터링, 상세 정보 보기 등 모든 기능을 직접 사용해볼 수 있습니다.

## 🔧 추가 스크립트

- **빌드**:

```bash
npm run build
# 또는
yarn build
```

- **미리보기**:

```bash
npm run preview
# 또는
yarn preview
```

- **린트**:

```bash
npm run lint
# 또는
yarn lint
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [TMDB](https://www.themoviedb.org/)에서 제공하는 영화 데이터 API
- [React](https://reactjs.org/)와 [Vite](https://vitejs.dev/) 커뮤니티
