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

	// 檢查陣列是否相等
	Array.prototype.array_include_only_total_length_is_2=function(another_array){
		for(var i=0;i<this.length;i++){
			var result= ( (this[i][0]==another_array[0]) && (this[i][1]==another_array[1]) );
			
			if(result){return result};
		};
		return false;
	};

	var target=$(this).css({
		position:'relative',
		cursor:'pointer',
		borderRadius:10
	}).empty();

	// 選擇結果
	target.current_selected_range=[];

	// 比例尺
	var km_length=km_length || parseInt($(this).css('width')); 

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

	var re_caculate_array=function(){
		// 重新計算飯為
		target.current_selected_range=[]; //清除
		var _select_ranges=target.find('span[id^=range_]');
		for(var i=0;i<_select_ranges.length;i++){
			target.current_selected_range.push( [ calculate_length(parseInt(_select_ranges[i].style.left)) , calculate_length(parseInt(_select_ranges[i].style.left)+parseInt(_select_ranges[i].style.width)) ] );
		}
	};

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
					re_caculate_array();
				});

				span.css({
					opacity: .6,
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
					$(this).css({backgroundColor:'green'});
				},function(e){
					$(this).css({backgroundColor:'lightblue'});
				});

				var this_position=[ calculate_length(parseInt( span.css('left') )) , calculate_length(parseInt( span.css('left') )+parseInt( span.css('width') )) ];

				// 檢查是不是重複的
				var check=target.current_selected_range.array_include_only_total_length_is_2(this_position);

				if(!check)
					span.appendTo(this);

				var infobox_item=$('<span></span>').css({paddingLeft:10}).attr({class:class_name});

				var begin=parseInt(span.css('left'));
				var end=parseInt(span.css('left'))+parseInt(span.css('width'));

				infobox_item.html(calculate_length(begin)+'~'+calculate_length(end)+' 公里');

				re_caculate_array();
			};

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

	main_ui.mouseleave(function(e){showInfo.hide();});

	var showInfo=$('<span>0km</span>').css({
		position:'absolute',
		fontWeight:'bold',
		color:'blue',
		top:50,
		display:'none'
	});

	// 公里顯示
	showInfo.appendTo(main_ui);

	return target
};

// init ui
$(document).ready(function(){
	a=$('.lane_blockage').build_lane_blockage_ui(50);		// 設定比例尺 50 KM
});