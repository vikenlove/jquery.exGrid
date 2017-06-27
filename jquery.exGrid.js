/* =========================================================
 * jquery.exGrid.js 
 * Original Idea: (Copyright 2013 Viken)
 * Updated by 大猫 
 * version 1.0.0 beta
 * =========================================================
 * http://vikenlove.github.io/jquery-Lweight-validate
 * http://www.oschina.net/p/jquery-lweight-validate 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
if (typeof jQuery === 'undefined') {
  throw new Error('Tabledit requires jQuery library.');
}

(function($) {
    'use strict';

    $.fn.dataGrid = function(options) {
       $("body").append('<div id="line" style="width:100px;height:200px;border-left:1px solid #C10066; position:absolute;display:none" ></div>');

        var $table = this;

        var defaults = {
            url: "",
            params:{},
            columns:[],
            title:"ExGrid Table",
            selectPage:[10,20,30,50,100],
        	rowNum:10,
        	toolbar:[]
        };

        var globalOptions = $.extend(true, defaults, options);

        //表格编辑模型函数
        var EditeCell = {
        		//     
        		setClickEvent: function(){
        			$table.find(".data-grid-item").on("dblclick",function(){
        				//取消输入文本，还原cell原格式
        				var $itemInputObj = $table.find(".data-grid-item div").find("input,select");
        				//判断是否是SELECT如果是获取text值，赋给TD
        				$itemInputObj.parent().html($.trim($itemInputObj.prop("tagName")=="SELECT"?$itemInputObj.find("option:selected").text():$itemInputObj.val()));
        				//获取配置列编辑
        				var _item = $(this).find("div").attr("data-item"),_dataItemObj = globalOptions.editeCell[_item],_celValue = $(this).find("div").text();
        				if(_dataItemObj!=undefined){
        					var _inputValidate = _dataItemObj.validate;
        					$(this).find("div").html(EditeCell.getCellOptionType(_dataItemObj,_celValue));   
        					$(this).off("click");
        					$table.find(".data-cell-validate").focus();
        				
            					$(this).find("input").on('blur',function(){
            						
            						if(_dataItemObj.validate!=undefined || _dataItemObj.validate!=""){
                    					var _validateObj = _dataItemObj.validate;
                    				
                    					if(!validRules(_validateObj,$(this).val())){
                    						$(this).val(_validateObj.msg);
                    						$table.find(".data-cell-validate").focus();
                    						
                    					};                   					
                    				};
                    				//修改后改变单元格状态
                    				$(this).parent().parent().addClass("grid-cell-modify");
                    				
                    				var argsFiled = $(this).parent().attr("data-item");
                    				 EditeCell.setExpressions(argsFiled,$(this).parents("tr"));
                    				
                				});
            					//重新绑定单机选中事件
            					$(this).on("click",function(){

                    				Point.pointX=$(this).index();	//TD坐标
                    				Point.pointY=$(this).parent().index();	//TR坐标
                    		
                    				$table.find(".data-grid-item").removeClass("grid-cell-selectd");
                    				$(this).addClass("grid-cell-selectd");
                				});	
        				
        				};
    
        				
        				
        			}).on("click",function(){
        				
        				//取消输入文本，还原cell原格式
        				var $itemInputObj = $table.find(".data-grid-item div").find("input,select");
        				//判断是否是SELECT如果是获取text值，赋给TD
        				$itemInputObj.parent().html($.trim($itemInputObj.prop("tagName")=="SELECT"?$itemInputObj.find("option:selected").text():$itemInputObj.val()));
        				
        				Point.pointX=$(this).index();	//TD坐标
        				Point.pointY=$(this).parent().index();	//TR坐标
        		
        				$table.find(".data-grid-item").removeClass("grid-cell-selectd");
        				$(this).addClass("grid-cell-selectd");
        				
        			});
        		},//改变TD 为输入文本或下拉
        		getCellOptionType: function(dataItemObj,celValue){
        			var _type = dataItemObj.type;
        			if(_type=='text'){
        				return '<input class="data-cell-validate" style="width: 90%; padding: 2px;"  value="'+celValue+'" type="text">';
        			}else if(_type=='select'){
        				var _select = '<select class="data-cell-validate">',_option="";
        					 $.each(dataItemObj.optionData,function(opIndex,opValue){
        						 _option+='<option value="'+opValue.option+'">'+opValue.optionName+'</option>';
        					 });
        				
        				return _select+_option+"</select>";
        			};
        			

        			
        		},
        		getClipboard:function(event){
        		     	if (window.clipboardData) {     
        		            return (window.clipboardData.getData('Text'));     
        		        }     
        		        else if (window.netscape) {     
        		        	
        		        	return (event.clipboardData.getData('Text'));
        		        	
        		        }     
        		        return null;  
        		},//绑定黏贴函数
        		setOnpasteClick:function(){
        			
        			
        			$table.find(".data-grid-item div").each(function(i,v){
        		         this.onpaste = function(event){
        		        	var clipboardData = EditeCell.getClipboard(event);
        		        	//获取行数
        		        	 var dataLength = clipboardData.split("\n");
        		        	 for(var i =0;i<dataLength.length-1;i++){
        		        		 //拆分单元格
        		        		var  trStr = dataLength[i].split(/\t/);
        		        		
        		        		$table.find("#data-gird-tr tr:eq("+(Point.pointY+i)+") td:lt("+(trStr.length+Point.pointX)+"):gt("+(Point.pointX-1)+")").each(function(index,value){
        		        			$(this).find("div").text(trStr[index]);
        		        			$(this).addClass("grid-cell-modify");
        		        		});
        		        		
        		        		
        		        	 };
         		        	 
        		         };
        			});
        		},
        		editeChoose:function(){
        			//判断是否需要开启 单元格编辑模式
        			if(globalOptions.editeCell!=undefined){
                		 EditeCell.setClickEvent();
                	     EditeCell.setOnpasteClick();
                	};
        		},
        		setExpressions:function(_field,_currentTr){
        			
        			//判断当前单元格是否包含计算公式
    				var _expressions = globalOptions.expressions;
    			
    				for(var k=0;k<_expressions.length;k++){
    					//判断当前单元格是否 为计算公式
    					var _express = _expressions[k].split("="),$currentTr = _currentTr;
    					//处理当前单元格 是公式 例：C=A+B 当鼠标在A单元格是去焦点
    					
    					 if(_express[1].indexOf(_field)>-1){
    						 var str = _express[1];
    						
    						 var _temp = str.match(/@\w*/g);

    						 for(var z=0;z<_temp.length;z++){
    						     var _field = str.match(/@\w*/)[0].substring(1),$tdField = $currentTr.find(".data-item-cl-"+_field);
    						     var $fieldInput = $tdField.find("input").val();
    						     var _value = $fieldInput==undefined?$tdField.text():$fieldInput;
    						     str = str.replace(/@\w*/,_value);
    						 };
    						 var _resulte = eval(str);
    						 $currentTr.find(".data-item-cl-"+_express[0]).text(_resulte);
    						 
    						 //处理单元格所在公式 结果与其他单元格联动  例：E=C+D 递归判断
    						 EditeCell.setExpressions(_express[0],$currentTr);
    					 };
    					
    					 
    				};
    				
        		}
        		
        };

        
        
        
        
        
        //坐标点
        var Point = {
        	_x:0,
        	_y:0,
        	get pointX(){
        		return this._x;
        	},
        	set pointX(val){
        		this._x = val;
        	},
         	get pointY(){
        		return this._y;
        	},
        	set pointY(val){
        		this._y = val;
        	}
        };
       
      
       
      // return this;
        var validRules = function(validateOptions,value){
        	var flag=true;
        	 if(validateOptions.type=="required"){
        		 if(value.length==0 || value==""){
        			 flag =  false;
        		 };
        	 }else{
        		
        		flag = new RegExp(validateOptions.regex).test(value);
        		console.log(flag);
        	 }
        	 return flag;
        };
        
        /**
         * table表格函数，通过自定义列明设置整个表格表头。
         *
         * @type {object}
         */
        var DrawTable = {
                setTableTitle: function(){
                    $table.append('<div id="data-grid-title" class="mDiv"><div class="ftitle">'+globalOptions.title+'</div></div>');
                },
                setTableDiv:function(){
                    //设置表格表头
                    $table.append('<div id="data-columns" class="hDiv"><div id="data-columns-cell" class="hDivBox"><div id="data-grid-header" class="data-grid-header"><div id="grid-header-inner" class="grid-header-inner"></div></div><div id="data-grid-body" class="data-grid-body"><div id="grid-body-inner" class="grid-body-inner"></div></div></div></div>');
                   
                    $table.find("#grid-header-inner").append('<table id="data-cell-header-table" cellspacing="0" cellpadding="0"><thead><tr id="data-cell-header"></tr></thead></table>');
                    //设置表头
                    $.each(globalOptions.columns, function(index, val) {
                    	var _title="";
                    	if($(this)[0].title=="checkbox"){
                    		_title ='<input type="checkbox" name="ckall" id="check-box-all">';
                    	}else{
                    		_title = $(this)[0].title;
                    	}
           	
                    	$table.find("#data-cell-header").append('<th class="grid-header-select datagrid-cell-cl-'+$(this)[0].field+'"  align="'+$(this)[0].textAlign+'"><div class="data-cell" style="text-align: '+$(this)[0].textAlign+';width: '+$(this)[0].width+'px;">'+_title+'</div></th>');
                    });
                  
                  


                },
                setPageSizeSelect: function(){
                	//设置分页外框样式
                	$table.find("#data-columns").after('<div class="pDiv"><div class="pDiv2" id="data-item-page">	</div><div style="clear:both"></div></div>');
                	//设置每页显示记录数
                	$table.find("#data-item-page").append('<div  id="page-size-select" class="pGroup"><select id="data-grid-select" id="data-page-size" name="pageSize"></select></div>');
                		$.each(globalOptions.selectPage,function(i,pageVal){
                			$table.find("#data-grid-select").append('<option value="'+pageVal+'">'+pageVal+'&nbsp;&nbsp;</option>');
                	});
                	
                		$table.find("#page-size-select").after('<div id="size-separator" class="btnseparator"></div>');
                		$table.find("#data-grid-select").on('change',function(){
                		DrawTable.setColumns(1,$(this).val());
                	});
                	
                },
                setPrev: function(){
                	$table.find("#size-separator").after('<div class="pGroup"><div id="page-prev-first" class="pFirst pButton"><span></span></div><div id="page-prev" class="pPrev pButton"><span></span></div></div><div id="size-input-separator" class="btnseparator"></div>');
                	$table.find("#page-prev-first").on('click',function(){
                		DrawTable.setColumns(1,$("#data-page-size").val());
                		$table.find("#data-page-no").val(1);
                	});
                	$table.find("#page-prev").on('click',function(){
                		var _currentPage = $.trim($table.find("#data-page-no").val()),pageNo=Number(_currentPage)==1?1:Number(_currentPage)-1;
                		$table.find("#data-page-no").val(pageNo);
                		DrawTable.setColumns(pageNo,$table.find("#data-page-size").val());
                	});
                
                },
                setPageInput:function(){
                	$table.find("#size-input-separator").after('<div class="pGroup"><span class="pcontrol">Page <input id="data-page-no" size="4" value="1" type="text"> of <span id="data-total-page"></span></span></div><div id="next-separator" class="btnseparator"></div>');
               
                },
                setNext: function(){
                	$table.find("#next-separator").after('<div class="pGroup"><div id="page-next"  class="pNext pButton"><span></span></div><div id="page-next-last" class="pLast pButton"><span></span></div></div>');
                	
                	$table.find("#page-next-last").on('click',function(){
                		var _totalPage = $table.find("#data-total-page").text();
                		DrawTable.setColumns(_totalPage,$table.find("#data-page-size").val());
                		$table.find("#data-page-no").val(_totalPage);
                	});
                	$table.find("#page-next").on('click',function(){
                		var _currentPage = $.trim($table.find("#data-page-no").val()),pageNo=Number(_currentPage)+1;
                		$table.find("#data-page-no").val(pageNo);
                		DrawTable.setColumns(pageNo,$table.find("#data-page-size").val());
                	});
                	
                },
            	//设置全选状态
                bindCheck: function(){
                	var _ckObj= $table.find("#data-gird-tr input[type='checkbox']"),_ckSize=_ckObj.size();
                	$table.on("click","input[type='checkbox']",function(){
                		if($(this).attr("name")=="ckall"){
                			if($(this).prop("checked")){
                				_ckObj.prop("checked",true);                				
                			}else{
                				_ckObj.prop("checked",false);  
                			};
                		}else{
                			if($table.find("#data-gird-tr input[type='checkbox']:checked").size()==_ckSize){
                				$table.find("#check-box-all").prop("checked",true);
                			}else{
                				$table.find("#check-box-all").prop("checked",false);
                			};                  			
                		};
                	});
                
                },
                isBindCheck:function(title){
                	if(title=="checkbox"){
                 		DrawTable.bindCheck();
                	};
                	
                },
                setColumns: function(pageNo,pageSize) {
                	$table.find("#data-gird-tr").remove();
                   //设置列表格外部标签
                	$table.find("#grid-body-inner").append('<table cellspacing="0" cellpadding="0" class="table-style" id="data-gird-tr"></table>');
                       //设置列数据

                    globalOptions.params.pageNo=pageNo==undefined?1:pageNo;
                    globalOptions.params.pageSize=pageSize==undefined?1:pageSize;
                   
                    $.ajax({
                        url: globalOptions.url,
                        type: globalOptions.type,
                        dataType: 'json',
                        data: globalOptions.params,
                        async: false,
                        success: function(data){
                        	var _columnsArray = globalOptions.columns;
                        	$.each(data.dataList, function(i, v) {
                        		$table.find("#data-gird-tr").append('<tr class="data-cell-columns"></tr>');
                        		var _ckType = "";
                                $.each(_columnsArray, function(index, val) {  
                                	var _cellVal = data.dataList[i][this.field],_class="",_widthTh = $table.find(".data-cell:eq("+index+")").width();
                                	if(this.title=="checkbox"){
                                		_ckType ='<input type="checkbox" name="checkbox" value="'+_cellVal+'">';
                                		_class =  '<td><div style="width: '+_widthTh+'px;"';
                                	}else if(index==_columnsArray.length-1 && globalOptions.fieldButton!=undefined){
                                		//获取表格列中按钮列
                                		var _btnHtml = globalOptions.fieldButton;
                                		_ckType = _btnHtml(data.dataList[i]);
                                		_class =  '<td><div  style="width: '+_widthTh+'px;text-align:'+this.textAlign+';"';
                                	}else{
                                		_ckType = _cellVal;
                                		_class =  '<td  class="data-grid-item" ><div  style="width: '+_widthTh+'px;" class="data-item-cl-'+this.field+'" data-item="'+this.field+'" ';
                                	}
                                	$table.find(".data-cell-columns:last").append(_class+' style="text-align:'+this.textAlign+';">'+_ckType+'</div></td>');
	                                
                                });
                                
                        	});
                        	$table.find("#data-total-page").text(data.totalPage);
                        	//判断是否需要绑定checkbox                  
                        	DrawTable.isBindCheck(_columnsArray[0].title);
                        	//判断是否编辑
                         	EditeCell.editeChoose();
                        	
                         }
                    }); 
              
                },//处理表格以表单形式
                setFormColumns:function(){
                	$table.find("#grid-body-inner").append('<table cellspacing="0" cellpadding="0" class="table-style" id="data-gird-tr"></table>');
                	 var _columnsArray = globalOptions.columns;
                	 for(var i=0;i<globalOptions.rowNum;i++){
                		 $table.find("#data-gird-tr").append('<tr class="data-cell-columns"></tr>');
                    		var _ckType = "";
                            $.each(_columnsArray, function(index, val) {  
                            	var _class="",_widthTh = $table.find(".data-cell:eq("+index+")").width();
                            	if(this.title=="checkbox"){
                            		_ckType ='<input type="checkbox" name="checkbox" value="'+index+'">';
                            		_class =  '<td><div style="width: '+_widthTh+'px;text-align:'+this.textAlign+';"';
                            	}else{
                            		_ckType = "";
                            		_class =  '<td  class="data-grid-item" ><div  style="width: '+_widthTh+'px;" data-item="'+this.field+'" ';
                            	}
                            	$table.find(".data-cell-columns:last").append(_class+' style="text-align:'+this.textAlign+';">'+_ckType+'</div></td>');
                                
                            });
                	 };
                	//判断是否需要绑定checkbox                  
                 	DrawTable.isBindCheck(_columnsArray[0].title);
                 	//判断是否编辑
                	EditeCell.editeChoose();
                }
        };
        
        //方法判断
        
        
        
        
        
        DrawTable.setTableTitle();
        DrawTable.setTableDiv();
      
     
        
        if(globalOptions.rowNum!=undefined && globalOptions.url==""){
        	   DrawTable.setFormColumns();
        }else{
        	   DrawTable.setColumns();
        	   DrawTable.setPageSizeSelect();
               DrawTable.setPrev();
               DrawTable.setPageInput();
               DrawTable.setNext();
        };
     
        //列宽拖动
      var DroppableCulmns = {
    		  setBindMouse : function(){
    			  var _line = false,currTh="";
	    			  $("body").on("mousemove", function(event) {
	    	                 if (_line == true) {
	    	                     $("#line").css({ "left": event.clientX }).show();
	    	                 };
	    	           });

	    			  $table.find("#data-cell-header th").on("mousemove", function(event) {
    			         var th = $(this);
    			         if (th.prevAll().length <= 1 || th.nextAll().length < 1) {
    			             return;
    			         }
    			         var left = th.offset().left;
    			         if (event.clientX - left < 4 || (th.width() - (event.clientX - left)) < 4) {
    			             th.css({ 'cursor': 'col-resize' });
    			         }
    			         else {
    			             th.css({ 'cursor': 'default' });
    			         }
    			     }).on("mousedown", function(event) {
    			         var th = $(this);
    			         if (th.prevAll().length <= 1 | th.nextAll().length < 1) {
    			             return;
    			         }
    			         var pos = th.offset();
    			         if (event.clientX - pos.left < 4 || (th.width() - (event.clientX - pos.left)) < 4) {
    			             var height = $table.find("#data-columns").outerHeight();
    			             var top = pos.top;
    			             $("#line").css({ "height": height, "top": top,"left":event .clientX,"display":"" });
    			             _line = true;
    			             if (event.clientX - pos.left < th.width() / 2) {
    			                 currTh = th.prev();
    			             }
    			             else {
    			                 currTh = th;
    			             }
    			         }
    			     });
    			     
    			     
    			     $("body").on("mouseup", function(event) {
    			         if (_line == true) {
    			             $("#line").hide();
    			             _line = false;
    			             var pos = currTh.offset(),index = currTh.index(),_width=event.clientX - pos.left;
    			             currTh.find("div").width(_width);
    			             var _divWidth=0;
    			             $table.find(".data-cell").each(function(){
    			                _divWidth+=$(this).width();
    			             });
    			             var _headerTh = $table.find("#data-cell-header th").size()+1;
    			             $table.find("#data-cell-header-table").width((_divWidth+_headerTh));
    			             $table.find("#data-gird-tr td:nth-child("+(index+1)+")").each(function(){
    			            	 $(this).find("div").width(_width);
    			             });
    			             
    			         };
    			     });
    			     
    			     $table.find("#grid-body-inner").scroll(function(){
    			    	 $table.find("#data-grid-header").scrollLeft($(this).scrollLeft());
    		         });

    		  }
      };
      DroppableCulmns.setBindMouse();
      var Toolbar ={
    		  //新增按钮
    		  setInitLayout:function(){
    			  $table.find("#data-grid-title").after('<div class="tDiv"><div id="grid-tool-bar" class="tDiv2"></div><div style="clear:both"></div></div>');
		
    		  },
    		  setBtnLayout:function(){
    			  $.each(globalOptions.toolbar,function(index,val){
    				  var _toolBarHtml = '<div class="fbutton"><div><span id="grid-toolbar-'+$(this)[0].type+'" class="'+$(this)[0].type+'" style="padding-left: 20px;">'+$(this)[0].text+'</span></div></div>';
    				  if($(this).separator){
    					  _toolBarHtml+='<div class="btnseparator"></div>';
    				  };
    				  $table.find("#grid-tool-bar").append(_toolBarHtml);
    			  });
    			  
    		  },
    		  setBtnEvent:function(){
    			  $.each(globalOptions.toolbar,function(index,val){
    				  	var _btnType = $(this)[0].type,_handler=$(this)[0].handler,$gridBody=$table.find("#data-gird-tr tr:last");
    				 //工具栏函数定义
    				  	$table.find("#grid-toolbar-"+_btnType).on('click',function(){
    					   if(_btnType=="add"){
    						   var _lastTr = $table.find("#data-gird-tr tr:last").clone(true);
    						   $gridBody.after(_lastTr);
    						   $table.find("#data-gird-tr tr:last td div:gt(0)").text(""); 
    						   //绑定checkbox 事件
    						   var _columnsArray = globalOptions.columns;
    						   	//判断是否需要绑定checkbox                  
    		                 	DrawTable.isBindCheck(_columnsArray[0].title);
    					   }else if(_btnType=="delete"){
    						   var _checkedFlag = false,_checkdata=$table.find("#data-columns input[type='checkbox']:checked");
    						   if(_checkdata.size()==0){
    							   _checkedFlag = true;
    						   }else{
    							   var _checkValue = new Array();
    							   _checkdata.each(function(){
    								   _checkValue.push($(this).val());
    								   $(this).parent().parent().parent().remove();
    							   });
    						   }   
    						   _handler(_checkValue,_checkedFlag);  
    					   }else if(_btnType=="save"){
    						   var _checkedFlag = false,_dataVal;
    						   if($table.find("#data-columns input[type='text']").size()>0){
    							   _checkedFlag = true;
    						   };
    						   _handler(_dataVal,_checkedFlag);  
    					   };
    					   
    				  });
    				  
    			  });
    		  }
      };
      
   
      
      if(globalOptions.toolbar.length!=0){
    	  Toolbar.setInitLayout();
    	  Toolbar.setBtnLayout();
    	  Toolbar.setBtnEvent();
      };
      //获取所选择行数据
      $table.getSelectRow=function(flag){
    	  var _datarow = $table.find("#data-gird-tr tr input[type='checkbox']:checked").parents('tr'),_rowData = new Array(),flag =flag==undefined?false:true;
    	 
    	  _datarow.each(function(){
    	      var dataTd = new Array();
    	    $(this).find('td').each(function(_index,_val){
    	      if(_index==0 && flag){
    	        dataTd.push($(this).find('input').val());
    	      }else if(_index>0){
    	        dataTd.push($(this).text().length==0?"":$(this).text());
    	      };
    	        
    	    });
    	    _rowData.push(dataTd);
    	  });
    	  return _rowData;
      };
      //获取所有行数据
      $table.getSelectData=function(flag){
    	  var _datarow = $table.find("#data-gird-tr tr"),_rowData = new Array(),flag =flag==undefined?false:true;
     	 
    	  _datarow.each(function(){
    	      var dataTd = new Array();
    	    $(this).find('td').each(function(_index,_val){
    	      if(_index==0 && flag){
    	        dataTd.push($(this).find('input').val());
    	      }else if(_index>0){
    	        dataTd.push($(this).text().length==0?"":$(this).text());
    	      };
    	        
    	    });
    	    _rowData.push(dataTd);
    	  });
    	  return _rowData;
      };
      //刷新表格内数据
      $table.reloadExGridData = function(){
    	  DrawTable.setColumns(1,$table.find("#data-page-size").val());
      };
      //获取编辑后的数据
      $table.getEditeData = function(flag){
    	  var _rowData = new Array();
    	  $table.find(".grid-cell-modify").parents("tr").each(function(){
    		    var dataTd = new Array();
    		    $(this).find('td').each(function(){
    		    	 if(_index==0 && flag){
    		    	        dataTd.push($(this).find('input').val());
    		    	    }else if(_index>0){
    		    	    	dataTd.push($(this).text().length==0?"":$(this).text());
    		    	  };
    		    });
    		    _rowData.push(dataTd);
    	  });
    	  return _rowData;
      };
      
    return $table;  
    };
    
 
    
    
}(jQuery));
