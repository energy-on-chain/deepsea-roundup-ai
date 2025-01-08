import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  InputLabel,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { loadConfigForYear } from '../../config/masterConfig';

const EditAnglerModal = (props) => {
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({});
  const [duplicateNameList, setDuplicateNameList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const loadedConfig = await loadConfigForYear(year);
        setConfig(loadedConfig?.adminConfig?.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANGLERS || []);
        initializeFormData(props.editInfo, loadedConfig?.adminConfig?.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANGLERS);
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();
  }, [year, props.editInfo]);

  const initializeFormData = (editInfo, tableProperties) => {
    const initialData = {};
    tableProperties?.forEach((property) => {
      if (property.field === 'over21' || property.field === 'hasCheckedIn') {
        initialData[property.field] = editInfo[property.field] !== undefined ? String(editInfo[property.field]) : '';
      } else {
        initialData[property.field] = editInfo[property.field] || '';
      }
    });
    setFormData(initialData);
  };

  // Fetch duplicate names
  useEffect(() => {
    const fetchDuplicateNames = async () => {
      try {
        const apiUrl = process.env.REACT_APP_NODE_ENV === 'staging'
          ? process.env.REACT_APP_SERVER_URL_STAGING
          : process.env.REACT_APP_SERVER_URL_PRODUCTION;

        const response = await fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName: `anglers${year}` }),
        });

        const data = await response.json();
        const names = Object.keys(data).map((key) => data[key].anglerName);
        setDuplicateNameList(names);
      } catch (error) {
        console.error('Error fetching duplicate names:', error);
      }
    };

    fetchDuplicateNames();
  }, [year]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = config?.filter((field) => field.isRequired);
    for (const field of requiredFields) {
      if (!formData[field.field]) {
        toast.warning(`Please enter ${field.headerName}.`);
        return false;
      }
    }

    if (formData.anglerName !== props.editInfo.anglerName && duplicateNameList.includes(formData.anglerName)) {
      toast.warning('This angler name is already registered. Please choose another name.');
      return false;
    }

    return true;
  };

  const handleEdit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.REACT_APP_NODE_ENV === 'staging'
        ? process.env.REACT_APP_SERVER_URL_STAGING
        : process.env.REACT_APP_SERVER_URL_PRODUCTION;

      const submitData = {
        ...formData,
        over21: formData.over21 === 'true',
        hasCheckedIn: formData.hasCheckedIn === 'true',
      };

      await fetch(`${apiUrl}/api/${year}/admin_edit_angler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      toast.success('Angler successfully updated.');
      props.close();
      window.location.reload(); // Refresh the page
    } catch (error) {
      toast.error('Error updating angler: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setDuplicateNameList([]);
    props.close();
  };

  if (isLoadingConfig) {
    return <CircularProgress />;
  }

  const dropdownFields = {
    division: ['Offshore', 'Bay/Surf', 'Flyfishing', 'Kayak'],
    gender: ['Male', 'Female'],
    ageBracket: ['Junior', 'Adult'],
    over21: ['true', 'false'], // Boolean values as strings
    hasCheckedIn: ['true', 'false'], // Boolean values as strings
  };

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTitle>
          Edit Angler Information
          <IconButton onClick={handleClose} style={{ float: 'right' }}>
            <CloseIcon color="primary" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {config
              ?.filter((field) => field.isEditable)
              .map((field) => {
                if (dropdownFields[field.field]) {
                  return (
                    <div key={field.field}>
                      <InputLabel>{field.headerName}</InputLabel>
                      <Select
                        value={formData[field.field] || ''}
                        onChange={(e) => handleInputChange(field.field, e.target.value)}
                        fullWidth
                      >
                        {dropdownFields[field.field].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'true' ? 'Yes' : option === 'false' ? 'No' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  );
                } else {
                  return (
                    <TextField
                      key={field.field}
                      label={field.headerName}
                      value={formData[field.field] || ''}
                      onChange={(e) => handleInputChange(field.field, e.target.value)}
                      fullWidth
                    />
                  );
                }
              })}
            <Button
              color="primary"
              variant="contained"
              onClick={handleEdit}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditAnglerModal;

