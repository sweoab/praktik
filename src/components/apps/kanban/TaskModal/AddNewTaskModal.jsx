


import { TaskProperties } from '../../../../api/kanban/KanbanData';
import {
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';

function AddNewList({
  show,
  onHide,
  onSave,
  newTaskData,
  setNewTaskData,
  updateTasks,
}) {


  const { task, taskText, taskProperty, taskImage } = newTaskData;

  //Function to handle saving changes and updating tasks
  const handleSave = () => {

    // Update the task data with the default date if needed
    setNewTaskData({ ...newTaskData });
    onSave();
    updateTasks();
  };


  const isFormValid = () => {
    return task && taskText && taskProperty && taskImage;
  };
  return (
    (<Dialog
      open={show}
      onClose={onHide}
      slotProps={{
        paper: {
          component: 'form',
        },
      }}

    >
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            {/* task title */}
            <CustomFormLabel
              sx={{
                mt: 0,
              }}
              htmlFor="task"
            >
              Task Title *
            </CustomFormLabel>
            <CustomTextField
              id="task"
              variant="outlined"
              fullWidth
              value={task}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, task: e.target.value })
              }
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            {/* task text */}
            <CustomFormLabel
              htmlFor="taskText"
              sx={{
                mt: 0,
              }}
            >
              Text*
            </CustomFormLabel>
            <CustomTextField
              id="taskText"
              variant="outlined"
              fullWidth
              value={taskText}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, taskText: e.target.value })
              }
            />
          </Grid>
          <Grid size={12}>
            {/* task image */}
            <CustomFormLabel
              htmlFor="taskImage"
              sx={{
                mt: 0,
              }}
            >
              Image URL*
            </CustomFormLabel>
            <CustomTextField
              id="taskImage"
              variant="outlined"
              fullWidth
              value={taskImage}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, taskImage: e.target.value })
              }
            />
            {taskImage !== undefined && (
              <img

                src={taskImage}
                alt="Selected"
                style={{
                  marginTop: "8px", width: "200px", height: "100px"
                }}
              />
            )}
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            {/* task image */}
            <CustomFormLabel
              htmlFor="taskProperty"
              sx={{
                mt: 0,
              }}
            >
              Task Property *
            </CustomFormLabel>
            <CustomSelect
              fullWidth
              id="taskProperty"
              variant="outlined"
              value={taskProperty}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, taskProperty: e.target.value })
              }
            >
              <MenuItem value="">Select Task Property</MenuItem>
              {TaskProperties.map((property) => (
                <MenuItem key={property} value={property}>
                  {property}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>)
  );
}
export default AddNewList;


