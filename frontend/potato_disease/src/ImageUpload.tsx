import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Clear } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import bgImage from './assets/bg.png';

export const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [data, setData] = useState<any>(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendFile = async () => {
    if (imageSelected && selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await axios.post(import.meta.env.VITE_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearData = () => {
    setData(null);
    setImageSelected(false);
    setSelectedFile(null);
    setPreview(undefined);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (preview) {
      setIsLoading(true);
      sendFile();
    }
  }, [preview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      clearData();
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setImageSelected(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <AppBar position="static" className="bg-pink-700 shadow-none text-white">
        <Toolbar className="flex justify-between">
          <Typography variant="h6">CodeBasics: Potato Disease Classification</Typography>
          
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className="flex flex-col items-center py-10">
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="w-[400px] h-auto bg-white/60 shadow-2xl rounded-xl">
              {imageSelected && preview && (
                <CardMedia
                  component="img"
                  height="400"
                  image={preview}
                  alt="Preview"
                  className="rounded-t-xl"
                />
              )}

              <CardContent>
                {!imageSelected && (
                  <div className="mb-4">
                    <div
                      {...getRootProps()}
                      className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Typography variant="body2" className="text-gray-700">
                        {isDragActive
                          ? 'Drop the image here...'
                          : 'Drag & drop a potato leaf image, or click to select'}
                      </Typography>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center py-4">
                    <CircularProgress className="text-pink-600" />
                    <Typography variant="h6" className="mt-2 text-pink-600">
                      Processing...
                    </Typography>
                  </div>
                )}

                {data && (
                  <div className="py-4">
                    <TableContainer component={Paper} elevation={0} className="bg-transparent">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell className="font-bold text-gray-600">Label</TableCell>
                            <TableCell align="right" className="font-bold text-gray-600">Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-lg font-bold text-gray-800">{data.class}</TableCell>
                            <TableCell align="right" className="text-lg font-bold text-gray-800">{confidence}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {data && (
            <Grid item className="mt-6">
              <Button
                variant="contained"
                className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-white/70"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};
