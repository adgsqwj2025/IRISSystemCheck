# IRISSystemCheck

## 1. Preface

The program is inspired by https://ideas.intersystems.com/ideas/DPI-I-740

## 2. Installation

### 2.1 docker installation

Pull the code to /opt/IRISSystemCheck

Execute "docker compose up -d" to start

### 2.2 zpm Installation

Execute zpm "install IRISSystemCheck"

## 3. How to use

After installing the program to http://localhost:52773/csp/user/index.csp pages

After visiting the page, you can see that it is divided into two parts

On the main page, you can view relevant indicator items, and on the Settings page, you can freely expand interfaces

<img width="968" height="615" alt="image" src="https://github.com/user-attachments/assets/0954ecd1-0ca3-465f-9be0-5b9fbaa21ae0" />

<img width="968" height="499" alt="image" src="https://github.com/user-attachments/assets/7987205b-04d7-478b-89ae-4f745a134022" />

Note: It should be noted that if the interface is a remote ip, the ip of the default configuration metric item needs to be changed to a remote ip in the configuration item

