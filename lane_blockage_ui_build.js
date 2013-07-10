/**
 * Created with JetBrains WebStorm.
 * User: scott
 * Date: 2013/7/10
 * Time: 下午 5:06
 * To change this template use File | Settings | File Templates.
 */

// laneblockage ui design
$.prototype.build_lane_blockage_ui=function(){
    var target=$(this).css({
        position:'relative',
        cursor:'pointer'
    }).empty();

    var main_ui=$('<div style="width: 100%;background-color: silver;display:inline-block;height:80px;"></div>');

    // 選取
    main_ui.mousedown(function(e){
        this.pos=[undefined,undefined];
        (e.target==this) ? this.pos[0] = e.offsetX : undefined;
        main_ui.mousemove(function(e){
            this.pos[1] = e.offsetX;
        });
    }).mouseup(function(e){
        main_ui.unbind('mousemove');
        //選取完成
        console.log(this.pos);
        var span=$('<span></span>').css({position:'absolute',left: this.pos[0],display:'inline-block',backgroundColor:'green',height:this.style.height,width: Math.abs(this.pos[1]-this.pos[0]) });
        span.appendTo(this)
    });

    main_ui.appendTo(target);

    return target
};

// init ui
$(document).ready(function(){
    $('.lane_blockage').build_lane_blockage_ui();
});