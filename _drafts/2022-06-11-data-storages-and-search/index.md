# 3. 저장소와 검색

# 1. DB 데이터 구조

DB가 다뤄야할 문제

- 동시성 제어
- 로그가 영원히 커지지 않게끔 디스크 공간 회수
- 오류 처리
- 부분적 기록된 레코드 처리

등

`index(색인)`

- 부가적 metadata유지
- CUD 느리게 함
- Read 빠르게 함

### Hash index

key-value - 비트캐스크가 근본적으로 사용하는 방식이다.

해시맵을 전부 메모리에 유지한다. 

👍 각 키 값이 자주 갱신되는 상황에서 좋다 👍  

디스크 공간 부족해진다면 - 특정 크기의 segment로 로그 나눈다. segment파일들에 대해 compation을 진행한다. compaction이란 중복된 키를 버리고 각 키의 최신 갱신 값만 유지하는 것 의미

고려해야하는 것

- 파일 형식
- record 삭제
- 고장 복구 - DB재시작시 인메모리 해시맵 손실되기 때문
- 부분적 record 쓰기
- 동시성 제어

inmemory여서 key 많으면 어렵다. 디스크상의 hash map할수는 있지만 성능이 좋지는 않다. 디스크 가득 찼을때 + 해시 충돌하는 로직 구현하기 성가시다.

### SS 테이블과 LSM트리

Sorted String Table

장점:

1. 병합정렬과 유사해서 파일이 크더라도 간단하고 효율적이다.
2. index유지할 필요가 없다.
3. 압축하기에 I/O 대역폭 사용 줄인다.

→ `LevelDB`, `RocksDB`

SS테이블 압축하고 병합하는 순서와 시기를 결정하는 다양한 전략이 있다.

1. size-tiered
    1. HBase
    2. 상대적으로 좀 더 새롭고 작은 SS테이블을 ⇒ 상대적으로 오래됐고 큰 SS테이블에 연이어 병합한다.
2. leveled compaction
    1. LevelDB, RocksDB
    2. 키 범위를 더 작은 SS테이블로 나누고, 오래된 데이터는 개별 `level`로 이동해서 점진적으로 compaction을 진행한다. 그래서 디스크 공간을 덜 사용한다.

카산드라는 둘다 지원

본질은 SS테이블 병합

### B 트리

전통적으로 4KB크기의 고정 크기 block or page로 나누고, 한번에 하나의 페이지에 읽기 또는 쓰기를 한다. 하드웨어와도 밀접환 관련이 있다.

root에서 키를 찾는 것이 시작된다. 최종적으로는 leaf page로 도달한다.

`균형 유지가 중요하고 보장된다`

페이지를 덮어씌우더라도 페이지를 가리키는 모든 참조는 온전하게 남는다. 같은 위치의 파일을 변경하는 것이다. orphan page생길 수 있기 때문에 쓰기전 로그를 둔다 (e.g. WAL log). 동시성 제어는 `latch`로 보호한다.

최적화

- copy on write scheme. 변경된 페이지 다른 위치에 기록하고 상위 페이지의 새로운 버전을 만들어 새로운 위치 가리키게 한다.
- 키를 축약해서 공간 절약
- 키 범위가 가까운 페이지들은 디스크상 연속된 순서로 나타나게끔 트리르 배치. 그런데 트리 커지면 어려움.
- 트리에 포인터 추가
- fractal tree.

<aside>
💡 LSM write에 GOOD
BTree read에 GOOD

LSM Tree는 compaction단계에 있는 여러 데이터 구조와 SS table확인해야해서 조금 느림.

</aside>

B Tree는 2번 쓴다. 로그와 트리 페이지. 몇 바이트만 바뀌어도 한번에 전체 페이지를 기록해야하는 overhead 존재.

만약 쓰기가 많다면 같은 곳에 여러번 쓰게 되고 이는 write amplification(쓰기 증폭)으로 이어지고 이는 SSD의 관심사이다. Write가 많으면 성능 병목은 디스크에 쓰는 속도이다. 이때 쓰기 증폭은 성능 비용이다. Write많을수록 대역폭 내 처리할 수 있는 초당 쓰기가 줄어든다.

LSM쓰기 증폭 낮다

