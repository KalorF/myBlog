## 实现一个Promise

## 一个比较完整的promise就实现了。只需要实现常用的 all，race 等api即可
```js
function Promise(fn) {
    var data = undefined, reason = undefined;
    var succallbacks = [];
    var failcallbacks = [];
    var status = "pending";
    this.then = function (fulfilled, rejected) {
        return new Promise(function(resolve,reject) {    //返回一个新的promise
            function suc(value) {   //成功
                var ret = typeof fulfilled === 'function' && fulfilled(value) || value;
                if( ret && typeof ret ['then'] == 'function'){    //判断 then中的 返回的是否是promise对象，如果是注册then方法
                    ret.then(function(value){
                        resolve(value);
                    });
                } else {
                    resolve(ret);
                }
            }
            function errback(reason) {  //失败
                reason = typeof rejected === 'function'  && rejected(reason) || reason;
                reject(reason);
            }

            if (status === 'pending') {
                succallbacks.push(suc);
                failcallbacks.push(errback);
            } else if(status === 'fulfilled'){
                suc(data);
            } else {
                errback(reason);
            }
        })

    }

    function resolve(value) {
        setTimeout(function () {   //加入延时
            status = "fulfilled";
            data = value;
            succallbacks.forEach((callback) => {
                callback(value);
            })
        }, 0)

    }

    function reject(value) {
        setTimeout(function () {
            status = "rejected";
            reason = value;
            failcallbacks.forEach((callback) => {
                callback(value);
            })

        }, 0)
    }

    fn(resolve, reject);
}

let p = new Promise((resolve, reject) => {
                setTimeout(() => {
                resolve(1);
            }, 1000)
        }) ;

p.then(data =>{
    console.log(data);
    return  new Promise((resolve,reject) => {    //then 方法返回的是一个promise对象，故执行 promise中的then注册该结果，在resolve
               setTimeout(() => { resolve(2);},1000)})
}).then(data =>{
    console.log(data);
})
```

## 完整
```js
function Promise(task) {
    let self = this; //缓存this
    self.status = 'pending'; //默认状态为pending
    self.value = undefined;  //存放着此promise的结果
    self.onResolvedCallbacks = [];  //存放着所有成功的回调函数
    self.onRejectedCallbacks = [];   //存放着所有的失败的回调函数

    // 调用resolve方法可以把promise状态变成成功态
    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        setTimeout(function () { // 异步执行所有的回调函数
            // 如果当前状态是初始态（pending），则转成成功态
            // 此处这个写判断的原因是因为resolved和rejected两个状态只能由pending转化而来，两者不能相互转化
            if (self.status == 'pending') {
                self.value = value;
                self.status = 'resolved';
                self.onResolvedCallbacks.forEach(item => item(self.value));
            }
        });

    }

    // 调用reject方法可以把当前的promise状态变成失败态
    function reject(value) {
        setTimeout(function () {
            if (self.status == 'pending') {
                self.value = value;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(item => item(value));
            }
        });
    }

    // 立即执行传入的任务
    try {
        task(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

/**
 * resolvePromise函数的目的是与原生Promise相兼容，可以互相调用
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 将返回的promise不停的调用执行，直到失败或者返回一个普通的数据类型
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }
    let then, called;

    if (x != null && ((typeof x == 'object' || isFunction(x)))) {
        // promise
        try {
            then = x.then;
            if (isFunction(then)) {
                then.call(x, function (value) {
                    if (called)return;
                    called = true;
                    resolvePromise(promise2, value, resolve, reject);
                }, function (reason) {
                    if (called)return;
                    called = true;
                    reject(reason);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called)return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

/**
 * onFulfilled成功的回调，onReject失败的回调
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    // 当调用时没有写函数给它一个默认函数值
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : function (value) {
        return value
    };
    onRejected = isFunction(onRejected) ? onRejected : function (value) {
        throw value
    };
    let promise2;
    if (self.status == 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status == 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status == 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function (value) {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push(function (value) {
                try {
                    let x = onRejected(value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    return promise2;
}

/**
 * catch实际上是then的一个简写,成功回调传空值即可
 */
Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}

/**
 * Promise.reject(error)是和 Promise.resolve(value) 类似的静态方法，是 new Promise() 方法的快捷方式。
 */
Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        if (typeof value !== null && typeof value === 'object' && isFunction(value.then)) {
            value.then();
        } else {
            resolve(value);
        }
    })
};

Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    })
};

/**
 * all方法，可以传入多个promise，全部执行完后会将结果以数组的方式返回，如果有一个失败就返回失败
 */
Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        let result = []; // all方法最终返回的结果
        let count = 0; // 完成的数量
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (data) {
                result[i] = data;
                if (++count == promises.length) {
                    resolve(result);
                }
            }, function (err) {
                reject(err);
            });
        }
    });
}

/**
 * race方法，可以传入多个promise，返回的是第一个执行完的resolve的结果，如果有一个失败就返回失败
 */
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (data) {
                resolve(data);
            },function (err) {
                reject(err);
            });
        }
    });
}

Promise.deferred = Promise.defer = function () {
    var defer = {};
    defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    })
    return defer;
}

/**
 * 一些会多次使用的复用功能函数
 */
function isFunction(obj) {
    return typeof obj === "function";
}

/**
* 最后可以通过以下命令安装一个promises测试插件，用插件来测试自己实现的promise符不符合规范
* npm(cnpm) i -g promises-aplus-tests
* promises-aplus-tests Promise.js
*/

module.exports = Promise;
```

