/**
 * Created with JetBrains WebStorm.
 * User: scott
 * Date: 2013/7/10
 * Time: 下午 5:06
 * To change this template use File | Settings | File Templates.
 */
//  laneblockage ui design

// 多路段選取UI
$.prototype.build_lane_blockage_ui=function(km_length){
    var target=$(this).css({
        position:'relative',
        cursor:'pointer',
        borderRadius:10
    }).empty();

    var main_ui=$('<div style="width: 100%;background-color: darkgrey;display:inline-block;margin-bottom:30px;height:40px;" onDragStart="return false" onSelectStart="return false"></div>');

    // 選取
    main_ui.mousedown(function(e){
        this.pos=[undefined,undefined]; // init

        //座標換算
        if(e.target!=this){this.pos[0]=parseInt(e.target.style.left)+parseInt(e.offsetX);}
        else{this.pos[0]=parseInt(e.offsetX);}

        main_ui.mouseup(function(e){    //滑鼠放開

                //座標換算
                if(e.target!=this){this.pos[1]=parseInt(e.target.style.left)+parseInt(e.offsetX);}
                else{this.pos[1]=parseInt(e.offsetX);}

                if( Math.abs(this.pos[1]-this.pos[0])>0 ){

                    var span=$('<span></span>')

                    span.dblclick(function(e){
                        this.remove();
                    });

                    span.click(function(e){
                        console.log(this.style.left,this.style.width);
                    });

                    span.css({
                        borderRadius:5,
                        opacity: .7,
                        position:'absolute',
                        left: this.pos[0] > this.pos[1] ? this.pos[1] : this.pos[0],
                        display:'inline-block',
                        backgroundColor:'yellow',
                        height:parseInt(this.style.height)-6,
                        width: Math.abs(this.pos[1]-this.pos[0]),
                        border:'3px solid blue'
                    });

                    span.hover(function(e){
                        this.style.border='3px solid orangered';
                    },function(e){
                        this.style.border='3px solid blue';
                    })
                    span.appendTo(this);
                }
            main_ui.unbind('mouseup');
        });
    });

    main_ui.appendTo(target);

    main_ui.mousemove(function(e){
        if(e.target!=this){var x=parseInt(e.target.style.left)+parseInt(e.offsetX);}
        else{var x=parseInt(e.offsetX);}
        showInfo.css('left',x);
        showInfo.show();

        var width=parseInt( $('div.lane_blockage').css('width') );

        showInfo.text( Math.round( (x/width)*km_length*10 )/10+' 公里' );
    });

    main_ui.mouseleave(function(e){
        showInfo.hide();
    });

    var showInfo=$('<span>0km</span>').css({
        position:'absolute',
        fontWeight:'bold',
        color:'blue',
        top:40,
        display:'none'
    });

    showInfo.appendTo(main_ui);

    return target
};

// init ui
$(document).ready(function(){
    $('.lane_blockage').build_lane_blockage_ui(50);
});