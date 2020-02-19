import React from 'react'
import './UserTable.sass'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider, Row, Col, Descriptions, Input,Button, Card } from 'antd';
import { userAdminSearchCertain, userAdminSearch, userAdminDelete } from '../../api/apiUser'
import InputUI from '../../UI/InputUI/InputUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import Regist from '../../components/Regist/Regist'
import {execListWithNull, execListWithKey} from '../../util/util'
class UserTable extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this)
      this.handleAdd = this.handleAdd.bind(this)
      this.volume = 10
      this.input = ''
      this.columns = [
        {
          title: '用户ID',
          dataIndex: 'userId',
          width: '100px',
          ellipsis: true
        },
        {
          title: '用户名',
          dataIndex: 'username',
          width: '130px',
          ellipsis: true
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '130px',
          ellipsis: true
        },
        {
          title: '性别',
          dataIndex: 'gender',
          width: '80px',
          ellipsis: true
        },
        {
          title: '权限',
          dataIndex: 'role',
          width: '130px',
          ellipsis: true
        },
        {
          title: '电话',
          dataIndex: 'phone',
          width: '150px',
          ellipsis: true
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: '200px',
          ellipsis: true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          ellipsis: true,
          render: (text, record) => 
          this.state.dataSource.length >= 1 ? (
            <span>
              <a onClick={() => this.handleModify(record.key)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除吗?" 
                okText="确定" 
                cancelText="取消"
                onConfirm={() => this.handleDelete(record.key)}>
                  <a>删除</a>
              </Popconfirm>              
              <Divider type="vertical" />
              <a onClick={() => this.handleDetail(record.key)}>详细</a>
            </span>
          ):(
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
            </span>
          )
        }
      ];
      this.state = {
        dataSource: [],
        count: 2,
        page: 1,
        tableLoading: false,
        modalLoading: false,
        modalAddVisible: false,
        modalModifyVisible: false,
        modalDetailVisible: false,
        selectedRowKeys: [],
        pagination: {},
        nowRowData:[]
      };
    }
  
    componentDidMount() {
      this.setState({tableLoading: true})
      this.tableFind({page: 1})
    }
    // 刷新table
    tableFind(params = {}) {
      this.setState({
        tableLoading: true,
        page: params.page
      });
      let data = {
        volume: this.volume,
        username: this.input,
        ...params
      }
      userAdminSearch(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res.list
        pagination.total = res.total;
        pagination.current = params.page
        let covertListWithRole = list.map((item)=>{
          if (item.role === 0) {
            item.role = '部门经理'
          } else if (item.role === 1){
            item.role = '系统管理员'
          } else {
            item.role = '普通员工'
          }
          return item
        })
        this.setState({
          dataSource : execListWithKey(execListWithNull(covertListWithRole,'-'),'userId'),
          tableLoading: false,
          pagination
        })
      })
    }
    
    //---------上部搜索框查询-----------------------
    handleSearch = res => {
      this.input = res
    }
    
    searchByName = () => {
      this.tableFind({page: 1})    
    };

    //------------添加 更改 用户----------------------
    handleDelete = key => {
      const dataSource = [...this.state.dataSource];
      const username = dataSource.find(item => item.key === key).username
      userAdminDelete({username}).then((res)=>{
        console.log(res)
        if(res.state == 1){
          this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
          this.tableFind({page: this.state.page})
        }
      })
    };
  
    handleAdd = () => {
      this.setState({
        modalAddVisible: true,
      });  
    };

    handleModify = key => {
      const dataSource = [...this.state.dataSource];
      const userId = dataSource.find(item => item.key === key).userId
      userAdminSearchCertain({user_id:userId}).then((res)=>{ 
        this.setState({
          nowRowData:res
        },()=>{
          this.setState({
            modalModifyVisible: true,
          })
        })
      })
    };

    handleDetail = key => {
      const dataSource = [...this.state.dataSource];
      const userId = dataSource.find(item => item.key === key).userId
      userAdminSearchCertain({user_id:userId}).then((res)=>{ 
        console.log(res)
        this.setState({
          nowRowData:res
        },()=>{
          this.setState({
            modalDetailVisible: true,
          })
        })
      })
    }

    handleCancelAdd = () => {
      this.setState({ modalAddVisible: false, modalModifyVisible: false,modalDetailVisible: false });
      this.tableFind({page: 1})  
    };

    handleCancelModify = () => {
      this.setState({ modalAddVisible: false, modalModifyVisible: false,modalDetailVisible: false });
      this.tableFind({page: this.state.page})  
    };

    handleCancelDetail = () => {
      this.setState({ modalAddVisible: false, modalModifyVisible: false,modalDetailVisible: false });
    };

    onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    };
    //-----------------------------------------

    handleTableChange = (pagination, filters, sorter) => {
      const pager = { ...this.state.pagination };
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
        tableLoading: true
      });
      let data = {
        page: pager.current
      }
      this.tableFind(data)    
    };  
    render() {
      const { dataSource,  selectedRowKeys, tableLoading, pagination, modalAddVisible,modalModifyVisible,  modalDetailVisible, nowRowData} = this.state;
      const columns = this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };  
      return (
        <div>
         <div style={{padding: 12 + 'px'}}>
            <Row type="flex" justify="start">
                <Col span={12}>
                  <Input.Search
                    placeholder="请输入模糊查找的用户名称"
                    enterButton="搜索"
                    onSearch={(value) => {
                      this.handleSearch(value)
                      this.searchByName()
                    } }
                  />
                </Col>
                <Col span={3} offset={1}>
                  <div>
                    <Button type="primary" onClick={this.handleAdd}>添加</Button>
                  </div>
                </Col>
            </Row>
          </div>
          <div style={{padding: 12 + 'px'}}>
            <Card bordered={true}>
              <Table
              tableLayout='auto'
              rowClassName={() => 'editable-row'}
              dataSource={dataSource}
              columns={columns}
              loading={tableLoading}
              onChange={this.handleTableChange}
              pagination={this.state.pagination}
              scroll={{ x: 1100 }}
            />
            <Modal
              visible={modalAddVisible}
              title="添加用户"
              onOk={this.handleOk}
              onCancel={this.handleCancelAdd}
              footer={null}
              destroyOnClose
            >
              <Regist type="add"></Regist>
            </Modal>
            <Modal
              visible={modalModifyVisible}
              title="修改用户"
              onOk={this.handleOk}
              onCancel={this.handleCancelModify}
              footer={null}
              destroyOnClose
            >
              <Regist type="modify" data={nowRowData}></Regist>
            </Modal>
            <Modal
              visible={modalDetailVisible}
              title="详细信息"
              onOk={this.handleOk}
              onCancel={this.handleCancelDetail}
              footer={null}
              width={850}
              destroyOnClose
            >
              <Descriptions title="用户信息" bordered >
                <Descriptions.Item label="用户ID">{nowRowData.userId}</Descriptions.Item>
                <Descriptions.Item label="用户名">{nowRowData.username}</Descriptions.Item>
                <Descriptions.Item label="密码">{nowRowData.password}</Descriptions.Item>
                <Descriptions.Item label="性别">{nowRowData.gender}</Descriptions.Item>
                <Descriptions.Item label="权限" >{nowRowData.role}</Descriptions.Item>
                <Descriptions.Item label="部门"> {nowRowData.department}</Descriptions.Item>
                <Descriptions.Item label="组织"> {nowRowData.organization}</Descriptions.Item>
                <Descriptions.Item label="职位"> {nowRowData.position}</Descriptions.Item>
                <Descriptions.Item label="电话" span={2}>{nowRowData.phone}</Descriptions.Item>
                <Descriptions.Item label="邮箱" span={2}>{nowRowData.email}</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={3}>{nowRowData.createTime}</Descriptions.Item>
                <Descriptions.Item label="修改时间" span={3}>{nowRowData.modifyTime}</Descriptions.Item>
              </Descriptions>
            </Modal>
            </Card>
          </div>
        </div>
      );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps)(UserTable);
