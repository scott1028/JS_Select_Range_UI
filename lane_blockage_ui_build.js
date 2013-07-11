/**
 * Created with JetBrains WebStorm.
 * User: scott
 * Date: 2013/7/10
 * Time: 下午 5:06
 * To change this template use File | Settings | File Templates.
 */

//  laneblockage ui design
// 多路段選取UI
$.prototype.build_lane_blockage_ui=function(){
    var target=$(this).css({
        position:'relative',
        cursor:'pointer'
    }).empty();

    var main_ui=$('<div style="width: 100%;background-color: silver;display:inline-block;height:80px;"></div>');

    // 選取
    main_ui.mousedown(function(e){
        this.pos=[undefined,undefined]; // init

        if(e.target==this){ //必須在指定元素下壓才會觸發
            this.pos[0] = e.offsetX;    // 畫鼠下壓

            console.log(this.pos);

            main_ui.mouseup(function(e){    //滑鼠放開
                if(e.target==this){

                    this.pos[1] = e.offsetX;

                    console.log(this.pos);

                    if( Math.abs(this.pos[1]-this.pos[0])>0 ){

                        var span=$('<span></span>').css({position:'absolute',left: this.pos[0] > this.pos[1] ? this.pos[1] : this.pos[0],display:'inline-block',backgroundColor:'green',height:this.style.height,width: Math.abs(this.pos[1]-this.pos[0]) });

                        span.appendTo(this);

                        span.dblclick(function(e){
                            this.remove();
                        })

                        span.click(function(e){
                            console.log(this.style.left,this.style.width);
                        })

                    }
                };

                main_ui.unbind('mousemove mouseup');
            });
        }
    });

    main_ui.appendTo(target);

    return target
};

// init ui
$(document).ready(function(){
    $('.lane_blockage').build_lane_blockage_ui();
});