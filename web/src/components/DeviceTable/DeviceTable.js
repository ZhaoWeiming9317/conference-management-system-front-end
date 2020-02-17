import React from 'react'
import './DeviceTable.sass'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider, List, Card } from 'antd';
import { deviceAdd, deviceDelete,deviceSearch, deviceDetail} from '../../api/apiDevice'
import InputUI from '../../UI/InputUI/InputUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import DeviceAdd from '../../components/DeviceAdd/DeviceAdd'
import {execListWithNull, execListWithKey} from '../../util/util'
class RoomTable extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this)
      this.handleAdd = this.handleAdd.bind(this)
      this.volume = 10
      this.input = ''
      this.columns = [
        {
          title: '设备ID',
          dataIndex: 'deviceId',
          width: '100px',
          ellipsis: true
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: '130px',
          ellipsis: true
        },
        {
          title: '商标',
          dataIndex: 'brand',
          width: '130px',
          ellipsis: true
        },
        {
          title: '类型',
          dataIndex: 'deviceType',
          width: '120px',
          ellipsis: true
        },
        {
          title: '设备平均维修时间',
          dataIndex: 'mttr',
          width: '120px',
          ellipsis: true
        },
        {
            title: '设备平均故障间隔时间',
            dataIndex: 'mtbf',
            width: '120px',
            ellipsis: true
        },
        {
            title: '设备所在会议室名称',
            dataIndex: 'roomName',
            width: '120px',
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
        device_name: this.input,
        ...params
      }
      deviceSearch(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res.list
        pagination.total = res.total;
        pagination.current = params.page
        this.setState({
          dataSource : [...execListWithKey(execListWithNull(this.execListWithRoom(list),'-'),'deviceId')],
          tableLoading: false,
          pagination
        })
      })
    }

    execListWithRoom(list){
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
      this.input = res.value
    }
    searchByUsername = () => {
      this.tableFind({page: 1})    
    };

    //------------添加 更改 用户----------------------
    handleDelete = key => {
      const dataSource = [...this.state.dataSource];
      const deviceId = dataSource.find(item => item.key === key).deviceId
      deviceDelete({ device_id : deviceId}).then((res)=>{
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
      const deviceId = dataSource.find(item => item.key === key).deviceId
      deviceDetail({device_id : deviceId}).then((res)=>{ 
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
      const deviceId = dataSource.find(item => item.key === key).deviceId
      deviceDetail({device_id:deviceId}).then((res)=>{ 
        let data = []
        for (let i in res) {
          if (res[i] === "null") {
            res[i] = '-'
          }
          if (i !== "room") {
            let item = {
                title:i,
                content:res[i]
            }
            data.unshift(item)
          } else {
            let roomList = res[i]
            for (let j in roomList) {
                if (roomList[j] === "null") {
                    roomList[j] = '-'
                }
                let item = {
                    title:j,
                    content:roomList[j]
                }
                data.unshift(item)
            }
          }
        }
        console.log(res)
        this.setState({
          nowRowData:data
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
          <div className="devicetable__wrapper--upper">
            <div className="devicetable__search__bar">
              <InputUI getValue={this.handleSearch} type='text' size='large'></InputUI>
            </div>
            <div className="devicetable__search__button" >
              <ButtonUI label="搜索" buttonStyle="fill" size="small" onClick={this.searchByUsername}></ButtonUI>
            </div>
            <div className="devicetable__search__button" >
              <ButtonUI label="添加" buttonStyle="hollow-fill" size="small" onClick={this.handleAdd}></ButtonUI>
            </div>
          </div>
          <Table
            tableLayout='auto'
            rowClassName={() => 'editable-row'}
            dataSource={dataSource}
            columns={columns}
            loading={tableLoading}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            scroll={{ x: 1200 }}
          />
          <Modal
            visible={modalAddVisible}
            title="添加设备"
            onOk={this.handleOk}
            onCancel={this.handleCancelAdd}
            footer={null}
            destroyOnClose
          >
          </Modal>
          <Modal
            visible={modalModifyVisible}
            title="修改设备"
            onOk={this.handleOk}
            onCancel={this.handleCancelModify}
            footer={null}
            destroyOnClose
          >
            <DeviceAdd></DeviceAdd>
          </Modal>
          <Modal
            visible={modalDetailVisible}
            title="设备详细信息"
            onOk={this.handleOk}
            onCancel={this.handleCancelDetail}
            footer={null}
            destroyOnClose
          >
            <List
              grid={{ gutter: 16, column: 2}}
              dataSource={nowRowData}
              renderItem={item => (
                <List.Item>
                  <Card title={item.title}>{item.content}</Card>
                </List.Item>
              )}
            />,
          </Modal>
        </div>
      );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps)(RoomTable);