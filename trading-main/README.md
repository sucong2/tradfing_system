# 트레이딩 전략 플랫폼

전략 생성, 검증 및 백테스트를 위한 웹 기반 트레이딩 시스템입니다.

## 주요 기능

- 전략 생성 및 관리
- 전략 검증
- 백테스트 실행 및 결과 분석
- 로컬 스토리지를 통한 데이터 저장

## 기술 스택

- React
- TypeScript
- Redux Toolkit
- Material UI
- Vite
- Recharts (차트 시각화)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 파일 실행
npm run start
```

## 프로젝트 구조

```
src/
├── assets/           # 이미지, 폰트 등의 정적 파일
├── components/       # 재사용 가능한 컴포넌트
├── features/         # 기능별 모듈 (Redux 슬라이스 포함)
├── layouts/          # 레이아웃 컴포넌트
├── pages/            # 페이지 컴포넌트
├── services/         # API 서비스
├── store/            # Redux 스토어 설정
├── styles/           # 스타일 관련 파일
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
```

## 라이센스

MIT
