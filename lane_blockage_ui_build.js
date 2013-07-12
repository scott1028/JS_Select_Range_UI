/**
 * Created with JetBrains WebStorm.
 * User: scott
 * Date: 2013/7/10
 * Time: 下午 5:06
 * To change this template use File | Settings | File Templates.
 */
//  laneblockage ui design

// 多路段選取UI,需要輸入比例尺
$.prototype.build_lane_blockage_ui=function(km_length){

    // 重新計算座標
    var re_calculate_offset=function(e,_this){
        if(e.target!=_this){ return parseInt(e.target.style.left)+parseInt(e.offsetX); }
        else{ return parseInt(e.offsetX); }
    };

    // 比例尺換算
    var calculate_length=function(pos_x){
        var width=parseInt( $('div.lane_blockage').css('width') );
        return Math.round( (pos_x/width)*km_length*10 )/10
    };

    var target=$(this).css({
        position:'relative',
        cursor:'pointer',
        borderRadius:10
    }).empty();

    var main_ui=$('<div style="border-top:5px ridge darkgrey;border-bottom:5px ridge darkgrey;width: 100%;background-color: lightgrey;display:inline-block;margin-bottom:20px;height:40px;" onDragStart="return false" onSelectStart="return false"></div>');

    // 選取
    main_ui.mousedown(function(e){
        this.pos=[undefined,undefined]; // init

        //座標換算
        this.pos[0]=re_calculate_offset(e,this);

        main_ui.mouseup(function(e){    //滑鼠放開

                //座標換算
                this.pos[1]=re_calculate_offset(e,this);

                if( Math.abs(this.pos[1]-this.pos[0])>0 ){

                    var time=new Date;
                    var class_name='range_'+time.getTime();
                    var span=$('<span></span>').attr({class:class_name,id:class_name});

                    span.dblclick(function(e){
                        this.remove();
                        infobox.find('.'+this.className).remove();
                        aa=infobox;
                    });

                    span.click(function(e){
                        console.log(this.style.left,this.style.width);
                    });

                    span.css({
                        opacity: .7,
                        position:'absolute',
                        left: this.pos[0] > this.pos[1] ? this.pos[1] : this.pos[0],
                        display:'inline-block',
                        backgroundColor:'yellow',
                        height:parseInt(this.style.height),
                        width: Math.abs(this.pos[1]-this.pos[0]),
                        borderRight:'3px solid blue',
                        borderLeft:'3px solid blue'
                    });

                    span.hover(function(e){
                        this.style.borderLeft='3px solid orangered';
                        this.style.borderRight='3px solid orangered';
                    },function(e){
                        this.style.borderLeft='3px solid blue';
                        this.style.borderRight='3px solid blue';
                    });

                    span.appendTo(this);
                    var infobox_item=$('<span></span>').css({paddingLeft:10}).attr({class:class_name});

                    var begin=parseInt(span.css('left'));
                    var end=parseInt(span.css('left'))+parseInt(span.css('width'));

                    infobox_item.html(
                        calculate_length(begin)+'~'+calculate_length(end)+' 公里'
                    );

                    infobox_item.appendTo(infobox);


                }
            main_ui.unbind('mouseup');
        });
    });

    main_ui.appendTo(target);

    main_ui.mousemove(function(e){

        //座標換算
        var x=re_calculate_offset(e,this);

        showInfo.css('left',x);
        showInfo.show();

        showInfo.text( calculate_length(x)+' 公里' );
    });

    main_ui.mouseleave(function(e){
        showInfo.hide();
    });

    var showInfo=$('<span>0km</span>').css({
        position:'absolute',
        fontWeight:'bold',
        color:'blue',
        top:50,
        display:'none'
    });

    // 用來紀錄到底有多少選擇
    showInfo.appendTo(main_ui);

    var infobox=$('<div></div>').css({
        width:'100%'
    });

    infobox.insertAfter(target);


    return target
};

// init ui
$(document).ready(function(){
    $('.lane_blockage').build_lane_blockage_ui(50);
});