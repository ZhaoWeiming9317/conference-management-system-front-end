import React from 'react'
import './RoomTable.sass'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider, Row, Col, Descriptions, Input,Button, Card } from 'antd';
import { roomSearchPage, roomDelete,roomSearch, roomDetail} from '../../api/apiRoom'
import RoomAdd from '../../components/RoomAdd/RoomAdd'
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
          title: '会议室ID',
          dataIndex: 'roomId',
          width: '100px',
          ellipsis: true
        },
        {
          title: '会议室名称',
          dataIndex: 'roomName',
          width: '130px',
          ellipsis: true
        },
        {
          title: '会议室编号',
          dataIndex: 'roomNumber',
          width: '130px',
          ellipsis: true
        },
        {
          title: '会议室容量',
          dataIndex: 'roomVolume',
          width: '130px',
          ellipsis: true
        },
        {
          title: '城市',
          dataIndex: 'city',
          width: '120px',
          ellipsis: true
        },
        {
          title: '大厦',
          dataIndex: 'building',
          width: '130px',
          ellipsis: true
        },
        {
          title: '楼层',
          dataIndex: 'floor',
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
        input:''
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
        room_name: this.input,
        ...params
      }
      roomSearch(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res.list
        pagination.total = res.total;
        pagination.current = params.page
        this.setState({
          dataSource : execListWithKey(execListWithNull(list,'-'),'roomId'),
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
      const roomId = dataSource.find(item => item.key === key).roomId
      roomDelete({ room_id : roomId}).then((res)=>{
        console.log(res)
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
      const roomId = dataSource.find(item => item.key === key).roomId
      roomDetail({room_id : roomId}).then((res)=>{ 
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
      const roomId = dataSource.find(item => item.key === key).roomId
      roomDetail({room_id : roomId}).then((res)=>{ 
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
                    placeholder="请输入模糊查找的会议室名称"
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
              title="添加会议室"
              onOk={this.handleOk}
              onCancel={this.handleCancelAdd}
              footer={null}
              destroyOnClose
            >
              <RoomAdd type="add"></RoomAdd>
            </Modal>
            <Modal
              visible={modalModifyVisible}
              title="修改会议室"
              onOk={this.handleOk}
              onCancel={this.handleCancelModify}
              footer={null}
              destroyOnClose
            >
              <RoomAdd type="modify" data={nowRowData}></RoomAdd>
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
              <Descriptions title="会议室信息" bordered >
                <Descriptions.Item label="会议室名称">{nowRowData.roomName}</Descriptions.Item>
                <Descriptions.Item label="会议室编号">{nowRowData.roomNumber}</Descriptions.Item>
                <Descriptions.Item label="会议室ID">{nowRowData.roomId}</Descriptions.Item>
                <Descriptions.Item label="会议室容量">{nowRowData.roomVolume}</Descriptions.Item>
                <Descriptions.Item label="国家" >{nowRowData.country}</Descriptions.Item>
                <Descriptions.Item label="省份/自治区"> {nowRowData.province}</Descriptions.Item>
                <Descriptions.Item label="城市"> {nowRowData.city}</Descriptions.Item>
                <Descriptions.Item label="街区">{nowRowData.block}</Descriptions.Item>
                <Descriptions.Item label="大厦">{nowRowData.building}</Descriptions.Item>
                <Descriptions.Item label="楼层">{nowRowData.floor}</Descriptions.Item>
                <Descriptions.Item label="备注" span={3}>{nowRowData.mark}</Descriptions.Item>
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

export default connect(mapStateToProps)(RoomTable);
