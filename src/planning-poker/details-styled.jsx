import styled from 'styled-components';

export const SetDiv = styled.div`
  display: inline-block;
  width: 120px;
  height: 200px;
  margin-right: 30px;
  --borderWidth: 10px;
  background: #fff;
  position: relative;
  border-radius: var(--borderWidth);
  border: solid #000;

  &:hover {
    cursor: pointer;
    border: unset;
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
    animation: animatedgradient 5s ease infinite;
    background-size: 300% 300%;
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
`;
