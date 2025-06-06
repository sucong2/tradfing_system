# 트레이딩 시스템 개발 회의록 요약

## 핵심 구조 및 기능

### 프로젝트 생성 및 구성
- **프로젝트 생성 시**: 인디케이터 생성 또는 전략 생성 템플릿 제공
- **필수 입력 가이드**: 심볼(BTC/USDT), 타임프레임, 레버리지 등 설정
- **In/Out 명시**: 데이터 입출력 스키마 명확히 정의 필요

### 주요 개발 모듈
1. **데이터 매니저**: 시장 데이터 관리
2. **인디케이터 템플릿**: 실시간 연산 가능하도록 개발
3. **전략 템플릿**: 트레이딩 로직 정의
4. **백테스팅 로직**: generate_signals 함수에서 실시간 인디케이터 계산

### 실행 모드
- **백테스트 모드**: "Run backTest" 버튼으로 서버에서 실행
- **운영 모드**: is_demo / is_backtest / is_live 조건에 따라 처리
- **전략 저장**: 대용량 전략 테스트 지원

## 기술 세부사항
- **거래 방식**: 현재는 현물 기준 롱/숏, 추후 선물/옵션으로 확장 가능
- **가격 데이터**: close price, last price 활용
- **실시간 데이터**: web socket 통신
- **디렉토리 경로**: project, public/project, 5010_strategy 등 언급

## 보안 및 비즈니스 측면
- **데이터 보안**: CSV 직접 제공 대신 결과값만 전달 (리버스 엔지니어링 방지)
- **현황 모니터링**: demo/live 트레이딩 현황 시각화 개발 필요
- **비즈니스 모델**: B2B 형태, "부자 - 해치펀드 - 5010" 구조 언급됨

## 후속 작업
- 실시간 인디케이터 계산 기능 개선
- 데이터 매니저 검토 필요
- docker 기반 live 시스템 구축
