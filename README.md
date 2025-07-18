# Potato-Disease-Classification

# 🥔 Potato Disease Classification 🌿

This project leverages a **Convolutional Neural Network (CNN)** to classify potato leaf diseases using image data. It features a **TensorFlow-based deep learning model** served through a **FastAPI backend**, with optional integration into a **React frontend** for real-time image upload and prediction.

---

## 📸 Features

- 🧠 Trained **CNN model** using TensorFlow/Keras
- 🚀 Backend API with **FastAPI**
- 📤 Image upload and drag-and-drop support (React Dropzone)
- 🗂 Model serving with optional **TensorFlow Serving**
- 📦 Dockerized backend for production deployment
- 🔍 Real-time prediction from user-uploaded images

---

## 📁 Project Structure

```
potato-disease-classifier/
│
├── api/
│ └── main.py # FastAPI app (handles image uploads & prediction)
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ └── Upload.tsx # Component to upload & preview images
│ │ │ └── Functionalities/
│ │ │ └── ApiService.ts # Handles API calls to FastAPI backend
│ │ └── App.tsx # Entry point for React app
│ └── package.json # Frontend dependencies
│
├── model_training/
│ ├── train.py # CNN model training script
│ ├── dataset/ # Directory with raw potato leaf images
│ └── model.h5 # Trained CNN model (Keras format)
```

---

## 🧠 CNN Model Overview

- **Architecture**: 3 Convolutional layers → Flatten → Dense layers
- **Input**: 256x256 RGB potato leaf images
- **Output**: Classes - *Early Blight*, *Late Blight*, *Healthy*
- **Optimizer**: Adam
- **Loss Function**: Categorical Crossentropy
- **Accuracy**: ~95% on validation data

---

## 🚀 FastAPI Backend

```bash
uvicorn main:app --reload

## 📊 Dataset
- https://www.kaggle.com/datasets/arjuntejaswi/plant-village
## 📚 Requirements
- Python 3.8+
- TensorFlow 2.x
- FastAPI
- Uvicorn
- Pillow
- React (TypeScript)
- React Dropzone

