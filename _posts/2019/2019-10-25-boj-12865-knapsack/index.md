---
title: "[백준 - DP] 12865 - 평범한 배낭 - 파이썬"
date: 2019-10-25
tags:
  - algorithm
keywords:
  - python
  - DP
  - algorithm
---

### 출처 : <a href="https://www.acmicpc.net/problem/12865"> 백준 12865 평범한 배낭</a>

## 문제
DP로 풀 수 있는 유명한 유형 중 하나이다. 배낭의 무게 최대값과 물품들의 무게와 가치가 주어졌을 때, 배낭의 가치를 최대화할 수 있는 방법을 찾는 것이다. 0-1 문제이기 때문에 DP로 밖에 풀 수 없다.

배낭 문제에 대한 해설은 [여기에서](https://dojinkimm.github.io/algorithm/2019/10/19/dp-2.html)찾을 수 있다.

## 풀이
```python
import sys

r = sys.stdin.readline
N, W = map(int, r().split())
bag = [tuple(map(int, r().split())) for _ in range(N)]

knap = [0 for _ in range(W+1)]

for i in range(N):
    for j in range(W, 1, -1):
        if bag[i][0] <= j:
            knap[j] = max(knap[j], knap[j-bag[i][0]] + bag[i][1])

print(knap[-1])
```
