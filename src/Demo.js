import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SearchBar from "material-ui-search-bar";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import useTodos from "./hooks/useTodos";
import useUsers from "./hooks/useUsers";
import { DialogContent } from "@material-ui/core";

const useStyles = makeStyles({
  paper: {
    margin: "50px 20px",
  },
  table: {
    minWidth: 650,
  },

  searchWrapper: {
    display: "flex",
    columnGap: "50px",
    justifyContent: "flex-end",
  },

  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filter: {
    minWidth: "200px",
  },
});

const Demo = () => {
  const classes = useStyles();

  const users = useUsers();
  const [todos, setTodos] = useTodos();
  const [rows, setRows] = useState([]);
  const [todosByUser, setTodosByUser] = useState([]);
  const [searched, setSearched] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRows(users);
  }, [users]);

  const requestSearch = searchedVal => {
    setSearched(searchedVal);

    const filteredRows = users.filter(row => {
      return (
        row.name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.email.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });

    setRows(filteredRows);
  };

  const cancelSearch = () => {
    requestSearch("");
  };

  const changeFilter = e => {
    const value = e.target.value;
    setFilter(value);

    let filteredRows = users.filter(row => {
      return (
        row.name.toLowerCase().includes(searched.toLowerCase()) ||
        row.email.toLowerCase().includes(searched.toLowerCase())
      );
    });

    filteredRows = filteredRows.filter(row => {
      if (value == "") return true;
      if (value == ".net" || value == ".com")
        return row.website.toLowerCase().includes(value);
      return (
        !row.website.toLowerCase().includes(".net") &&
        !row.website.toLowerCase().includes(".com")
      );
    });

    setRows(filteredRows);
  };

  const viewTodos = id => {
    setOpen(true);
    const data = todos.filter(v => {
      return v.userId == id;
    });
    setTodosByUser(data);
  };

  const toggleCompleted = (id, value) => {
    const ret = [];
    todos.forEach(v => {
      if (v.id == id) {
        ret.push({ ...v, completed: value });
      } else {
        ret.push(v);
      }
    });
    setTodos(ret);

    const retByUser = [];
    todosByUser.forEach(v => {
      if (v.id == id) {
        retByUser.push({ ...v, completed: value });
      } else {
        retByUser.push(v);
      }
    });
    setTodosByUser(retByUser);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.searchWrapper}>
          <SearchBar
            value={searched}
            onChange={searchVal => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
          <Select
            className={classes.filter}
            value={filter}
            onChange={changeFilter}
          >
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={".com"}>.com</MenuItem>
            <MenuItem value={".net"}>.net</MenuItem>
            <MenuItem value={"other"}>Other</MenuItem>
          </Select>
        </div>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right">Address</TableCell>
                <TableCell align="right">Website</TableCell>
                <TableCell align="right">Todos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.phone}</TableCell>
                  <TableCell align="right">{`${row.address.street} ${row.address.suite} ${row.address.city} ${row.address.zipcode}`}</TableCell>
                  <TableCell align="right">{row.website}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => viewTodos(row.id)}
                    >
                      View Todos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog fullScreen open={open}>
          <DialogTitle>
            <div className={classes.titleWrapper}>
              Todos
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todosByUser.map(row => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.completed}
                              onChange={e =>
                                toggleCompleted(row.id, e.target.checked)
                              }
                            />
                          }
                          label="Completed"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </Paper>
    </>
  );
};

export default Demo;
