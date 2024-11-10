from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse 
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from typing import List
import subprocess
import os
import tempfile
import shutil


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up Jinja2 templates to render HTML
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def read_index():
    return FileResponse('templates/index.html')

@app.get("/about")
async def read_about():
    return FileResponse('templates/about.html')

@app.get("/predict")
async def read_predict():
    return FileResponse('templates/predict.html')

@app.get("/help")
async def read_help():
    return FileResponse('templates/help.html')

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResult(BaseModel):
    predictions: List[float]

@app.post("/predict", response_model=PredictionResult)
async def predict_structure(pdb_file: UploadFile = File(...)):
    # Create a temporary directory to store uploaded file and results
    with tempfile.TemporaryDirectory() as temp_dir:
        # Save uploaded PDB file
        temp_pdb_path = os.path.join(temp_dir, pdb_file.filename)
        with open(temp_pdb_path, "wb") as buffer:
            content = await pdb_file.read()
            buffer.write(content)
        
        # Set up output paths
        output_dir = os.path.join(temp_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        
        # Use original filename without extension for output
        base_filename = os.path.splitext(pdb_file.filename)[0]
        output_filename = f"{base_filename}.txt"
        output_path = os.path.join(output_dir, output_filename)

        try:
            # Run prediction script
            process = subprocess.run([
                "python", "DeepGlycanSite/single_case_prediction.py",
                "--conf", "DeepGlycanSite/P2Y14_example/hparams_rec.yaml",
                "--ckpt_path", "DeepGlycanSite/ckpts/rec_only.ckpt",
                "--input_fn", temp_pdb_path,
                "--out_path", output_dir,
                "--output_fn", output_filename
            ], capture_output=True, text=True)

            if process.returncode != 0:
                raise HTTPException(
                    status_code=500,
                    detail=f"Prediction failed: {process.stderr}"
                )

            # Read and parse results
            predictions = []
            
            with open(output_path, "r") as f:
                for line in f:
                    parts = line.strip().split()
                    if len(parts) == 2:
                        # Only take the probability value, ignore PDB ID
                        predictions.append(float(parts[1]))

            if not predictions:
                raise HTTPException(
                    status_code=500,
                    detail="No predictions generated"
                )

            return PredictionResult(predictions=predictions)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing request: {str(e)}"
            )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)