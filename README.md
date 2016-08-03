Avalonx
=======

>基于Avalon 1.x 版本的数据响应管理器

什么时候需要用avalonx
---------------------
在不同viewmodel之间共享特定数据，并自动更新其对应的视图。目前不适合的应用环境：单页应用

如何引入
-------
```html
<script src="avalonx.min.js"></script>
```

接口
-------
引入js文件后即可在全局页面使用avalonx

### avalonx.define(param)
>参数 param 类型 object

使用方法同avalon.define, 返回一个avalon的vm对象。若需要vm使用共享数据，请在参数中添加$store:'$store'。

生成的vm对象中会包含一个store对象， 通常情况下请不要直接对store值进行操作，请使用patch和dispatch方法！

注：store是关键字，不能作为一个键值定义在param根下。

```js
// Example:

// 正确
vm = avalonx.define({
  $id: 'ctrl',
  $store: '$store'
});

// 报错， 关键字store不能在根下
vm = avalonx.define({
  $id: 'ctrl',
  store: 1
});

```

### avalonx.remove(id)
>参数 id 类型 string

从派发对象中删除，不再响应后续共享数据的变化情况

### avalonx.reset(id)
>参数 id 类型 string

>返回 成功:1 失败:0

根据第一次定义vm的参数重置一个vm对象，该vm对象必须是由avalonx定义，且没有使用remove方法移除过。传入的id对应vm对象中的$id。

### avalonx.store(param)
>参数 param 类型 object

>返回 成功:1 失败:0

定义共享数据，重复调用该方法只能添加或者重置已有的值。

注： 目前param中不能定义object或者function。

```js
// Example:

avalonx.store({
  name: 'A',
  age: 24
});

vm = avalonx.define({
  $id: 'ctrl',
  $store: '$store'
});

/** 
 * 在对应的controller中可以直接使用 store.key 的方式获取共享数据
 * 
 * <div ms-controller="ctrl">
 *   <span ms-bind="store.name"></span>
 * </div>
 *
 */

```

### avalonx.patch(arg1, arg2)
>参数 arg1 类型 object/string

>参数 arg2 类型 any

>返回 成功:1 失败:0


当需要更新共享数据时，首先需要调用patch方法，patch中改变的值并不会直接反映在原共享数据上，而是保存在缓存中，调用dispatch改变原数据。
若patch的数据不存在共享数据中，会停止后续patch并返回0。

```js
// Example:

// patch with key-value 
avalonx.patch('name', 'B');

// or patch with object
avalonx.patch({
  name: 'B'
});
```

### avalonx.patching(arg1, arg2)

patch的链式调用，使用方法同patch，若patch的数据不存在共享数据中，会直接忽略继续处理下一条数据。

### avalonx.unpatch(key)
>参数 key 类型 string

清除对应key的缓存，若不指定值则清空全部缓存。


### avalonx.dispatch(key)
>参数 key 类型 string

>返回 成功:1 失败:0

将缓存中对应key值中的数据更新到共享数据中，若不指定值则将所有缓存中的值更新到共享数据，并派发至各vm中。