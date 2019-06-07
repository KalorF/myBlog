# S O L I D 五大设计原则

## S - 单一职责原则
* 一个程序只做好一件事
* 如果功能过于复杂就拆分开，每个部分保持独立

## O - 开放封闭原则
* 对扩展开放，对修改封闭
* 增加需求时，扩展新代码，而非修改已有代码
* 软件设计的终极目标

## L - 李氏置换原则
* 子类能覆盖父类
* 父类能出现的地方子类就能出现
* js 中使用较少（弱类型&继承使用较少）

## I - 接口独立原则
* 保持接口的单一独立，避免出现“胖接口”
* js 中没有接口（typescript除外），使用较少
* 类似于单一职责原则，这里更关注接口

## D - 依赖倒置原则
* 面向接口编程，依赖于抽象而不依赖于具体
* 使用方法只关注接口而不关注具体类的实现
* js 中使用较少（没有借口&弱类型）

### S 和 O 演示（以Promise为例）
```js
function loadImg(src) {
  let promise = new Promise(function (resolve, reject) {
    let img = document.createElement('img')
    img.onload = function () {
      resolve(img)
    }
    img.onerror = function () {
      reject('图片加载失败')
    }
    img.src = src
  })
  return promise
}

let src = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=26&gp=0.jpg'
let result = loadImg(src)

result.then(function (img) {
  alert(`width: ${img.width}`)
  return img // 返回img可以继续使用then
}).then(function (img) {
  alert(`height: ${img.height}`)
}).catch(function (ex) {
  alert(ex)
})
```
### 面试题事例
::: tip 题目
* 某停车场，分3层，每层100车位
* 每个车位都能监控到车辆的驶入和离开
* 车辆进入前，显示每层的空余车位数量
* 车辆进入时，摄像头可以识别车牌号和时间
* 车辆出来时，出口显示器显示车牌号和停留时长
:::

##### 代码实现
```js
// 车辆
class Car {
  constructor(num) {
    this.num = num
  }
}

// 摄像头
class Camera {
  shot(car) {
    return {
      num: car.num,
      inTime: Date.now()
    }
  }
}

// 出口显示屏
class Screen {
  show(car, inTime) {
    console.log('车牌号', car.num)
    console.log('停车时间', Date.now() - inTime)
  }
}

// 停车场
class Park {
  constructor(floors) {
    this.floors = floors
    this.camrea = new Camera()
    this.screen = new Screen()
    this.carList = {} // 存储摄像头返回的车辆信息
  }
  in(car) {
    // 通过摄像头获取信息
    const info = this.camrea.shot(car)
    // 停到某个停车位
    const i = parseInt(Math.random() * 100 % 100)
    const place = this.floors[0].places[i]
    place.in()
    info.place = place
    // 记录信息
    this.carList[car.num] = info
    console.log(this.carList[car.num])
  }
  out(car) {
    // 获取信息
    const info = this.carList[car.num]
    // 将停车位清空
    const place = info.place
    place.out()
    // 显示时间
    this.screen.show(car, info.inTime)
    // 清空记录
    delete this.carList[car.num]
  }
  emptyNum() {
    return this.floors.map(floor => {
      return `${floor.index} 层还有 ${floor.emptyPlaceNum()} 个车位`
    }).join('\n')
  }
}

// 层
class Floor {
  constructor(index, places) {
    this.index = index
    this.places = places || []
  }
  emptyPlaceNum() {
    let num = 0
    this.places.forEach(p => {
      if (p.empty) {
        num = num + 1
      }
    })
    return num
  }
}

// 车位
class Place {
  constructor() {
    this.empty = true
  }
  in() {
    this.empty = false
  }
  out() {
    this.empty = true
  }
}

// 测试-------------
// 初始化停车场
const floors = []
for (let i = 0; i < 3; i++) {
  const places = []
  for (let j = 0; j < 100; j++) {
    places[j] = new Place()
  }
  floors[i] = new Floor(i + 1, places)
}
const park = new Park(floors)
// 初始化车辆
const car1 = new Car(100)
const car2 = new Car(200)
const car3 = new Car(300)

console.log('第一辆车进入')
console.log(park.emptyNum())
park.in(car1)
console.log('第二辆车进入')
console.log(park.emptyNum())
park.in(car2)
console.log('第一辆车离开')
park.out(car1)
console.log('第二辆车离开')
park.out(car2)

console.log('第三辆车进入')
console.log(park.emptyNum())
park.in(car3)
console.log('第三辆车离开')
park.out(car3)
```