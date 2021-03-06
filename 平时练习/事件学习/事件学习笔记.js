/*
	** 自定义事件分为两种

		1、js自定义事件（可以自定义event对象）
			ps：参照 —— “观察者模式”
				a、 定义一个Event构造函数，里面声明个listener对象（如this.listener = {}），用来保存事件类型。

				b、 在Event的原型对象中，声明三个方法，分别用来，声明事件（addEvent），删除事件回调（removeEvent），
					触发事件（fireEvent）

				c、 在addEvent中，把得到的事件类型保存到listener中，key为type，value为一个数组，数组中保
					存着回调函数（通过push操作），return this 用于链式操作。

				d、 在fireEvent中，遍历listener[type]数组，依次调用函数，然后可以自定义一个event对象，比
					如{ type : type }就可以传递出当前的事件类型，当然，可以定义许许多多的方法和属性，最后
					return this 用于链式操作

				e、 在removeEvent中，因为要删除的是一个数组中的回调函数，可以遍历事件类型数组，判断与传入
					进来函数是否全等，如果全等就删除（arr.splice(i,1)），然后 return this 用于链式操作

				f、 如何监听，是否可以有冒泡，如何设计和阻止默认行为，还一无所知


			
		2、DOM自定义事件（可带原生event对象）
			ps：模仿jquery伪事件对象（原生事件，自定义事件，兼容性都可以统一处理）
				a、 为当前DOM元素创建一个保存事件类型的容器对象（比如命名为events）。

				b、 为每个事件类型都创建一个保存回调函数的数组（比如命名为handlers）。
				
				c、 然后判断当前DOM元素上是否绑定了当前事件类型的回调函数,
					如果绑定了，我们就把这个回调函数拿出来转移到handlers数组的第一个元素（handlers[0]）,
					如果没有，就代表从来没有绑定过当前的事件类型，继续往下走。

				d、 依次把声明过的当前事件类型的回调函数放入这个数组之中，保存起来（比如执行push操作）

				e、 然后我们用一个统一的处理函数来执行数组中的所有回调函数，让当前DOM元素的回调为这个统
					一的处理函数（比如命名为handleEvent），但是在这里我们要判断是自定义的还是原生的事件，
					自定义的就用elem.addEventListener来声明，原生的事件可以转化为dom0级事件的形式处理
				
				f、 我们可以定义一个用来修正，自定义event属性的函数，并在hanleEvent中调用它（比如命名为
					fixEvent）。

				g、 我们在fixEvent函数中来创建一个Event构造函数，它的原型对象之中保存着当前事件对象的一些
					信息，可以根据需要来自定义（也可以做兼容处理），定义一些原生event对象中没有的属性和方
					法，然后把原生event对象中属性深拷贝到我们自定义的Event对象中。（具体做法可以参照jQuery
					中的 $.prototype.init.prototype = $.prototype ）。

				h、 对删除事件的回调的方法，我们可以得到当前DOM元素的events对象（自定义过的 a 步），然后我们得
					到当前事件类型的回调函数数组（比如events[click]），删除指定的回调函数。可以模仿字符串的indexOf
					方法写个数组的indexOf方法，找到当前回调函数的指定位置，并删除它。
			   	
			   	// ===================================================================================================
				//  到此，对于原生事件已经够了，但是对于我们自动以的dom事件还不够，因为没有触发方法，我的想法
				//	是这样的（简单的测试是可以的，但没做过深的测试）
				
				i、 可以来定义一个触发事件回调函数的方法（比如命名为fireEvent）

				j、 由于是自定义的dom事件，没有event，要通过 h5 里面的自定义事件的方法来获得event对象，参考：
					https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Creating_and_triggering_events

				k、 然后执行elem.dispatchEvent()这个方法，参数是当前要执行的事件类型，此时就会回到 e 那一步
					执行handleEvent函数


				*   这样就把原生事件和自定义事件统一为一个方法，还能做兼容处理，唯一的区别就是自定义的事件需要
					手动触发

*/


	// ====================================================================================================
	/*  
		**  疑惑的问题

		1、 自定义事件的监听实现，还没看到什么好的资料，猜测应该是满足某一条件，就调用自定义的fireEvent方法，我
			觉得大部分也是通过原生事件来实现的，如果是像ext的页面生命周期那样的自定义事件，我可能会用到原生的
			DOMContendLoaded这个事件来尝试一下。

		2、 对于阻止默认行为，dom事件，原生的可以用event.preventDefault()这个方法，自定义的dom事件，应该可以通过
			retrunValue属性来写一个preventDefault方法，但还没试过，不确定。js自定义事件的话可以从逻辑中自己定义
			一个preventDefault方法

		3、 dom事件冒泡的处理，还没有仔细看，不知如何处理
	*/
