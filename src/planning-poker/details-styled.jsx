import styled from 'styled-components';

export const SetDiv = styled.div`
  display: inline-block;
  width: 160px;
  height: 250px;
  margin-right: 30px;
  margin-bottom: 30px;
  --borderWidth: 10px;
  background: #fff;
  position: relative;
  border-radius: var(--borderWidth);
  background: linear-gradient(60deg, #56D9D3, #94DCFB, #9494FB);
  animation: animatedgradient 5s ease infinite;
  background-size: 300% 300%;

  &:hover {
    cursor: pointer;
    border: unset;
  }

  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  h1 {
    margin-top: 85px;
    text-align: center;
  }

  &.hvr-shutter-in-vertical:before {
    border-radius: var(--borderWidth);
  }
`;
