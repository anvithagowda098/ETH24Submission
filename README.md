# ZKonnect: Decentralized Event Management and Ticketing

ZKonnect is a blockchain-based event management and ticketing platform that leverages decentralized technologies to enhance transparency, security, and fairness in ticketing systems. Designed for organizers and attendees, ZKonnect eliminates ticket fraud, prevents black-market reselling, and enables seamless event management with role-based access control.

## **Features**

### For Organizers:
- **Event Creation**: Organizers can create events by specifying details like event name, image, maximum attendees, and a secret staking ID.
- **Editable Event Details**: Organizers can modify event details as needed, stored securely on-chain or via decentralized storage.
- **Secure Ticket Validation**: Attendees are validated on the day of the event using Zero-Knowledge Proofs (zkProofs).

### For Buyers:
- **Role-Based Access Control**: Buyers and organizers have separate views, authenticated using MetaMask wallet addresses.
- **Seamless Ticket Purchase**: Buyers stake a secret ID, verify using zkProofs, and pay via cryptocurrency.
- **NFT Ticketing**: After purchasing, buyers receive a minted NFT containing event details and a zkProof-generated hash as a secure ticket.

### Decentralized Technologies Used:
- **Polygon zkEVM**: For deploying scalable and cost-efficient smart contracts on the testnet.
- **zkRollups**: For secure, fast transactions and staking secret IDs.
- **MetaMask and Coinbase Wallet**: For user authentication via wallet addresses and managing cryptocurrency payments.
- **Circom and Snark.js**: For zkProof generation and validation.
- **Next.js**: For building a performant, modern frontend.
- **Hardhat**: For developing and deploying smart contracts.
- **Scaffold-ETH2**: For bootstrapping the frontend with Ethereum integration.

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v16 or higher)
- Yarn or npm
- Hardhat (for smart contract deployment)
- MetaMask wallet extension
- Polygon zkEVM testnet configuration

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/zkonnect.git
cd zkonnect
```

### **2. Install Dependencies**
#### For Scaffold-ETH2 Setup
- Install required tools:
  ```bash
  cd my-dapp-example
  yarn install
  ```

#### For ZKonnect Setup
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
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
   cd backend
   ```
2. Configure the deployment network in `hardhat.config.js` (e.g., Polygon zkEVM testnet or local network).
3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy the smart contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network zkEVM
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
   cd ../frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at `http://localhost:3000`.

---

## **How It Works**

### **Organizer Workflow**:
1. Login with MetaMask or Coinbase Wallet.
2. Create an event by filling in event details and uploading images.
3. Manage and edit event details stored securely on Polygon zkEVM.

### **Buyer Workflow**:
1. Login with MetaMask or Coinbase Wallet.
2. Browse events and select an event.
3. Enter the secret staking ID and pay using cryptocurrency.
4. Receive an NFT ticket as proof of purchase.

### **Event Verification**:
- On the event day, buyers provide their zkProof-generated hash, which the organizer verifies to grant entry.

---

## **Technologies Used**

### **Blockchain**:
- **Polygon zkEVM**: For scalable and efficient smart contract deployment.
- **zkRollups**: To ensure fast, low-cost, and secure transactions.

### **Authentication**:
- **MetaMask and Coinbase Wallet**: Wallet-based authentication for role-based access control and payments.

### **Proof Generation**:
- **Circom and Snark.js**: For generating and validating zkProofs to secure sensitive data.

### **Frontend**:
- **Next.js**: For a modern, responsive, and performant frontend.
- **Scaffold-ETH2**: For integrating Ethereum and bootstrapping frontend components.

### **Smart Contract Development**:
- **Hardhat**: For developing, testing, and deploying smart contracts on Polygon zkEVM.

---

## **Alternate Use Cases**
1. **Event Certification**: Use ZKonnect for certification of event participation using NFTs.
2. **Decentralized Memberships**: Manage memberships or subscriptions for exclusive events or communities.
3. **Fraud-Proof Ticket Resale**: Enable secure, verifiable resale of tickets using NFT ownership transfer.

---

## **Contributing**
We welcome contributions to improve ZKonnect. Please open an issue or submit a pull request.

---

## **License**
This project is licensed under the MIT License.