## ES6 版本
```js
class es6Promise {
    constructor(task) {
        let self = this; //缓存this
        self.status = 'pending'; //默认状态为pending
        self.value = undefined;  //存放着此promise的结果
        self.onResolvedCallbacks = [];  //存放着所有成功的回调函数
        self.onRejectedCallbacks = [];   //存放着所有的失败的回调函数

        // 调用resolve方法可以把promise状态变成成功态
        function resolve(value) {
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            setTimeout(() => { // 异步执行所有的回调函数
                // 如果当前状态是初始态（pending），则转成成功态
                // 此处这个写判断的原因是因为resolved和rejected两个状态只能由pending转化而来，两者不能相互转化
                if (self.status == 'pending') {
                    self.value = value;
                    self.status = 'resolved';
                    self.onResolvedCallbacks.forEach(item => item(self.value));
                }
            });

        }

        // 调用reject方法可以把当前的promise状态变成失败态
        function reject(value) {
            setTimeout(() => {
                if (self.status == 'pending') {
                    self.value = value;
                    self.status = 'rejected';
                    self.onRejectedCallbacks.forEach(item => item(value));
                }
            });
        }

        // 立即执行传入的任务
        try {
            task(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    /**
     * onFulfilled成功的回调，onReject失败的回调
     * 原型链方法
     */
    then(onFulfilled, onRejected) {
        let self = this;
        // 当调用时没有写函数给它一个默认函数值
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
        onRejected = isFunction(onRejected) ? onRejected : value => {
            throw value
        };
        let promise2;
        if (self.status == 'resolved') {
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        if (self.status == 'rejected') {
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        if (self.status == 'pending') {
            promise2 = new Promise((resolve, reject) => {
                self.onResolvedCallbacks.push(value => {
                    try {
                        let x = onFulfilled(value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
                self.onRejectedCallbacks.push(value => {
                    try {
                        let x = onRejected(value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        return promise2;
    }

    /**
     * catch实际上是then的一个简写,成功回调传空值即可
     * 原型链方法
     */
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    /**
     * Promise.reject(err)是和 Promise.resolve(value) 类似的静态方法，是 new Promise() 方法的快捷方式。
     * 静态方法为类自己的方法，不在原型链上
     */
    static resolve(value) {
        return new Promise((resolve, reject) => {
            if (typeof value !== null && typeof value === 'object' && isFunction(value.then)) {
                value.then();
            } else {
                resolve(value);
            }
        })
    }

    static reject(err) {
        return new Promise((resolve, reject) => {
            reject(err);
        })
    }

    /**
     * all方法，可以传入多个promise，全部执行完后会将结果以数组的方式返回，如果有一个失败就返回失败
     * 静态方法为类自己的方法，不在原型链上
     */
    static all(promises) {
        return new Promise((resolve, reject) => {
            let result = []; // all方法最终返回的结果
            let count = 0; // 完成的数量
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(data => {
                    result[i] = data;
                    if (++count == promises.length) {
                        resolve(result);
                    }
                }, err => {
                    reject(err);
                });
            }
        });
    }

    /**
     * race方法，可以传入多个promise，返回的是第一个执行完的resolve的结果，如果有一个失败就返回失败
     *  静态方法为类自己的方法，不在原型链上
     */
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(data => {
                    resolve(data);
                },err => {
                    reject(err);
                });
            }
        });
    }
}

/**
 * resolvePromise函数的目的是与原生Promise相兼容，可以互相调用
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 将返回的promise不停的调用执行，直到失败或者返回一个普通的数据类型
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }
    let then;
    let called;

    if (x != null && ((typeof x == 'object' || isFunction(x)))) {
        // promise
        try {
            then = x.then;
            if (isFunction(then)) {
                then.call(x, value => {
                    if (called)return;
                    called = true;
                    resolvePromise(promise2, value, resolve, reject);
                }, reason => {
                    if (called)return;
                    called = true;
                    reject(reason);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called)return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

Promise.deferred = Promise.defer = () => {
    const defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    })
    return defer;
}

/**
 * 一些会多次使用的复用功能函数
 */
function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * 最后可以通过以下命令安装一个promises测试插件，用插件来测试自己实现的promise符不符合规范
 * npm(cnpm) i -g promises-aplus-tests
 * promises-aplus-tests es6Promise.js
 */

module.exports = es6Promise;
```
