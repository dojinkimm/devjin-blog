---
title: "[번역] Protobuf에서 google.protobuf.StringValue와 string의 차이점"
date: 2020-03-15
tags:
  - Golang
keywords:
  - golang
  - go
  - protobuf
---



Protobuf에서 message를 작성할 때 string 값을 `google.protobuf.StringValue` 라고 표현하는 경우도 있고 `string`으로 표현하는 경우도 있었다. 그래서 이 둘의 차이점이 무엇인지 찾아봤고 좋은 대답이 있어서 공유하려고 한다.

[stackoverflow의 답변](https://stackoverflow.com/questions/51707877/what-is-the-point-of-google-protobuf-stringvalue)

`StringValue` 는 null이 될 수 있지만, `string`은 그럴 수 없는 경우가 많다. 예를 들어 Golang에서 string은 항상 "zero value"인 상황에 ""로 설정이 된다. 그렇기 때문에 

#### "의도적으로 비어있는 string으로 설정된 값의 경우"

#### "애초부터 값이 없었던 경우"

를 구분할 수가 없다. 
<br/>

`StringValue`는 null이 될 수 있어서 이 문제를 해결할 수 있다. 특히 (JSON을 표현할 수 있는) `StructValue` 로 사용될 때 이 개념이 중요하다. JSON key가 비어있는 string일 때 (`StringValue`가 비어있는 string "")와 JSON key가 처음부터 설정이 되지 않을 때(`StringValue`가 null)를 구분할 수 있다.

