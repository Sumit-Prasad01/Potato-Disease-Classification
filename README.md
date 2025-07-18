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

potato-disease-classifier/
│
├── api/
│ ├── main.py # FastAPI app
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ └── Upload.tsx # Image upload and preview
| | | ---Functionalities/ ApiService.ts// Handle Api     
│ │ └── App.tsx # Main app
│ └── package.json
│
├── model_training/
│ ├── train.py # CNN training script
│ ├── dataset/ # Raw dataset (Potato leaf images)
│ └── model.h5 # Trained model


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

