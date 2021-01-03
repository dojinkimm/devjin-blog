---
title: "[백준 - 백트래킹] 1987 - 알파벳 - 파이썬"
date: 2019-10-16
tags:
  - algorithm
keywords:
  - python
  - backtracking
  - algorithm
---


### 출처 : <a href="https://www.acmicpc.net/problem/1987"> 백준 1987 알파벳</a>

## 문제
2D 형태의 문자들이 주어진다. (0,0)에서 시작을 해서 상하좌우로 움직이면서 다른 알파벳들을 순회한다. 새롭게 이동하는 칸은 지금까지 지나오지 않은 알파벳이어야 한다. 이렇나 조건이 있을 때, 최대 몇칸을 지날 수 있는지 구하는 문제이다. 

<br/> 
이 문제는 백트래킹을 사용해서 푸는 문제이다. BFS나 DFS를 사용할 수 있지만, BFS나 DFS같은 경우는 모든 칸들을 지나가게 된다. 하지만, 이 문제에서 중복되는 알파벳들을 피해야하는 조건이 있기 때문에 BFS나 DFS로 한칸 한칸 지나면서 조건을 만족하지 않으면 백트래킹을 해야 한다.

## 풀이

### BFS로 풀이
```python
import sys

# 좌, 하, 우, 상
dx = [-1, 0, 1, 0]
dy = [0, -1, 0, 1]


def BFS(x, y):
    global answer
    q = set([(x, y, board[x][y])])

    while q:
        x, y, ans = q.pop()

        # 좌우상하 갈 수 있는지 살펴본다
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]

            # index 벗어나지 않는지 체크하고, 새로운 칸이 중복되는 알파벳인지 체크한다
            if ((0 <= nx < R) and (0 <= ny < C)) and (board[nx][ny] not in ans):
                q.add((nx,ny,ans + board[nx][ny]))
                answer = max(answer, len(ans)+1)


R, C = map(int, sys.stdin.readline().split())
board = [list(sys.stdin.readline().strip()) for _ in range(R)]

answer = 1
BFS(0, 0)
print(answer)
```

### DFS로 푼 풀이
DFS로 해당 문제를 Python3에 제출했을 때 시간초과가 발생했다, 하지만 Pypy3으로 제출했을 때는 통과를 했다.
```python
import sys

# 좌, 하, 우, 상
dx = [-1, 0, 1, 0]
dy = [0, -1, 0, 1]


def DFS(x, y, ans):
    global answer

    answer = max(ans, answer)

    # 좌우상화 다 확인한다
    for i in range(4):
        nx = x + dx[i]
        ny = y + dy[i]

        # index 벗어나지 않는지 체크하고, 새로운 칸이 중복되는 알파벳인지 체크한다
        if ((0 <= nx < R) and (0 <= ny < C)) and (board[nx][ny] not in passed):
            passed.append(board[nx][ny])
            DFS(nx, ny, ans+1)
            passed.remove(board[nx][ny])



R, C = map(int, sys.stdin.readline().split())
board = [list(sys.stdin.readline().strip()) for _ in range(R)]

answer = 1
DFS(0, 0, answer)
print(answer)
```


