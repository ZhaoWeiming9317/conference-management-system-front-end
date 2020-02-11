import React from 'react'
import './RoomTable.sass'
import { connect } from 'react-redux';
import { Table, Popconfirm, Modal, Divider} from 'antd';
import { roomSearchPage, roomDelete,roomSearch} from '../../api/apiRoom'
import InputUI from '../../UI/InputUI/InputUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import Regist from '../../components/Regist/Regist'
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
          title: '会议室名称',
          dataIndex: 'room_name',
          width: '130px',
          ellipsis: true
        },
        {
          title: '会议室编号',
          dataIndex: 'room_number',
          width: '130px',
          ellipsis: true
        },
        {
          title: '会议室容量',
          dataIndex: 'room_volume',
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
              <a>详细</a>
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
        pagination: {}
      };
    }
  
    componentDidMount() {
      this.setState({tableLoading: true})
      this.tableFirstFind({page: 1})
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
      roomSearchPage(data).then((res)=>{
        const pagination = { ...this.state.pagination };
        let list = res
        // pagination.total = res.total;
        pagination.current = params.page
        this.setState({
          dataSource : execListWithKey(execListWithNull(list,'-'),'userId'),
          tableLoading: false,
          pagination
        })
      })
    }
    // 等后端接口更新
    tableFirstFind(params = {}) {
      this.setState({
        tableLoading: true,
        page: params.page
      });
      let data = {
        volume: this.volume,
        username: this.input,
        ...params
      }
      roomSearchPage(data).then((res)=>{
        console.log(res)
        const pagination = { ...this.state.pagination };
        let list = res
        // pagination.total = res.total;
        pagination.total = 200
        pagination.current = 1
        // this.setState({
        //   dataSource : execListWithKey(execListWithNull(list,'-'),'userId'),
        //   tableLoading: false,
        //   pagination
        // })
      })
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
      const room_id = dataSource.find(item => item.key === key).room_id
      roomDelete({room_id}).then((res)=>{
        console.log(res)
        if(res.state === 1){
          this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        }
      })
    };
  
    handleAdd = () => {
      this.setState({
        modalAddVisible: true,
      });  
    };

    handleModify = key => {
      console.log(key)
      const dataSource = [...this.state.dataSource];
      const username = dataSource.find(item => item.key === key).username
      this.setState({
        username: username,
      },()=>{
        this.setState({
          modalModifyVisible: true,
        })
      });  
    };

    handleCancelAdd = () => {
      this.setState({ modalAddVisible: false, modalModifyVisible: false });
      this.tableFind({page: 1})  
    };

    handleCancelModify = () => {
      this.setState({ modalAddVisible: false, modalModifyVisible: false });
      this.tableFind({page: this.state.page})  
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
      const { dataSource,  selectedRowKeys, tableLoading, pagination, modalAddVisible,modalModifyVisible,  username} = this.state;
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
          <div className="usertable__wrapper--upper">
            <div className="usertable__search__bar">
              <InputUI getValue={this.handleSearch} type='text' size='large'></InputUI>
            </div>
            <div className="usertable__search__button" >
              <ButtonUI label="搜索" buttonStyle="fill" size="small" onClick={this.searchByUsername}></ButtonUI>
            </div>
            <div className="usertable__search__button" >
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
          />
          <Modal
            visible={modalAddVisible}
            title="添加会议室"
            onOk={this.handleOk}
            onCancel={this.handleCancelAdd}
            footer={null}
            destroyOnClose
          >
            <Regist type="add"></Regist>
          </Modal>
          <Modal
            visible={modalModifyVisible}
            title="修改会议室"
            onOk={this.handleOk}
            onCancel={this.handleCancelModify}
            footer={null}
            destroyOnClose
          >
            <Regist type="modify" username={username}></Regist>
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