→ 순차적으로 compaction된 SS테이블 파일을 쓴다. 

LSM압축률 더 좋다. 더 적은 파일 생성한다. 주기적으로 파편화를 없애기 위해 SS테이블을 다시 기록하기 때문.

하지만, 

- Compaction과정이 진행중인 읽기와 쓰기의 성능에 영향을 준다
- 높은 쓰기 처리량 발생한다.

### Clustered index

index안에 모든 raw data를 저장한다. 키를 변경하지 않고 값을 갱신할때 효율적

# 2. 트랜잭션 처리나 분석?

OLTP - online transaction processing

OLAP - online analytic processing

|  | OLTP | OLAP |
| --- | --- | --- |
| READ | query당 적은 레코드, 키 기준 | 많은 레코드 집계 |
| WRITE | 임의 접근. 낮은 지연 시간 | 대규모 or event stream |
| Usage | web application을 통한 최종 사용자 | 내부 분석가 |
| 표현 | 데이터의 최신 상태 | 시간이 지나며 일어난 이벤트 이력 |
| 크기 | GB~TB | TB~PB |

OLAP용 데이터베이스를 Data Warehouse라고 부른다.

  

데이터웨어하우스들은 `start schema (dimensional modeling)`로 알려진 정형화된 방식을 사용한다.

스키마 중심에 소위 `fact table` 이 있다 → 특정 시각에 발생한 이벤트가 이에 해당. fact table의 다른 컬럼은 `dimensional table`을 가리키는 외래 키 참조이다.

fact table

- 각 row 이벤트를 나타낸다

dimensional table

- 이벤트의 속성인 누가, 언제, 어디서, 무엇을, 어떻게, 왜를 나타낸다.

# 3. 컬럼 지향 저장소

대부분 OLTP는 로우 지향 방식으로 데이터를 배치한다. row의 모든 값이 서로 인접하게 저자오딘다.

컬럼 지향 저장소는 모든 값을 row에 저장하지 않는 대신에 각 컬럼별로 모든 값을 함께 저장한다. query에 필요한 컬럼만 읽고 구분 분석한다. 작업량 많이 줄어든다.

큰 병목중 하나는 disk로부터 memory로 데이터를 가져오는 대역폭.

row 저장 순서는 중요하지 않다.  압축효과는 첫번째 정렬키에서 가장 강력하다.

### 쓰기

컬럼 지향 저장소, 압축, 정렬은 Read query를 더 빠르게 하지만, Write은 느리게 한다. 그래서 LSM트리처럼 인메모리 저장소로 이동해 정렬된 구조에 추가하고 디스크에 쓸 준비를 한다. 

### Materialized aggregation(구체화 뷰)

count, avg, min, max같은 함수들이 query에서 자주 사용되면 캐시하는건 어떨까 → materialized view

구체화뷰는 디스크에 기록된 query의 실제 복사본이지만, 가상뷰(virtual view)는 query를 작성하는 단축키이다. 원본데이터 변경시 구체화뷰 갱신해야 한다. 갱신으로 인해 쓰기가 비싸기 때문에 OLTP에서는 잘 안한다. 

### Summary

OLTP

- 사용자 대면이라 대량의 요청 받는다.
- 부하 처리 위해 적은 record만 다룬다.
- 키의 일부만 사용하는 record를 요청하고, 저장소 엔진은 요청한 키의 데이터를 찾기 위해 index를 사용한다.
- 주로 디스크 탐색이 병목이다

- 로그 구조화 관점. 파일에 추가와 오래된 파일 삭제만 허용하고, 한번 쓰여진 파일 절대 갱신 안한다.
    - 비트 캐스크, SS table, LSM tree, LevelDB, HBase, Cassandra, 루씬…
- 제자리 갱신 관점에서 덮어쓰기를 할 수 있는 고정 크기 페이지 셋으로 디스크를 나눈다.
    - B Tree, most RDBs

OLAP

- 비즈니스 분석가가 고객.
- 적은수의 query이지만 각 query들이 복잡하고 짧은 시간에 수백만개의 record를 스캔한다.
- 주로 디스크 대역폭이 병목이다.
- 컬럼 지향 저장소는 이런 종류 작업 부하 처리할때 인기가 높아지는 솔루션이다.