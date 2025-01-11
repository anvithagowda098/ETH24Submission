## Highlights
<p align="center">
<img src="https://github.com/user-attachments/assets/be6e0a31-c725-412a-8328-33784c344879">
 <p align ="center">Introduction</p>
</p>
<br><br>
<p align="center">
<img src="https://github.com/user-attachments/assets/c2a29950-8d62-49b9-8845-0309c6917b48">
   <p align ="center">Internal Working</p>
</p>

#### Explanation
https://github.com/user-attachments/assets/736f3aa2-aafb-4b32-b929-c421368aece4

## Overview

<p align="center">
  <img src="https://github.com/user-attachments/assets/aa342c7e-8ca2-4d95-a2f1-598c32d79cad" alt="Sublime's custom image"/>
</p>

ZKonnect is a blockchain-based event management and ticketing platform that leverages decentralized technologies to enhance transparency, security, and fairness in ticketing systems. Designed for organizers and attendees, ZKonnect eliminates ticket fraud, prevents black-market reselling, and enables seamless event management with role-based access control.

### **Features**

#### For Organizers:
![image](https://github.com/user-attachments/assets/81ad9f8c-a959-419e-acb1-11b5bc5db70d)

- **Event Creation**: Organizers can create events by specifying details like event name, image, maximum attendees, and a secret staking ID.
- **Editable Event Details**: Organizers can modify event details as needed, stored securely on-chain or via decentralized storage.
- **Secure Ticket Validation**: Attendees are validated on the day of the event using Zero-Knowledge Proofs (zkProofs).

#### For Buyers:
![Screencast from 2024-12-12 15-19-29](https://github.com/user-attachments/assets/0025a082-6017-40e4-bb28-d0cf28ab082f)

- **Role-Based Access Control**: Buyers and organizers have separate views, authenticated using MetaMask/Coinbase wallet addresses.
- **Seamless Ticket Purchase**: Buyers stake a secret ID, verify using zkProofs, and pay via cryptocurrency.
- **NFT Ticketing**: After purchasing, buyers receive a minted NFT containing event details and a zkProof-generated hash as a secure ticket.

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v16 or higher)
- Yarn or npm
- Hardhat (for smart contract deployment)
- MetaMask wallet extension
- Polygon zkEVM/Amoy testnet configuration

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/ETH24Submission.git
cd ETH24Submission
```

### **2. Install Dependencies**
#### For Scaffold-ETH2 Setup
- Install required tools:
  ```bash
  yarn install
  ```

### **3. Smart Contract Deployment**
#### Scaffold-ETH2
1. Run a local Ethereum network in the first terminal:
   ```bash
   yarn chain
   ```

2. Deploy the test contract on a second terminal:
   ```bash
   yarn deploy
   ```

#### ZKonnect
1. Navigate to the backend directory:
   ```bash
   cd packages/hardhat
   ```
2. Configure the deployment network in `hardhat.config.js` (e.g., Polygon zkEVM/Amoy testnet or local network).
3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy the smart contracts:
   ```bash
   npx hardhat deploy --network polygonZkEvm
   ```
5. Copy the deployed contract address and update the frontend configuration file (`frontend/src/config.js`).

### **4. Run the Backend**
Start the backend server:
```bash
npm start
```

### **5. Run the Frontend**
#### Scaffold-ETH2
Start the Next.js app:
```bash
yarn start
```
Visit the app at `http://localhost:3000`.

#### ZKonnect
1. Navigate to the frontend directory:
   ```bash
   cd ../nextjs
   ```
2. Start the development server:
   ```bash
   yarn start
   ```
3. Open the app in your browser at `http://localhost:3000`.

---

### **Implementation**

#### **Organizer Workflow**:
1. Login with MetaMask or Coinbase Wallet.
2. Create an event by filling in event details and uploading images.
3. Manage and edit event details stored securely on Polygon zkEVM.

#### **Buyer Workflow**:
1. Login with MetaMask or Coinbase Wallet.
2. Browse events and select an event.
3. Enter the secret staking ID and pay using cryptocurrency.
4. Receive an NFT ticket as proof of purchase. Wait for the event :)

### **Event Verification**:
- On the event day, buyers provide their zkProof-generated hash, which the organizer verifies to grant entry, and all of this is automated via QR codes.
[![Deep Dive into out architecture](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=fGA3MQ0U6fA)
---

### **Technologies Used**

#### **Blockchain and smart contracts**:
![image](https://github.com/user-attachments/assets/d96ba7fd-a3f6-4212-9651-c2ab6193a74f)
![image](https://github.com/user-attachments/assets/4347563b-beb3-4aa5-b541-2ab4d3653765)
![image](https://github.com/user-attachments/assets/173af87d-86cd-4db2-bf2c-d611f52fa9b0)

#### **Authentication**:
![image](https://github.com/user-attachments/assets/32ce03ce-47ff-43c1-b576-808a5abefbbb)
![image](https://github.com/user-attachments/assets/3968f01d-a999-41b9-b477-d571f6576422)


#### **Proof Generation**:
- **Circom and Snark.js**: For generating and validating zkProofs to secure sensitive data.

### **Frontend**:
- **Next.js**: For a modern, responsive, and performant frontend.
- **Scaffold-ETH2**: For integrating Ethereum and bootstrapping frontend components.
