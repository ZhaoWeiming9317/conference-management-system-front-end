import React from 'react'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider, Row, Col, Descriptions, Input,Button, Card } from 'antd';
import { formDelete,formSearch, formDetail} from '../../api/apiForm'
import FormAdd from '../../components/FormAdd/FormAdd'
import {execListWithNull, execListWithKey} from '../../util/util'
class formTable extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this)
      this.handleAdd = this.handleAdd.bind(this)
      this.volume = 10
      this.input = ''
      this.columns = [
        {
          title: '表单ID',
          dataIndex: 'formId',
          width: '100px',
          ellipsis: true
        },
        {
          title: '表单名称',
          dataIndex: 'formName',
          width: '130px',
          ellipsis: true
        },
        {
          title: '检修措施',
          dataIndex: 'measure',
          width: '130px',
          ellipsis: true
        },
        {
          title: '故障原因',
          dataIndex: 'reason',
          width: '100px',
          ellipsis: true
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: '100px',
          ellipsis: true
        },
        {
            title: '设备所在会议室名称',
            dataIndex: 'roomName',
            width: '100px',
            ellipsis: true
        },
        {
            title: '维修人员',
            dataIndex: 'repairMan',
            width: '100px',
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
        selectedRowKeys: [],
        pagination: {},
        nowRowData:[],
        roomData: []
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
        form_name: this.input,
        ...params
      }
      formSearch(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res.list
        pagination.total = res.total;
        pagination.current = params.page
        this.setState({
          dataSource : [...execListWithKey(execListWithNull(this.execListWithRoomAndDevice(list),'-'),'formId')],
          tableLoading: false,
          pagination
        })
      })
    }

    execListWithRoomAndDevice(list){
        let res = []
        for (let i in list) {
            let itemRes = {}
            let item = list[i]
            for (let element in item) {
                if (element === 'room') {
                    let roomList = item[element]
                    for (let j in roomList) {
                        itemRes[j] = roomList[j]
                    }
                } else if (element === 'device'){
                    let deviceList = item[element]
                    for (let j in deviceList) {
                        itemRes[j] = deviceList[j]
                    }
                } else {
                    itemRes[element] = item[element]
                }
            }
            res.push(itemRes)
        }
        return res
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
      const formId = dataSource.find(item => item.key === key).formId
      formDelete({ form_id : formId}).then((res)=>{
        if(res.state === 1){
          this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        }
      })
      this.tableFind({page: this.state.page})
    };
  
    handleAdd = () => {
      this.setState({
        modalAddVisible: true,
      });  
    };

    handleModify = key => {
      const dataSource = [...this.state.dataSource];
      const formId = dataSource.find(item => item.key === key).formId
      formDetail({form_id : formId}).then((res)=>{ 
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
      const formId = dataSource.find(item => item.key === key).formId
      formDetail({form_id : formId}).then((res)=>{ 
        res = {...res,
        roomName: res.room.roomName,
        roomId: res.room.roomId,
        deviceName: res.device.deviceName,
        deviceId: res.device.deviceId}
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
    }

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
                    placeholder="请输入模糊查找的表单名称"
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
              title="添加表单"
              onOk={this.handleOk}
              onCancel={this.handleCancelAdd}
              footer={null}
              destroyOnClose
            >
              <FormAdd type="add" data={this.state.nowRowData}></FormAdd>
            </Modal>
            <Modal
              visible={modalModifyVisible}
              title="修改表单"
              onOk={this.handleOk}
              onCancel={this.handleCancelModify}
              footer={null}
              destroyOnClose
            >
              <FormAdd type="modify" data={this.state.nowRowData}></FormAdd>
            </Modal>
            <Modal
              visible={modalDetailVisible}
              title="表单详细信息"
              onOk={this.handleOk}
              onCancel={this.handleCancelDetail}
              footer={null}
              destroyOnClose
              width= {850}
            >
                <Descriptions title="表单信息" bordered >
                  <Descriptions.Item label="表单名称">{nowRowData.formName}</Descriptions.Item>
                  <Descriptions.Item label="表单ID">{nowRowData.formId}</Descriptions.Item>
                  <Descriptions.Item label="会议室名称">{nowRowData.roomName}</Descriptions.Item>
                  <Descriptions.Item label="设备名称">{nowRowData.deviceName}</Descriptions.Item>
                  <Descriptions.Item label="故障原因" span={1}>{nowRowData.reason}</Descriptions.Item>
                  <Descriptions.Item label="检修措施" span={1}> {nowRowData.measure}</Descriptions.Item>
                  <Descriptions.Item label="维修人员姓名"> {nowRowData.repairMan}</Descriptions.Item>
                  <Descriptions.Item label="服务人员姓名">{nowRowData.serviceMan}</Descriptions.Item>
                  <Descriptions.Item label="审查人员姓名" span={1}>{nowRowData.verifyMan}</Descriptions.Item>
                  <Descriptions.Item label="维修时间" span={3}>{nowRowData.repairTime}</Descriptions.Item>
                  <Descriptions.Item label="服务时间" span={3}>{nowRowData.serviceTime}</Descriptions.Item>
                  <Descriptions.Item label="完成时间" span={3}>{nowRowData.finishTime}</Descriptions.Item>
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

export default connect(mapStateToProps)(formTable);
