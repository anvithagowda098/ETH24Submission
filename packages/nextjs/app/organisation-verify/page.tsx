"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {ethers} from "ethers";

const generateQr = () => {
    const array = new Uint8Array(8); // 8 bytes = 64 bits
    crypto.getRandomValues(array); // Generate secure random values
    // Convert to a 16-digit number by parsing as a BigInt
    const randomBigInt = BigInt(`0x${Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    // Ensure it has 16 digits
    const randomNumber = randomBigInt.toString().padStart(16, '0').slice(0, 16);
    const randomNumberString = randomNumber.toString();

    return randomNumberString;
}

const RandomNumberQrShower = ({setPageNo}) => {
    const randomNumberString = generateQr();

    const buttonClicked = (e) => {
        e.preventDefault();
        setPageNo(1);
    }

    return (
        <div className="flex-col items-center justify-center min-h-screen min-w-screen">
          <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-xl mx-auto space-y-6">
            <QRCodeCanvas value={randomNumberString} size={256}></QRCodeCanvas>
          </div>
          <button className="p-4 bg-primary text-white" onClick={buttonClicked}>Next</button>
        </div>
      );
}

const QrScanner = ({setInputState, setPageNo}) => {

    const [value, setValue] = useState<any>(null);

    const onScanSuccess = (decodedText, _) => {
        const jsonBody = JSON.parse(decodedText);
        setInputState(jsonBody);
        setPageNo(2);
    }

    const onScanError = () => {}

    useEffect(() => {
        // Check if window is defined to ensure this runs only on the client side
        let scanner : string | Html5QrcodeScanner = "";
        if (typeof window !== "undefined") {
          // Create a new instance of Html5QrcodeScanner
          scanner = new Html5QrcodeScanner('qrcode-scanner', {
            fps: 10, // Frames per second for scanning
            qrbox: 500, // Size of the scanning box
          }, false);
    
          // Start the scanner with a callback function
          scanner.render(onScanSuccess, onScanError);
        }
    
        // Cleanup the scanner when the component unmounts
        return () => {
          (scanner as Html5QrcodeScanner).clear();
        };
      }, []);
    
      const handleClick = (e) => {
        e.preventDefault();
        const jsonBody = JSON.parse(value);
        console.log(jsonBody);
        setInputState(jsonBody);
        setPageNo(2);
      }

      console.log(value)

      return (
        <div className="flex items-center justify-center min-h-screen min-w-screen">
          <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
            <p className="text-neutral text-center opacity-75">
                Scan a QR Code using a scanner
            </p>
            <div id="qrcode-scanner"></div>
            <input
                type="text"
                value={value}
                onChange={(e) => {e.preventDefault(); setValue(e.target.value); setInputState(e.target.value)}}
                placeholder="Enter your text..."
                className="w-80 p-4 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            />
            <button
            onClick={handleClick}
            className="px-6 py-3 text-white bg-primary rounded-lg shadow-md hover:bg-red-500 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300 transform hover:scale-105"
            >
                Okay
            </button>
          </div>
        </div>
      );
}

const SmartContractPage = ({inputState}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<boolean>(false);
    


    useEffect(()=>{
        const verifyProof = async () => {
            console.log("Proof:" + inputState.proof);
            const provider = new ethers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/df71b884e8624de48cda1e91548a5995");

            // Contract address and ABI
            const contractAddress = "0xA5f137155c638d17D4D7D1A411B3cD139fF64C8F";
            const contractABI = [
                {
                  "inputs": [
                    {
                      "internalType": "uint256[2]",
                      "name": "_pA",
                      "type": "uint256[2]"
                    },
                    {
                      "internalType": "uint256[2][2]",
                      "name": "_pB",
                      "type": "uint256[2][2]"
                    },
                    {
                      "internalType": "uint256[2]",
                      "name": "_pC",
                      "type": "uint256[2]"
                    },
                    {
                      "internalType": "uint256[48]",
                      "name": "_pubSignals",
                      "type": "uint256[48]"
                    }
                  ],
                  "name": "verifyProof",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                }
              ];

            // Create a contract instance (connected to the provider)
            const contract = new ethers.Contract(contractAddress, contractABI, provider);


            const a = inputState.proof.proof.pi_a.map((value) => {return BigInt(value).toString(10);})
            a.pop();
            console.log(a);
            const b = inputState.proof.proof.pi_b.map((arr) => {
                const  mapped_array = arr.map((value) => {
                    return BigInt(value).toString(10);
                })
                return mapped_array;
            })
            console.log(b)
            b.pop();
            const c = inputState.proof.proof.pi_c.map((value) => {return BigInt(value).toString(10);});
            console.log(c)
            c.pop();
            const publicSignals = inputState.proof.publicSignals.map((value) => {return BigInt(value).toString(10);});

            console.log(a,b,c,publicSignals);

            try {
                const isValid = await contract.verifyProof(a, b, c, publicSignals);
                setLoading(false);
                setResult(isValid);
                console.log("Here");
            } catch (error) {
                setLoading(false);
                setResult(false);
                console.log(error);
            }
        }

        verifyProof();
    }, [])

    return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-xl mx-auto space-y-6">
        {loading  ? "Smart Contract Verification Running!" : result ? "Verified" : "Invalid Ticket!"}
      </div>
    </div>
    );
}

const finalPage = () => {
    const [pageNo, setPageNo] = useState<number>(0);
    const [inputState, setInputState] = useState<any>();

    const renderSplit = () => {
        switch (pageNo) {
            case 0:
                return <RandomNumberQrShower setPageNo={setPageNo}></RandomNumberQrShower>
            case 1:
                return <QrScanner setInputState = {setInputState} setPageNo = {setPageNo}></QrScanner>
            case 2:
                return <SmartContractPage inputState={inputState}></SmartContractPage>
        }
    }
    return (
        renderSplit()
    )
}

export default finalPage;