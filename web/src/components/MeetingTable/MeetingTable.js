import React from 'react'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider, Row, Col, Descriptions, Input,Button, Card, message } from 'antd';
import { meetingSearch, meetingSearchCertain, meetingSearchAll, meetingDelete} from '../../api/apiMeeting'
import MeetingAdd from '../../components/MeetingAdd/MeetingAdd'
import {execListWithNull, execListWithKey} from '../../util/util'
class MeetingTable extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this)
      this.handleAdd = this.handleAdd.bind(this)
      this.volume = 10
      this.input = ''
      this.meetingDataInit = {
        meetingName : '',
        meetingId: '',
        room:{
          roomId: '',
          roomName: ''
        },
        startTime:'',
        endTime:'',
        host:{
          name: '',
          userId: '',
          username: ''
        },
        recorder:{
          name: '',
          userId: '',
          username: ''
        },
        members:[{userId: '',name: ''}],
        topic:'',
        meetingAbstract:'',
        remark: '',
      }
      this.columns = [
        {
          title: '会议ID',
          dataIndex: 'meetingId',
          width: '100px',
          ellipsis: true
        },
        {
          title: '会议名称',
          dataIndex: 'meetingName',
          width: '130px',
          ellipsis: true
        },
        {
          title: '会议室名称',
          dataIndex: 'roomName',
          width: '130px',
          ellipsis: true
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          width: '130px',
          ellipsis: true
        },
        // {
        //   title: '结束时间',
        //   dataIndex: 'endTime',
        //   width: '120px',
        //   ellipsis: true
        // },
        {
          title: '主持人',
          dataIndex: 'hostName',
          width: '130px',
          ellipsis: true
        },
        // {
        //   title: '类型',
        //   dataIndex: 'topic',
        //   width: '120px',
        //   ellipsis: true
        // },
        {
            title: '状态',
            dataIndex: 'meetingState',
            width: '120px',
            ellipsis: true,render: (text, record) => {
              let txt = '关闭'
              let color = '#ff4d4f'
              switch(text) {
                case 0:
                  txt = '已预约'
                  color = '#ff4d4f'
                  break
                case 1:
                  txt = '进行中'
                  color = '#ffa39e'
                  break
                case 2:
                  txt = '空闲'
                  color = '#faad14'
                  break
              }
              return (            
              <span style={{color:color}}>
                {txt}
              </span>
              )
            }
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
        nowRowData:[],
        nowMembers: ``,
        input:''
      };
    }
  
    componentDidMount() {
      this.setState({tableLoading: true})
      this.tableFind({page: 1})
    }
    // 刷新table
    tableFind(params = {}, del = false) {
      let nowPage = (del == true && this.state.dataSource.length <= 1 && params.page >= 2) ? params.page - 1 : params.page
      this.setState({
        tableLoading: true,
        page: nowPage
      });
      let data = {
        volume: this.volume,
        meeting_name: this.input,
        page: nowPage
      }
      meetingSearch(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res.list
        pagination.total = res.total;
        pagination.current = nowPage
        this.setState({
          dataSource : execListWithKey(execListWithNull(list,'-'),'meetingId'),
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
      const meetingId = dataSource.find(item => item.key === key).meetingId
      meetingDelete({ meeting_id : meetingId}).then((res)=>{
        console.log(res)
        if(res.state === 1){
          this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        } else {
          message.error(res.message)
        }
      })
      this.tableFind({page: this.state.page},true)
    };
  
    handleAdd = () => {
      this.setState({
        modalAddVisible: true,
      });  
    };

    handleModify = key => {
      const dataSource = [...this.state.dataSource];
      const meetingId = dataSource.find(item => item.key === key).meetingId
      meetingSearchCertain ({meeting_id : meetingId}).then((res)=>{ 
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
      const meetingId = dataSource.find(item => item.key === key).meetingId
      meetingSearchCertain({meeting_id : meetingId}).then((res)=>{ 
        console.log(res)
        let nowMembers = ''
        res.members.map((item)=>{
          console.log(item)
          nowMembers = `${nowMembers} ${item.name}`
        })
        this.setState({
          nowRowData:res,
          nowMembers:nowMembers
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
      const { dataSource,  selectedRowKeys, tableLoading, pagination, modalAddVisible,modalModifyVisible,  modalDetailVisible, nowRowData, nowMembers} = this.state;
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
                    placeholder="请输入模糊查找的会议名称"
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
              // scroll={{ x: 1100 }}
            />
            <Modal
              visible={modalAddVisible}
              title="添加会议"
              onCancel={this.handleCancelAdd}
              footer={null}
              destroyOnClose
            >
              <MeetingAdd type="add" userMeetingData={this.meetingDataInit} closeModal={this.handleCancelAdd}></MeetingAdd>
            </Modal>
            <Modal
              visible={modalModifyVisible}
              title="修改会议室"
              onCancel={this.handleCancelModify}
              footer={null}
              destroyOnClose
            >
              <MeetingAdd type="modify" userMeetingData={nowRowData} closeModal={this.handleCancelModify}></MeetingAdd>
            </Modal>
            <Modal
              visible={modalDetailVisible}
              title="详细信息"
              onCancel={this.handleCancelDetail}
              footer={null}
              width={999}
              destroyOnClose
            >
              <Descriptions title="会议信息" bordered >
                <Descriptions.Item label="会议名称">{nowRowData.meetingName}</Descriptions.Item>
                <Descriptions.Item label="会议ID">{nowRowData.meetingId}</Descriptions.Item>
                <Descriptions.Item label="会议室名称">{nowRowData.room && nowRowData.room.roomName}</Descriptions.Item>
                <Descriptions.Item label="会议室ID" >{nowRowData.room &&  nowRowData.room.roomId}</Descriptions.Item>
                <Descriptions.Item label="开始时间"> {nowRowData.startTime}</Descriptions.Item>
                <Descriptions.Item label="结束时间"> {nowRowData.endTime}</Descriptions.Item>
                <Descriptions.Item label="发起人名称">{nowRowData.host && nowRowData.host.name}</Descriptions.Item>
                <Descriptions.Item label="发起人用户名">{nowRowData.host && nowRowData.host.username}</Descriptions.Item>
                <Descriptions.Item label="发起人ID">{nowRowData.host && nowRowData.host.userId}</Descriptions.Item>
                <Descriptions.Item label="记录人名称">{nowRowData.recorder && nowRowData.recorder.name}</Descriptions.Item>
                <Descriptions.Item label="记录人用户名">{nowRowData.recorder && nowRowData.recorder.username}</Descriptions.Item>
                <Descriptions.Item label="记录人ID">{nowRowData.recorder && nowRowData.recorder.userId}</Descriptions.Item>
                <Descriptions.Item span={3} label="参会人员">{(()=>{ 
                    let nowMembers = ``
                    nowRowData.members && nowRowData.members.map((item)=>{
                        nowMembers = `${nowMembers} ${item.name}`
                    })
                    return nowMembers || '暂无'
                })()}</Descriptions.Item>
                <Descriptions.Item span={3} label="尚未接受人员">{(()=>{ 
                    let nowMembers = ``
                    nowRowData.noAccept && nowRowData.noAccept.map((item)=>{
                        nowMembers = `${nowMembers} ${item.name}`
                    })
                    return nowMembers || '暂无'
                })()}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="拒绝人员">{(()=>{ 
                    let nowMembers = ``
                    nowRowData.reject && nowRowData.reject.map((item)=>{
                        nowMembers = `${nowMembers} ${item.name}`
                    })
                    return nowMembers || '暂无'
                })()}</Descriptions.Item>
                <Descriptions.Item span={3} label="签到人员">{(()=>{ 
                    let nowMembers = ``
                    nowRowData.attendance && nowRowData.attendance.map((item)=>{
                        nowMembers = `${nowMembers} ${item.name}`
                    })
                    return nowMembers || '暂无'
                })()}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="未签到人员">{(()=>{ 
                    let nowMembers = ``
                    nowRowData.unSign && nowRowData.unSign.map((item)=>{
                        nowMembers = `${nowMembers} ${item.name}`
                    })
                    return nowMembers || '暂无'
                })()}</Descriptions.Item>
                <Descriptions.Item label="会议类型" span={3}> {nowRowData.topic}</Descriptions.Item>
                <Descriptions.Item label="会议摘要" span={3}>{nowRowData.meetingAbstract}</Descriptions.Item>
                <Descriptions.Item label="备注" span={3}>{nowRowData.remark}</Descriptions.Item>
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

export default connect(mapStateToProps)(MeetingTable);