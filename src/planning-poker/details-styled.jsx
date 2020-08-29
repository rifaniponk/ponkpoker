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

  .shortcut {
    margin-top: 70px;
    margin-left: auto;
    margin-right: auto;
  }

  &:hover, &.selected {
    cursor: pointer;
    border: unset;

    .shortcut {
      background: none;
      box-shadow: unset;
      color: #fff;
      opacity: 0.8;
      border: 1px solid rgba(255, 255, 2555, .5);
    }
  }

  &.selected {
    cursor: none;
    color: #fff;
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

export const ParticipantList = styled.div`
  list-style: none;
  margin-bottom: 10px;
  padding: 7px;
  transform: all 0.5s;

  &.voted {
    background: linear-gradient(60deg, #56D9D3, #94DCFB, #9494FB);
    animation: animatedgradient 5s ease infinite;
    background-size: 300% 300%;
    b {
      color: #fff;
    }
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

export const Shortcut = styled.div`
  font-family: Raleway;
  width: 25px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.1em 0.5em;
  box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
  background-color: #f7f7f7;
`;
