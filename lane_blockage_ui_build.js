/**
 * Created with JetBrains WebStorm.
 * User: scott
 * Date: 2013/7/10
 * Time: 下午 5:06
 * To change this template use File | Settings | File Templates.
 */
//  laneblockage ui design

// 多路段選取UI,需要輸入比例尺, function( 比例尺長度、依照比例尺計算後預設排除的路段 )
$.prototype.build_lane_blockage_ui=function(km_length,user_block){
	// 初始化標的
	var target=$(this).css({
		position:'relative',
		cursor:'pointer',
		borderRadius:10
	}).empty();

	// 使用者自訂遮蔽陣列
	var user_block=user_block || [];

	// 檢查陣列是否相等
	Array.prototype.array_include_only_total_length_is_2=function(another_array){
		for(var i=0;i<this.length;i++){
			var result= ( (this[i][0]==another_array[0]) && (this[i][1]==another_array[1]) );
			
			if(result){return result};
		};
		return false;
	};

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

	// 重新計算飯為
	var re_caculate_array=function(){
		target.current_selected_range=[]; //清除
		var _select_ranges=target.find('span[id^=range_]');
		for(var i=0;i<_select_ranges.length;i++){
			target.current_selected_range.push( [ calculate_length(parseInt(_select_ranges[i].style.left)) , calculate_length(parseInt(_select_ranges[i].style.left)+parseInt(_select_ranges[i].style.width)) ] );
		}
	};

	// 計算覆蓋程度
	var calculate_recover=function(new_array){
		var result=false;
		var r=target.current_selected_range;
		for(var i=0;i<r.length;i++){
			
			// 某一點介於
			if( (r[i][0]<=new_array[0]) && (new_array[0]<=r[i][1]) || (r[i][0]<=new_array[1]) && (new_array[1]<=r[i][1]) ){
				return true;
			};

			// 兩點橫跨
			if( (new_array[0]<=r[i][0]) && new_array[1]>=r[i][1] ){
				return true;
			};
		}

		return result;
	};

	// 計算覆蓋程度(使用者定義)
	var calculate_recover_by_user=function(new_array){

		var result=false;

		var r=user_block;
		for(var i=0;i<r.length;i++){

			// 某一點介於
			if( (r[i][0]<=new_array[0]) && (new_array[0]<=r[i][1]) || (r[i][0]<=new_array[1]) && (new_array[1]<=r[i][1]) ){
				return true;
			};

			// 兩點橫跨
			if( (new_array[0]<=r[i][0]) && new_array[1]>=r[i][1] ){
				return true;
			};
		}

		return result;
	}

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
					backgroundColor:'lightblue',
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

				// 檢查這次拖曳的數據可否使用：
				//
				// 檢查是不是重複的
				var check_1=target.current_selected_range.array_include_only_total_length_is_2(this_position);
				// 檢查覆蓋
				var check_2=calculate_recover(this_position);
				// 檢查使用者定義覆蓋
				var check_3=calculate_recover_by_user(this_position);

				// 全數通過才可以畫圖
				if( (!check_1) && (!check_2) && (!check_3) ){ 
					var begin=parseInt(span.css('left'));
					var end=parseInt(span.css('left'))+parseInt(span.css('width'));
					span.attr({
						title:calculate_length(begin)+'~'+calculate_length(end)+' 公里',
						begin_at:calculate_length(begin),
						end_at:calculate_length(end),
						begin_time_at:'',
						end_time_at:'',
						duration_time:0
					});
					span.appendTo(this);
				};

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
		color:'red',
		top:50,
		display:'none'
	});

	// 公里顯示
	showInfo.appendTo(main_ui);

	return target
};

// init ui
$(document).ready(function(){
	a=$('.lane_blockage').build_lane_blockage_ui( 50 , [ [10,15] , [30,35] ] );		// 設定比例尺 50 KM
});