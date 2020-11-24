---
title: 🏎 [책 요약] Trustworthy Online Controlled Experiments - ch5 Speed Matters
date: 2020-08-02
tags:
  - online-controlled-experiment
keywords:
  - experiment platform
  - A/B testing
  - Trustworthy online controlled experiments
---

> **Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing**라는 책을 읽고 요약하고 있다. 이 포스트에서는 **5장: Speed Matters**에 대해 다루고 있다.

> 글에서 얘기하는 **실험**은 **online controlled experiment**를 의미한다. online controlled experiment은 때로 A/B 테스트라고도 불린다.


📕   4장에서는 **실험 플랫폼의 단계와 실험플랫폼을 구축하기 위해 필요한 요소들**에 대해 정리를 했다. 이번 포스트에서는 서비스의 속도를 개선하는 것이 어떠한 결과를 가져올 수 있고, 속도 개선 실험은 어떻게 할 수 있는지 다뤄보려고 한다. (매우 짧은 포스트이다)

실험에 대한 많은 예제들은 주로 어떻게 UI(User Interface)에 변화를 줘서 목표를 달성했는지에 대해서 다룬다. 하지만, 백엔드 사이드에도 서비스를 개선시킬 수 있는 엄청난 가능성이 존재한다. 특히, 백엔드에서 빠르게 처리할 수록 좋다는 것이 많은 다른 기업들의 실험을 통해서 증명되었다.

서비스가 100ms 빨라진다고 뭐가 달라질까?

‼️**달라진다**. 2017년 Bing의 실험 결과, 100ms의 속도가 개선될 때마다 $1800만의 추가 수익을 거뒀다고 한다.

물론 제품 전체적으로 퍼포먼스를 개선하는 것이 best지만, 실제로는 그렇게 하기가 어렵다. 그렇다면 최소한 제품에서 **퍼포먼스가 저하될 때 가장 조직에게 크리티컬한 이슈를 갖고 올 수 있는 부분**을 개선해야 한다.

> 그렇다면 제품 어느 부분의 latency를 줄여야 하는지 어떻게 알 수 있나?

### 🐢 `slowdown 실험`

간단하지만, 강력한 `slowdown 실험` (속도 저하 실험)이라는 실험 테크닉을 통해 위 질문에 대한 확실한 답변을 얻을 수 있다. 제품의 여러 파트에 해당 실험을 진행을 하고, 어느 부분에서의 속도 저하가 조직의 지표에 가장 악영향을 끼치는지 확인 해 볼 수 있다. 실험의 결과를 통해 제품의 어떤 파트의 퍼포먼스를 개선시켜야 조직이 원하는 지표를 상승시킬 수 있을 지 알 수 있게 된다.

`Amazon`에서 100ms `slowdown 실험`을 진행했었고, 속도가 저하되었을 때 1%의 매출이 줄어든 것을 확인했다.

이처럼 **서버 사이드의 퍼포먼스 개선**을 통해 조직이 중요시 하는 지표를 많이 개선시킬 수 있음을 다른 기업들의 `slowdown 실험`을 통해 알 수 있다.

이번 포스트는 Speed의 중요성을 실험을 통해서 증명할 수 있다는 것에 초점을 뒀다.

✍️ 다음 포스트는 **Organizational Metrics**에 대한 내용을 요약하려고 한다.
