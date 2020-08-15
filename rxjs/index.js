import { Observable, Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs-es/Rx'

var clicks = Observable.of(1, 2, 3)
var positions = clicks
      .do(x => console.log(x + 2 + '....'))
      .map(x => x + 1)
positions.subscribe(x => console.log(x))

/*var timer1 = Observable.interval(1000).take(10);
var timer2 = Observable.interval(2000).take(6);
var timer3 = Observable.interval(500).take(10);
var result = Observable.concat([timer1, timer2, timer3]); // note that array is passed
result.subscribe(x => console.log(x));*/

/*var timer = Observable.interval(1000).take(4)
var sequence = Observable.range(1, 10)
var result = Observable.concat(sequence, timer)
result.subscribe(x => console.log(x))*/

/*var clicksOrInterval = Observable.defer(function(){
  if(Math.random() > 0.5){
    return Observable.fromEvent(document, 'click')
  }else{
    return Observable.interval(1000)
  }
})

clicksOrInterval.subscribe(x => console.log(x))*/

/*var result = Observable.fromPromise(fetch('https://www.baidu.com'))
result.subscribe({
  next: v => console.log(x),
  error: err => console.error(err)
})*/

/*var clicks = Observable.fromEvent(document, 'click')
var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV')
clicksOnDivs.subscribe(x => console.log(x))*/



/*var count = 0
var button = document.querySelector('button')*/

/*Observable.fromEvent(button, 'click')
  .scan(count => count + 1, 0)
  .subscribe(() => console.log(`Clicked ${count} times`))*/
// button.addEventListener('click', () => console.log(`Clicked ${++count} times`))

/*var rate = 1000;
var lastClick = Date.now() - rate*/
/*button.addEventListener('click', (event) => {
  if(Date.now() - lastClick >= rate){
    count += event.clientX
    console.log(`Clicked ${count} times`)
    lastClick = Date.now()
  }
})*/

/*Observable.fromEvent(button, 'click')
  .throttleTime(1000)
  .map(event => event.clientX)
  .scan((count, clientX) => count + clientX, 0)
  .subscribe(() => console.log(`Clicked ${count} times`))*/

/*var observe = Observable.create(observe => {
  observe.next(1)
  observe.next(2)
  observe.next(3)
  setTimeout(() => {
    observe.next(4)
    observe.complete()
  }, 1000)
})

console.log('before subscribe')
observe.subscribe({
  next: x => console.log('got value: ' + x),
  error: err => console.error('something wrong occurred: ' + err),
  complete: _ => console.log('done')
})
console.log('after subscribe')*/


/*var foo = Observable.create(observer => {
  observer.next('hehe')
  observer.complete()
})

var subscription = foo.subscribe(_ => {
  console.log(_)
})

console.log(subscription)*/

// foo.subscribe(y => {
//   console.log(y)
// })

/*var observable1 = Observable.interval(400);
var observable2 = Observable.interval(300);

var subscription = observable1.subscribe(x => console.log('first: ' + x));
var childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe();
}, 1000);*/


/*var subject = new Subject()
subject.subscribe({
  next: v => console.log('observerA: ' + v)
})
subject.subscribe({
  next: v => console.log('observerB: ' + v)
})

subject.next(1)
subject.next(2)*/


/*var source = Observable.from([1, 2, 3])
var subject = new Subject()

var multicasted = source.multicast(subject)

multicasted.subscribe({
  next: v => console.log(`observerA: ${v}`)
})

multicasted.subscribe({
  next: v => console.log(`observerB: ${v}`)
})

multicasted.connect()*/

/*var source = Observable.interval(500);
var subject = new Subject();
var refCounted = source.multicast(subject).refCount();
var subscription1, subscription2, subscriptionConnect;

// This calls `connect()`, because
// it is the first subscriber to `refCounted`
console.log('observerA subscribed');
subscription1 = refCounted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

setTimeout(() => {
  console.log('observerB subscribed');
  subscription2 = refCounted.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
}, 600);

setTimeout(() => {
  console.log('observerA unsubscribed');
  subscription1.unsubscribe();
}, 1200);

// This is when the shared Observable execution will stop, because
// `refCounted` would have no more subscribers after this
setTimeout(() => {
  console.log('observerB unsubscribed');
  subscription2.unsubscribe();
}, 2000);*/

// 不论何时添加观察者，都会将最近的值发送给所有的观察者
/*var subject = new BehaviorSubject(0)
subject.subscribe({
  next: v => console.log('observerA: ' + v)
})

subject.next(1)
subject.next(2)

subject.subscribe({
  next: v => console.log('observerB: ' + v)
})

subject.next(3)*/


// 缓存多少个值给新的观察者
// 不仅可以决定缓存多少个值，而且还可以决定缓存的时间
/*var subject = new ReplaySubject(3)

subject.subscribe({
  next: v => console.log(`observerA: ${v}`)
})

subject.next(1)
subject.next(2)
subject.next(3)
subject.next(4)

subject.subscribe({
  next: v => console.log(`observerB: ${v}`)
})

subject.next(5)*/


// 接收到complete通知后，才将最后一次的值传递给观察者
/*var subject = new AsyncSubject()
subject.subscribe({
  next: v => console.log(`ObserverA: ${v}`)
})

subject.next(1)
subject.next(2)
subject.next(3)
subject.next(4)

subject.subscribe({
  next: v => console.log(`Observer B: ${v}`)
})

subject.next(5)
subject.complete()*/



// 实例操作符和静态操作符的区别
/*function mutiplyByTen(input) {
  var output = Observable.create(function (observer) {
    input.subscribe({
      next: v => observer.next(10 * v),
      error: err => observer.error(err),
      complete: _ => observer.complete()
    })
  })
  return output
}


var input = Observable.from([1, 2, 3, 4])
var output = mutiplyByTen(input)
output.subscribe(x => console.log(x))*/


/*var result = Observable.empty().startWith(7)
result.subscribe({
  next: v => console.log(v)
})*/


/*var interval = Observable.interval(1000)
var result = interval.mergeMap(x => x % 2 === 1 
  ? Observable.of('a', 'b', 'c')
  : Observable.empty())
result.subscribe(x => console.log(x))*/


/*var clicks = Observable.fromEvent(document, 'click')
var timer = Observable.interval(1000)
var clicksOrTimer = Observable.merge(clicks, timer)
clicksOrTimer.subscribe(x => console.log(x))*/

/*var numbers = Observable.of(10, 20, 30)
var letters = Observable.of('a', 'b', 'c')
var interval = Observable.interval(1000)
var result = numbers.concat(letters).concat(interval)
result.subscribe(x => console.log(x))*/

/*var result = Observable.throw(new Error('oops')).startWith(7)
result.subscribe(x => console.log(x), e => console.error(e))*/

/*var interval = Observable.interval(1000)
var result = interval.mergeMap(x => 
  x === 13 ? Observable.throw('thirteens was bad') 
    : Observable.of('a', 'b', 'c'))
result.subscribe(x => console.log(x), e => console.error(e))*/

/*var numbers = Observable.timer(3000, 1000);
numbers.subscribe(x => console.log(x));*/
