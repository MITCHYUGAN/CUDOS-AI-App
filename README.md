# DeepSeek LLM 7B Chat Application on CUDOS Intercloud

**Objective:** To deploy the DeepSeek LLM 7B Chat model on CUDOS Intercloud and create a web interface for interacting with it.

In depth guide: [AI Chat App Using DeepSeek OLM](https://medium.com/@cryptogrowthmarketer/ai-chat-app-using-deepseek-olm-hosted-on-cudos-intercloud-f9ca3a3c4291)

## 1. VM Setup on CUDOS Intercloud

* **VM Specs:**
    * vCPUs: 8
    * GPU: 2 x RTX A5000 (Note: GPU acceleration is not currently configured)
    * Memory: 16 GiB
    * Storage: 200 GiB
    * OS: Ubuntu 22.04 + AMD GPU Drivers
* **Rationale:**
    * The large storage (200 GiB) was chosen to provide ample space for the model files and dependencies.
    * The 8 vCPUs and 16 GiB of RAM were selected to meet the model's resource requirements.
    * Ubuntu 22.04 was chosen because it is a very common server OS, and has great support.
* **Actions:**
    * Logged into the CUDOS Intercloud console.
    * Selected the specified VM configuration.
    * Deployed the VM.
    * Obtained the VM's public IP address.

## 2. Initial VM Setup and Dependencies

* **SSH Connection:**
    * Connected to the VM using SSH with the obtained IP address.
* **Package Updates:**
    * Updated the package lists and upgraded existing packages:
        ```bash
        sudo apt update
        sudo apt upgrade -y
        ```
    * This ensures the system is up-to-date.
* **Python and `pip` Installation:**
    * Installed Python 3 and `pip` (Python package manager):
        ```bash
        sudo apt install python3 python3-pip -y
        ```
* **Virtual Environment Setup:**
    * Installed `python3-venv` to create virtual environments:
        ```bash
        sudo apt install python3.10-venv -y
        ```
    * Created and activated a virtual environment:
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```
    * Virtual environments isolate project dependencies.
* **Git LFS Installation:**
    * Installed Git Large File Storage (LFS) to handle large model files:
        ```bash
        sudo apt install git-lfs -y
        git lfs install
        ```
* **Cloning the DeepSeek LLM Repository:**
    * Cloned the DeepSeek LLM 7B Chat repository from Hugging Face:
        ```bash
        git clone [https://huggingface.co/deepseek-ai/deepseek-llm-7b-chat](https://huggingface.co/deepseek-ai/deepseek-llm-7b-chat)
        cd deepseek-llm-7b-chat
        ```
* **Installing Python Dependencies:**
    * Installed the required Python packages:
        ```bash
        pip install flask torch transformers
        ```
        * `flask`: For creating the web API.
        * `torch`: PyTorch deep learning framework.
        * `transformers`: Hugging Face library for working with transformer models.

* **Flask App Port:**
    * Configured the Flask app to run on port 8000.

## 3. Created `app.py`
The `app.py` script sets up a Flask web server that loads the DeepSeek LLM 7B Chat model and provides an API endpoint to generate text responses from user prompts:

```python
import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM, GenerationConfig
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model_name = "deepseek-ai/deepseek-llm-7b-chat"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load model to CPU
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", torch_dtype=torch.bfloat16)

# Generation config
model.generation_config = GenerationConfig.from_pretrained(model_name)
model.generation_config.pad_token_id = model.generation_config.eos_token_id

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.json['prompt']
    messages = [{"role": "user", "content": prompt}]
    inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt") # Get input tensors

    # Generate with attention mask
    outputs = model.generate(
        inputs.to(model.device),
        attention_mask=torch.ones_like(inputs).to(model.device), # Create attention mask
        max_new_tokens=100
    )

    result = tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)
    return jsonify({'response': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

## 5. React Frontend Setup

* **Project Creation:**
    * Created a React project using `create-react-app`.
* **Component Development:**
    * Developed a React component with a text input area and a display area for the LLM's responses.
* **API Integration:**
    * Used `axios` to make POST requests to the Flask API endpoint (`http://<YOUR_VM_IP>:8000/generate`). Replace `<YOUR_VM_IP>` with the public IP address of your CUDOS Intercloud VM.
* **CORS Handling:**
    * Encountered CORS errors initially.
    * Installed `flask-cors` and added `CORS(app)` to `app.py` to resolve the errors.
* **Testing:**
    * Tested the application running locally with the model deployed on the VM.

## 6. Current Application State

* **Functionality:**
    * The application is functional and generates responses using the DeepSeek LLM 7B Chat model.
    * It runs on the CPU, resulting in slower response times.
* **GPU Configuration:**
    * GPU acceleration is not currently configured.
    * The application is running on CPU.
