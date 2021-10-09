import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
${normalize}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family:'Open Sans',sans-serif; // 이 부분은 이 프로젝트에만 쓰임
}
html,body{
  font-size: 62.5%;
  box-sizing: border-box;
  /* font-family: 'Noto Sans KR', 'Noto Serif KR', 'sans-serif', 'serif'; */  // 이 부분은 이 프로젝트에서만 안쓰임
}

body{
  overflow-x: hidden; // 이 부분은 이 프로젝트에만 쓰임
}

a{
  text-decoration:none;
  color:inherit;
  cursor: pointer;
}
ol, ul, li {
  list-style: none;
}
img {
  display: block;
  width: 100%;
  height: 100%;
}
input, button {
  background-color: transparent;
}
`;

export { GlobalStyle };
