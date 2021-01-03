---
title: "[백준 - BFS] 7576 - 토마토 - 파이썬"
date: 2019-11-03
tags:
  - algorithm
keywords:
  - python
  - BFS
  - algorithm
---

### 출처 : <a href="https://www.acmicpc.net/problem/7576"> 백준 7576 토마토</a>

## 문제
BFS를 사용해서 밭에 있는 토마토가 다 익으려면 며칠이 걸리는지 구하는 문제이다. 하루가 지날 때마다 익은 토마토 상하좌우에 있는 토마토들이 익게 된다. 한 방향으로 쭉 익는 것이 아니라 익은 토마토 주변부가 익기 시작하기 때문에 BFS로만 풀어야 하는 문제이다.

처음에 익은 토마토의 위치를 파악하고 BFS이기 때문에 queue에 집어 넣는다. 그 다음에 하나씩 pop을 하면서 주변에 있는 토마토도 익게 만들고 queue내에 토마토들이 다 pop되고 주변이 다 익었으면 하루가 지났다고 고려한다. 그리고 이전 값에 1을 더해서 이전 토마토보다 하루 더 늦게 익었음을 보여준다. 마지막으로, 0이 하나라도 있으면 밭 전체가 익지 않았기 때문에 -1을 반환한다.

***주의해야할 점
Python에서 list를 queue처럼 사용할 수 있다. pop(0)를 하면 index 0 에 있는 숫자가 pop된다, 하지만, 이 방법은 `O(n)`의 시간복잡도로 pop하기 때문에 매우 느리다. 그래서 이 문제에서는 시간초과를 막기 위해 collections의 deque를 사용해야 한다. 해당 자료구조는 `O(1)`의 시간복잡도로 pop하도록 구현 되어있다.



## 풀이
```python
# BOJ 7576 - 토마토
import sys
from collections import deque
r = sys.stdin.readline


def bfs(M, N, box):
    # 좌우상하
    dx = [0, 0, 1, -1]
    dy = [-1, 1, 0, 0]

    days = -1

    while ripe:
        days += 1
        for _ in range(len(ripe)):
            x, y = ripe.popleft()

            for i in range(4):
                nx = x + dx[i]
                ny = y + dy[i]

                if (0 <= nx < N) and (0 <= ny < M) and (box[nx][ny] == 0):
                    box[nx][ny] = box[x][y] + 1
                    ripe.append([nx, ny])

    for b in box:
        if 0 in b:
            return -1
    return days


M, N = map(int, r().split())
box, ripe = [], deque()
for i in range(N):
    row = list(map(int, r().split()))
    for j in range(M):
        if row[j] == 1:
            ripe.append([i, j])
    box.append(row)


print(bfs(M, N, box))
```