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
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/CloudUpload';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { loadConfigForYear } from '../../config/masterConfig';
import dayjs from 'dayjs';

const EditSponsorModal = (props) => {
  console.log('editInfo:', props.editInfo)
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({});
  const [duplicateNameList, setDuplicateNameList] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null); // Holds the preview of the new logo
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const loadedConfig = await loadConfigForYear(year);
        setConfig(loadedConfig?.adminConfig?.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_SPONSORS || []);
        initializeFormData(props.editInfo, loadedConfig?.adminConfig?.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_SPONSORS);
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
      if (property.isDateTime) {
        initialData[property.field] = editInfo[property.field]
          ? dayjs(editInfo[property.field]).format('h:mm A, MMMM D, YYYY')
          : '';
      } else {
        initialData[property.field] = editInfo[property.field] || '';
      }
    });
    setFormData(initialData);
    setLogoFile(editInfo.logoUrl || null);
    setLogoPreview(editInfo.logoUrl || null);
  };

  const fetchDuplicateNames = async () => {
    try {
      const apiUrl = import.meta.env.VITE_NODE_ENV === 'staging'
        ? import.meta.env.VITE_SERVER_URL_STAGING
        : import.meta.env.VITE_SERVER_URL_PRODUCTION;

      const response = await fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName: `sponsors${year}` }),
      });

      const data = await response.json();
      const sponsorNames = Object.keys(data).map((key) => data[key].sponsorName);
      setDuplicateNameList(sponsorNames);
    } catch (error) {
      console.error('Error fetching sponsor names:', error);
    }
  };

  useEffect(() => {
    fetchDuplicateNames();
  }, [year]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleLogoChange = (event) => {
    const fieldName = "sponsorLogo"; // Define the field name explicitly
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      const newFile = new File([file], fieldName, { type: file.type });

      setLogoFile({
        file: newFile,
        fieldName: fieldName,
        url: URL.createObjectURL(newFile), // Create an object URL for the preview
        fileName: fieldName, // Store the new filename without extension
        fileExtension: fileExtension,
      });
  
      setLogoPreview(URL.createObjectURL(newFile));
    }
  };

  const deleteLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prevData) => ({
      ...prevData,
      logoUrl: '',
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

    if (
      formData.sponsorName !== props.editInfo.sponsorName &&
      duplicateNameList.includes(formData.sponsorName)
    ) {
      toast.warning('This sponsor name is already registered. Please choose another name.');
      return false;
    }

    return true;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_NODE_ENV === 'staging'
        ? import.meta.env.VITE_SERVER_URL_STAGING
        : import.meta.env.VITE_SERVER_URL_PRODUCTION;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('sponsorId', props.editInfo.sponsorId);
      formDataToSubmit.append('tableName', `sponsors${year}`);
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      if (logoFile) {
        formDataToSubmit.append('logo', logoFile.file); // Add the logo file if uploaded
      }

      await fetch(`${apiUrl}/api/${year}/admin_edit_sponsor`, {
        method: 'POST',
        body: formDataToSubmit,
      });

      toast.success('Sponsor successfully updated.');
      props.close();
      window.location.reload();
    } catch (error) {
      toast.error('Error updating sponsor: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setDuplicateNameList([]);
    setLogoFile(null);
    setLogoPreview(null);
    props.close();
  };

  if (isLoadingConfig) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTitle>
          Edit Sponsor Information
          <IconButton onClick={handleClose} style={{ float: 'right' }}>
            <CloseIcon color="primary" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {config.map((field) => {
              if (!field.isEditable) {
                return (
                  <InputLabel key={field.field}>
                    <strong>{field.headerName}:</strong>{' '}
                    {field.isCurrency ? formatCurrency(formData[field.field]) : formData[field.field]}
                  </InputLabel>
                );
              } else if (field.field !== 'logoUrl') {
                return (
                  <TextField
                    key={field.field}
                    label={field.headerName}
                    value={field.isCurrency ? formatCurrency(formData[field.field]) : formData[field.field] || ''}
                    onChange={(e) => handleInputChange(field.field, e.target.value)}
                    fullWidth
                  />
                );
              }
            })}

            {/* Centered Logo Preview and Buttons */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{ maxWidth: '150px', maxHeight: '150px', marginBottom: '10px' }}
                />
              )}
              <div>
                <input
                  type="file"
                  id="logo-upload"
                  style={{ display: 'none' }}
                  onChange={handleLogoChange}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<UploadIcon />}
                    component="span"
                  >
                    Upload New Logo
                  </Button>
                </label>
                {logoPreview && (
                  <IconButton color="secondary" onClick={deleteLogo} style={{ marginLeft: '10px' }}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </div>

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

export default EditSponsorModal;

              
           