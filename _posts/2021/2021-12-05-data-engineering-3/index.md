---
title: 데이터 엔지니어라면(3) - Hadoop과 MapReduce
date: 2021-12-05
tags:
  - data-engineering
  - data
keywords:
  - data-engineering
  - pipeline
  - spark
  - hadoop
  - data
  - map reduce
  - airflow
  - aws
  - gcp
  - azure
thumbnail: './main.png'
---

![main](./main.png)

구글의 `MapReduce` 모델이 현재 데이터엔지니어링 필드에서 사용되고 있는 데이터 분산처리의 시초이다. 하지만, 실제로 분산된 시스템에서 데이터 분석이 더 쉬워질 수 있었던건 Hadoop이라는 오픈소스 프레임워크가 소개된 이후부터라고 볼 수 있다.

# Hadoop의 탄생

2006년 Doug Cutting이 구글 논문에서 참고한 `MapReduce`와 HDFS(Hadoop Distributed File System)라는 분산 파일 시스템 기능을 포함해서 Hadoop이라는 오픈소스를 선보였다.

Hadoop의 다양한 장점들이 있으나 밑의 장점들이 대표적으로 꼽힌다:

- Fault Tolerance

기존 `MapReduce` 프로그래밍 모델을 활용한 분산 데이터 처리에서는 필요한 데이터를 따로 저장했었어서 네트워크 통신에서 데이터가 유실 되는 경우도 존재했었다. HDFS에서는 각 분산된 서버에 disk storage를 두고 파일을 저장하도록 해서 데이터 유실을 최소화했다. 그리고 작업 도중 한 노드가 실패하더라도 데이터가 이미 disk에 복제되서 존재하기 때문에도 데이터 유실로부터 안전할 수 있게 되었다.

- 빠른 데이터 접근

Hadoop은 작업을 실행할때 데이터가 있는 곳에서 가까운 노드가 컴퓨팅 연산을 할 수 있도록 효율적인 작업 분배를 한다. 데이터에 더 빠르게 접근 및 처리를 할 수 있게 한다.

- 확장성

중단 없이도 장비를 scale out하는 것이 쉽고 수 GB-TB의 데이터를 저렴한 비용으로 관리할 수 있다.

현재 2021년말 기준 가장 최신 버전의 Hadoop에는 4가지의 메인 모듈이 있다:

- Hadoop common - 기본적인 공용 유틸리티들
- HDFS - 어플리케이션 데이터에 높은 처리율로 접근할 수 있게 해주는 분산 파일 시스템
- MapReduce - 데이터 분산 처리를 위한 프로그래밍 모델
- YARN - 클러스터내의 컴퓨팅 리소스를 관리하고 일정을 예약하게 해주는 리소스 관리 플랫폼

# MapReduce

Hadoop의 MapReduce는 **[데이터 엔지니어라면(2) - 분산처리와 MapReduce](https://devjin-blog.com/data-engineering-2/)** 에서 설명한 MapReduce 프로그래밍 모델을 활용해서 큰 용량의 데이터를 큰 클러스터에 쉽게 처리할 수 있게 해주는 프레임워크이다. MapReduce의 가장 큰 장점은 엄청난 크기의 데이터를 여러대의 노드에서 병렬적으로 처리할 수 있다는 것이다. 데이터 처리 작업이 Map과 Reduce작업으로 나뉘어 병렬적인 노드에서 진행될 수 있게 설계되었기 때문에 수백개에서 수천 수만대의 노드로 scale out할때도 크게 설정을 변경할 필요가 없다.

- MapReduce 진행 과정

MapReduce 프레임워크는 map 작업을 먼저 시작한다. Map작업의 input으로 들어갈 데이터는 일반적으로 HDFS에 저장되어있다. 이 파일이 여러 노드에 분산 되어 있는 mapper에 input으로 전달되고, mapper는 데이터들을 key-value pair로 데이터를 나누는 작업을 한다. Map 작업에서 나온 결과물은 또 key-value pair로 정렬된 다음 reduce 작업으로 넘겨진다. Reduce작업에서는 데이터를 처리하고 새로운 key-value pair 결과물을 HDFS에 저장한다. 작업들이 진행될때 필요한 input과 결과물인 output이 다 HDFS에 저장되는 것이다.

Hadoop은 노드들한테 각각 Map과 Reduce 작업들을 할당한다. MapReduce 프레임워크 단에서 작업의 상태 및 데이터 이동 등을 관리해준다. 그리고 일반적으로 데이터가 저장된 노드에서 해당 데이터로 작업을 실행하게끔 해서 네트워크 비용을 최소화한다. 그리고 모든 작업이 끝나고 나서 데이터의 결과는 Hadoop 서버에 다시 전달된다.

## How many Maps and Reducers?

어플리케이션에서는 Map과 Reduce 메소드를 제공하기 위해 Mapper와 Reducer interface를 구현하게 된다. 그렇다면 몇개의 map과 reduce 작업들이 데이터 처리시 필요할까?

Map의 수는 보통 input의 총 사이즈에 따라 달라진다(input 파일의 총 block의 수). 보통은 한 노드당 10-100개의 map이 있을때 적당한 병렬성을 갖추게 된다 (cpu-light한 작업들에 대해서는 300개의 map까지도 작업될 수 있다).

만약 10TB의 input 데이터가 있고 block 사이즈가 128MB라면 총 82,000개의 map이 생성되는 것이다. 물론, MRJobConfig.NUM_MAPS 설정으로 더 수치를 조절할 수 있다.

적절한 Reducer의 수는 (노드의 수 x 노드별 최대 컨테이너 수) x 0.95 or 1.75라고 한다. 0.95라면 reducer들은 map 작업이 끝나서 결과물이 나오자마자 바로 시작될 수 있다. 1.75라면 로드밸랜싱을 통해 1차 reduce작업을 빠르게 처리한 노드는 2번째 작업을 시작할 수도 있다. Reducer의 수를 늘리는 것의 프레임워크의 오버헤드를 늘리는 것이지만 로드밸랜싱을 늘리는 것은 실패의 cost를 줄일 수 있게 된다.

Reduce 작업이 필요없다면 reducer가 하나도 없을 수도 있다. Map 작업 이후에 바로 파일시스템에 저장되는 경우가 바로 그러하다.

# 마무리 🙇

이번 `데이터 엔지니어라면` 시리즈 3에서는 Hadoop에 대해 간단히 소개를 하고 Hadoop에서 사용되는 MapReduce 프레임워크에 대해 정리를 했다.

원래는 Hadoop의 메인 모듈들에 대한 내용을 한개의 글에 다 담으려고 했으나 양이 너무 많아 나눠서 작성하게 되었다. 다음 시리즈에서는 Hadoop의 HDFS, Hadoop의 Yarn에 대해 더 정리를 해보려고 한다.

# References

- [https://towardsdatascience.com/what-is-big-data-understanding-the-history-32078f3b53ce](https://towardsdatascience.com/what-is-big-data-understanding-the-history-32078f3b53ce)
- [https://cloud.google.com/learn/what-is-hadoop?hl=ko](https://cloud.google.com/learn/what-is-hadoop?hl=ko)
- [https://hadoop.apache.org/docs/stable/](https://hadoop.apache.org/docs/stable/)
- [https://www.tutorialspoint.com/hadoop/hadoop_mapreduce.htm](https://www.tutorialspoint.com/hadoop/hadoop_mapreduce.htm)
