# 4. 부호화와 발전

# 1. 데이터 부호화 형식

파일에 쓰던지, 네트워크 전송하려면 일련의 바이트열의 형태로 부호화 되어야 한다.

부호화 - serialize, marshal

복호화 - parsing, deserialize, unmarshal

여러 프로그래밍 언어에서 읽고 쓸 수 있게 표준화된 부호화를 써야 한다.

JSON, XML, CSV 텍스트 형식이지만 문제 있음

### Thrift와 Protocol Buffers

둘다 marshal할때 스키마가 필요하다.

- thrift의 binary protocol
    
    field name대신에 그냥 숫자와 같은 field tag를 사용한다. 
    
- thrift의 compact protocol
    
    field type과 tag숫자를 단일 바이트로 줄이고, variable length integer를 사용해서 marshal한다.
    
- protocol buffer
    
    thrift의 compact protocol이랑 유사하다. 차이점이 있다면 required를 사용하면 field가 설정되지 않은 경우를 실행시 확인할 수 있다.
    

스키마는 시간이 지나면서 무조건 변한다 - Schema evolution. 

상위 호환성

- field tag는 변경이 불가하다.
- 새로운 tag번호를 부여해야한다.

→ 예전 코드에서 새로운 코드로 기록한 데이터를 읽을때 그냥 무시하면 된다.

하위 호환성

- 새로운 필드를 추가해서 required로 하는 순간 그 이전 코드에서는 읽지 못한다. 그래서 초기 배포 후에는 모든 필드 optional로 하던지 기본값 가지게 해야 한다.

필드 삭제시에는 optional만 삭제 가능하게 하고, 같은 tag 번호는 다시 사용하지 못하게 한다.

data type변경은 가능한데, 의도대로 안될 수 있으니 주의 하자. ex) int32 → int64. int64로 보내면 예전 코드에서는 문제가 발생할 수 있다.

### Avro

2개의 언어가 있다

- 사람이 편집할 수 있는 Avro IDL
- 기계가 쉽게 읽을 수 있는 JSON 기반

Thrift, Protocol Buffer와 다르게 태그 번호 없다.

스키마에 나타난 순서대로 필드를 살펴보고 스키마를 이용해 각 필드의 data type을 미리 파악해야 한다. 데이터를 읽는 코드가 데이터를 기록한 코드와 **정확히 같은 스키마**를 사용할때 올바르게 unmarshal한다.

schema evolution에도, avro는 read & write schema다르더라도 호환 가능하면 된다는 아이디어이다. 

- read에는 없지만, write에 있으면 무시한다.
- read에는 있지만, write에는 없으면 default value를 채운다.

avro의 장점 중 하나는 동적 생성 스키마에 있다.

ex) db 스키마 변경되면, 갱신된 db 스키마로부터 새로운 avro 스키마를 생성하고 새로운 avro 스키마로 데이터를 보낸다.

# 2. 데이터플로 모드

메모리 공유하지 않는 다른 프로세스로 일부 데이터를 보내고 싶을때 byte열로 marshal해야한다.

### Through Service call

**rpc - remote procedure call. 원격 네트워크 서비스 요청을 같은 프로세스 안에서 특정 프로그래밍 언어의 함수나 메서드를 호출하는것과 동일하게 한다 - `위치 투명성`.** 

+) 네트워크 문제를 항상 함께 고려해야 한다.

- timeout발생 가능
- 실패한 네트워크 요청 다시 시도하면 실제로 처리되고, 응답이 유실될 수 있음. 중복 제거 기법을 적용하지 않으면 멱등성이 보장되지 않음.
- 네트워크 요청은 느리고 지연시간은 다양하다.
- 항상 byte열로 marshal해야 한다.
- 하나의 언어에서 다른 언어로 data type 변환해야 한다.

### Through async message delivery

메세지를 직접 네트워크 연결로 보내지 않고, 임시로 메세지를 저장하는 메세지 브로커를 사용한다.

- 수신사 사용 불가능하거나 과부하일때 버퍼처럼 동작해서 시스템 안정성 향상된다.
- 죽었던 프로세스에 다시 보내서 메세지 유실 방지 가능
- 송신자가 수신자의 IP주소나 포트 번호 알 필요 없다.
- 하나의 메세지 여러 수신자로 전송 가능
- 논리적으로 송신/수신자 분리된다.