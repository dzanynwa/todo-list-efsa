import { Alarm, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";

const TaskItem: React.FC<{
  title: string;
  description: string;
  dueDate: string;
  status: "DONE" | "INPROGRESS";
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
  isCompleted?: boolean;
}> = ({
  title,
  description,
  dueDate,
  status,
  onDelete,
  onEdit,
  onToggle,
  isCompleted,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        bgcolor="#132f4c"
        border="1px solid #3399fe"
        borderRadius={2}
        p={2}
      >
        <Stack direction="row" spacing={3}>
          {!isCompleted && (
            <Checkbox onChange={onToggle} style={{ color: "white" }} />
          )}

          <Stack onClick={() => setModalOpen(true)}>
            <Typography variant="body1" color="white" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2" color="#ffffff90" fontWeight="bold">
              due {format(new Date(dueDate), "PP")}
            </Typography>
          </Stack>
        </Stack>
        {!isCompleted && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Edit onClick={onEdit} style={{ color: "white " }} />
            <Delete onClick={onDelete} style={{ color: "white " }} />
          </Stack>
        )}
      </Box>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: "5% 10%", border: "none" }}
      >
        <Box
          style={{ overflow: "hidden", overflowY: "scroll" }}
          padding={5}
          height="85%"
          bgcolor="#132f4c"
          border="none"
        >
          <Stack direction="column" spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                color="white"
                fontWeight={600}
                variant="h6"
                component="h1"
              >
                {title}
              </Typography>
              <Chip
                label={status}
                style={{ width: "15%" }}
                color={status === "DONE" ? "success" : "primary"}
              />
            </Stack>
            <Divider style={{ marginTop: 10, background: "white" }} />
            <Typography color="white" fontWeight={600}>
              Description:
            </Typography>
            <Typography style={{ wordWrap: "break-word" }} color="white">
              {description}
            </Typography>
            <Typography color="white" fontWeight={600}>
              Due date:
            </Typography>
            <Typography color="white">
              {format(new Date(dueDate), "PP")}
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default TaskItem;
