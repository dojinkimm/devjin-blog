---
title: "[번역] YOLO(v3) object detector를 Pytorch로 처음부터 구현해보기: Part4"
date: 2019-08-06
tags:
  - computer-vision
keywords:
  - yolo
  - computer-vision
  - pytorch
---
# Part 4 - Objectness 점수 thresholding과 non-maximum suppression(NMS)
<br/>

> Opencv DNN, Tensorflow, Pytorch로 YOLO v3를 구현해본 코드를 보려면 [Github repo](https://github.com/dojinkimm/Object_Detection_Video_DNN_Tensorflow_Pytorch) 를 참고하세요. 

<hr/>

### 본문

[본 내용 링크](https://blog.paperspace.com/how-to-implement-a-yolo-v3-object-detector-from-scratch-in-pytorch-part-4/)

지난 Part 3에서는 네트워크의 forward pass를 구현했다. 이번 Part 4에서는 object confidence 점수와 non-maximum suppression으로 thresholding을 해서 object detect하는 것을 알아볼 것이다. 

해당 코드는 `Python 3.5`, `Pytorch 0.4` 에서 실행되게끔 디자인이 되었고, 이 [Github repo](https://github.com/ayooshkathuria/YOLO_v3_tutorial_from_scratch)에서 코드들을 볼 수 있다.

튜토리얼은 총 5 단계로 나뉘어져 있다:

&nbsp;1. [Part 1 : YOLO가 어떻게 작동되는지 이해하기](https://devjin-blog.com/yolo-part1/)<br/>
&nbsp;2. [Part 2 : 네트워크 구조의 layers들 구현하기](https://devjin-blog.com/yolo-part2/)<br/>
&nbsp;3. [Part 3 : 네트워크의 forward pass 구현하기](https://devjin-blog.com/yolo-part3/)<br/>
&nbsp;4. Part 4 : Objectness 점수 thresholding과 non-maximum suppression(NMS)<br/>
&nbsp;5. [Part 5 : 입력과 출력 pipeline 디자인하기](https://devjin-blog.com/yolo-part5/)<br/>
<br/>

# 사전에 알아야할 지식
<br/>

- Part 1~3의 내용
- Pytorch 에 대한 기본 지식, `nn.Module`, `nn.Sequential`, `torch.nn` parameter class들로 커스텀 구조를 어떻게 구현하는지에 대한 지식도 포함한다.
- Numpy 사용법

위에 내용들을 잘 모르면, 이 포스트 맨 밑에 링크를 참고하세요.

이전 파트에서 우리는 이미지가 주어졌을 때 여러개의 출력결과가 object detections인 model을 구현했다. 더 자세히 출력 값을 살펴보면, 출력 값은 tensor이고  `B x 10647 x 85` 의 형태이다. B는 batch에 있는 이미지의 수고, 10647은 이미지당 예측된 bounding box들이고, 85는 bounding box 속성들이다.

하지만,  Part 1에서 얘기했듯이, 출력 결과가 objectness 점수 thresholding과 non-maximal suppression 과정을 거친 후에 나오는 값이 **true detection**이다(앞으로 이러한 detection을 true detection이라 부르겠다)**.** 이 과정을 실현시키기 위해서 `utils.py` 파일에 `write_results` 라는 함수를 만들 것이다. 

```python
def write_results(prediction, confidence, num_classes, nms_conf = 0.4):
```

이 함수는 입력으로  `prediction`, `confidence` (objectness score threshold), `num_classes` (80, COCO의 경우) 그리고 `nms_conf` (NMS IoU threshold)들을 받는다. 

## **Object Confidence Thresholding**

예측된 tensor는 `B x 10647` bounding box들에 대한 정보를 지니고 있다. 각 bounding box의 objectness score가 특정한 threshold 값 이하이면 우리는 모든 속성들(bounding box를 나타내는 전체 행)을 0 으로 설정한다.

```python
    conf_mask = (prediction[:,:,4] > confidence).float().unsqueeze(2)
    prediction = prediction*conf_mask
```

## **Performing Non-maximum Suppression**

> Note: IoU (Intersection over union)와 non-maximum suppression을 이해하고 있다고 가정하면서 포스팅을 진행하고 있다. 모른다면 포스트 밑에 링크를 참고하세요.

우리가 갖고 있는 bouding box의 속성은 bounding box의 중심 좌표, 높이, 너비로 나타내진다. 하지만, 2 box의 IoU를 계산할 때는 각 box 대각선에 있는 좌표들을 사용하는 것이 더 쉽다. 그래서 기존 속성(중심 좌표 x, y, 높이, 너비)을 (왼쪽 위 꼭지점 x, y, 오른쪽 밑 꼭지점 x,y)로 변환한다. 

```python
    box_corner = prediction.new(prediction.shape)
    box_corner[:,:,0] = (prediction[:,:,0] - prediction[:,:,2]/2)
    box_corner[:,:,1] = (prediction[:,:,1] - prediction[:,:,3]/2)
    box_corner[:,:,2] = (prediction[:,:,0] + prediction[:,:,2]/2) 
    box_corner[:,:,3] = (prediction[:,:,1] + prediction[:,:,3]/2)
    prediction[:,:,:4] = box_corner[:,:,:4]
```

True deetection의 수는 이미지마다 다르다. 예를 들어, batch 크기가 3이고 이미지가 1,2,3인 경우에 각각 5,2,4의 true detection을 가질 수 있다. 그렇기 때문에, confidence thresholding과 NMS가 이미지당 한번씩 처리되어야 한다. 벡터화시키는 것이 안되기 때문에 `prediction` (batch에서 이미지의 index를 가지고 있다)의 첫 번째 dimension을 loop 해야한다는 것을 의미한다.

```python
    batch_size = prediction.size(0)

    write = False

    for ind in range(batch_size):
        image_pred = prediction[ind]          #image Tensor
           #confidence threshholding 
           #NMS
   
```
 
이전에도 얘기했듯이, `write` flag는 전체 batch에서 true detections을 모으는데 사용되는 `output` 이 initialize 됐는지 안됐는지 알려준다. 

Loop에서 처음에 정리를 조금 해준다. 각 bouding box 행은 85개의 속성들을 가지고 있고, 그 중에서 80개는 class 점수이다. 여기서 우리는 class 점수 중 가장 높은 값만 고려한다. 그렇기 때문에 80개의 class 점수를 각 행에서 삭제하고 가장 큰 점수를 가진 값과 그 값의 index를 덧붙힌다.

```python
        max_conf, max_conf_score = torch.max(image_pred[:,5:5+ num_classes], 1)
        max_conf = max_conf.float().unsqueeze(1)
        max_conf_score = max_conf_score.float().unsqueeze(1)
        seq = (image_pred[:,:5], max_conf, max_conf_score)
        image_pred = torch.cat(seq, 1)
```

또한, 우리는 object confidence가 특정 threshold보다 작으면 0으로 설정했었으니 그 값들을 삭제한다. 

```python
        non_zero_ind =  (torch.nonzero(image_pred[:,4]))
        try:
            image_pred_ = image_pred[non_zero_ind.squeeze(),:].view(-1,7)
        except:
            continue
        
        #For PyTorch 0.4 compatibility
        #Since the above code with not raise exception for no detection 
        #as scalars are supported in PyTorch 0.4
        if image_pred_.shape[0] == 0:
            continue 
```

여기서 try-except 블록은 detection이 하나도 없을 때의 상황을 다룬다. 만약 없다면 `continue` 를 사용해서 loop body의 나머지 부분들을 건너뛴다. 

이제 이미지에서 detect된 class들을 가져온다.

```python
        #Get the various classes detected in the image
        img_classes = unique(image_pred_[:,-1]) # -1 index holds the class index
```


같은 class에 대해 여러개의 true detection이 나올 수 있기 때문에  `unique` 라는 함수를 새로 만들어서 주어진 이미지에 대해 중복되지 않은 class들을 가져온다. 

```python
def unique(tensor):
    tensor_np = tensor.cpu().numpy()
    unique_np = np.unique(tensor_np)
    unique_tensor = torch.from_numpy(unique_np)
    
    tensor_res = tensor.new(unique_tensor.shape)
    tensor_res.copy_(unique_tensor)
    return tensor_res
```

그 다음에는 class에 NMS를 적용한다. 

```python
        for cls in img_classes:
            #perform NMS
```

Loop안에서 가장 먼저 하는 것은 바로 특정 class(`cls` 로 표기됨)의 detection을 추출하는 것이다.

```python
            #get the detections with one particular class
            cls_mask = image_pred_*(image_pred_[:,-1] == cls).float().unsqueeze(1)
            class_mask_ind = torch.nonzero(cls_mask[:,-2]).squeeze()
            image_pred_class = image_pred_[class_mask_ind].view(-1,7)
            
            #sort the detections such that the entry with the maximum objectness
            #confidence is at the top
            conf_sort_index = torch.sort(image_pred_class[:,4], descending = True )[1]
            image_pred_class = image_pred_class[conf_sort_index]
            idx = image_pred_class.size(0)   #Number of detections
```

이 부분이 NMS를 적용하는 부분이다.

```python
            for i in range(idx):
                #Get the IOUs of all boxes that come after the one we are looking at 
                #in the loop
                try:
                    ious = bbox_iou(image_pred_class[i].unsqueeze(0), image_pred_class[i+1:])
                except ValueError:
                    break
            
                except IndexError:
                    break
            
                #Zero out all the detections that have IoU > treshhold
                iou_mask = (ious < nms_conf).float().unsqueeze(1)
                image_pred_class[i+1:] *= iou_mask       
            
                #Remove the non-zero entries
                non_zero_ind = torch.nonzero(image_pred_class[:,4]).squeeze()
                image_pred_class = image_pred_class[non_zero_ind].view(-1,7)
```

`bbox_iou` 라는 함수를 여기서 사용한다. 입력의 첫 번째 인자는 loop에서 `i` 의 index를 가진 bouding box의 행이다 (예, loop이 2번 째 반복되면 i가 1이기 때문에 image_pred_class[1].unsqueeze(0) 이 전달된다).

입력의 두 번째 인자는 tensor형태를 지닌 bounding box의 여러 행들이다. `bbox_iou`의 리턴은 bounding box의 IoU를 포함하는 tensor이다. 

<img src="/yolo_part4_1.png"/>

만약 2개의 bounding box들이 같은 class이고 IoU가 threshold보다 크다면, 둘 중 더 낮은 class confidence를 가진 class가 제거된다.

각 iteration당, `i` 의 index를 가진 bounding box보다 높은 index를 가진 box 중에서 `nms_thresh` 보다 높은 threshold 값을 가지고 있는 box는 제거 된다. 

위 코드에서 보면 `ious` 가 `idx` (`image_pred_class` 의 행의수)만큼 iterate하도록 디자인 되었기 때문에 try-catch 블록에 있다. 하지만, loop를 돌면서 몇몇 bounding box들은 `image_pred_class` 에서 제거될 수 있고 그렇게 된다면 loop이 `idx` 만큼 iterate하지 못하게 된다. 그러면 loop이 out of bounds라는 `IndexError`를 발생시키던지 `image_pred_class[i+1:]` 의 값이 비어있는 tensor를 리턴해서 `ValueError` 을 야기할 수 있기 때문에 try-catch 블록이 사양된 것이다. 이 에러가 발생하면 우리는 NMS가 더 이상 받아들일 bounding box가 없기에 loop을 빠져나와도 된다는 것을 알 수 있다. 

### **Calculating the IoU**

위에서 언급한 `bbox_iou` 함수이다.

```python
def bbox_iou(box1, box2):
    """
    Returns the IoU of two bounding boxes 
    
    
    """
    #Get the coordinates of bounding boxes
    b1_x1, b1_y1, b1_x2, b1_y2 = box1[:,0], box1[:,1], box1[:,2], box1[:,3]
    b2_x1, b2_y1, b2_x2, b2_y2 = box2[:,0], box2[:,1], box2[:,2], box2[:,3]
    
    #get the corrdinates of the intersection rectangle
    inter_rect_x1 =  torch.max(b1_x1, b2_x1)
    inter_rect_y1 =  torch.max(b1_y1, b2_y1)
    inter_rect_x2 =  torch.min(b1_x2, b2_x2)
    inter_rect_y2 =  torch.min(b1_y2, b2_y2)
    
    #Intersection area
    inter_area = torch.clamp(inter_rect_x2 - inter_rect_x1 + 1, min=0) * torch.clamp(inter_rect_y2 - inter_rect_y1 + 1, min=0)
 
    #Union Area
    b1_area = (b1_x2 - b1_x1 + 1)*(b1_y2 - b1_y1 + 1)
    b2_area = (b2_x2 - b2_x1 + 1)*(b2_y2 - b2_y1 + 1)
    
    iou = inter_area / (b1_area + b2_area - inter_area)
    
    return iou
```

## **Writing the predictions**

`write_results` 함수는 D x 8의 tensor 형태의 결과를 내놓는다. 여기서 D는 이미지 전체에서의 true detection의 수이고 행으로 나타나잰다. 각 detection은 8개의 속성을 지닌다: 

 &nbsp;1. batch에서의 이미지 인덱스 <br/>

 &nbsp;2~5. 4개의 꼭지점 좌표<br/>

 &nbsp;6. objectness 점수<br/>

 &nbsp;7. maximum confidence를 가진 class의 점수<br/>

 &nbsp;8. 그 class의 index<br/>

Output tensor는 이전에도 언급했듯이 detection이 없으면 initialize되지 않는다. Initialize 된 이후에는 그 이후 detection들을 concatenate 할 수 있다. `write` flag를 사용해서 tensor가 initialize 됐는지 안 됐는지 알려준다. Loop의 끝에서 결과로 나온 detection을 `output` tensor에 추가한다. 

```python
            batch_ind = image_pred_class.new(image_pred_class.size(0), 1).fill_(ind)      #Repeat the batch_id for as many detections of the class cls in the image
            seq = batch_ind, image_pred_class
            
            if not write:
                output = torch.cat(seq,1)
                write = True
            else:
                out = torch.cat(seq,1)
                output = torch.cat((output,out))
```

함수 맨 끝에선는 `output` 이 initialize 됐는지 안됐는지 확인한다. 만약 안됐다면 batch내에 이미지에서 단 하나의 detection도 없었다는 의미이기 때문에 0을 리턴한다.

```python
    try:
        return output
    except:
        return 0
```

이걸로 Part4가 마무리 됐다. 우리는 이제 tensor 형태의 prediction 결과(행의 결과를 리스트 형식을 만든 형태)를 얻을 수 있게 되었다. 이제 남은 것은 입력 pipeline을 만들어서 디스크에서 이미지를 읽고, prediction을 계산하고, 이미지에 bounding box를 그리고나서 이미지를 보여주는 것이다. 다음 [Part5](https://devjin-blog.com/yolo-part5/)에서 해당 내용을 찾아볼 수 있다.

### **Further Reading**

1. [PyTorch tutorial](http://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html)
2. [IoU](https://www.youtube.com/watch?v=DNEm4fJ-rto)
3. [Non maximum suppresion](https://www.youtube.com/watch?v=A46HZGR5fMw)
4. [Non-maximum suppression](https://www.google.co.in/search?q=NMS+python&oq=NMS+python+&aqs=chrome..69i57j35i39.2657j0j7&sourceid=chrome&ie=UTF-8)