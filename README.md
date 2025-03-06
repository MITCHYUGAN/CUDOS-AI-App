# DeepSeek LLM 7B Chat Application on CUDOS Intercloud

**Objective:** I deployed the DeepSeek LLM 7B Chat model on CUDOS Intercloud and created a web interface for interacting with it.

How to build something like this: [AI Chat App Using DeepSeek OLM](https://medium.com/@cryptogrowthmarketer/ai-chat-app-using-deepseek-olm-hosted-on-cudos-intercloud-f9ca3a3c4291)

## What I did:
* Spin up my VM on CUDOS Intercloud
* Access the VM using SSH
* Deploy AI model on my VM on CUDOS Intercloud
* Created a React frontend to interact with the model deployed on CUDOS Intercloud
* Used `axios` to make POST requests to the model to receive result
* Tested the application running locally with the model deployed on the VM.

## Getting Started ( Run Locally ):
* **Prerequisites**
  * Nodejs installed
  * npm or yarn installed

* **Clone Repo**:
   ```
   git clone https://github.com/MITCHYUGAN/CUDOS-AI-App.git
   cd CUDOS-AI-App
   ```
* **Install Dependencies**:
   ```
   npm install
   ```
* **Run the server**:
   ```
   npm run dev
   ```
   **Open `http://localhost:3000/`**

## Stack:
* React (Frontend)
* Python (To interact with model on CUDOS intercloud)
* Git
