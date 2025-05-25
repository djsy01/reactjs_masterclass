# ReactJS_마스터클래스 프로젝트

## 개요
ReactJS 마스터클래스 과제로, Framer-motion을 활용해 4개의 네모 박스와 그 안을 이동하는 원의 애니메이션을 구현한 프로젝트입니다.

## 사용 기술
- React
- TypeScript
- styled-components
- Framer-motion (애니메이션)

## 미션
- /(home) 페이지에 Latest movies, Top Rated Movies 그리고 Upcoming Movies의 슬라이더를 추가해주세요.
- /tv 페이지에 Latest Shows, Airing Today, Popular, Top Rated의 슬라이더를 추가해주세요.
- /search 페이지에 검색한 movie와 tv의 결과가 담긴 슬라이더를 추가해주세요.
- /movie/:id 페이지를 더욱 예쁘게 꾸며보세요.
- /tv/:id 페이지를 추가해주세요.

## 기술 포인트
- React Query를 사용해 데이터 패칭 및 캐싱을 최적화
- Framer-motion을 이용한 자연스러운 애니메이션 효과 구현
- styled-components를 활용한 컴포넌트별 스타일 관리
- React Router를 통한 동적 라우팅 및 URL 파라미터 활용
- TypeScript로 타입 안정성 확보 및 개발 생산성 향상

## 어려웠던 점 및 해결 방법
- **버전 충돌 문제**
  - 강의에서 사용한 라이브러리 버전과 프로젝트에 설치된 버전이 달라서 여러 오류가 발생했습니다.
  - 각 라이브러리(React, Framer-motion, React Router 등)의 호환 가능한 버전을 확인하고, `package.json`을 재설정 후 `node_modules`와 `package-lock.json`을 삭제하고 재설치하여 문제를 해결했습니다.
- **비동기 데이터와 타입 처리 문제**
  - API에서 받아오는 데이터가 null 또는 undefined일 수 있어 타입 에러가 잦았습니다.
  - TypeScript의 엄격한 타입 검사에 맞게 옵셔널 체이닝(`?.`)과 기본값 처리(`|| ""`)를 적용해 안전하게 데이터를 사용하도록 수정했습니다.
- **애니메이션과 레이아웃 충돌**
  - Framer-motion의 `layoutId`를 잘못 지정하거나 중복할 때 애니메이션이 제대로 작동하지 않았습니다.
  - 각 슬라이더와 모달의 고유한 `layoutId`를 철저히 관리해 문제를 해결했습니다.
- **모달 제목 미노출 문제**
  - 모달 내 타이틀이 보이지 않는 문제가 발생했는데, 이는 스타일 문제나 렌더링 조건 문제 때문이었습니다.
  - 스타일의 z-index 조정, 데이터 존재 여부 조건문 개선, 그리고 `motion` 컴포넌트의 `position` 속성 점검으로 해결했습니다.