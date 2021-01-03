---
title: "[백준 - DP] 2748 - 피보나치 2 - 파이썬"
date: 2019-10-16
tags:
  - algorithm
keywords:
  - python
  - DP
  - algorithm
---


### 출처 : <a href="https://www.acmicpc.net/problem/2748"> 백준 2748 피보나치 2</a>

## 문제
해당 문제는 피보나치 수열을 DP로 푸는 방법이다. 재귀로 피보나치 수열을 구할 때면 중복되는 연산을 다시 해야하는 경우가 발생해서 시간이 오래 걸린다. DP로 풀 때는 값을 array에 저장하기 떄문에 중복되는 연산을 하지 않고 바로 답을 가지고 올 수 있기 때문에 더 빠르게 문제를 풀 수 있다.

## 풀이
```python
import sys

N = int(sys.stdin.readline())
arr = [0 for _ in range(N+1)]
arr[1] = 1

for i in range(2, N+1):
    arr[i] = arr[i-1] + arr[i-2]

print(arr[-1])
```