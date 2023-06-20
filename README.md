# nodejs 개인과제 Lv. 3

## 개요

기존 과제에서 mongoose로 운영한 database를 MySQL과 sequalize로 전환한다.

## 최종 결과 명세

### Directory Structure

![example](./img/directory_structure.png)

## API 명세

| 경로                               | API Method | verify token | Description                   | Check List                                                                |
| ---------------------------------- | ---------- | ------------ | ----------------------------- | ------------------------------------------------------------------------- |
| /user                              | POST       | false        | 회원가입                      | 가입 후 유저 조회를 통해 추가 확인, createdAt/updatedAt 체크              |
| /user                              | GET        | false        | 전체유저조회                  | 스키마 디폴트값 적용 유무 체크                                            |
| /user:userId                       | GET        | false        | 전체유저조회                  | 스키마 디폴트값 적용 유무 체크                                            |
| /auth/login                        | POST       | false        | 로그인                        | 토큰(Access, Refresh) 발행 유무 확인                                      |
| /posts                             | POST       | true         | 포스트 작성(회원전용)         | 포스트 생성 유무 체크, 유저 정보 내 포스트id 내역 추가                    |
| /posts                             | GET        | false        | 전체 포스트 조회              | 스키마 디폴트값 적용 유무 체크                                            |
| /posts/:postId                     | PUT        | true         | 포스트 수정(회원전용)         | 포스트id 존재 유무 체크, 수정 적용 유무 체크, UpdatedAt 체크              |
| /posts/:postId                     | DELETE     | true         | 포스트 삭제(회원전용)         | 삭제 적용 유무 체크, 유저 정보 내 작성한 포스트번호 내역 삭제 체크        |
| /posts/:postId/comments            | POST       | true         | 포스트 내 댓글 작성(회원전용) | 댓글 생성 유무 체크, 포스트 데이터와 유저 데이터 내 댓글id 내역 추가      |
| /posts/:postId/comments            | GET        | false        | 포스트 내 댓글 조회           | 스키마 디폴트값 적용 유무 체크                                            |
| /posts/:postId/comments/:commentId | PUT        | true         | 댓글 수정(회원전용)           | 댓글, 포스트id 존재 유무 체크, 수정 적용 유무 체크, UpdatedAt 체크        |
| /posts/:postId/comments/:commentId | DELETE     | true         | 댓글 삭제(회원전용)           | 삭제 적용 유무 체크, 유저와 포스트 정보 내 작성한 댓글번호 내역 삭제 체크 |

[상세 API 명세보기](https://ionized-aster-f0c.notion.site/9343a74969704533820ab42c10daa3c9?pvs=4)

## Lv.2 (2주차) 추가 진행사항

이전 주차 과제 기간에 Lv.2에 해당하는 요구 사항 대부분을 구현했으며, 미충족한 나머지 사항을 추가 적용하였습니다.

> 📌 `TO DO LIST`
>
> - [x] AWS RDS를 활용한 MySQL 데이터베이스 준비
> - [ ] 기존 mongoose 방식을 sequalize 방식으로 변경
> - [ ] ERD 작성하기

## 진행 사항
