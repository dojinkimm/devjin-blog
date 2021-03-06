---
title: 💻 Merge Sort, 합병 정렬이란?
date: 2019-09-18
tags:
  - algorithm
keywords:
  - algorithm
  - sort
  - python
---



<div align="center">
<img src="./merge_sort_pseudo.png" style="width:500px"/>
</div>

Merge Sort(합병정렬)는 `Divide and Conquer(분할 정복)` 알고리즘 종류중 하나이다. 분할정복이란 주어진 문제를 여러 sub 문제들로 나눈 다음에 그 문제들을 해결한 다음에 합치는 것을 의미한다. 

## Pseudo-code 설명

Merge-sort와 Merge parameter에서 `A`는 정렬이 필요한 list이다. `p`는 list의 가장 앞 index, `q`는 list의 중간 index, `r`은 list의 마지막 index를 의미한다.

**Merge Sort**

: 이 함수는 정렬되지 않은 list를 분할하는 역할을 한다

- p<r 이면, 아직 정렬이 완성되지 않은 상태라고 간주해서, p와 r의 중간인 q를 구한다
- (p~q), (q+1~r) 로 list를 분할하고 merge 함수에 보낸다.

**Merge**

: 이 함수는 분할된 list를 합병하는 역할을 한다.

- 1~2라인: n1은 분할된 왼쪽 list의 길이이고 n2는 분할된 오른쪽 list의 길이이다.
- 3~7라인: 그 다음에 L과 R을 길이만큼 선언해준 다음에 정렬되지 않는 list에서 해당 index를 받아와서 L과 R을 채워준다.
- 8~11라인: pseudo-code에서는 1이 가장 첫 index를 의미하기 때문에 i,j = 1로 설정되었다.
- 12~17라인: L과 R의 item들을 비교하고 더 작은 값을 기존 list의 왼쪽에, 더 큰 값을 list의 오른쪽에 배치를 한다.

<div align="center">
<img src="./merge_sort.png" style="width:1000px"/>
</div>


<div align="center">

source: <a href="https://www.geeksforgeeks.org/merge-sort/">merge-sort</a>

</div>


그림을 보며 step들을 하나씩 따라가보자

step1 - 전체 list를 분할한다.

step2 - p<r이기 때문에 왼쪽 list 다시 분할한다

step3 - p<r이기 때문에 왼쪽 list 다시 분할한다

step4~6 - 분할된 list를 병합한다. 둘을 비교하고 더 작은 값을 왼쪽에 위치 시킨다.

step 7 - 이전 merge가 끝났으니 상위 recursion으로 돌아가서 오른쪽 list를 분할한다.

step8~10 - 분할된 list를 합병한다. 둘을 비교하고 더 작은 값을 왼쪽에 위치 시킨다.

step 11 - 이 부분을 이해하기 위해서는 코드로 살펴보자.


```python
while i < len(L) and j < len(R): 
    if L[i] < R[j]: 
        num[k] = L[i] 
        i+=1
    else: 
        num[k] = R[j] 
        j+=1
    k+=1
```


[27,38] [3,43] 을 병합하는 과정을 살펴보면, 각각 list의 첫인자를 보고 비교를 한다. 

- 3이 더 작으니 [3] 이 먼저 들어가게 된다.
- 그 다음에 27과 43을 비교하고 27이 더 작은니 [3,27]이 된다.
- 그 다음에는 38과 43을 비교하고 38이 더 작은니 [3, 27, 38] 이 된다.
- 하지만 이제 i가 2가 되어서 len(L)과 같아졌기 때문에 while문을 빠져 나오게 된다.

이때 나머지 43을 덧붙히기 위해서는 밑에 코드들이 필요하다. 숫자가 남았다는 것은 다른 숫자들 보다 값이 컸다는 의미이다. 그래서 남은 길이만큼 기존 list에 붙혀서 [3, 27, 38, 43] 이 되는 것이다.


```python
while i < len(L): 
    num[k] = L[i] 
    i+=1
    k+=1

while j < len(R): 
    num[k] = R[j] 
    j+=1
    k+=1
```


그 이후로 다시 상위 recursion으로 돌아가서 똑같은 작업을 진행한다.


## Python Code

위에 pseudo-code와는 다르게 구성을 했다. 이전에는 함수 2개를 만들어서 recursion으로 했지만, 하나의 함수로 같은 알고리즘을 구현했다.

```python
import random

def merge_sort(num): 
    if len(num) >1: 
        mid = len(num)//2 # list의 중간을 찾는다
        L = num[:mid] # list의 왼쪽을 분할한다
        R = num[mid:] # list의 오른쪽을 분할한다
    
        merge_sort(L) # 왼쪽 list를 정렬한다
        merge_sort(R) # 오른쪽 list를 정렬한다
    
        i = j = k = 0
            
        # 일시적으로 만든 L과 R을 비교한다
        while i < len(L) and j < len(R): 
            if L[i] < R[j]: # 왼쪽 list에 있던 item이 더 작으면 L[i]를 list 왼쪽에 위치하게 한다
                num[k] = L[i] 
                i+=1
            else: # 오른쪽 list에 있던 item이 더 작으면 R[j]를 list 왼쪽에 위치하게 한다
                num[k] = R[j] 
                j+=1
            k+=1
            
        # 위에 len(L) and len(R)이었기 때문에, 더 긴 list의 숫자가 남았을 것이다,
        # 그 숫자들을 이어 붙힌다.
        # 남은 숫자들은 크기 때문에 남은 것이기에 오른쪽에 붙혀진다
        while i < len(L): 
            num[k] = L[i] 
            i+=1
            k+=1
            
        while j < len(R): 
            num[k] = R[j] 
            j+=1
            k+=1

            

number = [i for i in range(10)]
random.shuffle(number)
print(number)
merge = merge_sort(number)
print(number)
```