---
title: "[백준 - BFS] 1697 - 숨박꼭질 - 파이썬"
date: 2019-11-09
tags:
  - algorithm
keywords:
  - python
  - BFS
  - algorithm
---

### 출처 : <a href="https://www.acmicpc.net/problem/1697"> 백준 1697 숨박꼭질</a>

## 문제
나의 위치가 주어지고 내가 잡아야할 사람의 위치가 주어진다. 둘다 일직선 상에 있고, 나는 한칸 뒤, 한칸 앞, 혹은 내가 있는 곳에서 2배 되는 자리로 순간이동을 할 수 있다. 잡아야 하는 사람이 있는 위치까지 최소로 이동할 수 있는 거리를 찾는 것이 문제의 목표이다.

한 위치에서 3가지로 이동할 수 있는 옵션이 주어졌기 때문에 BFS로 뻗어나가는 것이 가장 해결하기 좋은 방법이다. 한 위치에서 한칸 뒤, 한칸 앞, 두배 앞 값으로 뻗어나간다. 직선의 거리의 최대가 100,000이기 때문에 이동할 거리고 해당 값을 넘던지 0보다 작으면 이동을 하지 않는다. 그리고 만약 이미 방문했던 장소라면, 이전에 갔었을 때가 더 최소로 간 것이기 때문에 다시 방문하지 않는다. 만약 방문하지 않았고 0과 100,000사이이면 방문을 하고 기존 배열의 값에 1을 더해서 하나의 움직임이 더해서 방문했다는 것을 표시해준다. 그러고나서, 방문한 위치가 내가 잡아야하는 사람의 위치이면 해당 값을 반환한다.

만약 내가 잡아야 하는 사람의 위치가 내가 있는 위치보다 값이 작으면, (내 위치 - 상대방 위치)를 해주면 더 간단하게 문제를 풀 수 있다. 뒤로 가는 방법은 한칸 뒤로씩 가는 방법밖에 없기 때문이다.

***주의해야할 점
Python에서 list를 queue처럼 사용할 수 있다. pop(0)를 하면 index 0 에 있는 숫자가 pop된다, 하지만, 이 방법은 `O(n)`의 시간복잡도로 pop하기 때문에 매우 느리다. 그래서 이 문제에서는 시간초과를 막기 위해 collections의 deque를 사용해야 한다. 해당 자료구조는 `O(1)`의 시간복잡도로 pop하도록 구현 되어있다.



## 풀이
```python
# BOJ 1697 - 숨박꼭질
import sys
from collections import deque

LIMIT = 100001

def solve(arr, n, k):
    q = deque()
    q.append(n)

    while q:
        i = q.popleft()

        if i == k:
            return arr[i]

        for j in (i+1, i-1, 2*i):
            if (0 <= j < LIMIT) and arr[j] == 0:
                arr[j] = arr[i] + 1
                q.append(j)

N, K = map(int, sys.stdin.readline().split())
find = [0] * LIMIT

print(solve(find, N, K))
```