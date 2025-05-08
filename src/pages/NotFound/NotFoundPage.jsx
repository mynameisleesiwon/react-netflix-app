import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">페이지를 찾을 수 없습니다</h2>
        <p className="error-message">
          찾으시는 페이지가 존재하지 않거나, 삭제되었거나, 일시적으로 사용할 수
          없습니다.
        </p>
        <div className="error-details">
          <p>
            오류 코드: <span className="error-highlight">NSES-404</span>
          </p>
        </div>
        <div className="action-buttons">
          <Link to="/" className="home-button">
            홈으로 돌아가기
          </Link>
          <a
            href="https://help.netflix.com"
            className="help-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            도움말 센터
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
