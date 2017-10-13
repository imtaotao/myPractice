//生成的控件操作
var select = {
    init : function( context ) {
        this.conrectStyle( context );
        this.aimate();
    },
    conrectStyle : function( context ) {
    	var me = this;
        // 修正下拉框的位置
        setTimeout( function() {
        	var box = $( context ).find( '[data-select = true]' );
        	if( !box[0] ) {
        		me.conrectStyle( context );
        	}else{
        		for( var i = 0 ; i < box.length ; i++ ) {
		            var ul = $( box[i] ).find( 'ul' ),
		                show = $( box[i] ).find( 'span' ),
		                top = parseInt( $( box[i] ).css( 'height' ) );

		            // 为每个box都添加一个属性，用于样式操作
		            box[i].boxRadius = true;

		            ul.css( 'top' , top );

		            // 标题显示文字要居中
		            show.css( 'line-height' , top + 'px' );

		            // 改变li的高度
		            ul.find( 'li' ).css( 'height' , top )

		            // 默认显示第一个option
		            var firstLi = ul.find( 'li:first-child' );
		            // 赋值
		            ul.siblings( 'span' ).html( firstLi.html() );
		            // 给hover样式
		            firstLi.addClass( 'select-hover' )
	        	}
        	}
        } , 5 );
    },
    aimate : function() {
        var me = this;

        //下拉框动( 可以通过事件捕获来让li点击时可以收起 )
        $('body').on('click', '[data-select = true]' , function( e ) {
            var that = this;
            div = $( this );
            // 调用动画以及改变样式（mmp,那个slideToggle竟然有bug）
            !!that.boxRadius ? div.find( 'ul' ).stop().slideDown( 100 , function() {
                div.css( 'border-radius' , '5px 5px 0 0' ) && ( that.boxRadius = false )
            }) : div.find( 'ul' ).stop().slideUp( 100 , function() {
                div.css( 'border-radius' , '5px' ) && ( that.boxRadius = true );
            })

        })

        //option( li )添加点击事件，让span显示当前的值
        $('body').on('click', '[data-select = true]>ul li', function( e ) {
            var select = $( '[data-select=box]' ),
                value = $( this ).html();

            // 切换样式
            $( this ).siblings( '.select-hover' ).removeClass( 'select-hover' )
            $( this ).addClass( 'select-hover' )
            // 赋值
            $( this ).parent().siblings( 'span' ).html( value )

            // *****最后赋值给select（非常重要）
            // 得到我们自己定义的随机id
            var thatRandomId = $( this ).parents( '[data-select=true]' )[0].randomId;
            for( var i = 0 ; i < select.length ; i++ ) {
                var slRandomId = select[i].randomId;
                thatRandomId === slRandomId && $( select[i] ).val( value )
            }
        })
    },
}

// 生成控件
var controls = {
    init : function( context , delay ) {
    	var that = context;
    	//没有上下文，默认添加到body
    	(!that || that === true || this.isNum(context) ) && ( context = document.getElementsByTagName( 'body' )[0] );
    	for( var i = 0 , el = $( context ).find( '[data-select=box]' ) ; i < el.length ; i++ ) {
    		//把select透明度设置为0
    		el[i].style.opacity = 0;
    	}

    	//如果context为true，或者delay存在的话，都代表要进行延时处理，其余的情况正常处理
    	if( this.isNum( that ) || that === true || !!delay ){
    		var time = this.isNum( that ) ? that : 
    				   this.isNum( delay ) ? delay : 5;

    		setTimeout(function() {
    			this.addBox( context );
        		select.init( context );
    		}.bind( this ) , time );
    	}else{
    		this.addBox( context );
        	select.init( context );
    	}
        
    },
    isNum : function( num ) {
    	return Object.prototype.toString.call( num ) === "[object Number]"
    },
    //得到在当前上下文的坐标值
    getCoordinate : function( el , endparent ) {
        var actualLeft = el.offsetLeft,
            currentLeft = el.offsetParent,
            actualTop = el.offsetTop,
            currentTop = el.offsetParent;


        // 得到浏览器默认的margin值，一般为8px;
        // var bodyMargin =  parseInt( getComputedStyle( document.getElementsByTagName( 'body' )[0] ).margin );

        // 如果有父元素就循环叠加，直到没有父元素为止
        // 得到left的值
        while ( !!currentLeft && currentLeft !== endparent ) {
            actualLeft += !!currentLeft &&　currentLeft.offsetLeft;
            currentLeft = !!currentLeft && currentLeft.offsetParent;
        }
        // 得到top的值
        while ( !!currentTop && currentTop !== endparent) {
            actualTop += !!currentTop &&　currentTop.offsetTop;
            currentTop = !!currentTop &&　currentTop.offsetParent;
        }

        // 如果当前元素不是body的话就减去body的margin（现在用不到，因为后来生成的元素也在body里面，受到body影响）
        // el.nodeName !== 'BODY' && ( actualLeft -= bodyMargin ) && ( actualTop -= bodyMargin );

        return { left : actualLeft , top :  actualTop };
    },
    addBox : function( context ) {
        var me = this,
            select = $( context ).find( '[data-select=box]' ),
            len = select.length,
            ardhave = $( context ).find( '[data-select = true]' );
        // 先清空原先已经有的div
        for( var j = 0 ; j < ardhave.length ; j++) {
        	$( ardhave[j] ).remove()
        }

        // 遍历select,因为不晓得有多少个select
        for( var i = 0 ; i < select.length ; i++ ) {
            var slheight = $( select[i] ).css( 'height' ),
                slwidth = $( select[i] ).css( 'width' ),
                randomIdNum = Math.random() + Math.random().toString( 36 ),//随机ID
                slZb = me.getCoordinate( select[i] , context );//得到当前select相对我们要的父元素的坐标

            //给每个select都设置一个随机id便于后面自动生成的div查找
            select[i].randomId = randomIdNum ;

            // 生成最外层
            var div = document.createElement( 'div' );
            //生成的div也设置一个随机id,这样就让每个生成的div与select联系起来了
            div.randomId = randomIdNum;
            //自定义属性只能通过核心dom才能生成
            div.setAttribute( 'data-select' , 'true');
            div.style.display = 'block';
            div.style.width = slwidth;
            div.style.height = slheight;
            div.style['transform'] = 'translate(' + slZb.left + 'px,' + slZb.top + 'px)';
            div.style.zIndex = len--;

            // 生成显示的span
            var span = document.createElement( 'span' );

            // 生成ul
            var ul = document.createElement( 'ul' );

            // 遍历查看有多少个option，我们就动态生成多少个li
            var opNum = select[i].getElementsByTagName( 'option' );

            for( var j = 0 ; j < opNum.length ; j++ ) {
                var li = document.createElement( 'li');
                li.innerHTML = opNum[j].innerHTML
                ul.appendChild( li )
            }
            // 依次添加
            div.appendChild( span );
            div.appendChild( ul );
            context.appendChild( div );
            // 然后把当前的select设置为不可见，不可点击
            select[i].style.opacity = 0;
            select[i].disabled = 'disabled';
        }
    }
}
controls.init();