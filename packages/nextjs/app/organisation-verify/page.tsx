"use client";

import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QRCodeCanvas } from "qrcode.react";

const generateQr = () => {
  const array = new Uint8Array(8); // 8 bytes = 64 bits
  crypto.getRandomValues(array); // Generate secure random values
  // Convert to a 16-digit number by parsing as a BigInt
  const randomBigInt = BigInt(
    `0x${Array.from(array)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")}`,
  );
  // Ensure it has 16 digits
  const randomNumber = randomBigInt.toString().padStart(16, "0").slice(0, 16);
  const randomNumberString = randomNumber.toString();

  return randomNumberString;
};

interface RandomNumberQrShowerProps {
  setPageNo: (pageNo: number) => void;
}

const RandomNumberQrShower = ({ setPageNo }: RandomNumberQrShowerProps) => {
  const randomNumberString = generateQr();

  const buttonClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPageNo(1);
  };

  return (
    <div className="flex-col items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-xl mx-auto space-y-6">
        <QRCodeCanvas value={randomNumberString} size={256}></QRCodeCanvas>
      </div>
      <button className="p-4 bg-primary text-white" onClick={buttonClicked}>
        Next
      </button>
    </div>
  );
};

interface QrScannerProps {
  setInputState: (state: any) => void;
  setPageNo: (pageNo: number) => void;
}

const QrScanner = ({ setInputState, setPageNo }: QrScannerProps) => {
  const [value, setValue] = useState<any>(null);

  const onScanSuccess = useCallback(
    (decodedText: string) => {
      const jsonBody = JSON.parse(decodedText);
      setInputState(jsonBody);
      setPageNo(2);
    },
    [setInputState, setPageNo],
  );

  const onScanError = useCallback((errorMessage: string) => {
    console.error("QR Scan Error:", errorMessage);
  }, []);

  useEffect(() => {
    let scanner: string | Html5QrcodeScanner = "";
    if (typeof window !== "undefined") {
      scanner = new Html5QrcodeScanner(
        "qrcode-scanner",
        {
          fps: 10,
          qrbox: 500,
        },
        false,
      );

      scanner.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scanner) {
        (scanner as Html5QrcodeScanner).clear();
      }
    };
  }, [onScanSuccess, onScanError]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const jsonBody = JSON.parse(value);
    console.log(jsonBody);
    setInputState(jsonBody);
    setPageNo(2);
  };

  console.log(value);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
        <p className="text-neutral text-center opacity-75">Scan a QR Code using a scanner</p>
        <div id="qrcode-scanner"></div>
        <input
          type="text"
          value={value}
          onChange={e => {
            e.preventDefault();
            setValue(e.target.value);
            setInputState(e.target.value);
          }}
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
};

interface SmartContractPageProps {
  inputState: any;
}

const SmartContractPage = ({ inputState }: SmartContractPageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<boolean>(false);

  useEffect(() => {
    const verifyProof = async () => {
      if (!inputState?.proof) {
        setLoading(false);
        setResult(false);
        return;
      }

      try {
        console.log("Proof:" + inputState.proof);
        const provider = new ethers.JsonRpcProvider(
          "https://polygon-amoy.infura.io/v3/df71b884e8624de48cda1e91548a5995",
        );

        // Contract address and ABI
        const contractAddress = "0xA5f137155c638d17D4D7D1A411B3cD139fF64C8F";
        const contractABI = [
          {
            inputs: [
              {
                internalType: "uint256[2]",
                name: "_pA",
                type: "uint256[2]",
              },
              {
                internalType: "uint256[2][2]",
                name: "_pB",
                type: "uint256[2][2]",
              },
              {
                internalType: "uint256[2]",
                name: "_pC",
                type: "uint256[2]",
              },
              {
                internalType: "uint256[48]",
                name: "_pubSignals",
                type: "uint256[48]",
              },
            ],
            name: "verifyProof",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];

        // Create a contract instance (connected to the provider)
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const a = inputState.proof.proof.pi_a.map((value: string) => {
          return BigInt(value);
        });
        a.pop();
        console.log(a);
        const b = inputState.proof.proof.pi_b.map((arr: string[]) => {
          const mapped_array = arr.map((value: string) => {
            return BigInt(value);
          });
          return mapped_array.reverse();
        });
        console.log("b:" + b);
        b.pop();
        const c = inputState.proof.proof.pi_c.map((value: string) => {
          return BigInt(value);
        });
        console.log(c);
        c.pop();
        const publicSignals = inputState.proof.publicSignals.map((value: string) => {
          return BigInt(value).toString(10);
        });

        console.log(a, b, c, publicSignals);

        const isValid = await contract.verifyProof(a, b, c, publicSignals);
        setLoading(false);
        setResult(isValid);
        console.log("Here");
      } catch (error) {
        setLoading(false);
        setResult(false);
        console.log(error);
      }
    };

    verifyProof();
  }, [inputState?.proof]);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-xl mx-auto space-y-6">
        {loading ? "Smart Contract Verification Running!" : result ? "Verified" : "Invalid Ticket!"}
      </div>
    </div>
  );
};

const FinalPage = () => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [inputState, setInputState] = useState<any>();

  const renderSplit = () => {
    switch (pageNo) {
      case 0:
        return <RandomNumberQrShower setPageNo={setPageNo} />;
      case 1:
        return <QrScanner setInputState={setInputState} setPageNo={setPageNo} />;
      case 2:
        return <SmartContractPage inputState={inputState} />;
      default:
        return null;
    }
  };
  return renderSplit();
};

export default FinalPage;