import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  &.container {
    height: 100vh;
    width: 100vw;
    font-family: Helvetica;
  }

  .loader {
    height: 20px;
    width: 250px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .loader--dot {
    animation-name: loader;
    animation-timing-function: ease-in-out;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    height: 20px;
    width: 20px;
    border-radius: 100%;
    background-color: black;
    position: absolute;
    border: 2px solid white;
  }
  .loader--dot:first-child {
    background-color: #8cc759;
    animation-delay: 0.5s;
  }
  .loader--dot:nth-child(2) {
    background-color: #8c6daf;
    animation-delay: 0.4s;
  }
  .loader--dot:nth-child(3) {
    background-color: #ef5d74;
    animation-delay: 0.3s;
  }
  .loader--dot:nth-child(4) {
    background-color: #f9a74b;
    animation-delay: 0.2s;
  }
  .loader--dot:nth-child(5) {
    background-color: #60beeb;
    animation-delay: 0.1s;
  }
  .loader--dot:nth-child(6) {
    background-color: #fbef5a;
    animation-delay: 0s;
  }
  .loader--text {
    position: absolute;
    top: 200%;
    left: 0;
    right: 0;
    width: 4rem;
    margin: auto;
  }
  .loader--text:after {
    content: 'Loading';
    font-weight: bold;
    animation-name: loading-text;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }

  @keyframes loader {
    15% {
      transform: translateX(0);
    }
    45% {
      transform: translateX(230px);
    }
    65% {
      transform: translateX(230px);
    }
    95% {
      transform: translateX(0);
    }
  }
  @keyframes loading-text {
    0% {
      content: 'Loading';
    }
    25% {
      content: 'Loading.';
    }
    50% {
      content: 'Loading..';
    }
    75% {
      content: 'Loading...';
    }
  }
`;

const LoadingScreen = () => {
  return (
    <Div className="container">
      <div className="loader">
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--text"></div>
      </div>
    </Div>
  );
};

export default LoadingScreen;
