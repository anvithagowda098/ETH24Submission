"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

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

const QrScanner = ({setInputState}) => {

    const onScanSuccess = (decodedText, _) => {
        const jsonBody = JSON.parse(decodedText);
        setInputState(jsonBody);
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
    
      return (
        <div className="flex items-center justify-center min-h-screen min-w-screen">
          <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
            <p className="text-neutral text-center opacity-75">
                Scan a QR Code using a scanner
            </p>
            <div id="qrcode-scanner"></div>
          </div>
        </div>
      );
}

const verificationPage = ({inputState}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<boolean>(false);
    
    useEffect(()=>{
        const verifyProof = async (inputData) => {
            const answer = false;
            // calls the smart contract
            setLoading(false);
            setResult(answer);
        }
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
                return <QrScanner setInputState = {setInputState}></QrScanner>
        }
    }
    return (
        renderSplit()
    )
}

export default finalPage;