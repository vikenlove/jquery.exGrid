<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<script type="text/javascript" src="js/jquery.1.12.4.js"></script>
<script type="text/javascript" src="js/jquery.exGrid.js"></script>
<link rel="stylesheet" type="text/css" href="css/flexrgird.pack.css"/>
<link rel="stylesheet" type="text/css" href="css/style.css"/>


<script type="text/javascript">

	$(function(){
		var t= $("#tableGrid").dataGrid({
			url: "JsonServlet",
			type:"POST",
			params:{},
            columns:[
				{field:"id",title:"checkbox",textAlign:"center",width:"30"},
		        {field:"nature",title:"nature",textAlign:"center",width:"80"},
            	{field:"cpuName",title:"CPU",textAlign:"left",width:"180"},
            	{field:"display",title:"显示器",textAlign:"left",width:"120"},
            	{field:"keyName",title:"键盘",textAlign:"left",width:"130"},
            	{field:"mouseName",title:"鼠标",textAlign:"right",width:"80"}, 
            	{field:"id",title:"操作",textAlign:"center",width:"80",type:"btn"} 
		   	 	],
		   	 fieldButton:function(data){
		      var btnHtml = '<a onclick="editRow(\''+data.id+'\',\''+data.nature+'\')" href="javascript:void(0)">编辑</a>'; 
		   	  return btnHtml;
		   	},
		   	expressions:["mouseName=@keyName+@nature","display=(@mouseName+1)*100/2.5","cpuName=(@display/100)*2"],
		   	rowNum:5,
			title:"表格",//正则需要转义
            editeCell:{
		                nature:{type:"text",validate:{type:"required",msg:"当前值不能为空."}},
		                keyName:{type:"text",validate:{type:"required",msg:"当前值不能为空."}},
		              //  cpuName:{type:"select",optionData:[{option:"1",optionName:"AMD"},{option:"2",optionName:"Intel"},{option:"3",optionName:"骁龙"}]},
		               cpuName:{type:"text",validate:{type:"required",msg:"当前值不能为空."}},
		               // display:{type:"text",validate:{type:"regex",regex:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",msg:"输入YYYY-MM-DD"}}
		               display:{type:"text",validate:{type:"required",msg:"当前值不能为空."}},
           			 },
           	toolbar:[{
           			text:'增加',
           			type:'add',
           			separator:true,
           			handler:function(){
           				alert("add row 回调");
           				}
           			},{          			
               			text:'删除',
               			type:'delete',
               			separator:true,
               			handler:function(data,flag){
               				if(flag){
               					alert("请选择一行或者多行要删除的数据");
               				}else{
               					alert("delete 回调"+data.join(","));
               				}
               				
               			}
           			},{
              			text:'保存',
               			type:'save',
               			separator:true,
               			handler:function(data,flag){
               				if(flag){
               					alert("当前数据处于文本输入状态.");
               				
               				}else{
               					console.log(t.getSelectRow());
               					console.log(t.getSelectData());
               					
               				};
               			}
           			}
           	]
                       
		});
		

		
		
	});

	var editRow = function(id,name){
		alert(id+"-----"+name);
	}

	</script>



</head>
<body>


<div id="tableGrid" class="flexigrid" >
		
	
		</div>
		
		
	
</body>
</html>