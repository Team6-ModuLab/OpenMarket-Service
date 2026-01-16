# 호두마켓(HODU) 오픈마켓 프론트엔드 Wiki

> Team6-ModuLab 오픈마켓 프론트엔드 서비스 프로젝트 문서

## 1분 요약

### 실행
```bash
# 정적 파일 기반 - Live Server 또는 브라우저에서 직접 열기
# VSCode Live Server 확장 권장
```

### 배포
- GitHub Pages 사용 (TODO: 확인 필요)
- 진입점: `index.html` → `/pages/products/list/` 리다이렉트

### 핵심 구조
```
pages/           → 페이지별 HTML/CSS/JS (8개 페이지)
shared/          → 공용 리소스 (CSS, JS, 아이콘)
```

---

## 문서 목차

| 문서 | 설명 |
|------|------|
| [01_Overview](./01_Overview.md) | 프로젝트 목적, 주요 기능, 기술 스택, 페이지 목록 |
| [02_QuickStart](./02_QuickStart.md) | 개발환경 설치, 로컬 실행, 빌드/배포, 온보딩 체크리스트 |
| [03_FolderStructure](./03_FolderStructure.md) | 폴더 트리 요약, 각 폴더 역할, 파일 네이밍 규칙 |
| [04_PagesAndRouting](./04_PagesAndRouting.md) | 페이지별 URL/진입 파일, 공통 레이아웃, 페이지 이동 흐름 |
| [05_API_Integration](./05_API_Integration.md) | API 엔드포인트, 요청/응답 처리, 인증 방식 |
| [06_UI_Components_Styling](./06_UI_Components_Styling.md) | 배너 슬라이더, 공통 컴포넌트, 반응형/스타일 구조 |
| [07_Deployment_GitHubPages](./07_Deployment_GitHubPages.md) | GitHub Pages 배포 구조, 배포 확인 체크리스트 |
| [08_Contributing](./08_Contributing.md) | 브랜치 전략, PR 규칙, 커밋 컨벤션, 충돌 방지 가이드 |
| [09_Troubleshooting](./09_Troubleshooting.md) | 자주 발생하는 이슈 및 해결 방법 |

---

## 빠른 링크

- **시작하기**: [02_QuickStart.md](./02_QuickStart.md)
- **폴더 구조 이해**: [03_FolderStructure.md](./03_FolderStructure.md)
- **API 연동 확인**: [05_API_Integration.md](./05_API_Integration.md)
- **기여 방법**: [08_Contributing.md](./08_Contributing.md)

---

## 관련 파일/경로

| 항목 | 경로 |
|------|------|
| 진입점 | `index.html` |
| 페이지 | `pages/` |
| 공용 CSS | `shared/css/` |
| 공용 JS | `shared/js/` |
| 아이콘 | `shared/assets/icons/` |
