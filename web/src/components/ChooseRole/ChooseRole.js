import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';


const currencies = [

  {
    value: 2,
    label: '普通员工',
  },
  {
    value: 1,
    label: '管理员',
  },
  {
    value: 0,
    label: '部门经理',
  },
];

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  menu: {
    width: 200,
  },
}));

export default function MultilinFields(props) {
  const classes = useStyles();
  const [currency, setCurrency] = React.useState(2);
  const handleChange = event => {
    setCurrency(event.target.value);
    props.handleChangeRole(event.target.value)
  };
  return (
    <div>
    <TextField
        id="standard-select-currency"
        select
        label="权限"
        className={classes.textField}
        value={currency}
        onChange={handleChange}
        SelectProps={{
        MenuProps: {
            className: classes.menu,
        },
        }}
        margin="normal"
    >
        {currencies.map(option => (
        <MenuItem key={option.value} value={option.value}>
            {option.label}
        </MenuItem>
        ))}
    </TextField>
    </div>
  );
}
