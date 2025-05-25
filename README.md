# ReactJS_마스터클래스 프로젝트

## 개요
ReactJS 마스터클래스 과제로, Framer-motion을 활용해 4개의 네모 박스와 그 안을 이동하는 원의 애니메이션을 구현한 프로젝트입니다.

## 사용 기술
- React
- TypeScript
- styled-components
- Framer-motion (애니메이션)

## 주요 기능
- /(home) 페이지에 Latest movies, Top Rated Movies 그리고 Upcoming Movies의 슬라이더를 추가해주세요.
- /tv 페이지에 Latest Shows, Airing Today, Popular, Top Rated의 슬라이더를 추가해주세요.
- /search 페이지에 검색한 movie와 tv의 결과가 담긴 슬라이더를 추가해주세요.
- /movie/:id 페이지를 더욱 예쁘게 꾸며보세요.
- /tv/:id 페이지를 추가해주세요.

## 기술 포인트
- **Framer-motion**의 **`layoutId`**와 **`AnimatePresence`**를 활용한 자연스러운 모션 구현
- **`transform-origin`** 값을 박스 위치별로 다르게 설정해 커서 시 커지는 방향을 조절
- 확대된 박스 내부에 **flex** 스타일을 적용해 원이 중앙에 위치하도록 처리
- **styled-components**로 컴포넌트별 스타일 관리

## 어려웠던 점 및 해결 방법
- **커서가 박스 위에 있을 때 주변 박스가 없는 방향으로만 박스가 커지게 하는 로직 구현 어려움**  
  박스 위치(왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래)에 따라 `transform-origin`과 `whileHover`의 이동 값을 분기 처리하여 해결

- **박스 클릭 시 확대 애니메이션에서 원이 박스 중앙에 정확히 위치하지 않는 문제 발생**  
  확대된 박스에 flexbox 스타일을 적용해 원이 항상 중앙에 배치되도록 수정하여 해결
