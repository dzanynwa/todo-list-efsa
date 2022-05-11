import {
  Button,
  InputLabel,
  Modal,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TaskItem from "../components/TaskItem";
import DatePicker from "react-datepicker";
type Task = {
  id: string;
  status: "DONE" | "INPROGRESS";
  title: string;
  dueDate: string;
  description: string;
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Home: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [completedTaskList, setCompletedTaskList] = useState<Task[]>([]);
  useEffect(() => {
    setTaskList([]);
    setCompletedTaskList([]);
    getData();
  }, []);
  const getData = async () => {
    const resultingData = await localStorage.getItem("taskList");
    if (resultingData) {
      setTaskList(JSON.parse(resultingData));
    }
    const resultingDataa = await localStorage.getItem("completedTaskList");
    if (resultingDataa) {
      setCompletedTaskList(JSON.parse(resultingDataa));
    }
  };
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const { control, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    const item = {
      id: uuidv4(),
      status: "INPROGRESS",
      title: data.title,
      description: data.description,
      dueDate: startDate.toISOString(),
    };
    console.log(item);
    const newTaskList = [...taskList, item];
    await localStorage.setItem("taskList", JSON.stringify(newTaskList));
    getData();
    setAddModalOpen(false);
  };
  const onDelete = async (itemId: string) => {
    const newTaskList = taskList.filter((item) => item.id !== itemId);
    await localStorage.setItem("taskList", JSON.stringify(newTaskList));
    getData();
  };
  const onEdit = async (task: Task) => {
    setSelectedTask(task)
    setEditModalOpen(true)
  };
  const onEditSubmit = async (data: any) => {
    const item = {
      id: selectedTask?.id,
      status: 'INPROGRESS',
      title: data.title || selectedTask?.title,
      description: data.description || selectedTask?.description,
      dueDate: startDate.toISOString(),
    };
    const newTaskList = taskList.filter((item) => item.id !== selectedTask?.id);
    const newNewTaskList = [...newTaskList, item]
    await localStorage.setItem("taskList", JSON.stringify(newNewTaskList));
    getData();
    setEditModalOpen(false);
  }
  const onToggle = async (itemId: string) => {
    const item = taskList.filter((item) => item.id === itemId);
    const newTaskList = taskList.filter((item) => item.id !== itemId);
    const updatedItem = {
      id: item[0].id,
      status: "DONE",
      title: item[0].title,
      description: item[0].description,
      dueDate: item[0].dueDate,
    };
    const newCompletedTaskList = [...completedTaskList, updatedItem];
    await localStorage.setItem("taskList", JSON.stringify(newTaskList));
    await localStorage.setItem(
      "completedTaskList",
      JSON.stringify(newCompletedTaskList)
    );
    getData();
  };
  return (
    <Box height="100vh" bgcolor="#0b1929" display="flex" flexDirection="row">
      <Box
        px={5}
        width="50%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography color="#3399fe" fontWeight="bold" variant="h1">
          Be organized.
        </Typography>
        <Typography color="white" fontWeight="bold" variant="h2">
          Everything in one place.
        </Typography>
      </Box>
      <Box
        px={5}
        width="50%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          bgcolor="#011e3c"
          border="1px solid #3399fe"
          height="75%"
          borderRadius={8}
          p={5}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography color="white" fontWeight="bold" variant="h6">
              Tasks
            </Typography>
            <Box mt={1}>
              <AddIcon
                onClick={() => setAddModalOpen(true)}
                style={{ color: "white " }}
              />
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "white" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{ color: "white" }}
            >
              <Tab
                style={{ color: "white" }}
                label="Active"
                {...a11yProps(0)}
              />
              <Tab
                style={{ color: "white" }}
                color="white"
                label="Completed"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {taskList.map((task) => (
              <TaskItem
                onToggle={() => onToggle(task.id)}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
                title={task.title}
                description={task.description}
                status={task.status}
                dueDate={task.dueDate}
              />
            ))}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {completedTaskList.map((task) => (
              <TaskItem
                isCompleted={true}
                onToggle={() => onToggle(task.id)}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
                title={task.title}
                description={task.description}
                status={task.status}
                dueDate={task.dueDate}
              />
            ))}
          </TabPanel>
        </Box>
      </Box>
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: "5% 10%", border: "none" }}
      >
        <Box
          style={{ overflow: "hidden", overflowY: "scroll" }}
          padding={5}
          height="85%"
          bgcolor="white"
          border="none"
        >
          <Stack width="50%" direction="column" spacing={2}>
            <Typography>Add a new task</Typography>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  color="primary"
                  label="Title"
                  variant="outlined"
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  multiline
                  color="primary"
                  label="Description"
                  variant="outlined"
                  {...field}
                />
              )}
            />
            <InputLabel>Due date:</InputLabel>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="datePicker"
            />
            <Button onClick={handleSubmit((values) => onSubmit(values))}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: "5% 10%", border: "none" }}
      >
        <Box
          style={{ overflow: "hidden", overflowY: "scroll" }}
          padding={5}
          height="85%"
          bgcolor="white"
          border="none"
        >
          <Stack width="50%" direction="column" spacing={2}>
            <Typography>Edit a task</Typography>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  color="primary"
                  label="Title"
                  variant="outlined"
                  defaultValue={selectedTask?.title}
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  multiline
                  color="primary"
                  label="Description"
                  variant="outlined"
                  defaultValue={selectedTask?.description}
                  {...field}
                />
              )}
            />
            <InputLabel>Due date:</InputLabel>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="datePicker"
            />
            <Button onClick={handleSubmit((values) => onEditSubmit(values))}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
