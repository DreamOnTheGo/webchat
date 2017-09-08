Ext.define('Wechat.UI.Modify.ModifyPanel',{
	extend : 'Wechat.UI.Basic.BasicPanel',
	alias   :'widget.modifypanel',
	border : false,
	frame  : false,
	border : true,
	header : true,
	
	title  : '新增群组',
	region : 'east',
	collapsible : true,
	collapsed   : true,
	autoScroll  : true,
	width :1250,
	layout : {
		type  : 'vbox',
//		pack  : 'center',
		align : 'stretch', /*'stretchmax'*/
		padding : 10
	},
	
	items:[
		{
			xtype         : 'textfield',
			name          : 'oldGroupName',
			itemId        : 'oldGroupName',
			fieldLabel	  : '组名',
			hidden        : false,
			width		  : 200,
		},
		{
			xtype         : 'textfield',
			name          : 'corpID',
			itemId        : 'corpID',
			fieldLabel	  : '企业号',
			hidden        : false,
			readOnly      : true,
			width		  : 200,
			//value         : Corp.CorpInfo.corpname,
		},
		{
			xtype:'combobox',
			fieldLabel	  : '群组类型',
			name          : 'groupType',
			itemId        : 'groupType',
			mode : 'local',  
			store : new Ext.data.ArrayStore({  
				fields : ['value', 'text'],  
				data : [["公告组", '公告组'], ["普通组", '普通组']]  
			}),  
			valueField : 'value',  
			displayField : 'text',  
			emptyText : '请选择',	
		},
		{
			xtype  : 'container',
			layout : {
				type    : 'hbox',
				align   : 'stretch'
			},
			items  : [
				{
					xtype  : 'grid',
					title  : '全部员工',
					itemId : 'draggrid',
					flex   : 1,
					store  : null,
					qtip   : '拖曳数据完成选择和排序',
					height : 300,
					columnLines : true,
					autoScoll   : true,
					viewConfig  : {
						copy    : true,
						plugins : {
							ptype     : 'gridviewdragdrop',
							dropGroup : 'leftDDGroup',
							dragText  : '拖曳数据完成选择和排序'
						}
					},
					columns : [
						{
							header    : '工号',
							width     : '40%',
							dataIndex : 'employee_id',
						},
						{
							header    : '名字',
							width     : '20%',
							dataIndex : 'chinese_name'
						},
						{
							header    : '角色',
							width     : '20%',
							dataIndex : 'role_key',
							renderer:function(value, cellMeta, record, rowIndex, columnIndex, store) 
							{
								var type= record.data['role_key'];  
								var result='';
								switch(type)
								{
									/*
									["团队管理人员", 'ROLE_CRM_ADMIN'], 
									["坐席", 'ROLE_CRM_AGENT'],
									["团队项目总管", 'ROLE_CRM_PROJECT_MONITOR'],
									["团队质检班长", 'ROLE_CRM_CHECKER_MONITOR'],
									["团队项目专员", 'ROLE_CRM_PROJECT'],
									["团队质检员", 'ROLE_CRM_CHECKER'],
									["系统管理员", 'ROLE_ZS_SYS'],
									["总部质检员", 'ROLE_ZS_CHECKER'],
									["项目专员", 'ROLE_ZS_PROJECT'],
									["配置人员", 'ROLE_ZS_CONF'],
									["总部质检班长", 'ROLE_ZS_CHECKER_MONITOR'],
									["员工管理员", 'ROLE_ZS_ADMIN'],
									*/
									case 'ROLE_CRM_ADMIN' :
										result='团队管理人员';
										break;
									case 'ROLE_CRM_AGENT' :
										result='坐席';
										break;
									case 'ROLE_CRM_PROJECT_MONITOR' :
										result='团队项目总管';
										break;
									case 'ROLE_CRM_CHECKER_MONITOR' :
										result='团队质检班长';
										break;
									case 'ROLE_CRM_PROJECT' :
										result='团队项目专员';
										break;
									case 'ROLE_CRM_CHECKER' :
										result='团队质检员';
										break;
									case 'ROLE_ZS_SYS' :
										result='系统管理员';
										break;
									case 'ROLE_ZS_CHECKER' :
										result='总部质检员';
										break;
									case 'ROLE_ZS_PROJECT' :
										result='项目专员';
										break;
									case 'ROLE_ZS_CONF' :
										result='配置人员';
										break;
									case 'ROLE_ZS_CHECKER_MONITOR' :
										result='总部质检班长';
										break;
									case 'ROLE_ZS_ADMIN' :
										result='员工管理员';
										break;
								}	
								return result;
							} 
						},
						{
							header    : '班组',
							width     : '20%',
							dataIndex : 'team',
						},	
						],
					dockedItems: [{
						xtype: 'toolbar',
						dock: 'top',
						items: [{
							xtype      : 'textfield',
							fieldLabel : '工号',
							itemId        : 'search_empid',
							labelWidth :30,
						},
						{
							xtype      : 'combo',
							fieldLabel : '角色',
							itemId        : 'search_rolekey',
							mode : 'local',  
							store : new Ext.data.ArrayStore({  
								fields : ['rolekey_dislay', 'rolekey_value'],  
								data : [
									["团队管理人员", 'ROLE_CRM_ADMIN'], 
									["坐席", 'ROLE_CRM_AGENT'],
									["团队项目总管", 'ROLE_CRM_PROJECT_MONITOR'],
									["团队质检班长", 'ROLE_CRM_CHECKER_MONITOR'],
									["团队项目专员", 'ROLE_CRM_PROJECT'],
									["团队质检员", 'ROLE_CRM_CHECKER'],
									["系统管理员", 'ROLE_ZS_SYS'],
									["总部质检员", 'ROLE_ZS_CHECKER'],
									["项目专员", 'ROLE_ZS_PROJECT'],
									["配置人员", 'ROLE_ZS_CONF'],
									["总部质检班长", 'ROLE_ZS_CHECKER_MONITOR'],
									["员工管理员", 'ROLE_ZS_ADMIN'],
								]  
							}),  
							valueField : 'rolekey_value',  
							displayField : 'rolekey_dislay',  
							emptyText : '请选择',	
							labelWidth :30,
						},
						/*{
							xtype      : 'combo',
							fieldLabel : '班组',
							itemId     : 'search_teampname',
							labelWidth :30,
							//model: 'local',
							valueField : 'teamvalue',  
							displayField : 'teamdisplay',  
							emptyText : '请选择',
								listeners:{change: function(){console.info(arguments);}}
							
						},*/
						{
							xtype      : 'textfield',
							fieldLabel : '班组',
							itemId        : 'search_teampname',
							labelWidth :30,
						},
						{
							xtype      : 'button',
							text       : '查询'	,
							itemId : 'search',
						}
						]
					}]
				},
				{
						xtype  : 'grid',
						itemId : 'MembersGrid',
						title  : '选定成员',
						itemId : 'membersgrid',
						store  : null,
						flex   : 1,
						qtip   : '拖曳数据完成选择和排序',
						height : 300,
						margin : '0 0 0 30',
						columnLines : true,
						autoScoll   : true,
						viewConfig  : {
							plugins : 
							{
								ptype     : 'gridviewdragdrop',
								dragText  : '拖曳数据完成选择和排序'
							}
						},
						 plugins: [
							Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit: 1
							})
						],
						
						columns : [
							{
								header    : '工号',
								dataIndex : 'employee_id',
								width     : '30%',
							},
							{
								header    : '名字',
								width     : '20%',
								dataIndex : 'chinese_name'
							},
							{
								header    : '管理员',
								width     : '20%',
								dataIndex : 'chairMen',
								editor :{
									xtype:'combobox',
									mode : 'local',  
									store : new Ext.data.ArrayStore({  
												fields : ['value', 'text'],  
												data : [["是", '是'], ["否", '否']]  
											}),  
									valueField : 'value',  
									displayField : 'text',  
									emptyText : '请选择',
								}
							},
							{
								header    : '班组',
								width     : '20%',
								dataIndex : 'team',
							},	
							{
								header : '删除',
								width  : '10%',
								align  : 'center',
								xtype  : 'actioncolumn',
								itemId : 'delete',
								items  : [{
									iconCls : 'delete_node',
									tooltip : '删除',
									text    : '删除',  
								}]
							},
						]
				}
			]
		},

	],
	buttons : [
	{
		xtype   : 'button',
		text    : '提交',
		itemId  :  'submit',
	},
	{
		xtype   : 'button',
		text    : '取消',
		itemId  :  'cancel',
	}],
	constructor:function(config)
	{
		Ext.apply(this, config);
		
		this.callParent(arguments);
	}

})