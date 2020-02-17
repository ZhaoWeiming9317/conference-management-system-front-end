import React from 'react'
import './RoomAdd.sass'
import {roomAdd, roomModify} from '../../api/apiRoom';
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux';
import { gotoLogin } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'
import { message } from 'antd';

/**
 * 
 *  会议室界面
 *  type:  add ===> 添加 modify ===> 修改  默认 add
 *  data:string
 *  
 */
class RoomAdd extends React.Component {
    constructor(props) {
        super(props);
        this.submitRegist = this.submitRegist.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.canRegist = this.canRegist.bind(this);
        this.submitLabel = '注册'
        this.init = {
            roomName: '',
            country: '',
            province: '',
            city: '',
            block: '',
            building: '',
            floor: '',
            roomNumber: '',
            roomVolume: '',
            mark: '',
        }
        this.state = {
            ...this.init
        }
        if (props.type === 'add') {
            this.submitLabel = '添加会议室'
        } else {
            this.submitLabel = '更改会议室'
        }
        this.state = {
            ...this.init,
            page: 1, // 1 第一页， 2 第二页 ...
            };    
        };
    componentDidMount(){
        let data = this.props.data
        if (this.props.type === 'modify') {
            this.setState({...data})                    
            this.refs.updateCountry.updateValue(data.country)
            this.refs.updateProvince.updateValue(data.province)
            this.refs.updateCity.updateValue(data.city)        
            this.refs.updateBlock.updateValue(data.block)
            this.refs.updateBuilding.updateValue(data.building)    
            this.refs.updateFloor.updateValue(data.floor)    

        }
    }

    handleChange = res => {
        switch(res.name) {
            case 'roomName':
                this.setState({
                    roomName : res.value,
                });
               break;
            case 'roomNumber':
                this.setState({
                    roomNumber : res.value,
                });
               break;
            case 'roomVolume':
                this.setState({
                    roomVolume : res.value,
                });
            break;
            case 'mark':
                this.setState({
                    mark : res.value,
                });
               break;
            case 'country':
                this.setState({
                    country : res.value,
                });
                break;
            case 'province':
                this.setState({
                    province : res.value,
                });
               break;
            case 'city':
                this.setState({
                    city : res.value,
                });
               break;
            case 'block':
                this.setState({
                    block : res.value,
                });
               break;
            case 'building':
                this.setState({
                    building : res.value,
                });
               break;
            case 'floor':
                this.setState({
                    floor : res.value,
                });
               break;
            default:
               
       } 
        console.log(this.state)
    };

    pageChange = flag => {
        return (e)=>{
            const {country,province,city, block,building,floor,roomName,roomNumber,roomVolume,mark,page} = this.state
            let nowPage = flag === 'forward' ? page + 1 :  page - 1
            // 由于react的内在机制，input的值会被清空，因此需要强制刷新
            this.setState({
                page: nowPage,
            },()=>{
                if (this.state.page === 1){
                    this.refs.updateCountry.updateValue(country)
                    this.refs.updateProvince.updateValue(province)
                    this.refs.updateCity.updateValue(city)        
                    this.refs.updateBlock.updateValue(block)
                    this.refs.updateBuilding.updateValue(building)    
                    this.refs.updateFloor.updateValue(floor)    
                } else if (this.state.page === 2){
                    this.refs.updateRoomName.updateValue(roomName)
                    this.refs.updateRoomNumber.updateValue(roomNumber)
                    this.refs.updateRoomVolume.updateValue(roomVolume)        
                    this.refs.updateMark.updateValue(mark)
                }
            });
    
        }
    }

    canRegist = event => {
        return true
    }

    submitRegist = event => {
        const {country,province,city, block,building,floor,roomId,roomName,roomNumber,roomVolume,mark} = this.state
        const {type} = this.props
        const data = {room_id: roomId,room_number: roomNumber,room_name: roomName,room_volume: roomVolume,country,province,city, block,building,floor,mark}
        console.log(data)
        if (this.canRegist()) {
            if (type === 'add') {
                roomAdd(JSON.stringify(data)).then((res)=>{
                    if (res.state == 1) {                   
                        message.success('添加成功')
                    } else {
                        message.error('添加失败')
                    }
                })
            }else if (type === 'modify') {
                roomModify(JSON.stringify(data)).then((res) => {
                    if (res.state == 1) {                   
                        message.success('修改成功')
                    } else {
                        message.error('修改失败')
                    }
                })
            }    
        };
    };

    render() {
        let postionInfor = (
            <div>
                <div key='country' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="country" label='国家' ref='updateCountry'></InputUI>
                </div>
                <div key='province' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="province" type='text' label='省份' ref='updateProvince' ></InputUI>
                </div>
                <div key='city' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="city" type='text' label='城市' ref='updateCity' ></InputUI>
                </div>
                <div key='block' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="block" type='text'  label='街区' ref='updateBlock'></InputUI>
                </div>
                <div key='building' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="building" type='text' label='大厦' ref='updateBuilding' ></InputUI>
                </div>
                <div key='floor' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="floor" type='text' label='楼层' ref='updateFloor' ></InputUI>
                </div>
                <div key='backward' className = "roomadd__item roomadd__item--button">
                    <ButtonUI label="下一步" buttonStyle="fill" onClick={this.pageChange('forward')}></ButtonUI>
                </div>
            </div>
        )
      let fundamentalInfor = (
        <div>
            <div key='roomname' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="roomName" type='text' label='房间名称' ref='updateRoomName' ></InputUI>
            </div>
            <div key='roomnumber' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="roomNumber" type='text' label='房间编号' ref='updateRoomNumber' ></InputUI>
            </div>
            <div key='roomvolume' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="roomVolume" type='text' label='房间容量' ref='updateRoomVolume'></InputUI>
            </div>
            <div key='mark' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="mark" type='text' label='备注' ref='updateMark'></InputUI>
            </div>
            <div key='forward' className = "roomadd__item roomadd__item--button">
                <ButtonUI label="上一步" buttonStyle="fill" onClick={this.pageChange('backward')}></ButtonUI>
            </div>
            <div key='regist' className = "roomadd__item roomadd__item--button">
                <ButtonUI label={this.submitLabel} buttonStyle="hollow-fill" onClick={this.submitRegist}></ButtonUI>
            </div>
        </div>
      )

      let addDisplay, labelDisplay;      
      const {type = 'regist'} = this.props
      if (this.state.page === 1) {
        addDisplay = postionInfor
      } else if (this.state.page === 2) {
        addDisplay = fundamentalInfor
      } 
      // type:  add ===> 添加 modify ===> 修改
      if (type === 'add') {
        labelDisplay = ( <div className="roomadd__label">添加会议室</div>)
      } else if (type === 'modify') {
        labelDisplay = ( <div className="roomadd__label">修改会议室</div>)
      }
      return (
        <div className={`roomadd__box roomadd__box--${type}`}>
            {labelDisplay}
            <form className="roomadd__form" noValidate autoComplete="off">
                {addDisplay}
            </form>
        </div>  
      );
    }
}
const mapStateToProps = (state) => {
    return{
        
    }
}
export default connect(mapStateToProps, { gotoLogin })(RoomAdd);