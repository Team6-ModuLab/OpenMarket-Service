아래는 내가 사용하는 상품 API 명세야. 
이 명세를 기준으로 프론트(상품 목록/검색/상세) API 연동 로직을 구현하거나 수정할 때 참고해줘.

====================================
[상품 API 명세]
====================================

1) 3.1.1 상품 전체 불러오기 (GET)
- Endpoint
  GET /products/

- Response (SUCCESS, 200)
{
  "count": Int,
  "next": URL,
  "previous": URL,
  "results": [
    {
      "id": Int,
      "name": String,
      "info": String,
      "image": URL,
      "price": Int,
      "shipping_method": "PARCEL" | "DELIVERY",
      "shipping_fee": Int,
      "stock": Int,
      "seller": {
        "username": String,
        "name": String,
        "phone_number": String,
        "user_type": "SELLER",
        "company_registration_number": String,
        "store_name": String
      },
      "created_at": Time,
      "updated_at": Time
    }
  ]
}

- Response (상품이 없을 경우도 200)
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}

- shipping_method 의미
  - PARCEL   : 택배/소포/등기
  - DELIVERY : 직접배송(화물배달)


2) 3.3 상품 디테일 (GET)
- Endpoint
  GET /products/<int:product_id>/

- Response (SUCCESS, 200)
{
  "id": Int,
  "name": String,
  "info": String,
  "image": URL,
  "price": Int,
  "shipping_method": "PARCEL" | "DELIVERY",
  "shipping_fee": Int,
  "stock": Int,
  "seller": {
    "username": String,
    "name": String,
    "phone_number": String,
    "user_type": "SELLER",
    "company_registration_number": String,
    "store_name": String
  },
  "created_at": Time,
  "updated_at": Time
}

- Response (FAIL, 400)
{
  "detail": "No Product matches the given query."
}


3) 3.6 상품 제목 검색하기 (GET)
- Endpoint
  GET /products/?search=입력값
  (search 파라미터에 원하는 검색어를 넣으면 됨)

- Response (SUCCESS, 200)
{
  "count": Int,
  "next": URL,
  "previous": URL,
  "results": [
    {
      "id": Int,
      "name": String,
      "info": String,
      "image": URL,
      "price": Int,
      "shipping_method": "PARCEL" | "DELIVERY",
      "shipping_fee": Int,
      "stock": Int,
      "seller": {
        "username": String,
        "name": String,
        "phone_number": String,
        "user_type": "SELLER",
        "company_registration_number": String,
        "store_name": String
      },
      "created_at": Time,
      "updated_at": Time
    }
  ]
}

- Response (검색 결과가 없을 경우도 200)
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}

====================================
추가 메모
- 목록/검색 응답은 pagination 형태(count/next/previous/results)이고, next가 null이면 더 이상 다음 페이지 없음.
- 상품이 없는 경우도 에러가 아니라 200 + results=[] 로 온다.
- 상세 조회에서 없는 상품은 400 + detail 메시지가 온다.
====================================
