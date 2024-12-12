"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ethers } from "ethers";

const generateQr = (): string => {
    const array = new Uint8Array(8); // 8 bytes = 64 bits
    crypto.getRandomValues(array); // Generate secure random values
    const randomBigInt = BigInt(`0x${Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    const randomNumber = randomBigInt.toString().padStart(16, '0').slice(0, 16);
    const randomNumberString = randomNumber.toString();

    return randomNumberString;
}

const RandomNumberQrShower = ({ setPageNo }: { setPageNo: (pageNo: number) => void }) => {
    const randomNumberString = generateQr();

    const buttonClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPageNo(1);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto text-center">
                <QRCodeCanvas value={randomNumberString} size={256} />
            </div>
            <button 
                className="mt-6 px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                onClick={buttonClicked}
            >
                Next
            </button>
        </div>
    );
}

const QrScanner = ({ setInputState, setPageNo }: { setInputState: (state: any) => void, setPageNo: (pageNo: number) => void }) => {

    const [value, setValue] = useState<string | null>(null);

    const onScanSuccess = (decodedText: string, _: any) => {
        const jsonBody = JSON.parse(decodedText);
        setInputState(jsonBody);
        setPageNo(2);
    }

    const onScanError = () => {}

    useEffect(() => {
        let scanner: string | Html5QrcodeScanner = "";
        if (typeof window !== "undefined") {
            scanner = new Html5QrcodeScanner('qrcode-scanner', {
                fps: 10,
                qrbox: 500,
            }, false);

            scanner.render(onScanSuccess, onScanError);
        }

        return () => {
            (scanner as Html5QrcodeScanner).clear();
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (value) {
            const jsonBody = JSON.parse(value);
            setInputState(jsonBody);
            setPageNo(2);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-center space-y-4">
                <h1 className="text-3xl font-semibold text-neutral">Scan a QR Code</h1>
                <p className="text-neutral opacity-75">Scan a QR Code using the scanner below</p>
                <div id="qrcode-scanner" className="mb-4"></div>
                <input
                    type="text"
                    value={value ?? ''}
                    onChange={(e) => { e.preventDefault(); setValue(e.target.value); setInputState(e.target.value) }}
                    placeholder="Enter your text..."
                    className="w-full md:w-80 p-4 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                />
                <button
                    onClick={handleClick}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                >
                    Okay
                </button>
            </div>
        </div>
    );
}

const SmartContractPage = ({ inputState }: { inputState: any }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<boolean>(false);

    useEffect(() => {
        const verifyProof = async () => {
            const provider = new ethers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/df71b884e8624de48cda1e91548a5995");

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

            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const a = inputState.proof.proof.pi_a.map((value: string) => { return BigInt(value) });
            a.pop();
            const b = inputState.proof.proof.pi_b.map((arr: string[]) => {
                const mapped_array = arr.map((value: string) => {
                    return BigInt(value)
                })
                return mapped_array.reverse();
            });
            b.pop();
            const c = inputState.proof.proof.pi_c.map((value: string) => { return BigInt(value) });
            c.pop();
            const publicSignals = inputState.proof.publicSignals.map((value: string) => { return BigInt(value).toString(10); });

            try {
                const isValid = await contract.verifyProof(a, b, c, publicSignals);
                setLoading(false);
                setResult(isValid);
            } catch (error) {
                setLoading(false);
                setResult(false);
            }
        }

        verifyProof();
    }, [inputState]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto text-center">
                {loading ? "Smart Contract Verification Running!" : result ? "Verified" : "Invalid Ticket!"}
            </div>
        </div>
    );
}

const finalPage = () => {
    const [pageNo, setPageNo] = useState<number>(0);
    const [inputState, setInputState] = useState<any>(null);

    const renderSplit = () => {
        switch (pageNo) {
            case 0:
                return <RandomNumberQrShower setPageNo={setPageNo}></RandomNumberQrShower>
            case 1:
                return <QrScanner setInputState={setInputState} setPageNo={setPageNo}></QrScanner>
            case 2:
                return <SmartContractPage inputState={inputState}></SmartContractPage>
        }
    }
    return (
        renderSplit()
    );
}

export default finalPage;